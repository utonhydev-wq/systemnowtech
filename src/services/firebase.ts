import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  sendPasswordResetEmail, 
  onAuthStateChanged, 
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
  Auth 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  getDocs, 
  onSnapshot, 
  deleteDoc, 
  Firestore,
  writeBatch,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';
import { AppUser } from '../types/auth';

// Operation types for standard error handling as mandated by skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Configuration resolution: priority to firebase-applet-config.json, fallback to VITE_ env
const resolveFirebaseConfig = () => {
  if (firebaseConfigJson && firebaseConfigJson.apiKey && firebaseConfigJson.projectId) {
    return firebaseConfigJson;
  }

  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
  const appId = import.meta.env.VITE_FIREBASE_APP_ID;
  const databaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID;

  if (apiKey && projectId) {
    return {
      apiKey,
      authDomain: authDomain || `${projectId}.firebaseapp.com`,
      projectId,
      storageBucket: storageBucket || `${projectId}.appspot.com`,
      messagingSenderId: messagingSenderId || '',
      appId: appId || '',
      firestoreDatabaseId: databaseId || (firebaseConfigJson as any)?.firestoreDatabaseId || '(default)'
    };
  }

  return null;
};

const resolvedConfig = resolveFirebaseConfig();
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (resolvedConfig) {
  try {
    app = getApps().length === 0 ? initializeApp(resolvedConfig) : getApp();
    auth = getAuth(app);
    // Explicitly pass database ID as required by Firestore Enterprise / Applet configuration
    const databaseId = (resolvedConfig as any).firestoreDatabaseId || '(default)';
    db = getFirestore(app, databaseId);
    console.info('NowTech Solar: Firebase conectado com sucesso!');
  } catch (err) {
    console.warn('NowTech Solar: Erro ao inicializar Firebase SDK:', err);
  }
}

// Connection check to verify connection
export async function testConnection(): Promise<boolean> {
  if (!db) return false;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('NowTech Solar: O cliente Firebase está operando offline.');
    }
    return false;
  }
}

// Run non-blocking connection test
testConnection();

export const isFirebaseConfigured = (): boolean => {
  return !!(app && db && auth);
};

export { auth, db };

// Map Firebase errors to clear Brazilian Portuguese messages
export const mapFirebaseAuthError = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'E-mail ou senha incorretos. Verifique suas credenciais.';
    case 'auth/invalid-email':
      return 'O formato do e-mail informado é inválido.';
    case 'auth/user-disabled':
      return 'Esta conta de colaborador foi desativada pela administração.';
    case 'auth/email-already-in-use':
      return 'Este e-mail já está cadastrado no sistema.';
    case 'auth/weak-password':
      return 'A senha é fraca. Utilize pelo menos 6 caracteres com letras e números.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas sem sucesso. Aguarde alguns instantes antes de tentar novamente.';
    case 'auth/network-request-failed':
      return 'Falha na conexão de rede. Verifique seu sinal de internet.';
    case 'auth/popup-closed-by-user':
      return 'Janela de autenticação fechada antes da conclusão.';
    case 'auth/operation-not-allowed':
      return 'O provedor de e-mail/senha ou Google precisa ser ativado no Firebase Console.';
    default:
      return 'Ocorreu um erro na autenticação. Verifique os dados ou tente novamente.';
  }
};

/**
 * Firebase Authentication Service Helpers
 */
export const firebaseAuthService = {
  /**
   * Login with email and password
   */
  async loginWithEmail(email: string, password: string): Promise<FirebaseUser> {
    if (!auth) throw new Error('Firebase não configurado neste ambiente.');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      return userCredential.user;
    } catch (error: any) {
      throw new Error(mapFirebaseAuthError(error?.code || ''));
    }
  },

  /**
   * Register new user with email and password (for admins creating employee accounts or first admin)
   */
  async registerUser(email: string, password: string): Promise<FirebaseUser> {
    if (!auth) throw new Error('Firebase não configurado neste ambiente.');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      return userCredential.user;
    } catch (error: any) {
      throw new Error(mapFirebaseAuthError(error?.code || ''));
    }
  },

  /**
   * Login with Google (standard popup)
   */
  async loginWithGoogle(): Promise<FirebaseUser> {
    if (!auth) throw new Error('Firebase não configurado neste ambiente.');
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error: any) {
      throw new Error(mapFirebaseAuthError(error?.code || ''));
    }
  },

  /**
   * Sign out current user
   */
  async logout(): Promise<void> {
    if (!auth) return;
    await signOut(auth);
  },

  /**
   * Request password reset email
   */
  async sendPasswordReset(email: string): Promise<void> {
    if (!auth) throw new Error('Firebase não configurado neste ambiente.');
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (error: any) {
      throw new Error(mapFirebaseAuthError(error?.code || ''));
    }
  },

  /**
   * Subscribe to auth state changes
   */
  onAuthChange(callback: (user: FirebaseUser | null) => void): () => void {
    if (!auth) {
      callback(null);
      return () => {};
    }
    return onAuthStateChanged(auth, callback);
  },

  /**
   * Fetch user profile from Firestore /users/{uid}
   */
  async getUserProfile(uid: string): Promise<AppUser | null> {
    if (!db) return null;
    const path = `users/${uid}`;
    try {
      const docRef = doc(db, 'users', uid);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return snapshot.data() as AppUser;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  },

  /**
   * Sync or save user profile in Firestore /users/{uid}
   */
  async saveUserProfile(user: AppUser): Promise<void> {
    if (!db) return;
    const path = `users/${user.id}`;
    try {
      const docRef = doc(db, 'users', user.id);
      await setDoc(docRef, user, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }
};

/**
 * Cloud Firestore Real-time Sync Helpers
 */
export const firestoreSyncService = {
  /**
   * Listen to any collection in real-time
   */
  subscribe<T>(
    collectionName: string, 
    onData: (items: T[]) => void, 
    onError?: (err: Error) => void
  ): () => void {
    const firestoreInstance = db;
    if (!firestoreInstance) {
      return () => {};
    }

    const path = collectionName;
    try {
      const colRef = collection(firestoreInstance, collectionName);
      const unsubscribe = onSnapshot(colRef, (snapshot) => {
        const results: T[] = [];
        snapshot.forEach((docSnapshot) => {
          results.push({ id: docSnapshot.id, ...docSnapshot.data() } as T);
        });
        onData(results);
      }, (err) => {
        console.warn(`Firestore subscription error on ${collectionName}:`, err);
        if (onError) {
          onError(err);
        } else {
          try {
            handleFirestoreError(err, OperationType.GET, path);
          } catch {
            // Logged through handleFirestoreError
          }
        }
      });
      return unsubscribe;
    } catch (e: any) {
      console.warn(`Error setting up Firestore listener for ${collectionName}:`, e);
      return () => {};
    }
  },

  /**
   * Save or update an item in Firestore
   */
  async saveItem<T extends { id: string }>(collectionName: string, item: T): Promise<void> {
    const firestoreInstance = db;
    if (!firestoreInstance) return;
    const path = `${collectionName}/${item.id}`;
    try {
      const docRef = doc(firestoreInstance, collectionName, item.id);
      await setDoc(docRef, item, { merge: true });
    } catch (e) {
      console.warn(`Error saving item to Firestore [${collectionName}]:`, e);
      try {
        handleFirestoreError(e, OperationType.WRITE, path);
      } catch {
        // Logged through handleFirestoreError
      }
    }
  },

  /**
   * Delete an item from Firestore
   */
  async deleteItem(collectionName: string, id: string): Promise<void> {
    const firestoreInstance = db;
    if (!firestoreInstance) return;
    const path = `${collectionName}/${id}`;
    try {
      const docRef = doc(firestoreInstance, collectionName, id);
      await deleteDoc(docRef);
    } catch (e) {
      console.warn(`Error deleting item from Firestore [${collectionName}]:`, e);
      try {
        handleFirestoreError(e, OperationType.DELETE, path);
      } catch {
        // Logged through handleFirestoreError
      }
    }
  },

  /**
   * Batch seed initial data when collection is completely empty
   */
  async seedIfEmpty<T extends { id: string }>(collectionName: string, defaultItems: T[]): Promise<boolean> {
    const firestoreInstance = db;
    if (!firestoreInstance) return false;
    const path = collectionName;
    try {
      const colRef = collection(firestoreInstance, collectionName);
      const snapshot = await getDocs(colRef);
      if (snapshot.empty && defaultItems.length > 0) {
        console.info(`Seeding initial data into Firestore collection: ${collectionName}`);
        const batch = writeBatch(firestoreInstance);
        defaultItems.forEach((item) => {
          const docRef = doc(firestoreInstance, collectionName, item.id);
          batch.set(docRef, item);
        });
        await batch.commit();
        return true;
      }
      return false;
    } catch (e) {
      console.warn(`Error seeding Firestore collection ${collectionName}:`, e);
      try {
        handleFirestoreError(e, OperationType.WRITE, path);
      } catch {
        // Logged through handleFirestoreError
      }
      return false;
    }
  }
};
