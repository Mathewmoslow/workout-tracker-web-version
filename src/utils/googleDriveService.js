// Google Drive API Integration for Workout Tracker Data Backup
// Cross-platform compatible with iOS WorkoutTrackerPro app
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

// iOS app compatibility constants
const APP_DATA_FOLDER = 'appDataFolder';
const BACKUP_PREFIX = 'WorkoutTracker_Backup_';

class GoogleDriveService {
  constructor() {
    this.gapi = null;
    this.isInitialized = false;
    this.isSignedIn = false;
  }

  // Initialize Google APIs
  async initialize(apiKey, clientId) {
    if (this.isInitialized) return true;

    try {
      // Check if Google API script is already loaded
      if (!window.gapi) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://apis.google.com/js/api.js';
          script.onload = resolve;
          script.onerror = reject;
          
          // Check if script already exists
          const existingScript = document.querySelector('script[src="https://apis.google.com/js/api.js"]');
          if (!existingScript) {
            document.head.appendChild(script);
          } else {
            resolve();
          }
        });
      }

      // Initialize Google API
      await new Promise((resolve, reject) => {
        window.gapi.load('client:auth2', (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });

      // Initialize the API client with proper configuration
      await window.gapi.client.init({
        apiKey: apiKey,
        clientId: clientId,
        discoveryDocs: [DISCOVERY_DOC],
        scope: SCOPES,
        plugin_name: 'workout-tracker' // Changed to match app name
      });

      this.gapi = window.gapi;
      this.isInitialized = true;
      
      // Check if already signed in
      const authInstance = this.gapi.auth2.getAuthInstance();
      if (authInstance) {
        this.isSignedIn = authInstance.isSignedIn.get();
      }

      return true;
    } catch (error) {
      console.error('Failed to initialize Google Drive API:', error);
      console.error('Make sure the API key and Client ID are correct and the domain is authorized.');
      return false;
    }
  }

  // Sign in to Google
  async signIn() {
    if (!this.isInitialized) {
      throw new Error('Google Drive API not initialized');
    }

    try {
      const authInstance = this.gapi.auth2.getAuthInstance();
      await authInstance.signIn();
      this.isSignedIn = true;
      return true;
    } catch (error) {
      console.error('Failed to sign in to Google:', error);
      return false;
    }
  }

  // Sign out from Google
  async signOut() {
    if (!this.isInitialized) return;

    try {
      const authInstance = this.gapi.auth2.getAuthInstance();
      await authInstance.signOut();
      this.isSignedIn = false;
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  }

  // Get current sign-in status
  getSignInStatus() {
    return this.isSignedIn;
  }

  // Get current user info
  getCurrentUser() {
    if (!this.isSignedIn) return null;
    
    const user = this.gapi.auth2.getAuthInstance().currentUser.get();
    const profile = user.getBasicProfile();
    
    return {
      id: profile.getId(),
      name: profile.getName(),
      email: profile.getEmail(),
      imageUrl: profile.getImageUrl()
    };
  }

  // Use appDataFolder for cross-platform compatibility with iOS
  async getAppDataFolderId() {
    // appDataFolder is a special folder that's hidden from users
    // and shared across platforms using the same OAuth credentials
    return APP_DATA_FOLDER;
  }

  // Upload backup to Google Drive using iOS-compatible format
  async uploadBackup(data, fileName = null) {
    if (!this.isSignedIn) {
      throw new Error('Not signed in to Google Drive');
    }

    try {
      const folderId = await this.getAppDataFolderId();
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 19).replace(/[T]/g, '_').replace(/[:-]/g, '-');
      const backupFileName = fileName || `${BACKUP_PREFIX}${timestamp}.json`;

      // Create iOS-compatible backup data structure
      const backupData = {
        // Metadata matching iOS format
        exportDate: now.toISOString(),
        appVersion: '2.0.0-web',
        platform: 'web',
        
        // Data structure matching iOS export
        clients: data.clients || [],
        workouts: data.customWorkouts || [],
        sessions: data.sessions || [],
        exercises: data.customExercises || [],
        
        // Web-specific data that iOS can safely ignore
        workoutHistory: data.workoutHistory || [],
        settings: data.settings || {}
      };

      // Upload file to appDataFolder
      const response = await this.gapi.client.request({
        path: 'https://www.googleapis.com/upload/drive/v3/files',
        method: 'POST',
        params: {
          uploadType: 'multipart'
        },
        headers: {
          'Content-Type': 'multipart/related; boundary="foo_bar_baz"'
        },
        body: this.buildMultipartBody({
          name: backupFileName,
          parents: [folderId]
        }, JSON.stringify(backupData, null, 2), 'application/json')
      });

      return {
        success: true,
        fileId: response.result.id,
        fileName: backupFileName,
        timestamp: now.toISOString(),
        platform: 'web'
      };
    } catch (error) {
      console.error('Failed to upload backup:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // List available backups (includes both iOS and web backups)
  async listBackups() {
    if (!this.isSignedIn) {
      throw new Error('Not signed in to Google Drive');
    }

    try {
      // Search in appDataFolder for cross-platform compatibility
      const files = await this.gapi.client.drive.files.list({
        q: `parents in 'appDataFolder' and (name contains '${BACKUP_PREFIX}' or name contains 'workout-tracker-backup')`,
        spaces: 'appDataFolder',
        orderBy: 'createdTime desc',
        fields: 'files(id, name, createdTime, size, modifiedTime)'
      });

      return files.result.files.map(file => {
        // Determine platform from filename
        const isIOS = file.name.startsWith(BACKUP_PREFIX);
        const isWeb = file.name.includes('workout-tracker-backup');
        
        return {
          id: file.id,
          name: file.name,
          createdTime: new Date(file.createdTime),
          modifiedTime: new Date(file.modifiedTime),
          size: file.size,
          platform: isIOS ? 'iOS' : (isWeb ? 'Web' : 'Unknown'),
          isCompatible: isIOS || isWeb
        };
      }).filter(file => file.isCompatible);
    } catch (error) {
      console.error('Failed to list backups:', error);
      return [];
    }
  }

  // Download backup from Google Drive (handles both iOS and web formats)
  async downloadBackup(fileId) {
    if (!this.isSignedIn) {
      throw new Error('Not signed in to Google Drive');
    }

    try {
      const response = await this.gapi.client.drive.files.get({
        fileId: fileId,
        alt: 'media'
      });

      const backupData = JSON.parse(response.body);
      
      // Normalize data structure for cross-platform compatibility
      return this.normalizeBackupData(backupData);
    } catch (error) {
      console.error('Failed to download backup:', error);
      throw error;
    }
  }

  // Normalize backup data from different platforms
  normalizeBackupData(backupData) {
    // Check if this is iOS format (direct structure) or web format (wrapped in 'data')
    const isIOSFormat = backupData.exportDate && !backupData.data;
    const isWebFormat = backupData.data && backupData.timestamp;
    
    if (isIOSFormat) {
      // iOS format - return as-is but add metadata wrapper for consistency
      return {
        timestamp: backupData.exportDate,
        version: backupData.appVersion || '2.0.0-ios',
        platform: 'iOS',
        data: {
          clients: backupData.clients || [],
          customWorkouts: backupData.workouts || [],
          sessions: backupData.sessions || [],
          customExercises: backupData.exercises || [],
          workoutHistory: [], // iOS doesn't have this concept
          settings: {}
        },
        raw: backupData // Keep original data for reference
      };
    } else if (isWebFormat) {
      // Web format - already normalized
      return {
        ...backupData,
        platform: 'Web'
      };
    } else {
      // Unknown format - try to handle gracefully
      console.warn('Unknown backup format, attempting to parse');
      return {
        timestamp: new Date().toISOString(),
        version: 'unknown',
        platform: 'Unknown',
        data: backupData
      };
    }
  }

  // Delete backup from Google Drive
  async deleteBackup(fileId) {
    if (!this.isSignedIn) {
      throw new Error('Not signed in to Google Drive');
    }

    try {
      await this.gapi.client.drive.files.delete({
        fileId: fileId
      });
      return true;
    } catch (error) {
      console.error('Failed to delete backup:', error);
      return false;
    }
  }

  // Helper method to build multipart body for file upload
  buildMultipartBody(metadata, data, contentType) {
    const delimiter = 'foo_bar_baz';
    let body = '';
    
    body += `--${delimiter}\r\n`;
    body += 'Content-Type: application/json\r\n\r\n';
    body += JSON.stringify(metadata) + '\r\n';
    
    body += `--${delimiter}\r\n`;
    body += `Content-Type: ${contentType}\r\n\r\n`;
    body += data + '\r\n';
    
    body += `--${delimiter}--`;
    
    return body;
  }
}

// Create singleton instance
const googleDriveService = new GoogleDriveService();

export default googleDriveService;