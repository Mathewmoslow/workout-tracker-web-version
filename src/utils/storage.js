// Local storage utilities
const STORAGE_KEYS = {
  CLIENTS: 'workout_tracker_clients',
  SESSIONS: 'workout_tracker_sessions',
  CUSTOM_WORKOUTS: 'workout_tracker_custom_workouts',
  WORKOUT_HISTORY: 'workout_tracker_history'
};

export const storage = {
  // Clients
  getClients: () => {
    const data = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    return data ? JSON.parse(data) : [];
  },
  
  saveClients: (clients) => {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  },
  
  // Sessions
  getSessions: () => {
    const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return data ? JSON.parse(data) : [];
  },
  
  saveSessions: (sessions) => {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  },
  
  // Custom Workouts
  getCustomWorkouts: () => {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_WORKOUTS);
    return data ? JSON.parse(data) : [];
  },
  
  saveCustomWorkouts: (workouts) => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_WORKOUTS, JSON.stringify(workouts));
  },
  
  // Workout History
  getWorkoutHistory: () => {
    const data = localStorage.getItem(STORAGE_KEYS.WORKOUT_HISTORY);
    return data ? JSON.parse(data) : [];
  },
  
  saveWorkoutHistory: (history) => {
    localStorage.setItem(STORAGE_KEYS.WORKOUT_HISTORY, JSON.stringify(history));
  }
};
