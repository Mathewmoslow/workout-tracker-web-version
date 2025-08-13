// Google Drive API Integration for Workout Tracker Data Backup
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

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
      // Load Google API
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });

      // Initialize Google API
      await new Promise((resolve) => {
        window.gapi.load('client:auth2', resolve);
      });

      // Initialize the API client
      await window.gapi.client.init({
        apiKey: apiKey,
        clientId: clientId,
        discoveryDocs: [DISCOVERY_DOC],
        scope: SCOPES
      });

      this.gapi = window.gapi;
      this.isInitialized = true;
      this.isSignedIn = this.gapi.auth2.getAuthInstance().isSignedIn.get();

      return true;
    } catch (error) {
      console.error('Failed to initialize Google Drive API:', error);
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

  // Create a backup folder if it doesn't exist
  async createBackupFolder() {
    const folderName = 'Together Fitness Backups';
    
    // Check if folder exists
    const folders = await this.gapi.client.drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
      fields: 'files(id, name)'
    });

    if (folders.result.files.length > 0) {
      return folders.result.files[0].id;
    }

    // Create folder
    const folder = await this.gapi.client.drive.files.create({
      resource: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder'
      }
    });

    return folder.result.id;
  }

  // Upload backup to Google Drive
  async uploadBackup(data, fileName = null) {
    if (!this.isSignedIn) {
      throw new Error('Not signed in to Google Drive');
    }

    try {
      const folderId = await this.createBackupFolder();
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
      const backupFileName = fileName || `workout-tracker-backup-${timestamp}.json`;

      // Create the backup data
      const backupData = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        data: data
      };

      // Upload file
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
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to upload backup:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // List available backups
  async listBackups() {
    if (!this.isSignedIn) {
      throw new Error('Not signed in to Google Drive');
    }

    try {
      const folderId = await this.createBackupFolder();
      
      const files = await this.gapi.client.drive.files.list({
        q: `parents='${folderId}' and name contains 'workout-tracker-backup'`,
        orderBy: 'createdTime desc',
        fields: 'files(id, name, createdTime, size)'
      });

      return files.result.files.map(file => ({
        id: file.id,
        name: file.name,
        createdTime: new Date(file.createdTime),
        size: file.size
      }));
    } catch (error) {
      console.error('Failed to list backups:', error);
      return [];
    }
  }

  // Download backup from Google Drive
  async downloadBackup(fileId) {
    if (!this.isSignedIn) {
      throw new Error('Not signed in to Google Drive');
    }

    try {
      const response = await this.gapi.client.drive.files.get({
        fileId: fileId,
        alt: 'media'
      });

      return JSON.parse(response.body);
    } catch (error) {
      console.error('Failed to download backup:', error);
      throw error;
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