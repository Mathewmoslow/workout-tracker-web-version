// src/components/EnhancedSessionManager.js
import React, { useState } from 'react';
import { Calendar, Clock, User, Dumbbell, Play, Edit, Copy, Plus, X } from 'lucide-react';
import EnhancedClientModal from './EnhancedClientModal';

const EnhancedSessionManager = ({ 
  clients = [], 
  workouts = [], 
  sessions = [],
  onCreateSession,
  onUpdateSession,
  onStartSession,
  exerciseDatabase = [],
  onAddClient // New prop for adding clients
}) => {
  const [activeView, setActiveView] = useState('list'); // list, create, edit
  const [selectedSession, setSelectedSession] = useState(null);
  const [showWorkoutSelector, setShowWorkoutSelector] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  
  // Session form data
  const [sessionForm, setSessionForm] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    clientId: '',
    tags: [],
    workouts: [],
    notes: ''
  });

  const sessionTags = ['Strength', 'Cardio', 'Flexibility', 'Recovery', 'Assessment'];

  // Create new session
  const handleCreateSession = () => {
    if (!sessionForm.name || !sessionForm.clientId) {
      alert('Please provide session name and select a client');
      return;
    }

    const newSession = {
      id: Date.now(),
      ...sessionForm,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };

    onCreateSession(newSession);
    resetForm();
    setActiveView('list');
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

  // Handle new client creation
  const handleNewClientSave = (newClient) => {
    // Add the new client through the parent component
    if (onAddClient) {
      onAddClient(newClient);
    }
    
    // Select the new client in the form
    setSessionForm({ ...sessionForm, clientId: newClient.id || newClient._id });
    
    // Close the modal
    setShowClientModal(false);
  };

  const handleTagToggle = (tag) => {
    const tags = sessionForm.tags.includes(tag)
      ? sessionForm.tags.filter(t => t !== tag)
      : [...sessionForm.tags, tag];
    
    setSessionForm({ ...sessionForm, tags });
  };

  const handleAddWorkout = (workout) => {
    setSessionForm({
      ...sessionForm,
      workouts: [...sessionForm.workouts, {
        ...workout,
        sessionWorkoutId: Date.now() // Unique ID for this instance
      }]
    });
    setShowWorkoutSelector(false);
  };

  const handleRemoveWorkout = (sessionWorkoutId) => {
    setSessionForm({
      ...sessionForm,
      workouts: sessionForm.workouts.filter(w => w.sessionWorkoutId !== sessionWorkoutId)
    });
  };

  // Get client name helper
  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  // Format date and time for display
  const formatSessionDateTime = (date, time) => {
    const dateObj = new Date(date);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return `${dateObj.toLocaleDateString('en-US', options)} at ${time}`;
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '10px',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <h2 style={{ margin: 0 }}>Session Management</h2>
        {activeView === 'list' && (
          <button 
            onClick={() => setActiveView('create')}
            className="primary"
          >
            <Plus size={16} style={{ marginRight: '5px' }} />
            Create Session
          </button>
        )}
      </div>

      {/* List View */}
      {activeView === 'list' && (
        <div>
          {/* Upcoming Sessions */}
          <h3 style={{ marginBottom: '15px' }}>Upcoming Sessions</h3>
          <div style={{ marginBottom: '30px' }}>
            {sessions
              .filter(s => s.status === 'scheduled')
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .slice(0, 5)
              .map(session => (
                <div key={session.id} style={{
                  background: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '15px'
                  }}>
                    <div>
                      <h4 style={{ margin: 0, marginBottom: '5px' }}>{session.name}</h4>
                      <p style={{ 
                        margin: 0, 
                        color: '#666', 
                        fontSize: '14px' 
                      }}>
                        <User size={14} style={{ display: 'inline', marginRight: '5px' }} />
                        {getClientName(session.clientId)}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button 
                        onClick={() => onStartSession(session)}
                        className="primary small"
                        title="Start Session"
                      >
                        <Play size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedSession(session);
                          setSessionForm(session);
                          setActiveView('edit');
                        }}
                        className="secondary small"
                        title="Edit Session"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  </div>

                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                    <Calendar size={14} style={{ display: 'inline', marginRight: '5px' }} />
                    {formatSessionDateTime(session.date, session.time)}
                  </div>

                  {session.tags?.length > 0 && (
                    <div style={{ 
                      display: 'flex', 
                      gap: '5px', 
                      flexWrap: 'wrap',
                      marginBottom: '10px'
                    }}>
                      {session.tags.map(tag => (
                        <span key={tag} style={{
                          padding: '4px 8px',
                          background: '#e3f2fd',
                          color: '#1976d2',
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {session.workouts?.length > 0 && (
                    <div style={{ 
                      borderTop: '1px solid #e0e0e0', 
                      paddingTop: '10px',
                      marginTop: '10px'
                    }}>
                      <p style={{ 
                        fontSize: '14px', 
                        fontWeight: '600',
                        marginBottom: '5px'
                      }}>
                        Planned Workouts ({session.workouts.length})
                      </p>
                      {session.workouts.map((workout, index) => (
                        <div key={index} style={{ 
                          fontSize: '13px', 
                          color: '#666',
                          marginLeft: '10px'
                        }}>
                          • {workout.name} ({workout.exercises?.length || 0} exercises)
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>

          {/* Completed Sessions Summary */}
          <h3 style={{ marginBottom: '15px' }}>Recent Completed Sessions</h3>
          <div className="completed-sessions">
            {sessions
              .filter(s => s.status === 'completed')
              .slice(0, 5)
              .map(session => (
                <div key={session.id} style={{
                  padding: '10px',
                  borderBottom: '1px solid #e0e0e0'
                }}>
                  <strong>{session.name}</strong> - {getClientName(session.clientId)}
                  <span style={{ 
                    float: 'right', 
                    color: '#666',
                    fontSize: '14px'
                  }}>
                    {new Date(session.completedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Create/Edit View */}
      {(activeView === 'create' || activeView === 'edit') && (
        <div className="session-form" style={{
          background: 'white',
          padding: '30px',
          borderRadius: '8px',
          border: '1px solid #e0e0e0'
        }}>
          <h3>{activeView === 'create' ? 'Create New' : 'Edit'} Session</h3>

          {/* Step 1: Session Details */}
          <div style={{ marginBottom: '30px' }}>
            <h4>Step 1: Session Details</h4>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '15px',
              marginBottom: '15px'
            }}>
              <label>
                Session Name *
                <input
                  type="text"
                  value={sessionForm.name}
                  onChange={(e) => setSessionForm({ ...sessionForm, name: e.target.value })}
                  placeholder="e.g., Upper Body Strength"
                />
              </label>
              
              <label>
                Client *
                <select
                  value={sessionForm.clientId}
                  onChange={(e) => {
                    if (e.target.value === 'ADD_NEW_CLIENT') {
                      setShowClientModal(true);
                    } else {
                      setSessionForm({ ...sessionForm, clientId: e.target.value });
                    }
                  }}
                >
                  <option value="">Select a client...</option>
                  {clients.map(client => (
                    <option key={client.id || client._id} value={client.id || client._id}>
                      {client.name}
                    </option>
                  ))}
                  <option value="ADD_NEW_CLIENT" style={{ backgroundColor: '#f0f8ff', fontWeight: 'bold' }}>
                    + Add New Client
                  </option>
                </select>
              </label>
              
              <label>
                Date *
                <input
                  type="date"
                  value={sessionForm.date}
                  onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
                />
              </label>
              
              <label>
                Time *
                <input
                  type="time"
                  value={sessionForm.time}
                  onChange={(e) => setSessionForm({ ...sessionForm, time: e.target.value })}
                />
              </label>
            </div>

            {/* Tags */}
            <label>Tags</label>
            <div style={{ 
              display: 'flex', 
              gap: '10px', 
              flexWrap: 'wrap',
              marginBottom: '20px'
            }}>
              {sessionTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  style={{
                    padding: '6px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '20px',
                    background: sessionForm.tags.includes(tag) ? '#007bff' : 'white',
                    color: sessionForm.tags.includes(tag) ? 'white' : '#333',
                    cursor: 'pointer'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Select Workouts */}
          <div style={{ marginBottom: '30px' }}>
            <h4>Step 2: Select Workouts</h4>
            
            {/* Selected Workouts */}
            {sessionForm.workouts.length > 0 && (
              <div style={{ marginBottom: '15px' }}>
                {sessionForm.workouts.map((workout, index) => (
                  <div key={workout.sessionWorkoutId} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px',
                    background: '#f8f9fa',
                    borderRadius: '4px',
                    marginBottom: '8px'
                  }}>
                    <div>
                      <strong>{workout.name}</strong>
                      <span style={{ marginLeft: '10px', color: '#666' }}>
                        ({workout.exercises?.length || 0} exercises)
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveWorkout(workout.sessionWorkoutId)}
                      className="danger small"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowWorkoutSelector(true)}
              className="secondary"
            >
              <Plus size={16} />
              Add Workout
            </button>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '30px' }}>
            <label>Session Notes</label>
            <textarea
              value={sessionForm.notes}
              onChange={(e) => setSessionForm({ ...sessionForm, notes: e.target.value })}
              rows={3}
              placeholder="Any special instructions or notes for this session..."
            />
          </div>

          {/* Actions */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: '10px',
            paddingTop: '20px',
            borderTop: '1px solid #e0e0e0'
          }}>
            <button
              onClick={() => {
                setActiveView('list');
                resetForm();
              }}
              className="secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateSession}
              className="primary"
            >
              {activeView === 'create' ? 'Create' : 'Update'} Session
            </button>
          </div>
        </div>
      )}

      {/* Workout Selector Modal */}
      {showWorkoutSelector && (
        <WorkoutSelector
          workouts={workouts}
          exerciseDatabase={exerciseDatabase}
          onSelect={handleAddWorkout}
          onClose={() => setShowWorkoutSelector(false)}
        />
      )}

      {/* Client Modal */}
      {showClientModal && (
        <EnhancedClientModal
          isOpen={showClientModal}
          onClose={() => setShowClientModal(false)}
          onSave={handleNewClientSave}
          editingClient={null}
        />
      )}
    </div>
  );
};

// Workout Selector Component
const WorkoutSelector = ({ workouts, exerciseDatabase, onSelect, onClose }) => {
  const [activeTab, setActiveTab] = useState('library'); // library, create
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    exercises: []
  });
  const [showExerciseList, setShowExerciseList] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateAndAdd = () => {
    if (!newWorkout.name || newWorkout.exercises.length === 0) {
      alert('Please provide workout name and add exercises');
      return;
    }
    onSelect(newWorkout);
  };

  const addExerciseToWorkout = (exercise) => {
    setNewWorkout({
      ...newWorkout,
      exercises: [...newWorkout.exercises, {
        ...exercise,
        sets: [{ reps: 10, weight: 0, rest: 90 }]
      }]
    });
    setShowExerciseList(false);
    setSearchTerm('');
  };

  const filteredExercises = exerciseDatabase.filter(ex => 
    !searchTerm || ex.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Select or Create Workout</h3>
          <button onClick={onClose} className="icon-btn">
            <X size={20} />
          </button>
        </div>

        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid #e0e0e0',
          marginBottom: '20px'
        }}>
          <button
            onClick={() => setActiveTab('library')}
            style={{
              padding: '10px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'library' ? '2px solid #007bff' : 'none',
              color: activeTab === 'library' ? '#007bff' : '#666',
              cursor: 'pointer'
            }}
          >
            Workout Library
          </button>
          <button
            onClick={() => setActiveTab('create')}
            style={{
              padding: '10px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'create' ? '2px solid #007bff' : 'none',
              color: activeTab === 'create' ? '#007bff' : '#666',
              cursor: 'pointer'
            }}
          >
            Create New
          </button>
        </div>

        {/* Library Tab */}
        {activeTab === 'library' && (
          <div>
            {workouts.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
                No saved workouts yet. Create your first workout!
              </p>
            ) : (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '15px'
              }}>
                {workouts.map(workout => (
                  <div key={workout.id} style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '15px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => onSelect(workout)}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                  >
                    <h4 style={{ marginTop: 0, marginBottom: '10px' }}>{workout.name}</h4>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                      {workout.exercises?.length || 0} exercises
                    </p>
                    {workout.tags?.length > 0 && (
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        {workout.tags.map(tag => (
                          <span key={tag} style={{
                            fontSize: '12px',
                            padding: '2px 8px',
                            background: '#f0f0f0',
                            borderRadius: '12px'
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create New Tab */}
        {activeTab === 'create' && (
          <div>
            <label>
              Workout Name
              <input
                type="text"
                value={newWorkout.name}
                onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                placeholder="Enter workout name..."
              />
            </label>

            <div style={{ marginTop: '20px' }}>
              <h4>Exercises ({newWorkout.exercises.length})</h4>
              
              {newWorkout.exercises.map((exercise, index) => (
                <div key={index} style={{
                  padding: '10px',
                  background: '#f8f9fa',
                  borderRadius: '4px',
                  marginBottom: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>{exercise.title}</span>
                  <button
                    onClick={() => setNewWorkout({
                      ...newWorkout,
                      exercises: newWorkout.exercises.filter((_, i) => i !== index)
                    })}
                    className="danger small"
                  >
                    Remove
                  </button>
                </div>
              ))}

              {!showExerciseList ? (
                <button
                  onClick={() => setShowExerciseList(true)}
                  className="secondary"
                  style={{ marginTop: '10px' }}
                >
                  <Plus size={16} />
                  Add Exercise
                </button>
              ) : (
                <div style={{ marginTop: '10px' }}>
                  <input
                    type="text"
                    placeholder="Search exercises..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ marginBottom: '10px' }}
                  />
                  <div style={{ 
                    maxHeight: '200px', 
                    overflowY: 'auto',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px'
                  }}>
                    {filteredExercises.slice(0, 50).map(exercise => (
                      <div
                        key={exercise.id}
                        onClick={() => addExerciseToWorkout(exercise)}
                        style={{
                          padding: '10px',
                          borderBottom: '1px solid #f0f0f0',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8f9fa'}
                        onMouseLeave={e => e.currentTarget.style.background = 'white'}
                      >
                        <strong>{exercise.title}</strong>
                        <span style={{ marginLeft: '10px', color: '#666', fontSize: '14px' }}>
                          {exercise.bodyPart} • {exercise.equipment}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowExerciseList(false)}
                    className="secondary"
                    style={{ marginTop: '10px' }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div style={{ 
              marginTop: '30px', 
              display: 'flex', 
              justifyContent: 'flex-end' 
            }}>
              <button
                onClick={handleCreateAndAdd}
                className="primary"
                disabled={!newWorkout.name || newWorkout.exercises.length === 0}
              >
                Create and Add Workout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedSessionManager;