import React, { useState } from 'react';
import { Calendar, User, Clock, Activity, Filter, Download } from 'lucide-react';
import './HistoryView.css';

const HistoryView = ({ sessions = [], clients = [] }) => {
  const [filterClient, setFilterClient] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  // Get completed sessions
  const completedSessions = sessions.filter(s => s.status === 'completed' || s.completed);

  // Apply filters
  const filteredSessions = completedSessions.filter(session => {
    if (filterClient !== 'all' && session.clientId !== filterClient) return false;
    if (filterStatus !== 'all' && session.status !== filterStatus) return false;
    
    if (dateRange !== 'all') {
      const sessionDate = new Date(session.date);
      const now = new Date();
      
      switch(dateRange) {
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (sessionDate < weekAgo) return false;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (sessionDate < monthAgo) return false;
          break;
        case 'year':
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          if (sessionDate < yearAgo) return false;
          break;
      }
    }
    
    return true;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const getClientName = (clientId) => {
    if (!clientId) return 'Unknown Client';
    const client = clients.find(c => 
      c.id === clientId || 
      c._id === clientId ||
      String(c.id) === String(clientId)
    );
    return client ? client.name : 'Unknown Client';
  };

  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const calculateStats = () => {
    const stats = {
      totalSessions: filteredSessions.length,
      totalDuration: filteredSessions.reduce((sum, s) => sum + (s.duration || 0), 0),
      avgDuration: 0,
      uniqueClients: new Set(filteredSessions.map(s => s.clientId)).size
    };
    
    if (stats.totalSessions > 0) {
      stats.avgDuration = Math.floor(stats.totalDuration / stats.totalSessions);
    }
    
    return stats;
  };

  const stats = calculateStats();

  return (
    <div className="history-view">
      <div className="history-header">
        <h1>Session History</h1>
        <button className="btn-export">
          <Download size={16} />
          Export Data
        </button>
      </div>

      {/* Statistics */}
      <div className="history-stats">
        <div className="stat-card">
          <Activity size={20} />
          <div>
            <div className="stat-value">{stats.totalSessions}</div>
            <div className="stat-label">Total Sessions</div>
          </div>
        </div>
        <div className="stat-card">
          <Clock size={20} />
          <div>
            <div className="stat-value">{formatDuration(stats.totalDuration)}</div>
            <div className="stat-label">Total Time</div>
          </div>
        </div>
        <div className="stat-card">
          <Clock size={20} />
          <div>
            <div className="stat-value">{formatDuration(stats.avgDuration)}</div>
            <div className="stat-label">Avg Duration</div>
          </div>
        </div>
        <div className="stat-card">
          <User size={20} />
          <div>
            <div className="stat-value">{stats.uniqueClients}</div>
            <div className="stat-label">Unique Clients</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="history-filters">
        <div className="filter-group">
          <label>Client</label>
          <select 
            value={filterClient} 
            onChange={e => setFilterClient(e.target.value)}
          >
            <option value="all">All Clients</option>
            {clients.map(client => (
              <option key={client.id || client._id} value={client.id || client._id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Date Range</label>
          <select 
            value={dateRange} 
            onChange={e => setDateRange(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
            <option value="year">Past Year</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Status</label>
          <select 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Sessions List */}
      <div className="history-list">
        {filteredSessions.length > 0 ? (
          filteredSessions.map(session => (
            <div key={session.id} className="history-item">
              <div className="history-item-header">
                <div className="history-date">
                  <Calendar size={16} />
                  {new Date(session.date).toLocaleDateString()}
                </div>
                <div className="history-time">
                  <Clock size={16} />
                  {session.time || 'N/A'}
                </div>
              </div>
              
              <div className="history-item-body">
                <div className="history-client">
                  <User size={16} />
                  {session.clientName || getClientName(session.clientId)}
                </div>
                <div className="history-duration">
                  Duration: {formatDuration(session.duration)}
                </div>
              </div>
              
              {session.notes && (
                <div className="history-notes">
                  Notes: {session.notes}
                </div>
              )}
              
              {session.exercises && session.exercises.length > 0 && (
                <div className="history-exercises">
                  <strong>Exercises:</strong> {session.exercises.length} completed
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="empty-state">
            <Activity size={48} />
            <h3>No Session History</h3>
            <p>Completed sessions will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;