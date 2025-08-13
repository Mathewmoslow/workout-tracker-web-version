// src/components/EnhancedWorkoutsPage.js
import React, { useState } from 'react';
import { Plus, Edit, Copy, Trash2, Users, Calendar, MoreVertical, Search, Filter, Link2 } from 'lucide-react';

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
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [selectedForSuperset, setSelectedForSuperset] = useState([]);
  
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

  // Start editing workout - go straight to modal
  const handleEditWorkout = (workout) => {
    setEditingWorkout(workout);
    setWorkoutForm(workout || {
      name: '',
      description: '',
      tags: [],
      exercises: []
    });
    setShowExerciseSelector(true);
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
    setShowExerciseSelector(false);
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

  // Break superset
  const breakSuperset = (supersetId) => {
    setWorkoutForm({
      ...workoutForm,
      exercises: workoutForm.exercises.map(ex =>
        ex.supersetId === supersetId
          ? { ...ex, supersetId: null }
          : ex
      )
    });
  };

  // Handle superset selection
  const handleSupersetSelection = (exerciseId) => {
    if (selectedForSuperset.includes(exerciseId)) {
      setSelectedForSuperset(selectedForSuperset.filter(id => id !== exerciseId));
    } else {
      setSelectedForSuperset([...selectedForSuperset, exerciseId]);
    }
  };

  // Handle create superset from modal
  const handleCreateSuperset = () => {
    if (selectedForSuperset.length >= 2) {
      createSuperset(selectedForSuperset);
      setSelectedForSuperset([]);
    }
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

      {/* Exercise Selector Modal */}
      {showExerciseSelector && (
        <EnhancedExerciseSelector
          exerciseDatabase={exerciseDatabase}
          workout={workoutForm}
          onUpdateWorkout={setWorkoutForm}
          workoutExercises={workoutForm.exercises || []}
          onAddExercise={addExercise}
          onRemoveExercise={removeExercise}
          onUpdateExercise={updateExercise}
          onAddSet={addSet}
          onUpdateSet={updateSet}
          onRemoveSet={removeSet}
          onCreateSuperset={createSuperset}
          onBreakSuperset={breakSuperset}
          selectedForSuperset={selectedForSuperset}
          onSupersetSelection={handleSupersetSelection}
          onSaveAndClose={handleSaveWorkout}
          onClose={() => {
            setShowExerciseSelector(false);
            resetForm();
            setEditingWorkout(null);
            setSelectedForSuperset([]);
          }}
        />
      )}
    </div>
  );
};

// Enhanced Exercise Selector Component with split view
const EnhancedExerciseSelector = ({
  exerciseDatabase,
  workout,
  onUpdateWorkout,
  workoutExercises,
  onAddExercise,
  onRemoveExercise,
  onUpdateExercise,
  onAddSet,
  onUpdateSet,
  onRemoveSet,
  onCreateSuperset,
  onBreakSuperset,
  selectedForSuperset,
  onSupersetSelection,
  onSaveAndClose,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBodyPart, setFilterBodyPart] = useState('All Body Parts');
  const [filterEquipment, setFilterEquipment] = useState('All Equipment');
  const [filterLevel, setFilterLevel] = useState('All Levels');

  const bodyParts = ['All Body Parts', ...new Set(exerciseDatabase.map(e => e.bodyPart).filter(Boolean))];
  const equipment = ['All Equipment', ...new Set(exerciseDatabase.map(e => e.equipment).filter(Boolean))];
  const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredExercises = exerciseDatabase.filter(exercise => {
    const matchesSearch = !searchTerm || 
      exercise.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBodyPart = filterBodyPart === 'All Body Parts' || exercise.bodyPart === filterBodyPart;
    const matchesEquipment = filterEquipment === 'All Equipment' || exercise.equipment === filterEquipment;
    const matchesLevel = filterLevel === 'All Levels' || exercise.level === filterLevel;
    return matchesSearch && matchesBodyPart && matchesEquipment && matchesLevel;
  }).slice(0, 200); // Limit to 200 most popular

  // Group exercises by superset
  const groupedExercises = workoutExercises.reduce((groups, exercise) => {
    const key = exercise.supersetId || exercise.workoutExerciseId;
    if (!groups[key]) groups[key] = [];
    groups[key].push(exercise);
    return groups;
  }, {});

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }} onClick={onClose}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '1200px',
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          padding: '20px 30px',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '24px' }}>
            {workout?.id ? 'Edit Workout' : 'Create New Workout'}
          </h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '30px',
              cursor: 'pointer',
              color: '#999',
              padding: '0',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>

        {/* Workout Name Input */}
        <div style={{ padding: '20px 30px 10px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#333'
          }}>
            Workout Name
          </label>
          <input
            type="text"
            value={workout?.name || ''}
            onChange={(e) => onUpdateWorkout({ ...workout, name: e.target.value })}
            placeholder="e.g., Upper Body Strength"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '15px'
            }}
          />
        </div>

        {/* Main Content - Split View */}
        <div style={{
          flex: 1,
          display: 'flex',
          gap: '20px',
          padding: '20px 30px',
          overflow: 'hidden'
        }}>
          
          {/* Left Side - Exercise Library */}
          <div style={{
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid #e0e0e0',
            paddingRight: '20px'
          }}>
            <h3 style={{ 
              margin: '0 0 15px 0',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Exercise Library ({filteredExercises.length})
            </h3>
            
            {/* Search and Filters */}
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  marginBottom: '10px',
                  fontSize: '14px'
                }}
              />
              
              <select
                value={filterBodyPart}
                onChange={(e) => setFilterBodyPart(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  marginBottom: '10px',
                  fontSize: '14px',
                  background: 'white'
                }}
              >
                {bodyParts.map(part => (
                  <option key={part} value={part}>{part}</option>
                ))}
              </select>
              
              <select
                value={filterEquipment}
                onChange={(e) => setFilterEquipment(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  marginBottom: '10px',
                  fontSize: '14px',
                  background: 'white'
                }}
              >
                {equipment.map(eq => (
                  <option key={eq} value={eq}>{eq}</option>
                ))}
              </select>
              
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  background: 'white'
                }}
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Exercise List */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              background: '#fafafa'
            }}>
              {filteredExercises.map(exercise => (
                <div
                  key={exercise.id}
                  onClick={() => onAddExercise(exercise)}
                  style={{
                    padding: '12px 15px',
                    borderBottom: '1px solid #e0e0e0',
                    cursor: 'pointer',
                    background: 'white',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f8ff';
                    e.currentTarget.style.transform = 'translateX(5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{ 
                    fontWeight: '600',
                    fontSize: '15px',
                    marginBottom: '4px',
                    color: '#333'
                  }}>
                    {exercise.title}
                  </div>
                  <div style={{ 
                    fontSize: '13px', 
                    color: '#666',
                    marginBottom: '4px'
                  }}>
                    {exercise.bodyPart} • {exercise.level || 'Intermediate'}
                  </div>
                  <div style={{ 
                    fontSize: '13px',
                    color: '#007bff'
                  }}>
                    Rating: {exercise.rating}/10
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Workout Exercises */}
          <div style={{
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            paddingLeft: '20px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <h3 style={{ 
                margin: 0,
                fontSize: '18px',
                fontWeight: '600'
              }}>
                Workout Exercises ({workoutExercises.length})
              </h3>
              {selectedForSuperset.length >= 2 && (
                <button
                  onClick={() => {
                    onCreateSuperset(selectedForSuperset);
                    onSupersetSelection([]);
                  }}
                  style={{
                    padding: '6px 12px',
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Link2 size={14} />
                  Create Superset
                </button>
              )}
            </div>

            {/* Workout Exercise List */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              background: '#fafafa',
              padding: workoutExercises.length === 0 ? '40px' : '10px'
            }}>
              {workoutExercises.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  color: '#999',
                  fontSize: '15px'
                }}>
                  Click exercises from the library to add them to your workout
                </div>
              ) : (
                Object.entries(groupedExercises).map(([groupId, exercises]) => {
                  const isSuperset = exercises.length > 1;
                  const isSelected = exercises.some(ex => selectedForSuperset.includes(ex.workoutExerciseId));
                  
                  return (
                    <div key={`group-${groupId}`} style={{
                      marginBottom: '10px',
                      padding: '12px',
                      background: isSuperset ? '#e3f2fd' : isSelected ? '#fff3cd' : 'white',
                      borderRadius: '6px',
                      border: isSuperset ? '2px solid #2196f3' : isSelected ? '2px solid #ffc107' : '1px solid #e0e0e0'
                    }}>
                      {isSuperset && (
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '10px',
                          paddingBottom: '10px',
                          borderBottom: '1px solid #90caf9'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#1976d2',
                            fontWeight: '600',
                            fontSize: '14px'
                          }}>
                            <Link2 size={16} />
                            Superset
                          </div>
                          <button
                            onClick={() => onBreakSuperset(exercises[0].supersetId)}
                            style={{
                              padding: '4px 8px',
                              background: 'white',
                              color: '#1976d2',
                              border: '1px solid #1976d2',
                              borderRadius: '4px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            Break Apart
                          </button>
                        </div>
                      )}
                      
                      {exercises.map((exercise, idx) => (
                        <div key={exercise.workoutExerciseId || `exercise-${idx}-${exercise.id}`} style={{
                          marginBottom: idx < exercises.length - 1 ? '10px' : 0,
                          paddingBottom: idx < exercises.length - 1 ? '10px' : 0,
                          borderBottom: idx < exercises.length - 1 && isSuperset ? '1px solid #e0e0e0' : 'none'
                        }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {!isSuperset && (
                                <input
                                  type="checkbox"
                                  checked={selectedForSuperset.includes(exercise.workoutExerciseId)}
                                  onChange={() => onSupersetSelection(exercise.workoutExerciseId)}
                                  style={{
                                    width: '18px',
                                    height: '18px',
                                    cursor: 'pointer'
                                  }}
                                />
                              )}
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '8px' }}>
                                  {exercise.title}
                                </div>
                                
                                {/* Inline Set Editing */}
                                <div style={{ 
                                  display: 'flex', 
                                  gap: '8px', 
                                  alignItems: 'center',
                                  fontSize: '12px'
                                }}>
                                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    Sets:
                                    <input
                                      type="number"
                                      min="1"
                                      value={exercise.sets?.length || 1}
                                      onChange={(e) => {
                                        const newSetCount = parseInt(e.target.value) || 1;
                                        const currentSets = exercise.sets || [{ reps: 10, weight: 0, rest: 90, rpe: null }];
                                        let newSets;
                                        
                                        if (newSetCount > currentSets.length) {
                                          // Add sets
                                          const lastSet = currentSets[currentSets.length - 1];
                                          newSets = [...currentSets];
                                          for (let i = currentSets.length; i < newSetCount; i++) {
                                            newSets.push({ ...lastSet });
                                          }
                                        } else {
                                          // Remove sets
                                          newSets = currentSets.slice(0, newSetCount);
                                        }
                                        
                                        onUpdateExercise(exercise.workoutExerciseId, { sets: newSets });
                                      }}
                                      style={{
                                        width: '40px',
                                        padding: '2px 4px',
                                        border: '1px solid #ddd',
                                        borderRadius: '3px'
                                      }}
                                    />
                                  </label>
                                  
                                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    Reps:
                                    <input
                                      type="number"
                                      min="1"
                                      value={exercise.sets?.[0]?.reps || 10}
                                      onChange={(e) => {
                                        const reps = parseInt(e.target.value) || 10;
                                        const newSets = (exercise.sets || [{ reps: 10, weight: 0, rest: 90, rpe: null }])
                                          .map(set => ({ ...set, reps }));
                                        onUpdateExercise(exercise.workoutExerciseId, { sets: newSets });
                                      }}
                                      style={{
                                        width: '40px',
                                        padding: '2px 4px',
                                        border: '1px solid #ddd',
                                        borderRadius: '3px'
                                      }}
                                    />
                                  </label>
                                  
                                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    Weight:
                                    <input
                                      type="text"
                                      value={exercise.sets?.[0]?.weight === 'BW' ? 'BW' : (exercise.sets?.[0]?.weight || 0)}
                                      onChange={(e) => {
                                        const weight = e.target.value === 'BW' || e.target.value.toLowerCase() === 'bw' 
                                          ? 'BW' 
                                          : (parseInt(e.target.value) || 0);
                                        const newSets = (exercise.sets || [{ reps: 10, weight: 0, rest: 90, rpe: null }])
                                          .map(set => ({ ...set, weight }));
                                        onUpdateExercise(exercise.workoutExerciseId, { sets: newSets });
                                      }}
                                      placeholder="lbs or BW"
                                      style={{
                                        width: '50px',
                                        padding: '2px 4px',
                                        border: '1px solid #ddd',
                                        borderRadius: '3px'
                                      }}
                                    />
                                  </label>
                                </div>
                                
                                <div style={{ 
                                  display: 'flex', 
                                  gap: '8px', 
                                  alignItems: 'center',
                                  fontSize: '12px',
                                  marginTop: '6px'
                                }}>
                                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    Rest:
                                    <input
                                      type="number"
                                      min="0"
                                      value={exercise.sets?.[0]?.rest || 90}
                                      onChange={(e) => {
                                        const rest = parseInt(e.target.value) || 90;
                                        const newSets = (exercise.sets || [{ reps: 10, weight: 0, rest: 90, rpe: null }])
                                          .map(set => ({ ...set, rest }));
                                        onUpdateExercise(exercise.workoutExerciseId, { sets: newSets });
                                      }}
                                      style={{
                                        width: '45px',
                                        padding: '2px 4px',
                                        border: '1px solid #ddd',
                                        borderRadius: '3px'
                                      }}
                                    />
                                    <span>sec</span>
                                  </label>
                                  
                                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    RPE:
                                    <input
                                      type="number"
                                      min="1"
                                      max="10"
                                      value={exercise.sets?.[0]?.rpe || ''}
                                      onChange={(e) => {
                                        const rpe = e.target.value ? parseInt(e.target.value) : null;
                                        const newSets = (exercise.sets || [{ reps: 10, weight: 0, rest: 90, rpe: null }])
                                          .map(set => ({ ...set, rpe }));
                                        onUpdateExercise(exercise.workoutExerciseId, { sets: newSets });
                                      }}
                                      placeholder="-"
                                      style={{
                                        width: '35px',
                                        padding: '2px 4px',
                                        border: '1px solid #ddd',
                                        borderRadius: '3px'
                                      }}
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => onRemoveExercise(exercise.workoutExerciseId)}
                              style={{
                                padding: '4px 8px',
                                background: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                alignSelf: 'flex-start'
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '20px 30px',
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '10px'
        }}>
          <button
            onClick={onSaveAndClose}
            style={{
              flex: 1,
              padding: '12px',
              background: '#f8f9fa',
              color: '#333',
              border: '1px solid #dee2e6',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Save Workout
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedWorkoutsPage;