import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import workoutLibrary from '../data/workouts.json';

const WorkoutBuilder = ({ workout, onSave, onCancel }) => {
  const [workoutData, setWorkoutData] = useState({
    name: '',
    exercises: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBodyPart, setFilterBodyPart] = useState('');
  const [filterEquipment, setFilterEquipment] = useState('');

  const bodyParts = [...new Set(workoutLibrary.map(w => w.bodyPart))].filter(Boolean);
  const equipment = [...new Set(workoutLibrary.map(w => w.equipment))].filter(Boolean);

  useEffect(() => {
    if (workout) {
      setWorkoutData(workout);
    }
  }, [workout]);

  const filteredExercises = workoutLibrary.filter(exercise => {
    const matchesSearch = exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBodyPart = !filterBodyPart || exercise.bodyPart === filterBodyPart;
    const matchesEquipment = !filterEquipment || exercise.equipment === filterEquipment;
    return matchesSearch && matchesBodyPart && matchesEquipment;
  });

  const addExercise = (exercise) => {
    const newExercise = {
      id: uuidv4(),
      ...exercise,
      sets: [{ reps: 10, weight: 0, rest: 60 }]
    };
    setWorkoutData({
      ...workoutData,
      exercises: [...workoutData.exercises, newExercise]
    });
  };

  const addCustomExercise = () => {
    const newExercise = {
      id: uuidv4(),
      title: 'New Exercise',
      bodyPart: '',
      equipment: 'Bodyweight',
      type: 'Strength',
      sets: [{ reps: 10, weight: 0, rest: 60 }]
    };
    setWorkoutData({
      ...workoutData,
      exercises: [...workoutData.exercises, newExercise]
    });
  };

  const updateExercise = (exerciseId, field, value) => {
    setWorkoutData({
      ...workoutData,
      exercises: workoutData.exercises.map(ex =>
        ex.id === exerciseId ? { ...ex, [field]: value } : ex
      )
    });
  };

  const removeExercise = (exerciseId) => {
    setWorkoutData({
      ...workoutData,
      exercises: workoutData.exercises.filter(ex => ex.id !== exerciseId)
    });
  };

  const addSet = (exerciseId) => {
    setWorkoutData({
      ...workoutData,
      exercises: workoutData.exercises.map(ex =>
        ex.id === exerciseId
          ? { ...ex, sets: [...ex.sets, { reps: 10, weight: 0, rest: 60 }] }
          : ex
      )
    });
  };

  const updateSet = (exerciseId, setIndex, field, value) => {
    setWorkoutData({
      ...workoutData,
      exercises: workoutData.exercises.map(ex =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((set, i) =>
                i === setIndex ? { ...set, [field]: value } : set
              )
            }
          : ex
      )
    });
  };

  const removeSet = (exerciseId, setIndex) => {
    setWorkoutData({
      ...workoutData,
      exercises: workoutData.exercises.map(ex =>
        ex.id === exerciseId
          ? { ...ex, sets: ex.sets.filter((_, i) => i !== setIndex) }
          : ex
      )
    });
  };

  const handleSave = () => {
    if (workoutData.name && workoutData.exercises.length > 0) {
      onSave({
        ...workoutData,
        id: workout?.id || uuidv4(),
        createdAt: workout?.createdAt || new Date().toISOString()
      });
    }
  };

  const styles = {
    container: {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',
      gap: '20px',
      height: 'calc(100vh - 200px)',
      overflow: 'hidden'
    },
    librarySection: {
      overflowY: 'auto',
      padding: '10px'
    },
    builderSection: {
      overflowY: 'auto',
      padding: '10px'
    },
    filters: {
      position: 'sticky',
      top: 0,
      backgroundColor: 'white',
      paddingBottom: '10px',
      borderBottom: '1px solid #ddd',
      marginBottom: '10px'
    },
    exerciseCard: {
      backgroundColor: '#f8f9fa',
      padding: '10px',
      marginBottom: '10px',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    setHeader: {
      display: 'grid',
      gridTemplateColumns: '60px 100px 100px 100px auto',
      gap: '10px',
      fontWeight: 'bold',
      marginBottom: '10px',
      fontSize: '14px'
    }
  };

  return (
    <div className="card">
      <div className="flex-between mb-20">
        <h2>{workout ? 'Edit Workout' : 'Create Workout'}</h2>
        <div className="flex">
          <button onClick={handleSave}>Save Workout</button>
          <button className="secondary" onClick={onCancel}>Cancel</button>
        </div>
      </div>

      <div className="mb-20">
        <label>
          Workout Name
          <input
            type="text"
            value={workoutData.name}
            onChange={(e) => setWorkoutData({ ...workoutData, name: e.target.value })}
            placeholder="e.g., Upper Body Strength"
          />
        </label>
      </div>

      <div style={styles.container}>
        <div style={styles.librarySection}>
          <div style={styles.filters}>
            <h3>Exercise Library</h3>
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="grid grid-2">
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
          </div>

          {filteredExercises.map(exercise => (
            <div
              key={exercise.id}
              style={styles.exerciseCard}
              onClick={() => addExercise(exercise)}
            >
              <strong>{exercise.title}</strong>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {exercise.bodyPart} • {exercise.equipment}
              </div>
            </div>
          ))}
        </div>

        <div style={styles.builderSection}>
          <div className="flex-between mb-10">
            <h3>Workout Exercises</h3>
            <button onClick={addCustomExercise}>Add Custom Exercise</button>
          </div>

          {workoutData.exercises.length === 0 ? (
            <p>Click exercises from the library or add a custom exercise to get started.</p>
          ) : (
            workoutData.exercises.map(exercise => (
              <div key={exercise.id} className="exercise-item">
                <div className="flex-between mb-10">
                  <input
                    type="text"
                    value={exercise.title}
                    onChange={(e) => updateExercise(exercise.id, 'title', e.target.value)}
                    style={{ fontWeight: 'bold', backgroundColor: 'transparent', border: 'none' }}
                  />
                  <button className="danger" onClick={() => removeExercise(exercise.id)}>
                    Remove
                  </button>
                </div>

                <div style={styles.setHeader}>
                  <div>Set</div>
                  <div>Reps</div>
                  <div>Weight (lbs)</div>
                  <div>Rest (sec)</div>
                  <div></div>
                </div>

                {exercise.sets.map((set, setIndex) => (
                  <div key={setIndex} className="set-row">
                    <div>{setIndex + 1}</div>
                    <input
                      type="number"
                      value={set.reps}
                      onChange={(e) => updateSet(exercise.id, setIndex, 'reps', parseInt(e.target.value) || 0)}
                    />
                    <input
                      type="number"
                      value={set.weight}
                      onChange={(e) => updateSet(exercise.id, setIndex, 'weight', parseInt(e.target.value) || 0)}
                    />
                    <input
                      type="number"
                      value={set.rest}
                      onChange={(e) => updateSet(exercise.id, setIndex, 'rest', parseInt(e.target.value) || 0)}
                    />
                    <button
                      className="danger"
                      onClick={() => removeSet(exercise.id, setIndex)}
                      disabled={exercise.sets.length === 1}
                    >
                      ×
                    </button>
                  </div>
                ))}

                <button className="mt-10" onClick={() => addSet(exercise.id)}>
                  Add Set
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutBuilder;
