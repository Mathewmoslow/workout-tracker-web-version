import React, { useState } from 'react';
import { Calendar, Clock, Play, User, ChevronLeft, ChevronRight, Activity, Edit2 } from 'lucide-react';
import './IntegratedDashboard.css';
import { SessionTypes } from '../types/dataTypes';

const IntegratedDashboard = ({ 
  clients, 
  sessions, 
  onStartSession, 
  onCreateSession,
  onUpdateSession,
  savedWorkouts 
}) => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showNewSessionForm, setShowNewSessionForm] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [sessionForm, setSessionForm] = useState({
    clientId: '',
    date: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`,
    time: '09:00',
    workoutId: '',
    sessionType: SessionTypes.FULL_BODY,
    focusArea: '',
    lateMinutes: 0,
    notes: ''
  });

  // Get week dates
  const getWeekDates = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDates = getWeekDates(currentWeek);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Get sessions for a specific date
  const getSessionsForDate = (date) => {
    // Format date locally to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return sessions.filter(s => {
      const sessionDate = s.date.includes('T') 
        ? s.date.split('T')[0] 
        : s.date;
      return sessionDate === dateStr;
    });
  };

  // Get today's sessions
  const todaysSessions = getSessionsForDate(new Date());
  
  // Get upcoming sessions (next 7 days)
  const upcomingSessions = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const daySessions = getSessionsForDate(date);
    upcomingSessions.push(...daySessions.map(s => ({ ...s, sessionDate: date })));
  }

  const getClientName = (clientId) => {
    if (!clientId) return 'No Client Selected';
    // Standardize ID comparison - convert all to strings for consistent comparison
    const client = clients.find(c => 
      String(c.id || c._id) === String(clientId)
    );
    return client ? client.name : `Unknown (ID: ${clientId})`;
  };

  const handleQuickStart = (session) => {
    const client = clients.find(c => 
      String(c.id || c._id) === String(session.clientId)
    );
    if (client) {
      // Get the workout if one is assigned
      let workoutToUse = null;
      if (session.workoutId && savedWorkouts) {
        workoutToUse = savedWorkouts.find(w => w.id === session.workoutId);
      }
      
      // Ensure session has proper workout structure
      // Use assigned workout, or first saved workout, or a quick default
      const sessionWithWorkout = {
        ...session,
        workouts: workoutToUse 
          ? [workoutToUse] 
          : (session.workouts && session.workouts.length > 0) 
            ? session.workouts
            : savedWorkouts && savedWorkouts.length > 0
              ? [savedWorkouts[0]] // Use first saved workout as default
              : [{ 
                  exercises: [
                    {
                      id: 1,
                      name: 'Push-ups',
                      bodyPart: 'Chest',
                      equipment: 'Bodyweight',
                      sets: [
                        { reps: 10, weight: 0, rest: 60, effort: 7 },
                        { reps: 10, weight: 0, rest: 60, effort: 7 },
                        { reps: 10, weight: 0, rest: 60, effort: 7 }
                      ],
                      notes: 'Maintain proper form throughout'
                    },
                    {
                      id: 2,
                      name: 'Bodyweight Squats',
                      bodyPart: 'Legs',
                      equipment: 'Bodyweight',
                      sets: [
                        { reps: 15, weight: 0, rest: 60, effort: 6 },
                        { reps: 15, weight: 0, rest: 60, effort: 7 },
                        { reps: 15, weight: 0, rest: 60, effort: 7 }
                      ],
                      notes: 'Go to parallel or below'
                    },
                    {
                      id: 3,
                      name: 'Plank',
                      bodyPart: 'Core',
                      equipment: 'Bodyweight',
                      sets: [
                        { reps: 30, weight: 0, rest: 45, effort: 7 },
                        { reps: 30, weight: 0, rest: 45, effort: 8 },
                        { reps: 30, weight: 0, rest: 45, effort: 8 }
                      ],
                      notes: '30 second holds'
                    }
                  ],
                  name: 'Quick Bodyweight Session'
                }]
      };
      onStartSession(sessionWithWorkout, client);
    }
  };

  const handleEditSession = (session) => {
    setEditingSession(session);
    setSessionForm({
      clientId: session.clientId,
      date: session.date,
      time: session.time,
      workoutId: session.workoutId || '',
      sessionType: session.sessionType || SessionTypes.FULL_BODY,
      focusArea: session.focusArea || '',
      lateMinutes: session.lateMinutes || 0,
      notes: session.notes || ''
    });
    setShowNewSessionForm(true);
  };

  const handleSaveSession = () => {
    const sessionData = {
      id: editingSession ? editingSession.id : Date.now(),
      clientId: sessionForm.clientId,
      clientName: getClientName(sessionForm.clientId),
      date: sessionForm.date,
      time: sessionForm.time,
      workoutId: sessionForm.workoutId,
      sessionType: sessionForm.sessionType,
      focusArea: sessionForm.focusArea,
      lateMinutes: sessionForm.lateMinutes,
      notes: sessionForm.notes,
      status: editingSession ? editingSession.status : 'scheduled'
    };
    
    if (editingSession) {
      onUpdateSession(sessionData);
    } else {
      onCreateSession(sessionData);
    }
    
    setShowNewSessionForm(false);
    setEditingSession(null);
    setSessionForm({
      clientId: '',
      date: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`,
      time: '09:00',
      workoutId: '',
      sessionType: SessionTypes.FULL_BODY,
      focusArea: '',
      lateMinutes: 0,
      notes: ''
    });
  };

  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction * 7));
    setCurrentWeek(newWeek);
  };

  return (
    <div className="integrated-dashboard">
      {/* Main Content Area */}
      <div className="main-area">
        {/* Header */}
        <div className="dashboard-header">
          <h1>Session Manager</h1>
        </div>

        {/* Today's Sessions */}
        <div className="today-section">
          <h2>
            <Clock size={20} />
            Today's Sessions
          </h2>
          {todaysSessions.length > 0 ? (
            <div className="session-cards">
              {todaysSessions.map(session => (
                <div key={session.id} className="session-card">
                  <div className="session-card-header">
                    <div className="session-client">
                      <User size={16} />
                      {session.clientName || getClientName(session.clientId)}
                    </div>
                    <span className="session-time">{session.time}</span>
                  </div>
                  <div className="session-card-body">
                    {session.workoutName && (
                      <div className="session-workout">{session.workoutName}</div>
                    )}
                    {session.notes && (
                      <div className="session-notes">{session.notes}</div>
                    )}
                  </div>
                  <div className="session-card-actions">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEditSession(session)}
                      title="Edit Session"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="btn-start"
                      onClick={() => handleQuickStart(session)}
                    >
                      <Play size={16} />
                      Start
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              No sessions scheduled for today
            </div>
          )}
        </div>

        {/* Upcoming Sessions */}
        <div className="upcoming-section">
          <h2>
            <Calendar size={20} />
            Upcoming Sessions
          </h2>
          <div className="upcoming-list">
            {upcomingSessions.slice(0, 5).map(session => (
              <div key={session.id} className="upcoming-item">
                <div className="upcoming-date">
                  {monthNames[session.sessionDate.getMonth()]} {session.sessionDate.getDate()}
                </div>
                <div className="upcoming-details">
                  <div className="upcoming-client">{getClientName(session.clientId)}</div>
                  <div className="upcoming-time">{session.time}</div>
                </div>
                <button 
                  className="btn-action"
                  onClick={() => handleQuickStart(session)}
                >
                  <Activity size={16} />
                </button>
              </div>
            ))}
            {upcomingSessions.length === 0 && (
              <div className="empty-state">
                No upcoming sessions scheduled
              </div>
            )}
          </div>
        </div>

        {/* Client Quick Access */}
        <div className="clients-section">
          <h2>
            <User size={20} />
            Quick Start with Client
          </h2>
          <div className="client-grid">
            {clients.map(client => (
              <button
                key={client.id || client._id}
                className={`client-tile ${selectedClient?.id === client.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedClient(client);
                  setSessionForm({
                    clientId: client.id || client._id,
                    date: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`,
                    time: '09:00',
                    workoutId: '',
                    sessionType: SessionTypes.FULL_BODY,
                    focusArea: '',
                    lateMinutes: 0,
                    notes: ''
                  });
                  setShowNewSessionForm(true);
                }}
              >
                <div className="client-avatar">
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <div className="client-name">{client.name}</div>
              </button>
            ))}
          </div>
          
          {/* Create New Session Button */}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button 
              className="btn-primary"
              onClick={() => setShowNewSessionForm(true)}
              style={{ 
                fontSize: '16px', 
                padding: '12px 32px',
                borderRadius: '8px'
              }}
            >
              Create New Session
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Calendar */}
      <div className="calendar-sidebar">
        <div className="calendar-header">
          <h3>Week View</h3>
          <div className="week-nav">
            <button onClick={() => navigateWeek(-1)}>
              <ChevronLeft size={16} />
            </button>
            <span>
              {monthNames[weekDates[0].getMonth()]} {weekDates[0].getDate()} - {weekDates[6].getDate()}
            </span>
            <button onClick={() => navigateWeek(1)}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        
        <div className="week-calendar">
          {weekDates.map((date, index) => {
            const daySessions = getSessionsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = date.toDateString() === selectedDate.toDateString();
            
            return (
              <div 
                key={index} 
                className={`week-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedDate(date);
                  if (daySessions.length > 0) {
                    // If there are sessions, you can select one to edit
                    // For now, just select the date
                  }
                }}
              >
                <div className="week-day-header">
                  <span className="week-day-name">{dayNames[index]}</span>
                  <span className="week-day-date">{date.getDate()}</span>
                </div>
                <div className="week-day-sessions">
                  {daySessions.slice(0, 3).map((session, i) => (
                    <div 
                      key={i} 
                      className="week-session"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditSession(session);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="week-session-time">{session.time}</div>
                      <div className="week-session-client">
                        {getClientName(session.clientId)}
                      </div>
                    </div>
                  ))}
                  {daySessions.length > 3 && (
                    <div className="week-more">+{daySessions.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Session Modal */}
      {showNewSessionForm && (
        <div className="modal-overlay" onClick={() => {
          setShowNewSessionForm(false);
          setEditingSession(null);
        }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editingSession ? 'Edit Session' : 'Create New Session'}</h2>
            
            <div className="form-group">
              <label>Client</label>
              <select 
                value={sessionForm.clientId}
                onChange={e => setSessionForm({...sessionForm, clientId: e.target.value})}
              >
                <option value="">Select a client</option>
                {clients.map(client => (
                  <option key={client.id || client._id} value={client.id || client._id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input 
                  type="date"
                  value={sessionForm.date}
                  onChange={e => setSessionForm({...sessionForm, date: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Time</label>
                <input 
                  type="time"
                  value={sessionForm.time}
                  onChange={e => setSessionForm({...sessionForm, time: e.target.value})}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Session Type</label>
                <select 
                  value={sessionForm.sessionType}
                  onChange={e => setSessionForm({...sessionForm, sessionType: e.target.value})}
                >
                  {Object.values(SessionTypes).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Focus Area</label>
                <input 
                  type="text"
                  value={sessionForm.focusArea}
                  onChange={e => setSessionForm({...sessionForm, focusArea: e.target.value})}
                  placeholder="e.g., Lateral, Balance, Upper Body"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Workout Template (Optional)</label>
              <select 
                value={sessionForm.workoutId}
                onChange={e => setSessionForm({...sessionForm, workoutId: e.target.value})}
              >
                <option value="">No template</option>
                {savedWorkouts && savedWorkouts.length > 0 ? (
                  savedWorkouts.map(workout => (
                    <option key={workout.id} value={workout.id}>
                      {workout.name} ({workout.exercises ? workout.exercises.length : 0} exercises)
                    </option>
                  ))
                ) : (
                  <option value="default">Default Workout Template</option>
                )}
              </select>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea 
                value={sessionForm.notes}
                onChange={e => setSessionForm({...sessionForm, notes: e.target.value})}
                placeholder="Session notes..."
                rows={3}
              />
            </div>

            <div className="modal-actions">
              <button 
                className="btn-cancel"
                onClick={() => {
                  setShowNewSessionForm(false);
                  setEditingSession(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleSaveSession}
                disabled={!sessionForm.clientId}
              >
                {editingSession ? 'Update Session' : 'Create Session'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegratedDashboard;