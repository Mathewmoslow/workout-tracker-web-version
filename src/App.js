import React, { useState, useEffect } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import ErrorBoundary from './components/ErrorBoundary';
import IntegratedDashboard from './components/IntegratedDashboard';
import ClientDetailView from './components/ClientDetailView';
import ClientsView from './components/ClientsView';
import HistoryView from './components/HistoryView';
import WorkoutBuilder from './components/WorkoutBuilder';
import SessionTracker from './components/SessionTracker';
import exerciseDatabase from './data/exercises.json';
import defaultWorkouts from './data/defaultWorkouts';
import trainerData from './data/trainerDataImport';

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
  const [selectedDate] = useState(new Date());
  const [editingClient, setEditingClient] = useState(null);
  const [viewingClient, setViewingClient] = useState(null);
  
  // NEW: Additional states
  const [showSessionManager, setShowSessionManager] = useState(false);
  const [savedWorkouts, setSavedWorkouts] = useState(defaultWorkouts);
  
  // Enhanced trainer data states
  const [trainerNotes, setTrainerNotes] = useState([]);
  const [progressMetrics, setProgressMetrics] = useState([]);
  const [clientGoals, setClientGoals] = useState([]);
  
  // Load data from localStorage with trainer data as defaults
  useEffect(() => {
    const savedClients = localStorage.getItem('workout_clients');
    const savedSessions = localStorage.getItem('workout_sessions');
    const savedHistory = localStorage.getItem('workout_history');
    const savedWorkoutTemplates = localStorage.getItem('saved_workouts');
    const savedTrainerNotes = localStorage.getItem('trainer_notes');
    const savedMetrics = localStorage.getItem('progress_metrics');
    const savedGoals = localStorage.getItem('client_goals');
    
    // Check if we should load trainer data (for fresh install or reset)
    const hasTrainerData = savedClients && savedSessions && savedTrainerNotes;
    
    // Load clients with trainer data as default
    if (savedClients && hasTrainerData) {
      const existing = JSON.parse(savedClients);
      // Check if trainer client already exists
      const hasTrainerClient = existing.some(c => c.id === 'CL001' || c.firstName === 'Lindsey');
      if (!hasTrainerClient) {
        // Add trainer client if missing
        setClients([...existing, trainerData.trainerClient]);
      } else {
        setClients(existing);
      }
    } else {
      // Initialize with trainer's client data
      setClients([trainerData.trainerClient]);
    }
    
    // Load sessions with trainer data as default
    if (savedSessions && hasTrainerData) {
      const existing = JSON.parse(savedSessions);
      // Check if trainer sessions already exist
      const hasTrainerSessions = existing.some(s => s.id === 'S001' || s.clientId === 'CL001');
      if (!hasTrainerSessions) {
        // Add trainer sessions if missing
        setSessions([...existing, ...trainerData.trainerSessions]);
      } else {
        setSessions(existing);
      }
    } else {
      // Initialize with trainer's session data
      setSessions(trainerData.trainerSessions);
    }
    
    if (savedHistory) setWorkoutHistory(JSON.parse(savedHistory));
    if (savedWorkoutTemplates) {
      const parsed = JSON.parse(savedWorkoutTemplates);
      // Merge with default workouts, keeping user workouts first
      const userWorkoutIds = parsed.map(w => w.id);
      const uniqueDefaults = defaultWorkouts.filter(d => !userWorkoutIds.includes(d.id));
      setSavedWorkouts([...parsed, ...uniqueDefaults]);
    }
    
    // Load enhanced data with trainer defaults
    if (savedTrainerNotes && hasTrainerData) {
      const existing = JSON.parse(savedTrainerNotes);
      const hasTrainerNotes = existing.some(n => n.clientId === 'CL001');
      if (!hasTrainerNotes) {
        setTrainerNotes([...existing, ...trainerData.trainerNotes]);
      } else {
        setTrainerNotes(existing);
      }
    } else {
      setTrainerNotes(trainerData.trainerNotes);
    }
    
    if (savedMetrics && hasTrainerData) {
      const existing = JSON.parse(savedMetrics);
      const hasTrainerMetrics = existing.some(m => m.clientId === 'CL001');
      if (!hasTrainerMetrics) {
        setProgressMetrics([...existing, ...trainerData.trainerMetrics]);
      } else {
        setProgressMetrics(existing);
      }
    } else {
      setProgressMetrics(trainerData.trainerMetrics);
    }
    
    if (savedGoals && hasTrainerData) {
      const existing = JSON.parse(savedGoals);
      const hasTrainerGoals = existing.some(g => g.clientId === 'CL001');
      if (!hasTrainerGoals) {
        setClientGoals([...existing, ...trainerData.trainerGoals]);
      } else {
        setClientGoals(existing);
      }
    } else {
      setClientGoals(trainerData.trainerGoals);
    }
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
  
  // Save enhanced data to localStorage
  useEffect(() => {
    localStorage.setItem('trainer_notes', JSON.stringify(trainerNotes));
  }, [trainerNotes]);
  
  useEffect(() => {
    localStorage.setItem('progress_metrics', JSON.stringify(progressMetrics));
  }, [progressMetrics]);
  
  useEffect(() => {
    localStorage.setItem('client_goals', JSON.stringify(clientGoals));
  }, [clientGoals]);
  
  // Function to reset and load trainer data
  const loadTrainerData = () => {
    if (window.confirm('This will replace current data with Lindsey\'s training history. Continue?')) {
      setClients([trainerData.trainerClient]);
      setSessions(trainerData.trainerSessions);
      setTrainerNotes(trainerData.trainerNotes);
      setProgressMetrics(trainerData.trainerMetrics);
      setClientGoals(trainerData.trainerGoals);
      setWorkoutHistory([]);
      alert('Trainer data loaded! You should now see Lindsey as a client with training history.');
    }
  };

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
    <ErrorBoundary>
      <div className="app">
        <Navigation 
          activeView={activeView} 
          setActiveView={setActiveView}
          onLoadTrainerData={loadTrainerData}
        />
        
        <main className="main-content">
        {activeView === 'calendar' && (
          <>
            <IntegratedDashboard 
              clients={clients}
              sessions={sessions}
              savedWorkouts={savedWorkouts}
              onStartSession={(session, client) => {
                // Use the proper handleStartSession logic but with client parameter
                let workoutForTracker;
                
                if (session.workouts && session.workouts.length > 0) {
                  workoutForTracker = {
                    name: session.name || 'Session',
                    exercises: session.workouts.flatMap(w => {
                      return (w.exercises || []).map(ex => ({
                        ...ex,
                        id: ex.id || ex.workoutExerciseId || Date.now() + Math.random(),
                        sets: ex.sets || [{ reps: 10, weight: 0, rest: 90 }]
                      }));
                    })
                  };
                } else if (session.workout) {
                  workoutForTracker = session.workout;
                } else {
                  alert('No workout found for this session');
                  return;
                }
                
                setActiveSession({
                  ...session,
                  workout: workoutForTracker
                });
                setSelectedClient(client);
                setActiveView('session');
              }}
              onCreateSession={(newSession) => {
                setSessions([...sessions, newSession]);
              }}
              onUpdateSession={(updatedSession) => {
                setSessions(sessions.map(s => 
                  s.id === updatedSession.id ? updatedSession : s
                ));
              }}
            />
            
            {/* Add Create Session button */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button 
                onClick={() => setShowSessionManager(true)}
                className="primary"
              >
                Create New Session
              </button>
            </div>
          </>
        )}
        
        {activeView === 'clients' && (
          <ClientsView 
            clients={clients}
            setClients={setClients}
            showModal={showClientModal}
            setShowModal={setShowClientModal}
            onViewClient={(client) => setViewingClient(client)}
            onEditClient={handleEditClient}
            useEnhancedModal={true}
          />
        )}
        
        {activeView === 'client-detail' && selectedClient && (
          <ClientDetailView
            client={selectedClient}
            workoutHistory={workoutHistory.filter(h => h.clientId === selectedClient.id)}
            sessions={sessions.filter(s => s.clientId === selectedClient.id)}
            trainerNotes={trainerNotes.filter(n => n.clientId === selectedClient.id)}
            progressMetrics={progressMetrics.filter(m => m.clientId === selectedClient.id)}
            clientGoals={clientGoals.filter(g => g.clientId === selectedClient.id)}
            onUpdateClient={(updatedClient) => {
              setClients(clients.map(c => 
                c.id === updatedClient.id ? updatedClient : c
              ));
              setSelectedClient(updatedClient);
            }}
            onAddNote={(note) => setTrainerNotes([...trainerNotes, note])}
            onAddMetric={(metric) => setProgressMetrics([...progressMetrics, metric])}
            onAddGoal={(goal) => setClientGoals([...clientGoals, goal])}
            onBack={() => {
              setSelectedClient(null);
              setActiveView('clients');
            }}
          />
        )}
        
        {activeView === 'workouts' && (
          <EnhancedWorkoutsPage
            workouts={savedWorkouts}
            clients={clients}
            sessions={sessions}
            exerciseDatabase={exerciseDatabase}
            onSaveWorkout={handleSaveWorkout}
            onDeleteWorkout={handleDeleteWorkout}
            onAssignToClient={handleAssignToClient}
            onAddToSession={handleAddToSession}
          />
        )}
        
        {activeView === 'exercise-db' && (
          <ExerciseDatabase />
        )}
        
        {activeView === 'history' && (
          <HistoryView 
            sessions={[...sessions, ...workoutHistory]}
            clients={clients}
          />
        )}
        
        {activeView === 'session' && activeSession && selectedClient && (
          <SessionTracker
            session={activeSession}
            client={selectedClient}
            onSave={(completedSession) => {
              // Add to workout history
              setWorkoutHistory([...workoutHistory, completedSession]);
              
              // Update sessions array with completed session data
              const updatedSessions = sessions.map(s => 
                s.id === completedSession.id 
                  ? { ...s, ...completedSession, status: 'completed' }
                  : s
              );
              
              // If this is a new session not in sessions array, add it
              if (!sessions.find(s => s.id === completedSession.id)) {
                updatedSessions.push({
                  ...completedSession,
                  status: 'completed'
                });
              }
              
              setSessions(updatedSessions);
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
      {showWorkoutBuilder && (
        <WorkoutBuilder
          client={selectedClient}
          date={selectedDate}
          onSave={(workout) => {
            const newSession = {
              id: Date.now(),
              clientId: selectedClient.id || selectedClient._id,
              clientName: selectedClient.name,
              date: selectedDate.toISOString().split('T')[0],
              time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              workout: workout,
              workouts: [workout], // For compatibility with SessionViewEnhanced
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
      {showSessionManager && (
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
              exerciseDatabase={exerciseDatabase}
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
      {showClientModal && (
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
      
      {/* Client Detail View Modal */}
      {viewingClient && (
        <div className="modal-overlay" onClick={() => setViewingClient(null)}>
          <div 
            className="modal large" 
            style={{ maxWidth: '1000px', maxHeight: '90vh', overflow: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <ClientDetailView
              client={viewingClient}
              sessions={sessions}
              onUpdateClient={(updatedClient) => {
                setClients(clients.map(c => 
                  c.id === updatedClient.id ? updatedClient : c
                ));
              }}
              onClose={() => setViewingClient(null)}
            />
          </div>
        </div>
      )}
      </div>
    </ErrorBoundary>
  );
}

export default App;