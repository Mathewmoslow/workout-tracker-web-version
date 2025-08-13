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
import { loadInitialData } from './data/dataLoader';

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
  
  // Load data from localStorage and initialize with common programs and sample clients
  useEffect(() => {
    // Load initial data (workout programs and sample clients) if needed
    loadInitialData();
    
    // Load existing data from localStorage
    const savedClients = localStorage.getItem('clients');
    const savedSessions = localStorage.getItem('sessions');  
    const savedHistory = localStorage.getItem('workoutHistory');
    const savedWorkoutTemplates = localStorage.getItem('workouts');
    const savedTrainerNotes = localStorage.getItem('trainerNotes');
    const savedMetrics = localStorage.getItem('progressMetrics');
    const savedGoals = localStorage.getItem('clientGoals');
    
    if (savedClients) setClients(JSON.parse(savedClients));
    if (savedSessions) setSessions(JSON.parse(savedSessions));
    if (savedHistory) setWorkoutHistory(JSON.parse(savedHistory));
    
    if (savedWorkoutTemplates) {
      const parsed = JSON.parse(savedWorkoutTemplates);
      setSavedWorkouts(parsed);
    } else {
      setSavedWorkouts(defaultWorkouts);
    }
    
    if (savedTrainerNotes) setTrainerNotes(JSON.parse(savedTrainerNotes));
    if (savedMetrics) setProgressMetrics(JSON.parse(savedMetrics));
    if (savedGoals) setClientGoals(JSON.parse(savedGoals));
  }, []);
  
  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);
  
  useEffect(() => {
    localStorage.setItem('sessions', JSON.stringify(sessions));
  }, [sessions]);
  
  useEffect(() => {
    localStorage.setItem('workoutHistory', JSON.stringify(workoutHistory));
  }, [workoutHistory]);
  
  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(savedWorkouts));
  }, [savedWorkouts]);
  
  // Save enhanced data to localStorage
  useEffect(() => {
    localStorage.setItem('trainerNotes', JSON.stringify(trainerNotes));
  }, [trainerNotes]);
  
  useEffect(() => {
    localStorage.setItem('progressMetrics', JSON.stringify(progressMetrics));
  }, [progressMetrics]);
  
  useEffect(() => {
    localStorage.setItem('clientGoals', JSON.stringify(clientGoals));
  }, [clientGoals]);
  

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
        />
        
        <main className="main-content">
        {activeView === 'calendar' && (
          <>
            <IntegratedDashboard 
              clients={clients}
              sessions={sessions}
              savedWorkouts={savedWorkouts}
              onOpenSessionManager={() => setShowSessionManager(true)}
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
              onAddClient={(newClient) => {
                setClients([...clients, newClient]);
              }}
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