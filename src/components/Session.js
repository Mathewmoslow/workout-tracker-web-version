import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const Session = ({ session, client, workouts, onSave, onCancel }) => {
  const [sessionData, setSessionData] = useState({
    workout: null,
    actualSets: {},
    notes: ''
  });
  const [selectedWorkoutId, setSelectedWorkoutId] = useState('');

  useEffect(() => {
    if (session) {
      setSessionData(session);
      setSelectedWorkoutId(session.workoutId || '');
    }
  }, [session]);

  const handleWorkoutSelect = (workoutId) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (workout) {
      const actualSets = {};
      workout.exercises.forEach(exercise => {
        actualSets[exercise.id] = exercise.sets.map(set => ({
          ...set,
          completed: false,
          actualReps: set.reps,
          actualWeight: set.weight
        }));
      });
      setSessionData({
        ...sessionData,
        workout,
        actualSets
      });
      setSelectedWorkoutId(workoutId);
    }
  };

  const updateActualSet = (exerciseId, setIndex, field, value) => {
    setSessionData({
      ...sessionData,
      actualSets: {
        ...sessionData.actualSets,
        [exerciseId]: sessionData.actualSets[exerciseId].map((set, i) =>
          i === setIndex ? { ...set, [field]: value } : set
        )
      }
    });
  };

  const toggleSetComplete = (exerciseId, setIndex) => {
    const currentSets = sessionData.actualSets[exerciseId];
    const isCompleted = !currentSets[setIndex].completed;
    
    updateActualSet(exerciseId, setIndex, 'completed', isCompleted);
  };

  const addSet = (exerciseId) => {
    const lastSet = sessionData.actualSets[exerciseId][sessionData.actualSets[exerciseId].length - 1];
    setSessionData({
      ...sessionData,
      actualSets: {
        ...sessionData.actualSets,
        [exerciseId]: [
          ...sessionData.actualSets[exerciseId],
          {
            reps: lastSet.reps,
            weight: lastSet.weight,
            actualReps: lastSet.actualReps,
            actualWeight: lastSet.actualWeight,
            rest: lastSet.rest,
            completed: false
          }
        ]
      }
    });
  };

  const handleSave = () => {
    if (sessionData.workout) {
      const completedSession = {
        id: session?.id || uuidv4(),
        clientId: client.id,
        workoutId: selectedWorkoutId,
        date: session?.date || new Date().toISOString(),
        ...sessionData,
        completedAt: new Date().toISOString()
      };
      onSave(completedSession);
    }
  };

  const calculateProgress = () => {
    if (!sessionData.actualSets || Object.keys(sessionData.actualSets).length === 0) return 0;
    
    let totalSets = 0;
    let completedSets = 0;
    
    Object.values(sessionData.actualSets).forEach(sets => {
      totalSets += sets.length;
      completedSets += sets.filter(set => set.completed).length;
    });
    
    return totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
  };

  const styles = {
    header: {
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px'
    },
    progressBar: {
      height: '20px',
      backgroundColor: '#e9ecef',
      borderRadius: '10px',
      overflow: 'hidden',
      marginTop: '10px'
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#28a745',
      transition: 'width 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '12px'
    },
    exerciseSection: {
      marginBottom: '30px'
    },
    setRow: {
      display: 'grid',
      gridTemplateColumns: '40px 60px 100px 100px 100px 100px',
      gap: '10px',
      alignItems: 'center',
      marginBottom: '5px'
    },
    setHeader: {
      fontWeight: 'bold',
      fontSize: '14px',
      color: '#666'
    },
    completedSet: {
      backgroundColor: '#d4edda',
      padding: '5px',
      borderRadius: '4px'
    },
    notesSection: {
      marginTop: '30px',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px'
    }
  };

  const progress = calculateProgress();

  return (
    <div className="card">
      <div className="flex-between mb-20">
        <h2>Training Session - {client.name}</h2>
        <div className="flex">
          <button onClick={handleSave}>Save Session</button>
          <button className="secondary" onClick={onCancel}>Cancel</button>
        </div>
      </div>

      <div style={styles.header}>
        <label>
          Select Workout
          <select
            value={selectedWorkoutId}
            onChange={(e) => handleWorkoutSelect(e.target.value)}
          >
            <option value="">Choose a workout...</option>
            {workouts.map(workout => (
              <option key={workout.id} value={workout.id}>
                {workout.name}
              </option>
            ))}
          </select>
        </label>

        {sessionData.workout && (
          <div style={styles.progressBar}>
            <div 
              style={{ 
                ...styles.progressFill, 
                width: `${progress}%` 
              }}
            >
              {progress}%
            </div>
          </div>
        )}
      </div>

      {sessionData.workout && (
        <>
          {sessionData.workout.exercises.map(exercise => (
            <div key={exercise.id} style={styles.exerciseSection}>
              <h3>{exercise.title}</h3>
              <p style={{ color: '#666', marginBottom: '10px' }}>
                {exercise.bodyPart} • {exercise.equipment}
              </p>

              <div style={{ ...styles.setRow, ...styles.setHeader }}>
                <div>✓</div>
                <div>Set</div>
                <div>Target</div>
                <div>Actual Reps</div>
                <div>Weight (lbs)</div>
                <div>Rest (sec)</div>
              </div>

              {sessionData.actualSets[exercise.id]?.map((set, setIndex) => (
                <div 
                  key={setIndex} 
                  style={{
                    ...styles.setRow,
                    ...(set.completed ? styles.completedSet : {})
                  }}
                >
                  <input
                    type="checkbox"
                    checked={set.completed}
                    onChange={() => toggleSetComplete(exercise.id, setIndex)}
                  />
                  <div>{setIndex + 1}</div>
                  <div>{set.reps} × {set.weight}lbs</div>
                  <input
                    type="number"
                    value={set.actualReps}
                    onChange={(e) => updateActualSet(exercise.id, setIndex, 'actualReps', parseInt(e.target.value) || 0)}
                  />
                  <input
                    type="number"
                    value={set.actualWeight}
                    onChange={(e) => updateActualSet(exercise.id, setIndex, 'actualWeight', parseInt(e.target.value) || 0)}
                  />
                  <div>{set.rest}s</div>
                </div>
              ))}

              <button className="mt-10" onClick={() => addSet(exercise.id)}>
                Add Set
              </button>
            </div>
          ))}

          <div style={styles.notesSection}>
            <label>
              Session Notes
              <textarea
                rows="4"
                value={sessionData.notes}
                onChange={(e) => setSessionData({ ...sessionData, notes: e.target.value })}
                placeholder="Notes about form, adjustments for next session, etc..."
              />
            </label>
          </div>
        </>
      )}
    </div>
  );
};

export default Session;
