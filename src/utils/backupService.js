import { storage } from './storage';
import googleDriveService from './googleDriveService';

// Configuration - You'll need to replace these with your actual Google API credentials
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

// Cross-platform sync constants
const SYNC_CONFLICT_RESOLUTION = 'last-write-wins'; // or 'smart-merge'
const MAX_BACKUP_AGE_DAYS = 30;

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

  // Get all data to backup in iOS-compatible format
  getAllData() {
    const clients = storage.getClients();
    const sessions = storage.getSessions();
    const customWorkouts = storage.getCustomWorkouts();
    const workoutHistory = storage.getWorkoutHistory();
    
    return {
      // Core data that syncs with iOS
      clients: this.normalizeClientsForSync(clients),
      customWorkouts: this.normalizeWorkoutsForSync(customWorkouts),
      sessions: this.normalizeSessionsForSync(sessions),
      customExercises: [], // Web doesn't have custom exercises yet
      
      // Web-specific data
      workoutHistory: workoutHistory,
      settings: {
        autoBackupEnabled: this.autoBackupEnabled,
        lastBackupTime: this.lastBackupTime,
        lastSyncTime: localStorage.getItem('lastSyncTime')
      }
    };
  }

  // Normalize clients data for cross-platform compatibility
  normalizeClientsForSync(clients) {
    return clients.map(client => ({
      ...client,
      // Ensure required fields exist
      id: client.id || client._id,
      name: client.name || `${client.firstName || ''} ${client.lastName || ''}`.trim(),
      createdDate: client.createdDate || client.joinDate || new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    }));
  }

  // Normalize workouts data for cross-platform compatibility
  normalizeWorkoutsForSync(workouts) {
    return workouts.map(workout => ({
      ...workout,
      // Ensure required fields exist
      id: workout.id || Date.now() + Math.random(),
      name: workout.name || 'Unnamed Workout',
      exercises: (workout.exercises || []).map(exercise => ({
        ...exercise,
        id: exercise.id || exercise.workoutExerciseId || Date.now() + Math.random(),
        name: exercise.name || exercise.title || 'Unnamed Exercise'
      }))
    }));
  }

  // Normalize sessions data for cross-platform compatibility
  normalizeSessionsForSync(sessions) {
    return sessions.map(session => ({
      ...session,
      // Ensure required fields exist
      id: session.id || Date.now() + Math.random(),
      name: session.name || 'Session',
      date: session.date || new Date().toISOString().split('T')[0],
      clientId: session.clientId
    }));
  }

  // Create a manual backup with cross-platform sync check
  async createManualBackup() {
    try {
      await this.initialize();
      
      if (!googleDriveService.getSignInStatus()) {
        const signedIn = await googleDriveService.signIn();
        if (!signedIn) {
          throw new Error('Failed to sign in to Google Drive');
        }
      }

      // Check for newer remote backups before creating new backup
      const syncResult = await this.checkAndSyncRemoteData();
      if (syncResult.merged) {
        console.log('Data was merged with remote backup before creating new backup');
      }

      const data = this.getAllData();
      const result = await googleDriveService.uploadBackup(data);
      
      if (result.success) {
        this.lastBackupTime = result.timestamp;
        this.updateSyncTimestamps(result.timestamp);
      }

      return {
        ...result,
        syncInfo: syncResult
      };
    } catch (error) {
      console.error('Manual backup failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create automatic backup with smart sync
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

      // Check for remote changes before auto-backup
      const syncResult = await this.checkAndSyncRemoteData(true); // silent = true
      
      const data = this.getAllData();
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[T]/g, '_').replace(/[:-]/g, '-');
      const result = await googleDriveService.uploadBackup(data, `WorkoutTracker_Backup_${timestamp}.json`);
      
      if (result.success) {
        this.updateSyncTimestamps(result.timestamp);
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

  // Restore from backup with cross-platform compatibility
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
      if (!backupData.data && !backupData.clients) {
        throw new Error('Invalid backup file format');
      }

      const result = await this.mergeBackupData(backupData, 'replace');
      
      // Update sync timestamps
      this.updateSyncTimestamps(backupData.timestamp);

      return {
        success: true,
        message: `Data restored successfully from ${backupData.platform || 'unknown'} backup`,
        timestamp: backupData.timestamp,
        platform: backupData.platform,
        mergeInfo: result
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

  // Export data as JSON file in iOS-compatible format
  exportDataAsFile() {
    const data = this.getAllData();
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace(/[T]/g, '_').replace(/[:-]/g, '-');
    const filename = `WorkoutTracker_Backup_${timestamp}.json`;
    
    // Create iOS-compatible export format
    const exportData = {
      exportDate: now.toISOString(),
      appVersion: '2.0.0-web',
      platform: 'web',
      
      // Core data in iOS format
      clients: data.clients,
      workouts: data.customWorkouts,
      sessions: data.sessions,
      exercises: data.customExercises || [],
      
      // Web-specific data (iOS will ignore)
      workoutHistory: data.workoutHistory,
      settings: data.settings
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

  // Cross-platform sync methods
  
  // Check for newer remote backups and merge if needed
  async checkAndSyncRemoteData(silent = false) {
    try {
      const backups = await this.listBackups();
      if (backups.length === 0) {
        return { hasRemote: false, merged: false };
      }

      const latestRemote = backups[0]; // Already sorted by date
      const lastSyncTime = localStorage.getItem('lastSyncTime');
      const localTimestamp = new Date(lastSyncTime || 0);
      
      if (latestRemote.modifiedTime > localTimestamp) {
        if (!silent) {
          console.log(`Found newer ${latestRemote.platform} backup from ${latestRemote.modifiedTime}`);
        }
        
        // Download and merge the newer backup
        const remoteData = await googleDriveService.downloadBackup(latestRemote.id);
        const mergeResult = await this.mergeBackupData(remoteData, 'smart-merge');
        
        this.updateSyncTimestamps(latestRemote.modifiedTime.toISOString());
        
        return {
          hasRemote: true,
          merged: true,
          remoteBackup: latestRemote,
          mergeResult: mergeResult
        };
      }
      
      return { hasRemote: true, merged: false };
    } catch (error) {
      console.error('Sync check failed:', error);
      return { hasRemote: false, merged: false, error: error.message };
    }
  }

  // Merge backup data with local data
  async mergeBackupData(backupData, strategy = 'last-write-wins') {
    const { data } = backupData;
    const mergeResults = {
      clients: { added: 0, updated: 0, conflicts: 0 },
      workouts: { added: 0, updated: 0, conflicts: 0 },
      sessions: { added: 0, updated: 0, conflicts: 0 }
    };

    if (strategy === 'replace') {
      // Complete replacement
      if (data.clients) storage.saveClients(data.clients);
      if (data.customWorkouts) storage.saveCustomWorkouts(data.customWorkouts);
      if (data.sessions) storage.saveSessions(data.sessions);
      if (data.workoutHistory) storage.saveWorkoutHistory(data.workoutHistory);
      
      return { strategy: 'replace', results: 'All data replaced' };
    }

    // Smart merge strategy
    if (data.clients) {
      const result = await this.mergeClients(data.clients);
      mergeResults.clients = result;
    }
    
    if (data.customWorkouts) {
      const result = await this.mergeWorkouts(data.customWorkouts);
      mergeResults.workouts = result;
    }
    
    if (data.sessions) {
      const result = await this.mergeSessions(data.sessions);
      mergeResults.sessions = result;
    }

    return { strategy, results: mergeResults };
  }

  // Merge clients with conflict resolution
  async mergeClients(remoteClients) {
    const localClients = storage.getClients();
    const merged = [...localClients];
    let added = 0, updated = 0, conflicts = 0;

    for (const remoteClient of remoteClients) {
      const localIndex = merged.findIndex(c => c.id === remoteClient.id);
      
      if (localIndex === -1) {
        // New client from remote
        merged.push(remoteClient);
        added++;
      } else {
        // Existing client - check timestamps
        const localClient = merged[localIndex];
        const remoteTime = new Date(remoteClient.lastUpdated || remoteClient.createdDate || 0);
        const localTime = new Date(localClient.lastUpdated || localClient.createdDate || 0);
        
        if (remoteTime > localTime) {
          merged[localIndex] = { ...remoteClient, lastUpdated: new Date().toISOString() };
          updated++;
        } else if (remoteTime.getTime() === localTime.getTime()) {
          // Same timestamp - potential conflict, keep local for now
          conflicts++;
        }
      }
    }

    storage.saveClients(merged);
    return { added, updated, conflicts };
  }

  // Merge workouts with conflict resolution
  async mergeWorkouts(remoteWorkouts) {
    const localWorkouts = storage.getCustomWorkouts();
    const merged = [...localWorkouts];
    let added = 0, updated = 0, conflicts = 0;

    for (const remoteWorkout of remoteWorkouts) {
      const localIndex = merged.findIndex(w => w.id === remoteWorkout.id);
      
      if (localIndex === -1) {
        merged.push(remoteWorkout);
        added++;
      } else {
        // For now, prefer remote workouts (they might have been edited on iOS)
        merged[localIndex] = remoteWorkout;
        updated++;
      }
    }

    storage.saveCustomWorkouts(merged);
    return { added, updated, conflicts };
  }

  // Merge sessions with conflict resolution
  async mergeSessions(remoteSessions) {
    const localSessions = storage.getSessions();
    const merged = [...localSessions];
    let added = 0, updated = 0, conflicts = 0;

    for (const remoteSession of remoteSessions) {
      const localIndex = merged.findIndex(s => s.id === remoteSession.id);
      
      if (localIndex === -1) {
        merged.push(remoteSession);
        added++;
      } else {
        // Sessions are usually completed on one platform, so prefer the more complete one
        const localSession = merged[localIndex];
        if (remoteSession.status === 'completed' && localSession.status !== 'completed') {
          merged[localIndex] = remoteSession;
          updated++;
        }
      }
    }

    storage.saveSessions(merged);
    return { added, updated, conflicts };
  }

  // Update sync timestamps
  updateSyncTimestamps(timestamp) {
    this.lastBackupTime = timestamp;
    localStorage.setItem('lastBackupTime', timestamp);
    localStorage.setItem('lastSyncTime', timestamp);
  }

  // Get backup status with sync information
  getBackupStatus() {
    return {
      isInitialized: this.isInitialized,
      isSignedIn: googleDriveService.getSignInStatus(),
      autoBackupEnabled: this.autoBackupEnabled,
      lastBackupTime: this.lastBackupTime,
      lastSyncTime: localStorage.getItem('lastSyncTime'),
      user: googleDriveService.getCurrentUser(),
      crossPlatformSync: true,
      supportedPlatforms: ['iOS', 'Web']
    };
  }

  // Enable/disable auto backup
  setAutoBackupEnabled(enabled) {
    this.autoBackupEnabled = enabled;
    localStorage.setItem('autoBackupEnabled', enabled.toString());
  }

  // Sign in to Google Drive and check for cross-platform sync
  async signIn() {
    await this.initialize();
    const success = await googleDriveService.signIn();
    
    if (success) {
      // Check for existing backups after sign-in
      setTimeout(async () => {
        try {
          const syncResult = await this.checkAndSyncRemoteData();
          if (syncResult.merged) {
            console.log('Welcome! Your data has been synced with your other devices.');
          }
        } catch (error) {
          console.log('Sync check failed after sign-in:', error.message);
        }
      }, 1000);
    }
    
    return success;
  }

  // Sign out from Google Drive
  async signOut() {
    await googleDriveService.signOut();
  }

  // Force sync with remote data
  async forceSyncWithRemote() {
    return await this.checkAndSyncRemoteData(false);
  }
}

// Create singleton instance
const backupService = new BackupService();

export default backupService;