// src/components/WorkoutManagerEnhanced.js
import React, { useState } from 'react';

const WorkoutManagerEnhanced = ({ workouts, setWorkouts, sessions, setSessions, clients }) => {
  const [activeView, setActiveView] = useState('library');
  const [showWorkoutBuilder, setShowWorkoutBuilder] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Workout builder state
  const [workoutForm, setWorkoutForm] = useState({
    name: '',
    description: '',
    type: 'strength',
    exercises: []
  });

  const workoutTypes = ['strength', 'cardio', 'hiit', 'flexibility', 'circuit', 'recovery'];
  const effortLevels = ['Light', 'Moderate', 'Hard', 'Max'];

  const createWorkout = () => {
    if (!workoutForm.name || workoutForm.exercises.length === 0) {
      alert('Please add a workout name and at least one exercise');
      return;
    }

    const newWorkout = {
      id: Date.now(),
      ...workoutForm,
      createdAt: new Date().toISOString()
    };

    setWorkouts([...workouts, newWorkout]);
    resetWorkoutForm();
    setShowWorkoutBuilder(false);
  };

  const resetWorkoutForm = () => {
    setWorkoutForm({
      name: '',
      description: '',
      type: 'strength',
      exercises: []
    });
  };

  const addExerciseToWorkout = (exercise) => {
    const newExercise = {
      ...exercise,
      workoutExerciseId: Date.now(),
      sets: [{
        reps: 10,
        weight: 0,
        rest: 90,
        effort: 'Moderate'
      }]
    };

    setWorkoutForm({
      ...workoutForm,
      exercises: [...workoutForm.exercises, newExercise]
    });
  };

  const updateExerciseInWorkout = (index, field, value) => {
    const updatedExercises = [...workoutForm.exercises];
    updatedExercises[index][field] = value;
    setWorkoutForm({ ...workoutForm, exercises: updatedExercises });
  };

  const updateSet = (exerciseIndex, setIndex, field, value) => {
    const updatedExercises = [...workoutForm.exercises];
    updatedExercises[exerciseIndex].sets[setIndex][field] = value;
    setWorkoutForm({ ...workoutForm, exercises: updatedExercises });
  };

  const addSet = (exerciseIndex) => {
    const updatedExercises = [...workoutForm.exercises];
    const lastSet = updatedExercises[exerciseIndex].sets[updatedExercises[exerciseIndex].sets.length - 1];
    updatedExercises[exerciseIndex].sets.push({ ...lastSet });
    setWorkoutForm({ ...workoutForm, exercises: updatedExercises });
  };

  const removeSet = (exerciseIndex, setIndex) => {
    const updatedExercises = [...workoutForm.exercises];
    if (updatedExercises[exerciseIndex].sets.length > 1) {
      updatedExercises[exerciseIndex].sets.splice(setIndex, 1);
      setWorkoutForm({ ...workoutForm, exercises: updatedExercises });
    }
  };

  const removeExerciseFromWorkout = (index) => {
    const updatedExercises = workoutForm.exercises.filter((_, i) => i !== index);
    setWorkoutForm({ ...workoutForm, exercises: updatedExercises });
  };

  const assignWorkoutToClient = (workoutId, clientId, sessionId) => {
    if (sessionId) {
      // Add to specific session
      setSessions(sessions.map(session => {
        if (session.id === sessionId) {
          const workout = workouts.find(w => w.id === workoutId);
          return {
            ...session,
            workouts: [...(session.workouts || []), workout]
          };
        }
        return session;
      }));
    }
    
    setShowAssignModal(false);
    setSelectedWorkout(null);
  };

  // Sample exercises for demo (would come from your exercise database)
  const sampleExercises = [
    { id: 1, title: "Barbell Bench Press", bodyPart: "Chest", equipment: "Barbell" },
    { id: 2, title: "Back Squat", bodyPart: "Legs", equipment: "Barbell" },
    { id: 3, title: "Pull-ups", bodyPart: "Back", equipment: "Bodyweight" },
    { id: 4, title: "Shoulder Press", bodyPart: "Shoulders", equipment: "Dumbbell" },
    { id: 5, title: "Romanian Deadlift", bodyPart: "Legs", equipment: "Barbell" }
  ];

  return (
    <div className="workout-manager">
      <div className="manager-header">
        <h2>Workout Management</h2>
        <button 
          className="btn-primary"
          onClick={() => setShowWorkoutBuilder(true)}
        >
          + Create New Workout
        </button>
      </div>

      <div className="view-tabs">
        <button 
          className={`tab ${activeView === 'library' ? 'active' : ''}`}
          onClick={() => setActiveView('library')}
        >
          Workout Library
        </button>
        <button 
          className={`tab ${activeView === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveView('templates')}
        >
          Templates
        </button>
      </div>

      {activeView === 'library' && (
        <div className="workout-library">
          {workouts.length === 0 ? (
            <p className="empty-state">No workouts created yet. Click "Create New Workout" to get started.</p>
          ) : (
            <div className="workout-grid">
              {workouts.map(workout => (
                <div key={workout.id} className="workout-card">
                  <div className="workout-header">
                    <h3>{workout.name}</h3>
                    <span className={`workout-type ${workout.type}`}>{workout.type}</span>
                  </div>
                  
                  {workout.description && (
                    <p className="workout-description">{workout.description}</p>
                  )}

                  <div className="exercise-count">
                    {workout.exercises.length} exercises
                  </div>

                  <div className="exercise-preview">
                    {workout.exercises.slice(0, 3).map((ex, i) => (
                      <div key={i} className="preview-item">
                        • {ex.title}
                      </div>
                    ))}
                    {workout.exercises.length > 3 && (
                      <div className="preview-item more">
                        +{workout.exercises.length - 3} more
                      </div>
                    )}
                  </div>

                  <div className="workout-actions">
                    <button 
                      className="btn-action"
                      onClick={() => {
                        setSelectedWorkout(workout);
                        setShowAssignModal(true);
                      }}
                    >
                      Assign
                    </button>
                    <button 
                      className="btn-action"
                      onClick={() => {
                        setEditingWorkout(workout);
                        setWorkoutForm(workout);
                        setShowWorkoutBuilder(true);
                      }}
                    >
                      Edit
                    </button>
                    <button className="btn-action">Duplicate</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Workout Builder Modal */}
      {showWorkoutBuilder && (
        <div className="modal-overlay">
          <div className="modal large">
            <div className="modal-header">
              <h2>{editingWorkout ? 'Edit' : 'Create'} Workout</h2>
              <button onClick={() => {
                setShowWorkoutBuilder(false);
                resetWorkoutForm();
                setEditingWorkout(null);
              }}>✕</button>
            </div>

            <div className="modal-body">
              <div className="workout-basics">
                <div className="form-row">
                  <div className="form-group">
                    <label>Workout Name *</label>
                    <input
                      type="text"
                      value={workoutForm.name}
                      onChange={(e) => setWorkoutForm({ ...workoutForm, name: e.target.value })}
                      placeholder="e.g., Upper Body Strength Day"
                    />
                  </div>

                  <div className="form-group">
                    <label>Type</label>
                    <select
                      value={workoutForm.type}
                      onChange={(e) => setWorkoutForm({ ...workoutForm, type: e.target.value })}
                    >
                      {workoutTypes.map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={workoutForm.description}
                    onChange={(e) => setWorkoutForm({ ...workoutForm, description: e.target.value })}
                    placeholder="Describe the workout goals, intensity, etc..."
                    rows={2}
                  />
                </div>
              </div>

              <div className="exercises-section">
                <h3>Exercises ({workoutForm.exercises.length})</h3>
                
                {workoutForm.exercises.map((exercise, exerciseIndex) => (
                  <div key={exercise.workoutExerciseId} className="exercise-block">
                    <div className="exercise-header">
                      <h4>{exercise.title}</h4>
                      <button 
                        className="btn-remove"
                        onClick={() => removeExerciseFromWorkout(exerciseIndex)}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="sets-table">
                      <div className="sets-header">
                        <span>Set</span>
                        <span>Reps</span>
                        <span>Weight (lbs)</span>
                        <span>Rest (sec)</span>
                        <span>Effort</span>
                        <span></span>
                      </div>

                      {exercise.sets.map((set, setIndex) => (
                        <div key={setIndex} className="set-row">
                          <span>{setIndex + 1}</span>
                          <input
                            type="number"
                            value={set.reps}
                            onChange={(e) => updateSet(exerciseIndex, setIndex, 'reps', parseInt(e.target.value) || 0)}
                            min="1"
                          />
                          <input
                            type="number"
                            value={set.weight}
                            onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', parseInt(e.target.value) || 0)}
                            min="0"
                          />
                          <input
                            type="number"
                            value={set.rest}
                            onChange={(e) => updateSet(exerciseIndex, setIndex, 'rest', parseInt(e.target.value) || 0)}
                            min="0"
                          />
                          <select
                            value={set.effort}
                            onChange={(e) => updateSet(exerciseIndex, setIndex, 'effort', e.target.value)}
                          >
                            {effortLevels.map(level => (
                              <option key={level} value={level}>{level}</option>
                            ))}
                          </select>
                          <button 
                            className="btn-remove-set"
                            onClick={() => removeSet(exerciseIndex, setIndex)}
                            disabled={exercise.sets.length === 1}
                          >
                            ✕
                          </button>
                        </div>
                      ))}

                      <button 
                        className="btn-add-set"
                        onClick={() => addSet(exerciseIndex)}
                      >
                        + Add Set
                      </button>
                    </div>

                    <div className="exercise-notes">
                      <label>Notes for this exercise</label>
                      <input
                        type="text"
                        value={exercise.notes || ''}
                        onChange={(e) => updateExerciseInWorkout(exerciseIndex, 'notes', e.target.value)}
                        placeholder="Form cues, modifications, etc..."
                      />
                    </div>
                  </div>
                ))}

                <div className="add-exercise-section">
                  <h4>Add Exercise</h4>
                  <div className="exercise-quick-add">
                    {sampleExercises.map(exercise => (
                      <button
                        key={exercise.id}
                        className="exercise-option"
                        onClick={() => addExerciseToWorkout(exercise)}
                      >
                        <span className="exercise-name">{exercise.title}</span>
                        <span className="exercise-info">{exercise.bodyPart} • {exercise.equipment}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => {
                  setShowWorkoutBuilder(false);
                  resetWorkoutForm();
                  setEditingWorkout(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={createWorkout}
                disabled={!workoutForm.name || workoutForm.exercises.length === 0}
              >
                {editingWorkout ? 'Update' : 'Create'} Workout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Workout Modal */}
      {showAssignModal && selectedWorkout && (
        <AssignWorkoutModal
          workout={selectedWorkout}
          clients={clients}
          sessions={sessions}
          onAssign={assignWorkoutToClient}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedWorkout(null);
          }}
        />
      )}

      <style jsx>{`
        .workout-manager {
          background: white;
          border-radius: 8px;
          padding: 20px;
        }

        .manager-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .view-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          border-bottom: 2px solid #e0e0e0;
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
        }

        .tab.active {
          color: #007bff;
          border-bottom-color: #007bff;
        }

        .workout-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .workout-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 20px;
          transition: box-shadow 0.2s;
        }

        .workout-card:hover {
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .workout-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .workout-type {
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          font-weight: 500;
        }

        .workout-type.strength {
          background: #ffe0e0;
          color: #d32f2f;
        }

        .workout-type.cardio {
          background: #e0f2ff;
          color: #0288d1;
        }

        .workout-type.hiit {
          background: #fff3e0;
          color: #f57c00;
        }

        .workout-description {
          color: #666;
          font-size: 14px;
          margin-bottom: 15px;
        }

        .exercise-count {
          font-weight: 500;
          margin-bottom: 10px;
        }

        .exercise-preview {
          font-size: 14px;
          color: #666;
          margin-bottom: 15px;
        }

        .preview-item {
          margin-bottom: 2px;
        }

        .preview-item.more {
          color: #007bff;
        }

        .workout-actions {
          display: flex;
          gap: 10px;
        }

        .btn-action {
          flex: 1;
          padding: 8px;
          border: 1px solid #e0e0e0;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-action:hover {
          background: #f8f9fa;
          border-color: #007bff;
          color: #007bff;
        }

        /* Workout Builder Styles */
        .modal.large {
          max-width: 900px;
          width: 90%;
          max-height: 90vh;
        }

        .workout-basics {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 15px;
        }

        .exercises-section {
          margin-top: 20px;
        }

        .exercise-block {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
        }

        .exercise-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .btn-remove {
          background: #dc3545;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .sets-table {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 15px;
        }

        .sets-header {
          display: grid;
          grid-template-columns: 40px 80px 100px 80px 100px 40px;
          gap: 10px;
          font-weight: 500;
          font-size: 14px;
          margin-bottom: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e0e0e0;
        }

        .set-row {
          display: grid;
          grid-template-columns: 40px 80px 100px 80px 100px 40px;
          gap: 10px;
          align-items: center;
          margin-bottom: 8px;
        }

        .set-row input,
        .set-row select {
          padding: 6px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .btn-remove-set {
          background: #dc3545;
          color: white;
          border: none;
          width: 30px;
          height: 30px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-remove-set:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-add-set {
          background: none;
          border: 1px dashed #007bff;
          color: #007bff;
          padding: 8px;
          border-radius: 4px;
          cursor: pointer;
          width: 100%;
          margin-top: 10px;
        }

        .exercise-notes {
          margin-top: 15px;
        }

        .exercise-notes label {
          display: block;
          font-size: 14px;
          margin-bottom: 5px;
          color: #666;
        }

        .exercise-notes input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .add-exercise-section {
          background: #e3f2fd;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
        }

        .exercise-quick-add {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 10px;
          margin-top: 10px;
        }

        .exercise-option {
          background: white;
          border: 1px solid #ddd;
          padding: 12px;
          border-radius: 4px;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
        }

        .exercise-option:hover {
          border-color: #007bff;
          background: #f0f7ff;
        }

        .exercise-name {
          display: block;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .exercise-info {
          display: block;
          font-size: 12px;
          color: #666;
        }

        .empty-state {
          text-align: center;
          color: #666;
          padding: 40px;
        }

        .btn-primary {
          background: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

// Assign Workout Modal Component
const AssignWorkoutModal = ({ workout, clients, sessions, onAssign, onClose }) => {
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [assignType, setAssignType] = useState('session');

  const clientSessions = sessions.filter(s => 
    s.clientId === selectedClient && s.status === 'scheduled'
  );

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Assign Workout: {workout.name}</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Assign to:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  value="session"
                  checked={assignType === 'session'}
                  onChange={(e) => setAssignType(e.target.value)}
                />
                Specific Session
              </label>
              <label>
                <input
                  type="radio"
                  value="template"
                  checked={assignType === 'template'}
                  onChange={(e) => setAssignType(e.target.value)}
                />
                Client Template
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Select Client *</label>
            <select
              value={selectedClient}
              onChange={(e) => {
                setSelectedClient(e.target.value);
                setSelectedSession('');
              }}
            >
              <option value="">Choose a client...</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          {assignType === 'session' && selectedClient && (
            <div className="form-group">
              <label>Select Session</label>
              {clientSessions.length === 0 ? (
                <p className="no-sessions">No upcoming sessions for this client</p>
              ) : (
                <select
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(e.target.value)}
                >
                  <option value="">Choose a session...</option>
                  {clientSessions.map(session => (
                    <option key={session.id} value={session.id}>
                      {session.name} - {session.date} at {session.time}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn-primary"
            onClick={() => onAssign(workout.id, selectedClient, selectedSession)}
            disabled={!selectedClient || (assignType === 'session' && !selectedSession)}
          >
            Assign Workout
          </button>
        </div>
      </div>

      <style jsx>{`
        .radio-group {
          display: flex;
          gap: 20px;
          margin-top: 10px;
        }

        .radio-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .no-sessions {
          color: #666;
          font-style: italic;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default WorkoutManagerEnhanced;