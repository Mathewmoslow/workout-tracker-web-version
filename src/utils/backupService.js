import { storage } from './storage';
import googleDriveService from './googleDriveService';

// Configuration - You'll need to replace these with your actual Google API credentials
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export class BackupService {
  constructor() {
    this.isInitialized = false;
    this.lastBackupTime = localStorage.getItem('lastBackupTime');
    this.autoBackupEnabled = localStorage.getItem('autoBackupEnabled') !== 'false';
  }

  // Initialize the backup service
  async initialize() {
    if (this.isInitialized) return true;

    if (!GOOGLE_API_KEY || !GOOGLE_CLIENT_ID) {
      console.warn('Google API credentials not configured. Backup functionality will be limited.');
      return false;
    }

    try {
      const success = await googleDriveService.initialize(GOOGLE_API_KEY, GOOGLE_CLIENT_ID);
      this.isInitialized = success;
      return success;
    } catch (error) {
      console.error('Failed to initialize backup service:', error);
      return false;
    }
  }

  // Get all data to backup
  getAllData() {
    return {
      clients: storage.getClients(),
      sessions: storage.getSessions(),
      customWorkouts: storage.getCustomWorkouts(),
      workoutHistory: storage.getWorkoutHistory(),
      settings: {
        autoBackupEnabled: this.autoBackupEnabled,
        lastBackupTime: this.lastBackupTime
      }
    };
  }

  // Create a manual backup
  async createManualBackup() {
    try {
      await this.initialize();
      
      if (!googleDriveService.getSignInStatus()) {
        const signedIn = await googleDriveService.signIn();
        if (!signedIn) {
          throw new Error('Failed to sign in to Google Drive');
        }
      }

      const data = this.getAllData();
      const result = await googleDriveService.uploadBackup(data);
      
      if (result.success) {
        this.lastBackupTime = result.timestamp;
        localStorage.setItem('lastBackupTime', this.lastBackupTime);
      }

      return result;
    } catch (error) {
      console.error('Manual backup failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create automatic backup (called after significant actions)
  async createAutoBackup() {
    if (!this.autoBackupEnabled) return;

    try {
      // Don't auto-backup more than once per hour
      const lastBackup = new Date(this.lastBackupTime || 0);
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      if (lastBackup > hourAgo) return;

      await this.initialize();
      
      if (!googleDriveService.getSignInStatus()) {
        // Don't prompt for auto-backup, just skip
        return;
      }

      const data = this.getAllData();
      const result = await googleDriveService.uploadBackup(data, `workout-tracker-auto-backup-${Date.now()}.json`);
      
      if (result.success) {
        this.lastBackupTime = result.timestamp;
        localStorage.setItem('lastBackupTime', this.lastBackupTime);
      }

      return result;
    } catch (error) {
      console.error('Auto backup failed:', error);
      // Don't throw for auto-backups, just log
    }
  }

  // List available backups
  async listBackups() {
    try {
      await this.initialize();
      
      if (!googleDriveService.getSignInStatus()) {
        const signedIn = await googleDriveService.signIn();
        if (!signedIn) {
          throw new Error('Failed to sign in to Google Drive');
        }
      }

      return await googleDriveService.listBackups();
    } catch (error) {
      console.error('Failed to list backups:', error);
      throw error;
    }
  }

  // Restore from backup
  async restoreFromBackup(fileId) {
    try {
      await this.initialize();
      
      if (!googleDriveService.getSignInStatus()) {
        const signedIn = await googleDriveService.signIn();
        if (!signedIn) {
          throw new Error('Failed to sign in to Google Drive');
        }
      }

      const backupData = await googleDriveService.downloadBackup(fileId);
      
      // Validate backup data
      if (!backupData.data) {
        throw new Error('Invalid backup file format');
      }

      const { data } = backupData;

      // Restore all data
      if (data.clients) storage.saveClients(data.clients);
      if (data.sessions) storage.saveSessions(data.sessions);
      if (data.customWorkouts) storage.saveCustomWorkouts(data.customWorkouts);
      if (data.workoutHistory) storage.saveWorkoutHistory(data.workoutHistory);

      // Restore settings
      if (data.settings) {
        if (typeof data.settings.autoBackupEnabled === 'boolean') {
          this.autoBackupEnabled = data.settings.autoBackupEnabled;
          localStorage.setItem('autoBackupEnabled', this.autoBackupEnabled.toString());
        }
      }

      return {
        success: true,
        message: 'Data restored successfully from backup',
        timestamp: backupData.timestamp
      };
    } catch (error) {
      console.error('Failed to restore backup:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete backup
  async deleteBackup(fileId) {
    try {
      await this.initialize();
      return await googleDriveService.deleteBackup(fileId);
    } catch (error) {
      console.error('Failed to delete backup:', error);
      return false;
    }
  }

  // Export data as JSON file (manual download)
  exportDataAsFile() {
    const data = this.getAllData();
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    const filename = `workout-tracker-export-${timestamp}.json`;
    
    const exportData = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      data: data
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    return filename;
  }

  // Import data from JSON file
  async importDataFromFile(file) {
    try {
      const text = await file.text();
      const importData = JSON.parse(text);
      
      if (!importData.data) {
        throw new Error('Invalid file format');
      }

      const result = await this.restoreFromBackup(null, importData);
      return result;
    } catch (error) {
      console.error('Failed to import data:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get backup status
  getBackupStatus() {
    return {
      isInitialized: this.isInitialized,
      isSignedIn: googleDriveService.getSignInStatus(),
      autoBackupEnabled: this.autoBackupEnabled,
      lastBackupTime: this.lastBackupTime,
      user: googleDriveService.getCurrentUser()
    };
  }

  // Enable/disable auto backup
  setAutoBackupEnabled(enabled) {
    this.autoBackupEnabled = enabled;
    localStorage.setItem('autoBackupEnabled', enabled.toString());
  }

  // Sign in to Google Drive
  async signIn() {
    await this.initialize();
    return await googleDriveService.signIn();
  }

  // Sign out from Google Drive
  async signOut() {
    await googleDriveService.signOut();
  }
}

// Create singleton instance
const backupService = new BackupService();

export default backupService;