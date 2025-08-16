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
    this.tokenClient = null;
    this.accessToken = null;
    this.isInitialized = false;
    this.isSignedIn = false;
  }

  // Initialize Google APIs using the newer Google Identity Services
  async initialize(apiKey, clientId) {
    if (this.isInitialized) return true;
    
    // Reset state for fresh init
    this.tokenClient = null;
    this.accessToken = null;

    try {
      // Load the Google API client library
      if (!window.gapi) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://apis.google.com/js/api.js';
          script.onload = resolve;
          script.onerror = reject;
          
          const existingScript = document.querySelector('script[src="https://apis.google.com/js/api.js"]');
          if (!existingScript) {
            document.head.appendChild(script);
          } else {
            resolve();
          }
        });
      }

      // Load the Google Identity Services library
      if (!window.google?.accounts) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://accounts.google.com/gsi/client';
          script.onload = resolve;
          script.onerror = reject;
          
          const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
          if (!existingScript) {
            document.head.appendChild(script);
          } else {
            resolve();
          }
        });
      }

      // Initialize the Google API client
      await new Promise((resolve, reject) => {
        window.gapi.load('client', async () => {
          try {
            await window.gapi.client.init({
              apiKey: apiKey,
              discoveryDocs: [DISCOVERY_DOC]
            });
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      });

      // Initialize the token client for OAuth 2.0 with redirect flow as fallback
      try {
        this.tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: SCOPES,
          callback: (response) => {
            if (response.error) {
              console.error('Token error:', response);
              this.isSignedIn = false;
            } else {
              this.accessToken = response.access_token;
              this.isSignedIn = true;
              // Set the access token for API calls
              this.gapi.client.setToken({
                access_token: response.access_token
              });
            }
          }
        });
      } catch (error) {
        console.error('Failed to initialize token client:', error);
        throw error;
      }

      this.gapi = window.gapi;
      this.isInitialized = true;

      return true;
    } catch (error) {
      console.error('Failed to initialize Google Drive API:', error);
      console.error('Error details:', error.message || error);
      return false;
    }
  }

  // Sign in to Google using the new Identity Services
  async signIn() {
    if (!this.isInitialized) {
      throw new Error('Google Drive API not initialized');
    }

    return new Promise((resolve) => {
      try {
        // Request an access token
        this.tokenClient.callback = (response) => {
          if (response.error) {
            console.error('Sign in error:', response);
            this.isSignedIn = false;
            resolve(false);
          } else {
            this.accessToken = response.access_token;
            this.isSignedIn = true;
            // Set the access token for API calls
            this.gapi.client.setToken({
              access_token: response.access_token
            });
            resolve(true);
          }
        };
        
        // Request the access token with simpler configuration
        this.tokenClient.requestAccessToken({ prompt: '' });
      } catch (error) {
        console.error('Failed to sign in to Google:', error);
        resolve(false);
      }
    });
  }

  // Sign out from Google
  async signOut() {
    if (!this.isInitialized) return;

    try {
      // Revoke the access token
      if (this.accessToken) {
        try {
          window.google.accounts.oauth2.revoke(this.accessToken, () => {
            console.log('Access token revoked');
          });
        } catch (error) {
          console.log('Error revoking token:', error);
        }
      }
      this.accessToken = null;
      this.isSignedIn = false;
      // Clear the token from the API client
      this.gapi.client.setToken(null);
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  }

  // Get current sign-in status
  getSignInStatus() {
    return this.isSignedIn;
  }

  // Get current user info
  async getCurrentUser() {
    if (!this.isSignedIn || !this.accessToken) return null;
    
    try {
      // Use the People API to get user info
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
      
      if (response.ok) {
        const userInfo = await response.json();
        return {
          id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          imageUrl: userInfo.picture
        };
      }
    } catch (error) {
      console.error('Failed to get user info:', error);
    }
    
    return null;
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