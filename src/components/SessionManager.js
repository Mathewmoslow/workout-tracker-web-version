// src/components/SessionManager.js
import React, { useState, useEffect } from 'react';

const SessionManager = ({ clients, workouts, sessions, setSessions, onStartSession }) => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [showCreateSession, setShowCreateSession] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sessionForm, setSessionForm] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    clientId: '',
    tags: [],
    workouts: [],
    notes: ''
  });

  const tagOptions = ['Strength', 'Cardio', 'HIIT', 'Flexibility', 'Recovery', 'Assessment'];

  const createSession = () => {
    if (!sessionForm.name || !sessionForm.clientId) {
      alert('Please fill in session name and select a client');
      return;
    }

    const newSession = {
      id: Date.now(),
      ...sessionForm,
      dateTime: `${sessionForm.date}T${sessionForm.time}`,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };

    setSessions([...sessions, newSession]);
    setShowCreateSession(false);
    resetForm();
  };

  const resetForm = () => {
    setSessionForm({
      name: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      clientId: '',
      tags: [],
      workouts: [],
      notes: ''
    });
  };

  const addWorkoutToSession = (sessionId, workout) => {
    setSessions(sessions.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          workouts: [...(session.workouts || []), {
            ...workout,
            addedAt: new Date().toISOString()
          }]
        };
      }
      return session;
    }));
  };

  const removeWorkoutFromSession = (sessionId, workoutId) => {
    setSessions(sessions.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          workouts: session.workouts.filter(w => w.id !== workoutId)
        };
      }
      return session;
    }));
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const getSessionsByDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return sessions.filter(session => session.date === dateStr);
  };

  return (
    <div className="session-manager">
      <div className="manager-header">
        <h2>Session Management</h2>
        <button 
          className="btn-primary"
          onClick={() => setShowCreateSession(true)}
        >
          + Create Session
        </button>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          Calendar View
        </button>
        <button 
          className={`tab ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          List View
        </button>
        <button 
          className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Sessions
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'list' && (
          <div className="sessions-list">
            {sessions.length === 0 ? (
              <p className="empty-state">No sessions created yet. Click "Create Session" to get started.</p>
            ) : (
              sessions.map(session => (
                <div key={session.id} className="session-card">
                  <div className="session-header">
                    <div>
                      <h3>{session.name}</h3>
                      <p className="session-meta">
                        {getClientName(session.clientId)} • {session.date} at {session.time}
                      </p>
                    </div>
                    <div className="session-actions">
                      {session.status === 'scheduled' && (
                        <button 
                          className="btn-start"
                          onClick={() => onStartSession(session)}
                        >
                          Start Session
                        </button>
                      )}
                      <button className="btn-icon">✏️</button>
                      <button className="btn-icon">🗑️</button>
                    </div>
                  </div>

                  <div className="session-tags">
                    {session.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>

                  <div className="session-workouts">
                    <h4>Workouts ({session.workouts?.length || 0})</h4>
                    {session.workouts?.map(workout => (
                      <div key={workout.id} className="workout-item">
                        <span>{workout.name}</span>
                        <button 
                          className="btn-remove"
                          onClick={() => removeWorkoutFromSession(session.id, workout.id)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button 
                      className="btn-add-workout"
                      onClick={() => {/* Open workout selector */}}
                    >
                      + Add Workout
                    </button>
                  </div>

                  {session.notes && (
                    <div className="session-notes">
                      <p>{session.notes}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'upcoming' && (
          <UpcomingSessionsView 
            sessions={sessions}
            clients={clients}
            onStartSession={onStartSession}
          />
        )}
      </div>

      {showCreateSession && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Create New Session</h2>
              <button onClick={() => setShowCreateSession(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Session Name *</label>
                <input
                  type="text"
                  value={sessionForm.name}
                  onChange={(e) => setSessionForm({ ...sessionForm, name: e.target.value })}
                  placeholder="e.g., Upper Body Strength"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    value={sessionForm.date}
                    onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Time *</label>
                  <input
                    type="time"
                    value={sessionForm.time}
                    onChange={(e) => setSessionForm({ ...sessionForm, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Client *</label>
                <select
                  value={sessionForm.clientId}
                  onChange={(e) => setSessionForm({ ...sessionForm, clientId: e.target.value })}
                >
                  <option value="">Select a client...</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Tags</label>
                <div className="tag-selector">
                  {tagOptions.map(tag => (
                    <label key={tag} className="tag-option">
                      <input
                        type="checkbox"
                        checked={sessionForm.tags.includes(tag)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSessionForm({
                              ...sessionForm,
                              tags: [...sessionForm.tags, tag]
                            });
                          } else {
                            setSessionForm({
                              ...sessionForm,
                              tags: sessionForm.tags.filter(t => t !== tag)
                            });
                          }
                        }}
                      />
                      <span>{tag}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={sessionForm.notes}
                  onChange={(e) => setSessionForm({ ...sessionForm, notes: e.target.value })}
                  placeholder="Session goals, focus areas, etc..."
                  rows={3}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowCreateSession(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={createSession}
              >
                Create Session
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .session-manager {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .manager-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .tabs {
          display: flex;
          gap: 10px;
          border-bottom: 2px solid #e0e0e0;
          margin-bottom: 20px;
        }

        .tab {
          padding: 10px 20px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          color: #666;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
          transition: all 0.2s;
        }

        .tab.active {
          color: #007bff;
          border-bottom-color: #007bff;
        }

        .sessions-list {
          display: grid;
          gap: 20px;
        }

        .session-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 20px;
          transition: box-shadow 0.2s;
        }

        .session-card:hover {
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .session-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 15px;
        }

        .session-meta {
          color: #666;
          font-size: 14px;
          margin-top: 5px;
        }

        .session-actions {
          display: flex;
          gap: 10px;
        }

        .btn-start {
          background: #28a745;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn-icon {
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          padding: 5px;
        }

        .session-tags {
          display: flex;
          gap: 8px;
          margin-bottom: 15px;
        }

        .tag {
          background: #e3f2fd;
          color: #1976d2;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
        }

        .session-workouts {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 15px;
        }

        .session-workouts h4 {
          margin-bottom: 10px;
        }

        .workout-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #e0e0e0;
        }

        .btn-remove {
          background: #dc3545;
          color: white;
          border: none;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        }

        .btn-add-workout {
          background: none;
          border: 1px dashed #007bff;
          color: #007bff;
          padding: 8px;
          border-radius: 4px;
          cursor: pointer;
          width: 100%;
          margin-top: 10px;
        }

        .session-notes {
          background: #fff3cd;
          padding: 10px;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .tag-selector {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .tag-option {
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          padding: 5px 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .tag-option:hover {
          background: #f0f0f0;
        }

        .tag-option input[type="checkbox"]:checked + span {
          color: #007bff;
          font-weight: 500;
        }

        .empty-state {
          text-align: center;
          color: #666;
          padding: 40px;
        }
      `}</style>
    </div>
  );
};

// Upcoming Sessions Component
const UpcomingSessionsView = ({ sessions, clients, onStartSession }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingSessions = sessions
    .filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= today && session.status === 'scheduled';
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown';
  };

  const getDaysUntil = (date) => {
    const sessionDate = new Date(date);
    const diffTime = sessionDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `In ${diffDays} days`;
  };

  return (
    <div className="upcoming-sessions">
      {upcomingSessions.length === 0 ? (
        <p className="empty-state">No upcoming sessions scheduled.</p>
      ) : (
        <div className="timeline">
          {upcomingSessions.map(session => (
            <div key={session.id} className="timeline-item">
              <div className="timeline-marker" />
              <div className="timeline-content">
                <div className="timeline-header">
                  <h4>{session.name}</h4>
                  <span className="timeline-date">{getDaysUntil(session.date)}</span>
                </div>
                <p className="timeline-meta">
                  {getClientName(session.clientId)} • {session.date} at {session.time}
                </p>
                <div className="timeline-tags">
                  {session.tags.map(tag => (
                    <span key={tag} className="mini-tag">{tag}</span>
                  ))}
                </div>
                <button 
                  className="btn-start-small"
                  onClick={() => onStartSession(session)}
                >
                  Start Session
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .upcoming-sessions {
          padding: 20px 0;
        }

        .timeline {
          position: relative;
          padding-left: 30px;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 10px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #e0e0e0;
        }

        .timeline-item {
          position: relative;
          padding-bottom: 30px;
        }

        .timeline-marker {
          position: absolute;
          left: -24px;
          top: 5px;
          width: 12px;
          height: 12px;
          background: #007bff;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 0 2px #e0e0e0;
        }

        .timeline-content {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
        }

        .timeline-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 5px;
        }

        .timeline-date {
          font-size: 14px;
          color: #28a745;
          font-weight: 500;
        }

        .timeline-meta {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
        }

        .timeline-tags {
          display: flex;
          gap: 5px;
          margin-bottom: 10px;
        }

        .mini-tag {
          font-size: 11px;
          background: #e3f2fd;
          color: #1976d2;
          padding: 2px 8px;
          border-radius: 12px;
        }

        .btn-start-small {
          background: #28a745;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default SessionManager;