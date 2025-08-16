import React, { useState, useEffect } from 'react';
import { Cloud, Download, Upload, Trash2, Settings, User, Calendar, Check, AlertCircle, Loader, Smartphone, Monitor, RefreshCw } from 'lucide-react';
import backupService from '../utils/backupService';
import SyncStatus from './SyncStatus';

const BackupManager = ({ isOpen, onClose }) => {
  const [backupStatus, setBackupStatus] = useState(null);
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [view, setView] = useState('main'); // 'main', 'list', 'settings'
  const [showSyncStatus, setShowSyncStatus] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadBackupStatus();
    }
  }, [isOpen]);

  const loadBackupStatus = async () => {
    const status = await backupService.getBackupStatus();
    setBackupStatus(status);
  };

  const loadBackups = async () => {
    setLoading(true);
    setError('');
    
    try {
      const backupList = await backupService.listBackups();
      setBackups(backupList);
    } catch (err) {
      setError('Failed to load backups: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    setError('');
    
    try {
      const success = await backupService.signIn();
      if (success) {
        setSuccess('Successfully signed in to Google Drive');
        await loadBackupStatus();
      } else {
        setError('Failed to sign in to Google Drive');
      }
    } catch (err) {
      setError('Sign in failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    
    try {
      await backupService.signOut();
      setSuccess('Signed out from Google Drive');
      await loadBackupStatus();
    } catch (err) {
      setError('Sign out failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await backupService.createManualBackup();
      if (result.success) {
        setSuccess(`Backup created successfully: ${result.fileName}`);
        await loadBackupStatus();
        if (view === 'list') {
          await loadBackups();
        }
      } else {
        setError('Backup failed: ' + result.error);
      }
    } catch (err) {
      setError('Backup failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreBackup = async (backup) => {
    if (!window.confirm(`Are you sure you want to restore from backup "${backup.name}"? This will overwrite all current data.`)) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await backupService.restoreFromBackup(backup.id);
      if (result.success) {
        setSuccess('Data restored successfully! Please refresh the page to see changes.');
      } else {
        setError('Restore failed: ' + result.error);
      }
    } catch (err) {
      setError('Restore failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBackup = async (backup) => {
    if (!window.confirm(`Are you sure you want to delete backup "${backup.name}"?`)) {
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const success = await backupService.deleteBackup(backup.id);
      if (success) {
        setSuccess('Backup deleted successfully');
        await loadBackups();
      } else {
        setError('Failed to delete backup');
      }
    } catch (err) {
      setError('Delete failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    try {
      const filename = backupService.exportDataAsFile();
      setSuccess(`Data exported to ${filename}`);
    } catch (err) {
      setError('Export failed: ' + err.message);
    }
  };

  const handleImportData = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');
    
    try {
      const result = await backupService.importDataFromFile(file);
      if (result.success) {
        setSuccess('Data imported successfully! Please refresh the page to see changes.');
      } else {
        setError('Import failed: ' + result.error);
      }
    } catch (err) {
      setError('Import failed: ' + err.message);
    } finally {
      setLoading(false);
    }
    
    // Clear the file input
    event.target.value = '';
  };

  const handleToggleAutoBackup = () => {
    const newValue = !backupStatus.autoBackupEnabled;
    backupService.setAutoBackupEnabled(newValue);
    setBackupStatus({
      ...backupStatus,
      autoBackupEnabled: newValue
    });
    setSuccess(`Auto-backup ${newValue ? 'enabled' : 'disabled'}`);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', width: '90%' }}>
        <div className="modal-header">
          <h2 className="modal-title">
            <Cloud size={20} />
            Backup Manager
          </h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-content">
          {/* Error/Success Messages */}
          {error && (
            <div className="alert error">
              <AlertCircle size={16} />
              <div className="alert-content">{error}</div>
            </div>
          )}
          
          {success && (
            <div className="alert success">
              <Check size={16} />
              <div className="alert-content">{success}</div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
            <button 
              className={`btn-quick ${view === 'main' ? 'active' : ''}`}
              onClick={() => setView('main')}
            >
              Overview
            </button>
            <button 
              className={`btn-quick ${view === 'list' ? 'active' : ''}`}
              onClick={() => {
                setView('list');
                loadBackups();
              }}
            >
              Backups
            </button>
            <button 
              className={`btn-quick ${view === 'settings' ? 'active' : ''}`}
              onClick={() => setView('settings')}
            >
              <Settings size={16} />
              Settings
            </button>
            <button 
              className="btn-quick"
              onClick={() => setShowSyncStatus(true)}
            >
              <RefreshCw size={16} />
              Cross-Platform Sync
            </button>
          </div>

          {/* Main View */}
          {view === 'main' && backupStatus && (
            <div>
              {/* Google Drive Status */}
              <div style={{ 
                background: backupStatus.isSignedIn ? 'var(--bg-sage-subtle)' : 'var(--bg-coral-subtle)', 
                padding: '16px', 
                borderRadius: '8px', 
                marginBottom: '20px',
                border: '1px solid',
                borderColor: backupStatus.isSignedIn ? 'var(--border-sage)' : 'var(--border-coral)'
              }}>
                <h3 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Cloud size={18} />
                  Google Drive Status
                </h3>
                {backupStatus.isSignedIn ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <User size={16} />
                      <span>{backupStatus.user?.name} ({backupStatus.user?.email})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={16} />
                      Last backup: {backupStatus.lastBackupTime ? formatDate(backupStatus.lastBackupTime) : 'Never'}
                    </div>
                    {backupStatus.crossPlatformSync && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Smartphone size={14} color="#007AFF" />
                          <Monitor size={14} color="#8FA68E" />
                          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Cross-platform sync enabled</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p>Not connected to Google Drive</p>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {backupStatus.isSignedIn ? (
                  <>
                    <button 
                      className="btn-primary"
                      onClick={handleCreateBackup}
                      disabled={loading}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      {loading ? <Loader size={16} className="spinner" /> : <Upload size={16} />}
                      Create Backup
                    </button>
                    <button 
                      className="btn-edit"
                      onClick={handleSignOut}
                      disabled={loading}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button 
                    className="btn-primary"
                    onClick={handleSignIn}
                    disabled={loading}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    {loading ? <Loader size={16} className="spinner" /> : <Cloud size={16} />}
                    Sign In to Google Drive
                  </button>
                )}
              </div>

              {/* Manual Export/Import */}
              <div style={{ 
                background: 'var(--bg-primary)', 
                padding: '16px', 
                borderRadius: '8px',
                border: '1px solid var(--border-light)'
              }}>
                <h3 style={{ margin: '0 0 12px 0' }}>Manual Export/Import</h3>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button 
                    className="btn-start"
                    onClick={handleExportData}
                  >
                    <Download size={16} />
                    Export Data
                  </button>
                  <label className="btn-start" style={{ cursor: 'pointer' }}>
                    <Upload size={16} />
                    Import Data
                    <input 
                      type="file" 
                      accept=".json"
                      onChange={handleImportData}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Backups List View */}
          {view === 'list' && (
            <div>
              {loading && (
                <div className="loading">
                  <div className="spinner"></div>
                  Loading backups...
                </div>
              )}
              
              {!loading && backups.length === 0 && (
                <div className="empty-state">
                  No backups found
                </div>
              )}

              {!loading && backups.length > 0 && (
                <div>
                  {backups.map(backup => {
                    const getPlatformIcon = (platform) => {
                      switch (platform) {
                        case 'iOS':
                          return <Smartphone size={14} color="#007AFF" />;
                        case 'Web':
                          return <Monitor size={14} color="#8FA68E" />;
                        default:
                          return <Cloud size={14} />;
                      }
                    };
                    
                    return (
                      <div key={backup.id} style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-light)',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '12px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div>
                            <div style={{ fontWeight: 'bold', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {backup.name}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {getPlatformIcon(backup.platform)}
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{backup.platform}</span>
                              </div>
                            </div>
                            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                              {formatDate(backup.modifiedTime || backup.createdTime)} • {formatFileSize(backup.size)}
                            </div>
                          </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="btn-start"
                            onClick={() => handleRestoreBackup(backup)}
                            disabled={loading}
                          >
                            <Download size={14} />
                            Restore
                          </button>
                          <button 
                            className="btn-cancel"
                            onClick={() => handleDeleteBackup(backup)}
                            disabled={loading}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Settings View */}
          {view === 'settings' && backupStatus && (
            <div>
              <div style={{ 
                background: 'var(--bg-primary)', 
                padding: '16px', 
                borderRadius: '8px',
                border: '1px solid var(--border-light)'
              }}>
                <h3 style={{ margin: '0 0 16px 0' }}>Auto-Backup Settings</h3>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', marginBottom: '12px' }}>
                  <input 
                    type="checkbox" 
                    checked={backupStatus.autoBackupEnabled}
                    onChange={handleToggleAutoBackup}
                  />
                  <span>Enable automatic backups</span>
                </label>
                
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '0' }}>
                  When enabled, your data will be automatically backed up to Google Drive after completing workouts and other significant actions (maximum once per hour).
                </p>
              </div>

              <div style={{ 
                background: 'var(--bg-primary)', 
                padding: '16px', 
                borderRadius: '8px',
                border: '1px solid var(--border-light)',
                marginTop: '16px'
              }}>
                <h3 style={{ margin: '0 0 12px 0' }}>About Cross-Platform Backups</h3>
                <ul style={{ fontSize: '14px', color: 'var(--text-secondary)', paddingLeft: '20px' }}>
                  <li>Backups include all clients, sessions, custom workouts, and workout history</li>
                  <li>Data syncs automatically between iOS and Web versions</li>
                  <li>Backups are stored in your Google Drive's secure app folder</li>
                  <li>You can restore from any backup created on any platform</li>
                  <li>Conflicts are resolved using newest-wins strategy</li>
                  <li>Manual exports create downloadable JSON files compatible with iOS</li>
                </ul>
                
                <div style={{ marginTop: '16px', padding: '12px', background: 'var(--bg-sage-subtle)', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Smartphone size={16} color="#007AFF" />
                    <Monitor size={16} color="#8FA68E" />
                    <strong style={{ fontSize: '14px' }}>Cross-Platform Compatibility</strong>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                    This web app shares data with the iOS WorkoutTrackerPro app using the same Google account.
                    Create backups on one platform and restore them on another seamlessly.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      
      {/* Sync Status Modal */}
      <SyncStatus 
        isOpen={showSyncStatus} 
        onClose={() => setShowSyncStatus(false)} 
      />
    </div>
  );
};

export default BackupManager;