import React, { useState, useEffect } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import CalendarView from './components/CalendarView';
import ClientsView from './components/ClientsView';
import ClientDetailView from './components/ClientDetailView';
import WorkoutsView from './components/WorkoutsView';
import HistoryView from './components/HistoryView';
import WorkoutBuilder from './components/WorkoutBuilder';
import SessionTracker from './components/SessionTracker';
import exerciseDatabase from './data/exercises.json';

// NEW: Import enhanced components
import EnhancedClientModal from './components/EnhancedClientModal';
import EnhancedSessionManager from './components/EnhancedSessionManager';
import EnhancedWorkoutsPage from './components/EnhancedWorkoutsPage';
import ExerciseDatabase from './components/ExerciseDatabase';

function App() {
  const [activeView, setActiveView] = useState('calendar');
  const [clients, setClients] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  
  // Modal and selection states
  const [showClientModal, setShowClientModal] = useState(false);
  const [showWorkoutBuilder, setShowWorkoutBuilder] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingClient, setEditingClient] = useState(null);
  
  // NEW: Additional states
  const [showSessionManager, setShowSessionManager] = useState(false);
  const [savedWorkouts, setSavedWorkouts] = useState([]);
  
  // NEW: Feature flags - all on by default
  const [useEnhancedFeatures, setUseEnhancedFeatures] = useState({
    clientModal: true,
    sessionManager: true,
    workoutsPage: true
  });
  
  // Load data from localStorage
  useEffect(() => {
    const savedClients = localStorage.getItem('workout_clients');
    const savedSessions = localStorage.getItem('workout_sessions');
    const savedHistory = localStorage.getItem('workout_history');
    const savedWorkoutTemplates = localStorage.getItem('saved_workouts');
    
    if (savedClients) setClients(JSON.parse(savedClients));
    if (savedSessions) setSessions(JSON.parse(savedSessions));
    if (savedHistory) setWorkoutHistory(JSON.parse(savedHistory));
    if (savedWorkoutTemplates) setSavedWorkouts(JSON.parse(savedWorkoutTemplates));
  }, []);
  
  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('workout_clients', JSON.stringify(clients));
  }, [clients]);
  
  useEffect(() => {
    localStorage.setItem('workout_sessions', JSON.stringify(sessions));
  }, [sessions]);
  
  useEffect(() => {
    localStorage.setItem('workout_history', JSON.stringify(workoutHistory));
  }, [workoutHistory]);
  
  useEffect(() => {
    localStorage.setItem('saved_workouts', JSON.stringify(savedWorkouts));
  }, [savedWorkouts]);
  
  // Make exercise database available globally
  window.exerciseDatabase = exerciseDatabase;

  // Enhanced handlers
  const handleSaveWorkout = (workout) => {
    const existing = savedWorkouts.find(w => w.id === workout.id);
    if (existing) {
      setSavedWorkouts(savedWorkouts.map(w => 
        w.id === workout.id ? workout : w
      ));
    } else {
      setSavedWorkouts([...savedWorkouts, workout]);
    }
  };

  const handleDeleteWorkout = (workoutId) => {
    setSavedWorkouts(savedWorkouts.filter(w => w.id !== workoutId));
  };

  const handleAssignToClient = (workout) => {
    // TODO: Implement client selector modal
    console.log('Assign workout to client:', workout);
    alert('Feature coming soon: Assign workout to client');
  };

  const handleAddToSession = (workout) => {
    // Open session manager with this workout pre-selected
    setShowSessionManager(true);
    // TODO: Pass workout to session manager
  };

  const handleCreateSession = (session) => {
    setSessions([...sessions, session]);
    setShowSessionManager(false);
  };

  const handleUpdateSession = (updatedSession) => {
    setSessions(sessions.map(s => 
      s.id === updatedSession.id ? updatedSession : s
    ));
  };

  const handleStartSession = (session) => {
    // Fix: Convert session workouts array to single workout for SessionTracker
    let workoutForTracker;
    
    if (session.workouts && session.workouts.length > 0) {
      // Combine all workouts into one for the session tracker
      workoutForTracker = {
        name: session.name,
        exercises: session.workouts.flatMap(w => {
          // Ensure each exercise has proper structure
          return (w.exercises || []).map(ex => ({
            ...ex,
            id: ex.id || ex.workoutExerciseId || Date.now() + Math.random(),
            sets: ex.sets || [{ reps: 10, weight: 0, rest: 90 }]
          }));
        })
      };
    } else if (session.workout) {
      // Already has single workout
      workoutForTracker = session.workout;
    } else {
      alert('No workout found for this session');
      return;
    }
    
    setActiveSession({
      ...session,
      workout: workoutForTracker
    });
    
    setSelectedClient(clients.find(c => c.id === session.clientId));
    setActiveView('session');
  };

  // Client handlers
  const handleEditClient = (client) => {
    setEditingClient(client);
    setShowClientModal(true);
  };

  const handleSaveClient = (clientData) => {
    if (editingClient) {
      setClients(clients.map(c => 
        c.id === editingClient.id 
          ? { ...clientData, id: editingClient.id }
          : c
      ));
    } else {
      setClients([...clients, {
        ...clientData,
        id: Date.now()
      }]);
    }
    setShowClientModal(false);
    setEditingClient(null);
  };
  
  return (
    <div className="app">
      {/* Feature Toggle (bottom right) */}
      <div style={{
        position: 'fixed',
        bottom: 50,
        right: 10,
        zIndex: 1000,
        background: 'white',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        fontSize: '12px'
      }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Enhanced Features</h4>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          <input
            type="checkbox"
            checked={useEnhancedFeatures.clientModal}
            onChange={(e) => setUseEnhancedFeatures({
              ...useEnhancedFeatures,
              clientModal: e.target.checked
            })}
          />
          Enhanced Client Modal
        </label>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          <input
            type="checkbox"
            checked={useEnhancedFeatures.sessionManager}
            onChange={(e) => setUseEnhancedFeatures({
              ...useEnhancedFeatures,
              sessionManager: e.target.checked
            })}
          />
          Session Manager
        </label>
        <label style={{ display: 'block' }}>
          <input
            type="checkbox"
            checked={useEnhancedFeatures.workoutsPage}
            onChange={(e) => setUseEnhancedFeatures({
              ...useEnhancedFeatures,
              workoutsPage: e.target.checked
            })}
          />
          Enhanced Workouts
        </label>
      </div>

      <Navigation activeView={activeView} setActiveView={setActiveView} />
      
      <main className="main-content">
        {activeView === 'calendar' && (
          <>
            <CalendarView 
              sessions={sessions}
              clients={clients}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              onStartSession={(client, date) => {
                setSelectedClient(client);
                setSelectedDate(date);
                if (useEnhancedFeatures.sessionManager) {
                  setShowSessionManager(true);
                } else {
                  setShowWorkoutBuilder(true);
                }
              }}
            />
            
            {/* Add Create Session button */}
            {useEnhancedFeatures.sessionManager && (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button 
                  onClick={() => setShowSessionManager(true)}
                  className="primary"
                >
                  Create New Session
                </button>
              </div>
            )}
          </>
        )}
        
        {activeView === 'clients' && (
          <ClientsView 
            clients={clients}
            setClients={setClients}
            showModal={showClientModal}
            setShowModal={setShowClientModal}
            onViewClient={(client) => {
              setSelectedClient(client);
              setActiveView('client-detail');
            }}
            onEditClient={handleEditClient}
            useEnhancedModal={useEnhancedFeatures.clientModal}
          />
        )}
        
        {activeView === 'client-detail' && selectedClient && (
          <ClientDetailView
            client={selectedClient}
            workoutHistory={workoutHistory.filter(h => h.clientId === selectedClient.id)}
            onBack={() => {
              setSelectedClient(null);
              setActiveView('clients');
            }}
          />
        )}
        
        {activeView === 'workouts' && (
          <>
            {useEnhancedFeatures.workoutsPage ? (
              <EnhancedWorkoutsPage
                workouts={savedWorkouts}
                clients={clients}
                sessions={sessions}
                exerciseDatabase={window.exerciseDatabase || []}
                onSaveWorkout={handleSaveWorkout}
                onDeleteWorkout={handleDeleteWorkout}
                onAssignToClient={handleAssignToClient}
                onAddToSession={handleAddToSession}
              />
            ) : (
              <WorkoutsView 
                sessions={sessions}
                setSessions={setSessions}
              />
            )}
          </>
        )}
        
        {activeView === 'exercise-db' && (
          <ExerciseDatabase />
        )}
        
        {activeView === 'history' && (
          <HistoryView 
            history={workoutHistory}
            clients={clients}
          />
        )}
        
        {activeView === 'session' && activeSession && selectedClient && (
          <SessionTracker
            session={activeSession}
            client={selectedClient}
            onSave={(completedSession) => {
              setWorkoutHistory([...workoutHistory, completedSession]);
              setActiveSession(null);
              setActiveView('calendar');
            }}
            onCancel={() => {
              setActiveSession(null);
              setActiveView('calendar');
            }}
          />
        )}
      </main>
      
      {/* Original WorkoutBuilder modal */}
      {showWorkoutBuilder && !useEnhancedFeatures.sessionManager && (
        <WorkoutBuilder
          client={selectedClient}
          date={selectedDate}
          onSave={(workout) => {
            const newSession = {
              id: Date.now(),
              clientId: selectedClient.id,
              date: selectedDate.toISOString(),
              workout: workout,
              status: 'scheduled'
            };
            setSessions([...sessions, newSession]);
            setShowWorkoutBuilder(false);
            
            setActiveSession(newSession);
            setActiveView('session');
          }}
          onClose={() => setShowWorkoutBuilder(false)}
        />
      )}
      
      {/* Enhanced Session Manager Modal */}
      {showSessionManager && useEnhancedFeatures.sessionManager && (
        <div className="modal-overlay" onClick={() => setShowSessionManager(false)}>
          <div 
            className="modal large" 
            style={{ maxWidth: '900px', maxHeight: '90vh', overflow: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <EnhancedSessionManager
              clients={clients}
              workouts={savedWorkouts}
              sessions={sessions}
              exerciseDatabase={window.exerciseDatabase || []}
              onCreateSession={handleCreateSession}
              onUpdateSession={handleUpdateSession}
              onStartSession={handleStartSession}
            />
            <button 
              onClick={() => setShowSessionManager(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* Enhanced Client Modal */}
      {showClientModal && useEnhancedFeatures.clientModal && (
        <EnhancedClientModal
          isOpen={showClientModal}
          onClose={() => {
            setShowClientModal(false);
            setEditingClient(null);
          }}
          onSave={handleSaveClient}
          editingClient={editingClient}
          useEnhancedVersion={true}
        />
      )}
    </div>
  );
}

export default App;