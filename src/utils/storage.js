// Local storage utilities
const STORAGE_KEYS = {
  CLIENTS: 'workout_tracker_clients',
  SESSIONS: 'workout_tracker_sessions',
  CUSTOM_WORKOUTS: 'workout_tracker_custom_workouts',
  WORKOUT_HISTORY: 'workout_tracker_history'
};

// Auto-backup trigger (debounced to avoid excessive calls)
let backupTimeout;
const triggerAutoBackup = () => {
  if (backupTimeout) clearTimeout(backupTimeout);
  backupTimeout = setTimeout(() => {
    // Lazy import to avoid circular dependency
    import('./backupService').then(({ default: backupService }) => {
      backupService.createAutoBackup().catch(err => {
        console.log('Auto-backup skipped:', err.message);
      });
    }).catch(err => {
      console.log('Backup service not available:', err.message);
    });
  }, 2000); // Wait 2 seconds before triggering backup
};

export const storage = {
  // Clients
  getClients: () => {
    const data = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    return data ? JSON.parse(data) : [];
  },
  
  saveClients: (clients) => {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    triggerAutoBackup();
  },
  
  // Sessions
  getSessions: () => {
    const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return data ? JSON.parse(data) : [];
  },
  
  saveSessions: (sessions) => {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    triggerAutoBackup();
  },
  
  // Custom Workouts
  getCustomWorkouts: () => {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_WORKOUTS);
    return data ? JSON.parse(data) : [];
  },
  
  saveCustomWorkouts: (workouts) => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_WORKOUTS, JSON.stringify(workouts));
    triggerAutoBackup();
  },
  
  // Workout History
  getWorkoutHistory: () => {
    const data = localStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY);
    return data ? JSON.parse(data) : [];
  },
  
  saveWorkoutHistory: (history) => {
    localStorage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, JSON.stringify(history));
    triggerAutoBackup();
  }
};
