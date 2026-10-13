/**
 * Unified Storage & Sync Service for NowTech Solar
 * Handles real-time cross-tab BroadcastChannel sync, local persistence with safe migration,
 * and comprehensive JSON backup/restore.
 */

const STORAGE_KEYS = {
  CONTENT_ITEMS: 'nowtech_marketing_items_v2',
  EMPLOYEES: 'nowtech_employees_v2',
  TRIBUTES: 'nowtech_birthday_tributes_v2',
  TASKS: 'nowtech_team_tasks_v2',
  NOTIFICATIONS: 'nowtech_notifications_v2',
  AUTH_USER: 'nowtech_auth_user_v2',
  THEME_MODE: 'nowtech_theme_mode_v2',
  LAST_SYNC: 'nowtech_last_sync_timestamp',
};

// BroadcastChannel for instant synchronization across open tabs/windows
const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window 
  ? new BroadcastChannel('nowtech_solar_sync_channel') 
  : null;

export const storageService = {
  // Save with cross-tab broadcast
  save<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
      if (syncChannel) {
        syncChannel.postMessage({ type: 'DATA_UPDATED', key, timestamp: Date.now() });
      }
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  },

  load<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item) as T;
    } catch (e) {
      console.warn('Storage load error:', e);
      return defaultValue;
    }
  },

  // Listen to remote changes
  onSync(callback: (key: string) => void): () => void {
    if (!syncChannel) {
      // Fallback to window storage event
      const handler = (e: StorageEvent) => {
        if (e.key) callback(e.key);
      };
      window.addEventListener('storage', handler);
      return () => window.removeEventListener('storage', handler);
    }

    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'DATA_UPDATED' && event.data?.key) {
        callback(event.data.key);
      }
    };
    syncChannel.addEventListener('message', handler);
    return () => syncChannel.removeEventListener('message', handler);
  },

  // Generate full system backup
  exportBackup(data: {
    items: any[];
    employees: any[];
    tributes: any[];
    tasks: any[];
    notifications: any[];
  }): string {
    const backup = {
      app: 'NowTech Solar Mobile App',
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      ...data,
    };
    return JSON.stringify(backup, null, 2);
  },

  // Download backup as file
  downloadBackupFile(backupJson: string): void {
    const blob = new Blob([backupJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nowtech-solar-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // Parse and validate imported backup
  parseBackup(jsonString: string): any {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Arquivo de backup inválido.');
      }
      return parsed;
    } catch (e: any) {
      throw new Error('Falha ao processar arquivo: ' + (e?.message || 'JSON inválido'));
    }
  },

  STORAGE_KEYS,
};
