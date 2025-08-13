// Cross-Platform Sync Status Component
import React, { useState, useEffect } from 'react';
import { Cloud, Smartphone, Monitor, Sync, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import backupService from '../utils/backupService';

const SyncStatus = ({ isOpen, onClose }) => {
  const [syncStatus, setSyncStatus] = useState(null);
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSyncStatus();
    }
  }, [isOpen]);

  const loadSyncStatus = async () => {
    setLoading(true);
    try {
      const status = backupService.getBackupStatus();
      setSyncStatus(status);

      if (status.isSignedIn) {
        const backupList = await backupService.listBackups();
        setBackups(backupList);
      }
    } catch (error) {
      console.error('Failed to load sync status:', error);
    }
    setLoading(false);
  };

  const handleForceSync = async () => {
    setSyncing(true);
    try {
      const result = await backupService.forceSyncWithRemote();
      if (result.merged) {
        alert('Data synchronized successfully with your other devices!');
        await loadSyncStatus(); // Refresh status
      } else if (result.hasRemote) {
        alert('Your data is already up to date.');
      } else {
        alert('No remote backups found to sync with.');
      }
    } catch (error) {
      alert(`Sync failed: ${error.message}`);
    }
    setSyncing(false);
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Never';
    return new Date(timeString).toLocaleString();
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'iOS':
        return <Smartphone size={16} />;
      case 'Web':
        return <Monitor size={16} />;
      default:
        return <Cloud size={16} />;
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'iOS':
        return '#007AFF';
      case 'Web':
        return '#8FA68E';
      default:
        return '#666';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal large" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
        <div className="modal-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cloud size={24} />
            Cross-Platform Sync Status
          </h2>
          <button onClick={onClose} className="icon-btn">
            ×
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Sync className="spin" size={32} />
              <p>Loading sync status...</p>
            </div>
          ) : !syncStatus ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <AlertCircle size={32} color="#dc3545" />
              <p>Unable to load sync status</p>
            </div>
          ) : (
            <>
              {/* Sync Overview */}
              <div style={{ 
                background: '#f8f9fa', 
                padding: '20px', 
                borderRadius: '8px', 
                marginBottom: '20px' 
              }}>
                <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {syncStatus.isSignedIn ? 
                    <CheckCircle size={20} color="#28a745" /> : 
                    <AlertCircle size={20} color="#dc3545" />
                  }
                  Google Drive Connection
                </h3>
                
                {syncStatus.isSignedIn ? (
                  <div>
                    <p style={{ color: '#28a745', marginBottom: '10px' }}>
                      ✓ Connected to Google Drive as {syncStatus.user?.email}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <div>
                        <strong>Last Backup:</strong><br />
                        <span style={{ color: '#666' }}>{formatTime(syncStatus.lastBackupTime)}</span>
                      </div>
                      <div>
                        <strong>Last Sync:</strong><br />
                        <span style={{ color: '#666' }}>{formatTime(syncStatus.lastSyncTime)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p style={{ color: '#dc3545', marginBottom: '15px' }}>
                      Not connected to Google Drive. Sign in to enable cross-platform sync.
                    </p>
                    <button 
                      onClick={async () => {
                        const success = await backupService.signIn();
                        if (success) {
                          await loadSyncStatus();
                        }
                      }}
                      className="primary"
                    >
                      Sign in to Google Drive
                    </button>
                  </div>
                )}
              </div>

              {/* Platform Compatibility Info */}
              <div style={{ marginBottom: '20px' }}>
                <h3>Supported Platforms</h3>
                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    padding: '8px 12px',
                    background: '#f0f8ff',
                    borderRadius: '20px'
                  }}>
                    <Smartphone size={16} color="#007AFF" />
                    <span>iOS App</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    padding: '8px 12px',
                    background: '#f0f8f0',
                    borderRadius: '20px'
                  }}>
                    <Monitor size={16} color="#8FA68E" />
                    <span>Web App</span>
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                  Your data automatically syncs between iOS and Web versions using the same Google account.
                </p>
              </div>

              {/* Recent Backups */}
              {syncStatus.isSignedIn && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '15px'
                  }}>
                    <h3 style={{ margin: 0 }}>Recent Backups ({backups.length})</h3>
                    <button 
                      onClick={handleForceSync}
                      disabled={syncing}
                      className="secondary small"
                      style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      <Sync size={14} className={syncing ? 'spin' : ''} />
                      {syncing ? 'Syncing...' : 'Force Sync'}
                    </button>
                  </div>
                  
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {backups.length === 0 ? (
                      <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                        No backups found. Create your first backup to enable sync.
                      </p>
                    ) : (
                      backups.map((backup, index) => (
                        <div key={backup.id} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px',
                          borderBottom: index === backups.length - 1 ? 'none' : '1px solid #e0e0e0',
                          background: index === 0 ? '#f8f9fa' : 'transparent'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {getPlatformIcon(backup.platform)}
                            <div>
                              <div style={{ fontWeight: index === 0 ? '600' : 'normal' }}>
                                {backup.name}
                                {index === 0 && (
                                  <span style={{ 
                                    marginLeft: '10px',
                                    fontSize: '12px',
                                    background: '#28a745',
                                    color: 'white',
                                    padding: '2px 6px',
                                    borderRadius: '4px'
                                  }}>
                                    Latest
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '14px', color: '#666' }}>
                                {formatTime(backup.modifiedTime)}
                              </div>
                            </div>
                          </div>
                          <div style={{ 
                            fontSize: '12px', 
                            color: getPlatformColor(backup.platform),
                            fontWeight: '500'
                          }}>
                            {backup.platform}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Sync Information */}
              <div style={{ 
                background: '#e8f5e8', 
                padding: '15px', 
                borderRadius: '8px',
                fontSize: '14px'
              }}>
                <h4 style={{ marginTop: 0, color: '#155724' }}>How Cross-Platform Sync Works</h4>
                <ul style={{ paddingLeft: '20px', marginBottom: 0 }}>
                  <li>Both iOS and Web apps use the same Google Drive storage</li>
                  <li>Data automatically merges when you sign in on any device</li>
                  <li>Newer changes take priority in case of conflicts</li>
                  <li>Backups are stored securely in your Google Drive's hidden app folder</li>
                  <li>You can manually force sync anytime using the "Force Sync" button</li>
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="secondary">
            Close
          </button>
          {syncStatus?.isSignedIn && (
            <button 
              onClick={async () => {
                const result = await backupService.createManualBackup();
                if (result.success) {
                  alert('Backup created successfully!');
                  await loadSyncStatus();
                } else {
                  alert(`Backup failed: ${result.error}`);
                }
              }}
              className="primary"
            >
              Create Backup Now
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .modal-body {
          max-height: 70vh;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
};

export default SyncStatus;