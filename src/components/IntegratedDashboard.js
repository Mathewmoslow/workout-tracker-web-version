import React, { useState } from 'react';
import { Calendar, Clock, Play, User, ChevronLeft, ChevronRight, Activity, Edit2 } from 'lucide-react';
import './IntegratedDashboard.css';

const IntegratedDashboard = ({ 
  clients, 
  sessions, 
  onStartSession, 
  onCreateSession,
  onUpdateSession,
  savedWorkouts,
  onOpenSessionManager
}) => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Get week dates
  const getWeekDates = (date) => {
    const week = [];
    const startDate = new Date(date);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDates = getWeekDates(currentWeek);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction * 7));
    setCurrentWeek(newDate);
  };

  const getSessionsForDate = (date) => {
    return sessions.filter(session => {
      const sessionDate = session.sessionDate || new Date(session.date);
      return sessionDate.toDateString() === date.toDateString();
    });
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => (c.id || c._id) === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const getTodaysSessions = () => {
    const today = new Date();
    return sessions.filter(session => {
      const sessionDate = session.sessionDate || new Date(session.date);
      return sessionDate.toDateString() === today.toDateString();
    });
  };

  const getUpcomingSessions = () => {
    const today = new Date();
    return sessions.filter(session => {
      const sessionDate = session.sessionDate || new Date(session.date);
      return sessionDate > today;
    }).sort((a, b) => {
      const dateA = a.sessionDate || new Date(a.date);
      const dateB = b.sessionDate || new Date(b.date);
      return dateA - dateB;
    });
  };

  const todaysSessions = getTodaysSessions();
  const upcomingSessions = getUpcomingSessions();

  const handleQuickStart = (session) => {
    const client = clients.find(c => (c.id || c._id) === session.clientId);
    if (client) {
      // Build a workout for the session tracker
      const workout = {
        name: session.name || 'Session Workout',
        exercises: session.workouts?.flatMap(w => w.exercises) || []
      };
      
      const sessionWithWorkout = {
        ...session,
        workout: workout
      };
      
      onStartSession(sessionWithWorkout, client);
    }
  };

  const handleEditSession = (session) => {
    // Open the enhanced session manager for editing
    if (onOpenSessionManager) {
      onOpenSessionManager();
    }
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
                    <div className="session-time">
                      {session.time}
                    </div>
                  </div>
                  <div className="session-card-body">
                    <div className="session-workout">
                      {session.sessionType || 'General Session'}
                    </div>
                    {session.notes && (
                      <div className="session-notes">
                        {session.notes}
                      </div>
                    )}
                  </div>
                  <div className="session-card-actions">
                    <button 
                      className="btn-start"
                      onClick={() => handleQuickStart(session)}
                    >
                      <Play size={14} />
                      Start
                    </button>
                    <button 
                      className="btn-edit"
                      onClick={() => handleEditSession(session)}
                    >
                      <Edit2 size={14} />
                      Edit
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
                  // Open session manager with this client pre-selected
                  if (onOpenSessionManager) {
                    onOpenSessionManager();
                  }
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
              onClick={() => onOpenSessionManager && onOpenSessionManager()}
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

    </div>
  );
};

export default IntegratedDashboard;