#!/bin/bash

# This script creates all the component files for the Enhanced Workout Tracker

echo "Setting up Enhanced Workout Tracker components..."

# Create Navigation component
cat > src/components/Navigation.js << 'EOF'
import React from 'react';
import { Calendar, Users, Dumbbell, History } from 'lucide-react';

const Navigation = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <nav className="nav">
      <div className="nav-content">
        <h1>💪 Workout Tracker Pro</h1>
        <div className="nav-links">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id || 
              (activeView === 'client-detail' && item.id === 'clients') || 
              (activeView === 'session' && item.id === 'calendar');
              
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={isActive ? 'active' : ''}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
EOF

# Create CalendarView component
cat > src/components/CalendarView.js << 'EOF'
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarView = ({ sessions, clients, selectedDate, setSelectedDate, onStartSession }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };
  
  const days = getDaysInMonth(currentMonth);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  
  const getSessionsForDate = (date) => {
    if (!date) return [];
    return sessions.filter(s => {
      const sessionDate = new Date(s.date);
      return sessionDate.toDateString() === date.toDateString();
    });
  };

  const handleDateClick = (day) => {
    if (day) {
      setSelectedDate(day);
      if (clients.length === 0) {
        alert('Please add a client first');
        return;
      }
      
      // Simple client selector
      const clientNames = clients.map((c, i) => `${i + 1}. ${c.name}`).join('\\n');
      const selection = prompt(`Select client:\\n${clientNames}`);
      
      if (selection) {
        const clientIndex = parseInt(selection) - 1;
        if (clientIndex >= 0 && clientIndex < clients.length) {
          onStartSession(clients[clientIndex], day);
        }
      }
    }
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
          <ChevronLeft size={20} />
        </button>
        <h2>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h2>
        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}
        
        {days.map((day, index) => {
          const daySessions = day ? getSessionsForDate(day) : [];
          const isSelected = day && selectedDate && day.toDateString() === selectedDate.toDateString();
          const isToday = day && day.toDateString() === new Date().toDateString();
          
          return (
            <div
              key={index}
              className={`calendar-day ${!day ? 'empty' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${daySessions.length > 0 ? 'has-session' : ''}`}
              onClick={() => handleDateClick(day)}
            >
              {day && (
                <>
                  <div className="day-number">{day.getDate()}</div>
                  {daySessions.map((session, i) => {
                    const client = clients.find(c => c.id === session.clientId);
                    return (
                      <div key={i} className="session-indicator">
                        {client?.name}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
EOF

# Create ClientsView component
cat > src/components/ClientsView.js << 'EOF'
import React, { useState } from 'react';
import { Plus, Eye, Edit, Trash2, X } from 'lucide-react';

const ClientsView = ({ clients, setClients, showModal, setShowModal, onViewClient }) => {
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: '',
    height: '',
    weight: '',
    goals: '',
    injuries: '',
    experience: 'beginner',
    notes: ''
  });

  const handleSubmit = () => {
    if (!formData.name) {
      alert('Please enter a name');
      return;
    }
    
    if (editingClient) {
      setClients(clients.map(c => c.id === editingClient.id ? { ...formData, id: editingClient.id } : c));
    } else {
      setClients([...clients, { ...formData, id: Date.now() }]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '', email: '', phone: '', birthDate: '', gender: '', 
      height: '', weight: '', goals: '', injuries: '', experience: 'beginner', notes: ''
    });
    setEditingClient(null);
    setShowModal(false);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData(client);
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex-between mb-20">
        <h2>Clients</h2>
        <button onClick={() => setShowModal(true)}>
          <Plus size={16} />
          Add Client
        </button>
      </div>

      <div className="grid grid-3">
        {clients.map(client => (
          <div key={client.id} className="card">
            <div className="card-actions">
              <button onClick={() => onViewClient(client)} className="icon-btn">
                <Eye size={16} />
              </button>
              <button onClick={() => handleEdit(client)} className="icon-btn">
                <Edit size={16} />
              </button>
              <button 
                onClick={() => {
                  if (window.confirm('Delete this client?')) {
                    setClients(clients.filter(c => c.id !== client.id));
                  }
                }}
                className="icon-btn danger"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <h3>{client.name}</h3>
            <div className="client-info">
              {client.email && <p>📧 {client.email}</p>}
              {client.phone && <p>📱 {client.phone}</p>}
              {client.experience && <p>🏋️ {client.experience}</p>}
              {client.goals && <p className="truncate">🎯 {client.goals}</p>}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingClient ? 'Edit' : 'Add'} Client</h2>
              <button className="secondary" onClick={resetForm}>
                <X size={20} />
              </button>
            </div>

            <div className="form-grid">
              <div>
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              
              <div>
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              
              <div>
                <label>Birth Date</label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                />
              </div>
              
              <div>
                <label>Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label>Experience Level</label>
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              
              <div>
                <label>Height (cm)</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                />
              </div>
              
              <div>
                <label>Weight (kg)</label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <label>Goals</label>
              <textarea
                value={formData.goals}
                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                rows={3}
                placeholder="What are their fitness goals?"
              />
            </div>
            
            <div>
              <label>Injuries/Limitations</label>
              <textarea
                value={formData.injuries}
                onChange={(e) => setFormData({ ...formData, injuries: e.target.value })}
                rows={2}
                placeholder="Any injuries or physical limitations?"
              />
            </div>
            
            <div>
              <label>Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="Additional notes..."
              />
            </div>
            
            <div className="flex mt-20">
              <button onClick={handleSubmit}>
                {editingClient ? 'Update' : 'Add'} Client
              </button>
              <button className="secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsView;
EOF

# Create ClientDetailView component
cat > src/components/ClientDetailView.js << 'EOF'
import React from 'react';
import { ChevronLeft } from 'lucide-react';

const ClientDetailView = ({ client, workoutHistory, onBack }) => {
  const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getExerciseStats = () => {
    const stats = {};
    workoutHistory.forEach(session => {
      session.workout.exercises.forEach(exercise => {
        if (!stats[exercise.title]) {
          stats[exercise.title] = {
            count: 0,
            maxWeight: 0,
            totalVolume: 0,
            lastPerformed: null,
            bodyPart: exercise.bodyPart
          };
        }
        
        stats[exercise.title].count++;
        stats[exercise.title].lastPerformed = session.completedAt;
        
        session.actualSets[exercise.id]?.forEach(set => {
          if (set.actualWeight > stats[exercise.title].maxWeight) {
            stats[exercise.title].maxWeight = set.actualWeight;
          }
          stats[exercise.title].totalVolume += set.actualReps * set.actualWeight;
        });
      });
    });
    return stats;
  };

  const getBodyPartFrequency = () => {
    const frequency = {};
    workoutHistory.forEach(session => {
      session.workout.exercises.forEach(exercise => {
        if (!frequency[exercise.bodyPart]) {
          frequency[exercise.bodyPart] = 0;
        }
        frequency[exercise.bodyPart]++;
      });
    });
    return frequency;
  };

  const exerciseStats = getExerciseStats();
  const bodyPartFrequency = getBodyPartFrequency();

  return (
    <div>
      <div className="flex items-center gap-20 mb-20">
        <button onClick={onBack} className="icon-btn">
          <ChevronLeft size={20} />
        </button>
        <h2>Client Profile: {client.name}</h2>
      </div>

      <div className="card mb-20">
        <h3>Personal Information</h3>
        <div className="grid grid-3">
          <div>
            <p className="label">Age</p>
            <p className="value">{calculateAge(client.birthDate)} years</p>
          </div>
          <div>
            <p className="label">Gender</p>
            <p className="value">{client.gender || 'N/A'}</p>
          </div>
          <div>
            <p className="label">Experience</p>
            <p className="value capitalize">{client.experience}</p>
          </div>
          <div>
            <p className="label">Height</p>
            <p className="value">{client.height ? `${client.height} cm` : 'N/A'}</p>
          </div>
          <div>
            <p className="label">Weight</p>
            <p className="value">{client.weight ? `${client.weight} kg` : 'N/A'}</p>
          </div>
          <div>
            <p className="label">Contact</p>
            <p className="value">{client.email || client.phone || 'N/A'}</p>
          </div>
        </div>
        
        {client.goals && (
          <div className="mt-20">
            <p className="label">Goals</p>
            <p className="value">{client.goals}</p>
          </div>
        )}
        
        {client.injuries && (
          <div className="mt-20">
            <p className="label">Injuries/Limitations</p>
            <p className="value text-danger">{client.injuries}</p>
          </div>
        )}
      </div>

      <div className="card mb-20">
        <h3>Training Statistics</h3>
        <div className="grid grid-3 mb-20">
          <div className="stat-card">
            <p className="stat-value">{workoutHistory.length}</p>
            <p className="stat-label">Total Sessions</p>
          </div>
          <div className="stat-card">
            <p className="stat-value">{Object.keys(exerciseStats).length}</p>
            <p className="stat-label">Different Exercises</p>
          </div>
          <div className="stat-card">
            <p className="stat-value">
              {workoutHistory.length > 0 ? 
                Math.round(workoutHistory.length / ((Date.now() - new Date(workoutHistory[0].completedAt)) / (1000 * 60 * 60 * 24 * 7))) 
                : 0}
            </p>
            <p className="stat-label">Sessions/Week</p>
          </div>
        </div>

        <h4>Body Part Focus</h4>
        <div className="body-part-chart">
          {Object.entries(bodyPartFrequency).sort((a, b) => b[1] - a[1]).map(([bodyPart, count]) => (
            <div key={bodyPart} className="chart-row">
              <span className="chart-label">{bodyPart}</span>
              <div className="chart-bar">
                <div 
                  className="chart-fill"
                  style={{ width: `${(count / Math.max(...Object.values(bodyPartFrequency))) * 100}%` }}
                />
              </div>
              <span className="chart-value">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Exercise Personal Records</h3>
        <table>
          <thead>
            <tr>
              <th>Exercise</th>
              <th>Body Part</th>
              <th>Times</th>
              <th>Max Weight</th>
              <th>Total Volume</th>
              <th>Last Performed</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(exerciseStats)
              .sort((a, b) => b[1].maxWeight - a[1].maxWeight)
              .map(([exercise, stats]) => (
                <tr key={exercise}>
                  <td>{exercise}</td>
                  <td>{stats.bodyPart}</td>
                  <td className="text-center">{stats.count}</td>
                  <td className="text-center font-bold">{stats.maxWeight} lbs</td>
                  <td className="text-center">{stats.totalVolume.toLocaleString()} lbs</td>
                  <td className="text-center">
                    {new Date(stats.lastPerformed).toLocaleDateString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientDetailView;
EOF

echo "Components created successfully!"
echo "Don't forget to:"
echo "1. Copy your megaGymDataset.csv to the project root"
echo "2. Run: node process-megagym-data.js"
echo "3. Update your CSS file with the enhanced styles"
echo "4. Run: npm start"