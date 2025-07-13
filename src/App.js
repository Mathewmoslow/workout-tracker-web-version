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

  // Load data from localStorage
  useEffect(() => {
    const savedClients = localStorage.getItem('workout_clients');
    const savedSessions = localStorage.getItem('workout_sessions');
    const savedHistory = localStorage.getItem('workout_history');
    
    if (savedClients) setClients(JSON.parse(savedClients));
    if (savedSessions) setSessions(JSON.parse(savedSessions));
    if (savedHistory) setWorkoutHistory(JSON.parse(savedHistory));
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

  // Make exercise database available globally (for other components)
  window.exerciseDatabase = exerciseDatabase;

  return (
    <div className="app">
      <Navigation activeView={activeView} setActiveView={setActiveView} />
      
      <main className="main-content">
        {activeView === 'calendar' && (
          <CalendarView 
            sessions={sessions}
            clients={clients}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onStartSession={(client, date) => {
              setSelectedClient(client);
              setSelectedDate(date);
              setShowWorkoutBuilder(true);
            }}
          />
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
          <WorkoutsView 
            sessions={sessions}
            setSessions={setSessions}
          />
        )}
        
        {activeView === 'history' && (
          <HistoryView 
            history={workoutHistory}
            clients={clients}
          />
        )}
        
        {activeView === 'session' && activeSession && (
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
      
      {showWorkoutBuilder && (
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
            
            // Start session immediately
            setActiveSession(newSession);
            setActiveView('session');
          }}
          onClose={() => setShowWorkoutBuilder(false)}
        />
      )}
    </div>
  );
}

export default App;