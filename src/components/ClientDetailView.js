import React, { useState, useEffect } from 'react';
import { 
  User, Calendar, TrendingUp, Activity, 
  Ruler, Weight, Target, Clock, 
  Edit2, Save, X, Plus, ChevronDown, ChevronUp 
} from 'lucide-react';
import './ClientDetailView.css';

const ClientDetailView = ({ client, sessions, onUpdateClient, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showMeasurements, setShowMeasurements] = useState(true);
  const [showGoals, setShowGoals] = useState(true);
  const [showHistory, setShowHistory] = useState(true);
  const [showProgress, setShowProgress] = useState(true);
  
  const [clientData, setClientData] = useState({
    ...client,
    measurements: client.measurements || [],
    goals: client.goals || [],
    notes: client.notes || ''
  });

  const [newMeasurement, setNewMeasurement] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    bodyFat: '',
    chest: '',
    waist: '',
    hips: '',
    thighs: '',
    arms: '',
    shoulders: '',
    notes: ''
  });

  // Get client's sessions
  const clientSessions = sessions.filter(s => 
    s.clientId === client.id || s.clientId === client._id
  );

  // Calculate statistics
  const stats = {
    totalSessions: clientSessions.filter(s => s.status === 'completed').length,
    upcomingSessions: clientSessions.filter(s => s.status === 'scheduled').length,
    thisMonth: clientSessions.filter(s => {
      const sessionDate = new Date(s.date);
      const now = new Date();
      return sessionDate.getMonth() === now.getMonth() && 
             sessionDate.getFullYear() === now.getFullYear() &&
             s.status === 'completed';
    }).length,
    avgSessionsPerWeek: calculateAvgSessionsPerWeek(clientSessions)
  };

  function calculateAvgSessionsPerWeek(sessions) {
    if (sessions.length === 0) return 0;
    const completedSessions = sessions.filter(s => s.status === 'completed');
    if (completedSessions.length === 0) return 0;
    
    const dates = completedSessions.map(s => new Date(s.date));
    const earliest = new Date(Math.min(...dates));
    const latest = new Date(Math.max(...dates));
    const weeks = Math.max(1, (latest - earliest) / (7 * 24 * 60 * 60 * 1000));
    
    return (completedSessions.length / weeks).toFixed(1);
  }

  const handleSaveMeasurement = () => {
    const updatedMeasurements = [
      ...clientData.measurements,
      { ...newMeasurement, id: Date.now() }
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    const updatedClient = {
      ...clientData,
      measurements: updatedMeasurements
    };

    setClientData(updatedClient);
    onUpdateClient(updatedClient);
    
    // Reset form
    setNewMeasurement({
      date: new Date().toISOString().split('T')[0],
      weight: '',
      bodyFat: '',
      chest: '',
      waist: '',
      hips: '',
      thighs: '',
      arms: '',
      shoulders: '',
      notes: ''
    });
  };

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoalText, setNewGoalText] = useState('');

  const handleAddGoal = () => {
    if (newGoalText.trim()) {
      const updatedGoals = [
        ...clientData.goals,
        {
          id: Date.now(),
          text: newGoalText,
          createdAt: new Date().toISOString(),
          completed: false
        }
      ];
      
      const updatedClient = { ...clientData, goals: updatedGoals };
      setClientData(updatedClient);
      onUpdateClient(updatedClient);
      setNewGoalText('');
      setShowGoalModal(false);
    }
  };

  const toggleGoal = (goalId) => {
    const updatedGoals = clientData.goals.map(g =>
      g.id === goalId ? { ...g, completed: !g.completed } : g
    );
    
    const updatedClient = { ...clientData, goals: updatedGoals };
    setClientData(updatedClient);
    onUpdateClient(updatedClient);
  };

  const calculateProgress = () => {
    if (!clientData.measurements || clientData.measurements.length < 2) {
      return null;
    }

    const recent = clientData.measurements[0];
    const previous = clientData.measurements[1];
    
    return {
      weight: recent.weight && previous.weight 
        ? ((recent.weight - previous.weight) / previous.weight * 100).toFixed(1)
        : null,
      bodyFat: recent.bodyFat && previous.bodyFat
        ? (recent.bodyFat - previous.bodyFat).toFixed(1)
        : null,
      waist: recent.waist && previous.waist
        ? ((recent.waist - previous.waist) / previous.waist * 100).toFixed(1)
        : null
    };
  };

  const progress = calculateProgress();

  return (
    <div className="client-detail-view">
      <div className="client-header">
        <div className="client-info">
          <div className="client-avatar-large">
            {client.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1>{client.name}</h1>
            <p className="client-meta">
              Member since {new Date(client.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>
        <button className="btn-close" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <Activity size={20} />
          <div className="stat-content">
            <div className="stat-value">{stats.totalSessions}</div>
            <div className="stat-label">Total Sessions</div>
          </div>
        </div>
        <div className="stat-card">
          <Calendar size={20} />
          <div className="stat-content">
            <div className="stat-value">{stats.upcomingSessions}</div>
            <div className="stat-label">Upcoming</div>
          </div>
        </div>
        <div className="stat-card">
          <TrendingUp size={20} />
          <div className="stat-content">
            <div className="stat-value">{stats.thisMonth}</div>
            <div className="stat-label">This Month</div>
          </div>
        </div>
        <div className="stat-card">
          <Clock size={20} />
          <div className="stat-content">
            <div className="stat-value">{stats.avgSessionsPerWeek}</div>
            <div className="stat-label">Avg/Week</div>
          </div>
        </div>
      </div>

      {/* Measurements Section */}
      <div className="section">
        <div className="section-header" onClick={() => setShowMeasurements(!showMeasurements)}>
          <h2>
            <Ruler size={20} />
            Measurements & Progress
          </h2>
          {showMeasurements ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        {showMeasurements && (
          <div className="section-content">
            {/* Add New Measurement Form */}
            <div className="measurement-form">
              <h3>Record New Measurements</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={newMeasurement.date}
                    onChange={e => setNewMeasurement({...newMeasurement, date: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Weight (lbs)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newMeasurement.weight}
                    onChange={e => setNewMeasurement({...newMeasurement, weight: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Body Fat %</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newMeasurement.bodyFat}
                    onChange={e => setNewMeasurement({...newMeasurement, bodyFat: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Chest (in)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newMeasurement.chest}
                    onChange={e => setNewMeasurement({...newMeasurement, chest: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Waist (in)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newMeasurement.waist}
                    onChange={e => setNewMeasurement({...newMeasurement, waist: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Hips (in)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newMeasurement.hips}
                    onChange={e => setNewMeasurement({...newMeasurement, hips: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Arms (in)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newMeasurement.arms}
                    onChange={e => setNewMeasurement({...newMeasurement, arms: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Thighs (in)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newMeasurement.thighs}
                    onChange={e => setNewMeasurement({...newMeasurement, thighs: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group full-width">
                <label>Notes</label>
                <textarea
                  placeholder="Additional notes..."
                  value={newMeasurement.notes}
                  onChange={e => setNewMeasurement({...newMeasurement, notes: e.target.value})}
                  rows={2}
                />
              </div>
              <button className="btn-primary" onClick={handleSaveMeasurement}>
                <Save size={16} />
                Save Measurements
              </button>
            </div>

            {/* Progress Indicators */}
            {progress && (
              <div className="progress-indicators">
                <h3>Recent Changes</h3>
                <div className="progress-grid">
                  {progress.weight && (
                    <div className={`progress-item ${progress.weight < 0 ? 'negative' : 'positive'}`}>
                      <Weight size={16} />
                      <span>Weight: {progress.weight > 0 ? '+' : ''}{progress.weight}%</span>
                    </div>
                  )}
                  {progress.bodyFat && (
                    <div className={`progress-item ${progress.bodyFat < 0 ? 'negative' : 'positive'}`}>
                      <Activity size={16} />
                      <span>Body Fat: {progress.bodyFat > 0 ? '+' : ''}{progress.bodyFat}%</span>
                    </div>
                  )}
                  {progress.waist && (
                    <div className={`progress-item ${progress.waist < 0 ? 'negative' : 'positive'}`}>
                      <Ruler size={16} />
                      <span>Waist: {progress.waist > 0 ? '+' : ''}{progress.waist}%</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Measurement History */}
            <div className="measurement-history">
              <h3>Measurement History</h3>
              {clientData.measurements.length > 0 ? (
                <div className="history-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Weight</th>
                        <th>Body Fat</th>
                        <th>Waist</th>
                        <th>Chest</th>
                        <th>Arms</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientData.measurements.slice(0, 5).map(m => (
                        <tr key={m.id}>
                          <td>{new Date(m.date).toLocaleDateString()}</td>
                          <td>{m.weight || '-'}</td>
                          <td>{m.bodyFat ? `${m.bodyFat}%` : '-'}</td>
                          <td>{m.waist || '-'}</td>
                          <td>{m.chest || '-'}</td>
                          <td>{m.arms || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="empty-state">No measurements recorded yet</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Goals Section */}
      <div className="section">
        <div className="section-header" onClick={() => setShowGoals(!showGoals)}>
          <h2>
            <Target size={20} />
            Goals & Objectives
          </h2>
          {showGoals ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        {showGoals && (
          <div className="section-content">
            <button className="btn-add" onClick={() => setShowGoalModal(true)}>
              <Plus size={16} />
              Add Goal
            </button>
            
            <div className="goals-list">
              {clientData.goals.length > 0 ? (
                clientData.goals.map(goal => (
                  <div key={goal.id} className="goal-item">
                    <input
                      type="checkbox"
                      checked={goal.completed}
                      onChange={() => toggleGoal(goal.id)}
                    />
                    <span className={goal.completed ? 'completed' : ''}>
                      {goal.text}
                    </span>
                  </div>
                ))
              ) : (
                <p className="empty-state">No goals set</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Session History */}
      <div className="section">
        <div className="section-header" onClick={() => setShowHistory(!showHistory)}>
          <h2>
            <Clock size={20} />
            Session History
          </h2>
          {showHistory ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        {showHistory && (
          <div className="section-content">
            <div className="session-history">
              {clientSessions.length > 0 ? (
                clientSessions
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 10)
                  .map(session => (
                    <div key={session.id} className="history-item">
                      <div className="history-date">
                        {new Date(session.date).toLocaleDateString()}
                      </div>
                      <div className="history-details">
                        <div className="history-time">{session.time}</div>
                        <div className="history-status">
                          <span className={`status-badge ${session.status}`}>
                            {session.status}
                          </span>
                        </div>
                      </div>
                      {session.notes && (
                        <div className="history-notes">{session.notes}</div>
                      )}
                    </div>
                  ))
              ) : (
                <p className="empty-state">No session history</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div className="section">
        <div className="section-header">
          <h2>Notes</h2>
        </div>
        <div className="section-content">
          <textarea
            className="client-notes"
            placeholder="Add notes about this client..."
            value={clientData.notes}
            onChange={e => {
              const updated = { ...clientData, notes: e.target.value };
              setClientData(updated);
            }}
            onBlur={() => onUpdateClient(clientData)}
            rows={4}
          />
        </div>
      </div>

      {/* Goal Modal */}
      {showGoalModal && (
        <div className="modal-overlay" onClick={() => setShowGoalModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Add New Goal</h3>
            <input
              type="text"
              placeholder="Enter goal description..."
              value={newGoalText}
              onChange={e => setNewGoalText(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleAddGoal()}
              autoFocus
              className="goal-input"
            />
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => {
                setShowGoalModal(false);
                setNewGoalText('');
              }}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleAddGoal}>
                Add Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetailView;