import { 
  doc, 
  getDoc, 
  getDocs,
  setDoc, 
  updateDoc, 
  collection, 
  onSnapshot,
  getDocFromServer,
  getDocsFromServer
} from 'firebase/firestore';
import { teamUsersList, initialUserPins } from '../data/authUsersData';
import { AppUser } from '../types/auth';
import { db, handleFirestoreError, OperationType } from './firebase';

export interface UserPinRecord {
  userId: string;
  pinHash: string;
  updatedAt: string;
  updatedBy: 'user' | 'admin' | 'system';
  failedAttempts: number;
  lockedUntil: number | null; // Timestamp ms
  changedByUserId?: string;
  changedByName?: string;
}

export interface PinAuditLog {
  id: string;
  targetUserId: string;
  targetUserName: string;
  changedByUserId: string;
  changedByName: string;
  changeType: 'user_change' | 'admin_reset' | 'admin_unlock';
  timestamp: string;
}

const PIN_STORAGE_FALLBACK_KEY = 'nowtech_pin_records_v4';
const PIN_LOCKOUT_MAX_ATTEMPTS = 5;
const PIN_LOCKOUT_DURATION_MS = 30 * 1000; // 30 seconds lockout after 5 fails

/**
 * Computes salted SHA-256 hash of a 6-digit PIN using standard Web Crypto API.
 * Never stores, transmits or logs plain text PINs.
 */
export async function hashPin(pin: string, userId: string): Promise<string> {
  const salt = `nowtech-solar-2026-${userId.trim()}`;
  const enc = new TextEncoder();
  const data = enc.encode(`${salt}:${pin.trim()}`);
  
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Safe synchronous fallback for environments without WebCrypto
  let hash = 0;
  const str = `${salt}:${pin.trim()}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash_${Math.abs(hash).toString(16)}`;
}

class PinAuthService {
  private inMemoryCache: Record<string, UserPinRecord> = {};
  private isInitialized = false;
  private isListeningToFirestore = false;
  private unsubscribeListener: (() => void) | null = null;

  constructor() {
    this.loadFromLocalStorage();
    this.setupFirestoreListener();
  }

  public getUserName(userId: string): string {
    const user = teamUsersList.find((u) => u.id === userId);
    return user?.name || userId;
  }

  private loadFromLocalStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(PIN_STORAGE_FALLBACK_KEY);
      if (raw) {
        this.inMemoryCache = JSON.parse(raw);
      }
    } catch {
      this.inMemoryCache = {};
    }
  }

  private saveToLocalStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(PIN_STORAGE_FALLBACK_KEY, JSON.stringify(this.inMemoryCache));
    } catch {
      // Ignored
    }
  }

  /**
   * Subscribes to real-time changes in Firestore collection 'pin_credentials'.
   * Synchronizes cache across all open devices, browsers and tabs in real-time.
   */
  public setupFirestoreListener(): void {
    if (this.isListeningToFirestore || !db) return;

    try {
      const colRef = collection(db, 'pin_credentials');
      this.unsubscribeListener = onSnapshot(colRef, (snapshot) => {
        snapshot.docs.forEach((docSnap) => {
          const data = docSnap.data() as UserPinRecord;
          if (data && data.userId && data.pinHash) {
            this.inMemoryCache[data.userId] = {
              userId: data.userId,
              pinHash: data.pinHash,
              updatedAt: data.updatedAt || new Date().toISOString(),
              updatedBy: data.updatedBy || 'system',
              failedAttempts: typeof data.failedAttempts === 'number' ? data.failedAttempts : 0,
              lockedUntil: data.lockedUntil || null,
              changedByUserId: data.changedByUserId,
              changedByName: data.changedByName,
            };
          }
        });
        this.saveToLocalStorage();
      }, (err) => {
        console.warn('NowTech Solar: Erro no listener em tempo real de PINs:', err);
      });

      this.isListeningToFirestore = true;
    } catch (e) {
      console.warn('NowTech Solar: Não foi possível iniciar listener de PINs:', e);
    }
  }

  /**
   * Idempotent initialization:
   * 1. Fetches all existing documents from Firestore 'pin_credentials'.
   * 2. Populates inMemoryCache with the live Firestore data.
   * 3. CRITICAL: Never overwrites existing credentials with default PINs.
   * 4. Only if a user is completely missing from Firestore, seeds the initial document.
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    this.setupFirestoreListener();

    if (db) {
      try {
        const colRef = collection(db, 'pin_credentials');
        let snapshot;
        try {
          snapshot = await getDocsFromServer(colRef);
        } catch {
          snapshot = await getDocs(colRef);
        }

        const existingDocIds = new Set<string>();

        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as UserPinRecord;
          if (data && data.userId && data.pinHash) {
            existingDocIds.add(data.userId);
            this.inMemoryCache[data.userId] = {
              userId: data.userId,
              pinHash: data.pinHash,
              updatedAt: data.updatedAt || new Date().toISOString(),
              updatedBy: data.updatedBy || 'system',
              failedAttempts: typeof data.failedAttempts === 'number' ? data.failedAttempts : 0,
              lockedUntil: data.lockedUntil || null,
              changedByUserId: data.changedByUserId,
              changedByName: data.changedByName,
            };
          }
        });

        // Seed ONLY users that DO NOT exist at all in Firestore
        for (const [userId, defaultPin] of Object.entries(initialUserPins)) {
          if (!existingDocIds.has(userId)) {
            const pinHash = await hashPin(defaultPin, userId);
            const newRecord: UserPinRecord = {
              userId,
              pinHash,
              updatedAt: new Date().toISOString(),
              updatedBy: 'system',
              failedAttempts: 0,
              lockedUntil: null,
            };
            const docRef = doc(db, 'pin_credentials', userId);
            await setDoc(docRef, newRecord);
            this.inMemoryCache[userId] = newRecord;
          }
        }

        this.saveToLocalStorage();
        this.isInitialized = true;
        return;
      } catch (err) {
        console.warn('NowTech Solar: Inicialização de PINs operando com suporte híbrido:', err);
      }
    }

    this.saveToLocalStorage();
    this.isInitialized = true;
  }

  /**
   * Gets the official up-to-date record directly from Firestore server.
   * NEVER overwrites document if not found.
   */
  public async getLatestRecord(userId: string): Promise<UserPinRecord | null> {
    if (db) {
      const docRef = doc(db, 'pin_credentials', userId);
      try {
        // Try server first for real-time guarantee across devices
        const docSnap = await getDocFromServer(docRef);
        if (docSnap.exists()) {
          const cloudData = docSnap.data() as UserPinRecord;
          this.inMemoryCache[userId] = cloudData;
          this.saveToLocalStorage();
          return cloudData;
        }
      } catch {
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const cloudData = docSnap.data() as UserPinRecord;
            this.inMemoryCache[userId] = cloudData;
            this.saveToLocalStorage();
            return cloudData;
          }
        } catch {
          // Fall back to memory
        }
      }
    }

    return this.inMemoryCache[userId] || null;
  }

  /**
   * Checks remaining lockout seconds if user entered too many wrong attempts
   */
  public getLockoutSeconds(userId: string): number {
    const record = this.inMemoryCache[userId];
    if (!record || !record.lockedUntil) return 0;
    const diff = record.lockedUntil - Date.now();
    return diff > 0 ? Math.ceil(diff / 1000) : 0;
  }

  /**
   * Validates a 6-digit individual PIN for a collaborator against Firebase Firestore.
   * NEVER overwrites the user's PIN with initial defaults on failed lookups.
   */
  public async verifyPin(
    userId: string,
    inputPin: string
  ): Promise<{
    success: boolean;
    error?: string;
    remainingAttempts?: number;
    lockedSeconds?: number;
  }> {
    // 1. Format check: exactly 6 digits
    const cleanPin = inputPin.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      return {
        success: false,
        error: 'O PIN deve conter exatamente 6 dígitos numéricos.',
      };
    }

    // 2. Fetch fresh record from official Firebase server
    let record = await this.getLatestRecord(userId);
    if (!record) {
      await this.initialize();
      record = await this.getLatestRecord(userId);
    }

    if (!record) {
      return { 
        success: false, 
        error: 'Perfil de colaborador não localizado no banco de dados. Contate o administrador.' 
      };
    }

    // 3. Check lockout
    const lockout = this.getLockoutSeconds(userId);
    if (lockout > 0) {
      return {
        success: false,
        error: `Acesso bloqueado temporariamente por excesso de tentativas. Aguarde ${lockout} segundos.`,
        lockedSeconds: lockout,
      };
    }

    // 4. Hash and compare with official Firestore hash
    const inputHash = await hashPin(cleanPin, userId);
    if (inputHash === record.pinHash) {
      // SUCCESS: Reset failed attempts and lockout in Firebase
      record.failedAttempts = 0;
      record.lockedUntil = null;
      this.inMemoryCache[userId] = record;
      this.saveToLocalStorage();

      if (db) {
        try {
          await updateDoc(doc(db, 'pin_credentials', userId), {
            failedAttempts: 0,
            lockedUntil: null,
          });
        } catch {
          // Non-blocking update failure
        }
      }

      return { success: true };
    }

    // 5. FAILED ATTEMPT: Increment counter and update Firebase
    const newFails = (record.failedAttempts || 0) + 1;
    let newLockedUntil: number | null = null;
    let isLocked = false;

    if (newFails >= PIN_LOCKOUT_MAX_ATTEMPTS) {
      newLockedUntil = Date.now() + PIN_LOCKOUT_DURATION_MS;
      isLocked = true;
    }

    record.failedAttempts = newFails;
    record.lockedUntil = newLockedUntil;
    this.inMemoryCache[userId] = record;
    this.saveToLocalStorage();

    if (db) {
      try {
        await updateDoc(doc(db, 'pin_credentials', userId), {
          failedAttempts: newFails,
          lockedUntil: newLockedUntil,
        });
      } catch {
        // Non-blocking
      }
    }

    if (isLocked) {
      return {
        success: false,
        error: 'Número excessivo de tentativas incorretas. Acesso bloqueado por 30 segundos.',
        lockedSeconds: 30,
      };
    }

    const remaining = PIN_LOCKOUT_MAX_ATTEMPTS - newFails;
    return {
      success: false,
      error: 'PIN de acesso incorreto. Verifique os 6 dígitos.',
      remainingAttempts: remaining,
    };
  }

  /**
   * Collaborator changes their own 6-digit PIN.
   * REGRA OBRIGATÓRIA: Salva permanentemente no Firebase.
   * Somente confirma após o Firebase confirmar a gravação.
   * Em caso de falha, mantém o PIN anterior válido.
   */
  public async changeUserPin(
    userId: string,
    currentPin: string,
    newPin: string
  ): Promise<{ success: boolean; error?: string }> {
    // 1. Validate current PIN against official Firebase record
    const verify = await this.verifyPin(userId, currentPin);
    if (!verify.success) {
      return { success: false, error: verify.error || 'PIN atual incorreto.' };
    }

    // 2. Validate new PIN format: 6 digits
    const cleanNewPin = newPin.trim();
    if (!/^\d{6}$/.test(cleanNewPin)) {
      return {
        success: false,
        error: 'O novo PIN deve ser composto exatamente por 6 dígitos numéricos.',
      };
    }

    if (currentPin.trim() === cleanNewPin) {
      return {
        success: false,
        error: 'O novo PIN deve ser diferente do PIN atual.',
      };
    }

    const newHash = await hashPin(cleanNewPin, userId);
    const nowIso = new Date().toISOString();
    const userName = this.getUserName(userId);

    const updatedRecord: UserPinRecord = {
      userId,
      pinHash: newHash,
      updatedAt: nowIso,
      updatedBy: 'user',
      failedAttempts: 0,
      lockedUntil: null,
      changedByUserId: userId,
      changedByName: userName,
    };

    // 3. PERSISTENCE FIRST: Write directly to Firebase Cloud Firestore and await
    if (db) {
      const path = `pin_credentials/${userId}`;
      try {
        const docRef = doc(db, 'pin_credentials', userId);
        await setDoc(docRef, updatedRecord, { merge: true });

        // Save audit log in Firebase (without plain text PIN)
        const auditLogId = `audit_${Date.now()}_${userId}`;
        const auditRef = doc(db, 'pin_audit_logs', auditLogId);
        const auditRecord: PinAuditLog = {
          id: auditLogId,
          targetUserId: userId,
          targetUserName: userName,
          changedByUserId: userId,
          changedByName: userName,
          changeType: 'user_change',
          timestamp: nowIso,
        };
        await setDoc(auditRef, auditRecord);
      } catch (e) {
        console.error('Falha ao salvar novo PIN no Firebase:', e);
        try {
          handleFirestoreError(e, OperationType.WRITE, path);
        } catch {
          // Handled
        }
        return {
          success: false,
          error: 'Falha na gravação no Firebase. O novo PIN NÃO foi salvo e o PIN anterior continua ativo.',
        };
      }
    }

    // 4. Update memory cache and localStorage only after Firebase confirms write
    this.inMemoryCache[userId] = updatedRecord;
    this.saveToLocalStorage();

    return { success: true };
  }

  /**
   * Administrator resets a collaborator's PIN.
   * REGRA OBRIGATÓRIA:
   * 1. Valida se quem solicita tem autorização real de ADMIN.
   * 2. Salva permanentemente no Firebase e aguarda confirmação.
   * 3. O PIN antigo deixa de funcionar imediatamente em todos os dispositivos.
   * 4. Registra auditoria com responsável, conta alterada e data/hora.
   */
  public async adminResetPin(
    adminUser: AppUser,
    targetUserId: string,
    customPin?: string
  ): Promise<{ success: boolean; newPin?: string; error?: string }> {
    // 1. Authorization check
    const isAuthorized =
      adminUser.userRole === 'ADMIN' ||
      ['user-carlos', 'user-william', 'user-wellington', 'user-williams'].includes(adminUser.id);

    if (!isAuthorized) {
      return {
        success: false,
        error: 'Acesso negado: apenas diretores e administradores autorizados podem redefinir PINs.',
      };
    }

    if (!targetUserId) {
      return { success: false, error: 'Colaborador de destino não informado.' };
    }

    // 2. Validate or generate 6-digit PIN
    let nextPin = customPin?.trim();
    if (!nextPin) {
      nextPin = Math.floor(100000 + Math.random() * 900000).toString();
    } else if (!/^\d{6}$/.test(nextPin)) {
      return {
        success: false,
        error: 'O novo PIN informado deve conter exatamente 6 dígitos numéricos.',
      };
    }

    const newHash = await hashPin(nextPin, targetUserId);
    const nowIso = new Date().toISOString();
    const targetUserName = this.getUserName(targetUserId);

    const updatedRecord: UserPinRecord = {
      userId: targetUserId,
      pinHash: newHash,
      updatedAt: nowIso,
      updatedBy: 'admin',
      failedAttempts: 0,
      lockedUntil: null,
      changedByUserId: adminUser.id,
      changedByName: adminUser.name,
    };

    // 3. PERSISTENCE FIRST: Write directly to Firebase Cloud Firestore and await
    if (db) {
      const path = `pin_credentials/${targetUserId}`;
      try {
        const docRef = doc(db, 'pin_credentials', targetUserId);
        await setDoc(docRef, updatedRecord, { merge: true });

        // Save audit log in Firebase (without plain text PIN)
        const auditLogId = `audit_${Date.now()}_${targetUserId}`;
        const auditRef = doc(db, 'pin_audit_logs', auditLogId);
        const auditRecord: PinAuditLog = {
          id: auditLogId,
          targetUserId,
          targetUserName,
          changedByUserId: adminUser.id,
          changedByName: adminUser.name,
          changeType: 'admin_reset',
          timestamp: nowIso,
        };
        await setDoc(auditRef, auditRecord);
      } catch (e) {
        console.error('Falha ao redefinir PIN no Firebase pelo administrador:', e);
        try {
          handleFirestoreError(e, OperationType.WRITE, path);
        } catch {
          // Handled
        }
        return {
          success: false,
          error: 'Falha ao gravar novo PIN no Firebase. O PIN do colaborador NÃO foi alterado.',
        };
      }
    }

    // 4. Update memory cache and localStorage only after Firebase confirms write
    this.inMemoryCache[targetUserId] = updatedRecord;
    this.saveToLocalStorage();

    return { success: true, newPin: nextPin };
  }

  /**
   * Administrator unlocks a collaborator WITHOUT resetting their PIN.
   * Resets failed attempts and lockout in Firebase while preserving custom PIN.
   */
  public async adminUnlockUser(
    adminUser: AppUser,
    targetUserId: string
  ): Promise<{ success: boolean; error?: string }> {
    const isAuthorized =
      adminUser.userRole === 'ADMIN' ||
      ['user-carlos', 'user-william', 'user-wellington', 'user-williams'].includes(adminUser.id);

    if (!isAuthorized) {
      return {
        success: false,
        error: 'Acesso negado: apenas administradores podem desbloquear contas.',
      };
    }

    const record = await this.getLatestRecord(targetUserId);
    if (!record) {
      return { success: false, error: 'Registro do colaborador não encontrado.' };
    }

    const nowIso = new Date().toISOString();
    const targetUserName = this.getUserName(targetUserId);

    if (db) {
      try {
        const docRef = doc(db, 'pin_credentials', targetUserId);
        await updateDoc(docRef, {
          failedAttempts: 0,
          lockedUntil: null,
        });

        // Audit log
        const auditLogId = `audit_${Date.now()}_${targetUserId}`;
        const auditRef = doc(db, 'pin_audit_logs', auditLogId);
        const auditRecord: PinAuditLog = {
          id: auditLogId,
          targetUserId,
          targetUserName,
          changedByUserId: adminUser.id,
          changedByName: adminUser.name,
          changeType: 'admin_unlock',
          timestamp: nowIso,
        };
        await setDoc(auditRef, auditRecord);
      } catch (e) {
        return {
          success: false,
          error: 'Falha ao desbloquear conta no Firebase.',
        };
      }
    }

    record.failedAttempts = 0;
    record.lockedUntil = null;
    this.inMemoryCache[targetUserId] = record;
    this.saveToLocalStorage();

    return { success: true };
  }

  /**
   * Returns user PIN metadata (whether custom, when updated, and who updated)
   */
  public getPinMetadata(userId: string): {
    hasCustomPin: boolean;
    updatedAt: string;
    updatedBy: string;
    changedByName?: string;
  } | null {
    const record = this.inMemoryCache[userId];
    if (!record) return null;
    return {
      hasCustomPin: record.updatedBy !== 'system',
      updatedAt: record.updatedAt,
      updatedBy: record.updatedBy,
      changedByName: record.changedByName,
    };
  }
}

export const pinAuthService = new PinAuthService();
