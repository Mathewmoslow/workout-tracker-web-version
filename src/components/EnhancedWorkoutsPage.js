// src/components/EnhancedWorkoutsPage.js
import React, { useState } from 'react';
import { Plus, Edit, Copy, Trash2, Users, Calendar, MoreVertical, Search, Filter } from 'lucide-react';

const EnhancedWorkoutsPage = ({ 
  workouts = [], 
  clients = [], 
  sessions = [],
  exerciseDatabase = [],
  onSaveWorkout,
  onDeleteWorkout,
  onAssignToClient,
  onAddToSession
}) => {
  const [activeView, setActiveView] = useState('grid'); // grid, edit
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('');
  
  // Workout form state
  const [workoutForm, setWorkoutForm] = useState({
    name: '',
    description: '',
    tags: [],
    exercises: []
  });

  const workoutTags = ['Strength', 'Hypertrophy', 'Power', 'Endurance', 'Circuit', 'Superset', 'Full Body', 'Upper', 'Lower', 'Push', 'Pull'];

  // Filter workouts
  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = !searchTerm || 
      workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workout.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !filterTag || workout.tags?.includes(filterTag);
    return matchesSearch && matchesTag;
  });

  // Start editing workout
  const handleEditWorkout = (workout) => {
    setEditingWorkout(workout);
    setWorkoutForm(workout || {
      name: '',
      description: '',
      tags: [],
      exercises: []
    });
    setActiveView('edit');
  };

  // Save workout
  const handleSaveWorkout = () => {
    if (!workoutForm.name || workoutForm.exercises.length === 0) {
      alert('Please provide workout name and add at least one exercise');
      return;
    }

    const workoutToSave = {
      ...workoutForm,
      id: editingWorkout?.id || Date.now(),
      updatedAt: new Date().toISOString()
    };

    onSaveWorkout(workoutToSave);
    setActiveView('grid');
    resetForm();
  };

  const resetForm = () => {
    setWorkoutForm({
      name: '',
      description: '',
      tags: [],
      exercises: []
    });
    setEditingWorkout(null);
  };

  // Handle exercise management
  const addExercise = (exercise) => {
    const newExercise = {
      ...exercise,
      workoutExerciseId: Date.now(),
      sets: [{
        type: 'normal',
        reps: 10,
        weight: 0,
        rest: 90,
        rpe: null
      }]
    };
    
    setWorkoutForm({
      ...workoutForm,
      exercises: [...workoutForm.exercises, newExercise]
    });
  };

  const updateExercise = (workoutExerciseId, updates) => {
    setWorkoutForm({
      ...workoutForm,
      exercises: workoutForm.exercises.map(ex =>
        ex.workoutExerciseId === workoutExerciseId
          ? { ...ex, ...updates }
          : ex
      )
    });
  };

  const removeExercise = (workoutExerciseId) => {
    setWorkoutForm({
      ...workoutForm,
      exercises: workoutForm.exercises.filter(ex => ex.workoutExerciseId !== workoutExerciseId)
    });
  };

  // Set management
  const addSet = (workoutExerciseId) => {
    const exercise = workoutForm.exercises.find(ex => ex.workoutExerciseId === workoutExerciseId);
    const lastSet = exercise.sets[exercise.sets.length - 1];
    
    updateExercise(workoutExerciseId, {
      sets: [...exercise.sets, { ...lastSet }]
    });
  };

  const updateSet = (workoutExerciseId, setIndex, updates) => {
    const exercise = workoutForm.exercises.find(ex => ex.workoutExerciseId === workoutExerciseId);
    const updatedSets = [...exercise.sets];
    updatedSets[setIndex] = { ...updatedSets[setIndex], ...updates };
    
    updateExercise(workoutExerciseId, { sets: updatedSets });
  };

  const removeSet = (workoutExerciseId, setIndex) => {
    const exercise = workoutForm.exercises.find(ex => ex.workoutExerciseId === workoutExerciseId);
    if (exercise.sets.length > 1) {
      updateExercise(workoutExerciseId, {
        sets: exercise.sets.filter((_, i) => i !== setIndex)
      });
    }
  };

  // Create superset
  const createSuperset = (exerciseIds) => {
    const supersetId = Date.now();
    setWorkoutForm({
      ...workoutForm,
      exercises: workoutForm.exercises.map(ex =>
        exerciseIds.includes(ex.workoutExerciseId)
          ? { ...ex, supersetId }
          : ex
      )
    });
  };

  return (
    <div className="enhanced-workouts-page">
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2>Workout Library</h2>
        <button 
          onClick={() => handleEditWorkout(null)}
          className="primary"
        >
          <Plus size={16} />
          Create Workout
        </button>
      </div>

      {/* Grid View */}
      {activeView === 'grid' && (
        <>
          {/* Search and Filters */}
          <div style={{ 
            display: 'flex', 
            gap: '15px',
            marginBottom: '20px'
          }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={20} style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#666'
              }} />
              <input
                type="text"
                placeholder="Search workouts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
            </div>
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              style={{ width: '200px' }}
            >
              <option value="">All Tags</option>
              {workoutTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          {/* Workouts Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {filteredWorkouts.map(workout => (
              <div key={workout.id} className="workout-card" style={{
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                padding: '20px',
                position: 'relative',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'none';
              }}
              >
                {/* Action Menu Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActionMenu(showActionMenu === workout.id ? null : workout.id);
                  }}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '5px'
                  }}
                >
                  <MoreVertical size={20} />
                </button>

                {/* Action Menu Dropdown */}
                {showActionMenu === workout.id && (
                  <div style={{
                    position: 'absolute',
                    top: '40px',
                    right: '10px',
                    background: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    zIndex: 10,
                    minWidth: '150px'
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditWorkout(workout);
                        setShowActionMenu(null);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        padding: '10px 15px',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <Edit size={16} />
                      Edit Workout
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAssignToClient(workout);
                        setShowActionMenu(null);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        padding: '10px 15px',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <Users size={16} />
                      Assign to Client
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToSession(workout);
                        setShowActionMenu(null);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        padding: '10px 15px',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <Calendar size={16} />
                      Add to Session
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const duplicated = {
                          ...workout,
                          id: Date.now(),
                          name: `${workout.name} (Copy)`
                        };
                        onSaveWorkout(duplicated);
                        setShowActionMenu(null);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        padding: '10px 15px',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <Copy size={16} />
                      Duplicate
                    </button>
                    
                    <hr style={{ margin: '5px 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Delete this workout?')) {
                          onDeleteWorkout(workout.id);
                        }
                        setShowActionMenu(null);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        padding: '10px 15px',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        color: '#dc3545'
                      }}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                )}

                {/* Workout Content */}
                <div onClick={() => handleEditWorkout(workout)}>
                  <h3 style={{ margin: '0 0 10px 0' }}>{workout.name}</h3>
                  
                  {workout.description && (
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#666',
                      marginBottom: '10px'
                    }}>
                      {workout.description}
                    </p>
                  )}

                  {workout.tags?.length > 0 && (
                    <div style={{ 
                      display: 'flex', 
                      gap: '5px', 
                      flexWrap: 'wrap',
                      marginBottom: '15px'
                    }}>
                      {workout.tags.map(tag => (
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
                      {workout.exercises?.length || 0} Exercises
                    </p>
                    
                    {/* Exercise Preview */}
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      {workout.exercises?.slice(0, 3).map((ex, i) => (
                        <div key={i}>
                          • {ex.title} ({ex.sets?.length || 0} sets)
                        </div>
                      ))}
                      {workout.exercises?.length > 3 && (
                        <div>... and {workout.exercises.length - 3} more</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Edit View */}
      {activeView === 'edit' && (
        <WorkoutEditor
          workout={workoutForm}
          exerciseDatabase={exerciseDatabase}
          onUpdateWorkout={setWorkoutForm}
          onSave={handleSaveWorkout}
          onCancel={() => {
            setActiveView('grid');
            resetForm();
          }}
          onAddExercise={addExercise}
          onUpdateExercise={updateExercise}
          onRemoveExercise={removeExercise}
          onAddSet={addSet}
          onUpdateSet={updateSet}
          onRemoveSet={removeSet}
          onCreateSuperset={createSuperset}
        />
      )}
    </div>
  );
};

// Workout Editor Component
const WorkoutEditor = ({
  workout,
  exerciseDatabase,
  onUpdateWorkout,
  onSave,
  onCancel,
  onAddExercise,
  onUpdateExercise,
  onRemoveExercise,
  onAddSet,
  onUpdateSet,
  onRemoveSet,
  onCreateSuperset
}) => {
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [selectedForSuperset, setSelectedForSuperset] = useState([]);
  
  const workoutTags = ['Strength', 'Hypertrophy', 'Power', 'Endurance', 'Circuit', 'Superset', 'Full Body', 'Upper', 'Lower', 'Push', 'Pull'];
  const setTypes = ['Normal', 'Warmup', 'Drop Set', 'Rest Pause', 'Cluster'];

  const handleTagToggle = (tag) => {
    const tags = workout.tags?.includes(tag)
      ? workout.tags.filter(t => t !== tag)
      : [...(workout.tags || []), tag];
    
    onUpdateWorkout({ ...workout, tags });
  };

  const handleSupersetSelection = (exerciseId) => {
    if (selectedForSuperset.includes(exerciseId)) {
      setSelectedForSuperset(selectedForSuperset.filter(id => id !== exerciseId));
    } else {
      setSelectedForSuperset([...selectedForSuperset, exerciseId]);
    }
  };

  const handleCreateSuperset = () => {
    if (selectedForSuperset.length >= 2) {
      onCreateSuperset(selectedForSuperset);
      setSelectedForSuperset([]);
    }
  };

  // Group exercises by superset
  const groupedExercises = workout.exercises?.reduce((groups, exercise) => {
    const key = exercise.supersetId || exercise.workoutExerciseId;
    if (!groups[key]) groups[key] = [];
    groups[key].push(exercise);
    return groups;
  }, {}) || {};

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      padding: '30px',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      <h3 style={{ marginBottom: '20px' }}>
        {workout.id ? 'Edit' : 'Create'} Workout
      </h3>

      {/* Basic Info */}
      <div style={{ marginBottom: '30px' }}>
        <label>Workout Name *</label>
        <input
          type="text"
          value={workout.name}
          onChange={(e) => onUpdateWorkout({ ...workout, name: e.target.value })}
          placeholder="e.g., Upper Body Strength"
          style={{ marginBottom: '15px' }}
        />

        <label>Description</label>
        <textarea
          value={workout.description || ''}
          onChange={(e) => onUpdateWorkout({ ...workout, description: e.target.value })}
          rows={3}
          placeholder="Describe this workout..."
          style={{ marginBottom: '15px' }}
        />

        <label>Tags</label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {workoutTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: '1px solid #ddd',
                background: workout.tags?.includes(tag) ? '#007bff' : 'white',
                color: workout.tags?.includes(tag) ? 'white' : '#333',
                cursor: 'pointer'
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Exercises */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px'
        }}>
          <h4>Exercises ({workout.exercises?.length || 0})</h4>
          <div style={{ display: 'flex', gap: '10px' }}>
            {selectedForSuperset.length >= 2 && (
              <button 
                onClick={handleCreateSuperset}
                className="secondary small"
              >
                Create Superset
              </button>
            )}
            <button 
              onClick={() => setShowExerciseSelector(true)}
              className="primary small"
            >
              <Plus size={16} />
              Add Exercise
            </button>
          </div>
        </div>

        {/* Exercise List */}
        {Object.entries(groupedExercises).map(([groupId, exercises]) => (
          <div key={groupId} style={{
            marginBottom: '20px',
            padding: '15px',
            background: exercises.length > 1 ? '#f0f8ff' : '#f8f9fa',
            borderRadius: '8px',
            border: exercises.length > 1 ? '2px solid #007bff' : '1px solid #e0e0e0'
          }}>
            {exercises.length > 1 && (
              <div style={{ 
                marginBottom: '10px', 
                fontWeight: '600',
                color: '#007bff'
              }}>
                Superset
              </div>
            )}
            
            {exercises.map((exercise, index) => (
              <div key={exercise.workoutExerciseId} style={{
                marginBottom: index < exercises.length - 1 ? '15px' : 0
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {exercises.length === 1 && (
                      <input
                        type="checkbox"
                        checked={selectedForSuperset.includes(exercise.workoutExerciseId)}
                        onChange={() => handleSupersetSelection(exercise.workoutExerciseId)}
                      />
                    )}
                    <h5 style={{ margin: 0 }}>{exercise.title}</h5>
                  </div>
                  <button
                    onClick={() => onRemoveExercise(exercise.workoutExerciseId)}
                    className="danger small"
                  >
                    Remove
                  </button>
                </div>

                <p style={{ 
                  fontSize: '13px', 
                  color: '#666',
                  marginBottom: '10px'
                }}>
                  {exercise.bodyPart} • {exercise.equipment} • {exercise.type}
                </p>

                {/* Sets */}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ 
                    width: '100%', 
                    fontSize: '14px',
                    borderCollapse: 'collapse'
                  }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                        <th style={{ padding: '8px', textAlign: 'left' }}>Set</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>Type</th>
                        <th style={{ padding: '8px', textAlign: 'center' }}>Reps</th>
                        <th style={{ padding: '8px', textAlign: 'center' }}>Weight</th>
                        <th style={{ padding: '8px', textAlign: 'center' }}>Rest (s)</th>
                        <th style={{ padding: '8px', textAlign: 'center' }}>RPE</th>
                        <th style={{ padding: '8px', textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exercise.sets?.map((set, setIndex) => (
                        <tr key={setIndex}>
                          <td style={{ padding: '8px' }}>
                            {setIndex + 1}
                          </td>
                          <td style={{ padding: '8px' }}>
                            <select
                              value={set.type || 'normal'}
                              onChange={(e) => onUpdateSet(exercise.workoutExerciseId, setIndex, { type: e.target.value })}
                              style={{ padding: '4px', fontSize: '13px' }}
                            >
                              {setTypes.map(type => (
                                <option key={type} value={type.toLowerCase().replace(' ', '-')}>
                                  {type}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td style={{ padding: '8px', textAlign: 'center' }}>
                            <input
                              type="number"
                              value={set.reps}
                              onChange={(e) => onUpdateSet(exercise.workoutExerciseId, setIndex, { reps: parseInt(e.target.value) || 0 })}
                              style={{ width: '60px', textAlign: 'center' }}
                            />
                          </td>
                          <td style={{ padding: '8px', textAlign: 'center' }}>
                            <input
                              type="number"
                              value={set.weight}
                              onChange={(e) => onUpdateSet(exercise.workoutExerciseId, setIndex, { weight: parseInt(e.target.value) || 0 })}
                              style={{ width: '60px', textAlign: 'center' }}
                            />
                          </td>
                          <td style={{ padding: '8px', textAlign: 'center' }}>
                            <input
                              type="number"
                              value={set.rest}
                              onChange={(e) => onUpdateSet(exercise.workoutExerciseId, setIndex, { rest: parseInt(e.target.value) || 0 })}
                              style={{ width: '60px', textAlign: 'center' }}
                            />
                          </td>
                          <td style={{ padding: '8px', textAlign: 'center' }}>
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={set.rpe || ''}
                              onChange={(e) => onUpdateSet(exercise.workoutExerciseId, setIndex, { rpe: e.target.value ? parseInt(e.target.value) : null })}
                              style={{ width: '50px', textAlign: 'center' }}
                              placeholder="-"
                            />
                          </td>
                          <td style={{ padding: '8px', textAlign: 'center' }}>
                            {exercise.sets.length > 1 && (
                              <button
                                onClick={() => onRemoveSet(exercise.workoutExerciseId, setIndex)}
                                className="danger small"
                              >
                                ×
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={() => onAddSet(exercise.workoutExerciseId)}
                  className="text-btn"
                  style={{ marginTop: '10px' }}
                >
                  + Add Set
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        gap: '10px',
        paddingTop: '20px',
        borderTop: '1px solid #e0e0e0'
      }}>
        <button onClick={onCancel} className="secondary">
          Cancel
        </button>
        <button onClick={onSave} className="primary">
          Save Workout
        </button>
      </div>

      {/* Exercise Selector Modal */}
      {showExerciseSelector && (
        <ExerciseSelector
          exerciseDatabase={exerciseDatabase}
          onSelect={(exercise) => {
            onAddExercise(exercise);
            setShowExerciseSelector(false);
          }}
          onClose={() => setShowExerciseSelector(false)}
        />
      )}
    </div>
  );
};

// Exercise Selector Component
const ExerciseSelector = ({ exerciseDatabase, onSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBodyPart, setFilterBodyPart] = useState('');
  const [filterEquipment, setFilterEquipment] = useState('');

  const bodyParts = [...new Set(exerciseDatabase.map(e => e.bodyPart))];
  const equipment = [...new Set(exerciseDatabase.map(e => e.equipment))];

  const filteredExercises = exerciseDatabase.filter(exercise => {
    const matchesSearch = !searchTerm || 
      exercise.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBodyPart = !filterBodyPart || exercise.bodyPart === filterBodyPart;
    const matchesEquipment = !filterEquipment || exercise.equipment === filterEquipment;
    return matchesSearch && matchesBodyPart && matchesEquipment;
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Select Exercise</h3>
          <button onClick={onClose} className="icon-btn">
            ×
          </button>
        </div>

        <div style={{ padding: '20px' }}>
          {/* Filters */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '10px',
            marginBottom: '20px'
          }}>
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={filterBodyPart}
              onChange={(e) => setFilterBodyPart(e.target.value)}
            >
              <option value="">All Body Parts</option>
              {bodyParts.map(part => (
                <option key={part} value={part}>{part}</option>
              ))}
            </select>
            <select
              value={filterEquipment}
              onChange={(e) => setFilterEquipment(e.target.value)}
            >
              <option value="">All Equipment</option>
              {equipment.map(eq => (
                <option key={eq} value={eq}>{eq}</option>
              ))}
            </select>
          </div>

          {/* Exercise List */}
          <div style={{ 
            maxHeight: '400px', 
            overflowY: 'auto',
            border: '1px solid #e0e0e0',
            borderRadius: '4px'
          }}>
            {filteredExercises.map(exercise => (
              <div
                key={exercise.id}
                onClick={() => onSelect(exercise)}
                style={{
                  padding: '15px',
                  borderBottom: '1px solid #e0e0e0',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <h5 style={{ margin: '0 0 5px 0' }}>{exercise.title}</h5>
                <p style={{ 
                  margin: 0, 
                  fontSize: '13px', 
                  color: '#666' 
                }}>
                  {exercise.bodyPart} • {exercise.equipment} • {exercise.level}
                </p>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '10px',
                  marginTop: '5px'
                }}>
                  <div style={{
                    width: '60px',
                    height: '4px',
                    background: '#e0e0e0',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(exercise.rating / 10) * 100}%`,
                      height: '100%',
                      background: '#4caf50'
                    }} />
                  </div>
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    {exercise.rating}/10 - {exercise.ratingDesc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedWorkoutsPage;