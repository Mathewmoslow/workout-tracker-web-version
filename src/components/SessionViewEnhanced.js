// src/components/SessionViewEnhanced.js
import React, { useState, useEffect } from 'react';
import './SessionViewEnhanced.css';
import { SessionTypes, WeightUnits } from '../types/dataTypes';

const SessionViewEnhanced = ({ session, client, onSave, onCancel }) => {
  const [sessionData, setSessionData] = useState({
    startTime: new Date(),
    exercises: [],
    notes: '',
    overallFeedback: '',
    clientMood: '',
    sessionType: session?.sessionType || SessionTypes.FULL_BODY,
    focusArea: session?.focusArea || '',
    lateMinutes: session?.lateMinutes || 0,
    completed: false
  });

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);

  // Initialize session data from planned workout
  useEffect(() => {
    if (session && session.workouts && session.workouts.length > 0) {
      const exercises = [];
      session.workouts.forEach(workout => {
        workout.exercises.forEach(exercise => {
          exercises.push({
            ...exercise,
            plannedSets: exercise.sets,
            actualSets: exercise.sets.map(set => ({
              ...set,
              actualReps: set.reps,
              actualWeight: set.weight,
              actualRest: set.rest,
              actualEffort: set.effort,
              weightUnit: set.weightUnit || WeightUnits.POUNDS,
              tempo: set.tempo || '',
              equipmentNotes: set.equipmentNotes || '',
              formNotes: set.formNotes || '',
              completed: false,
              notes: ''
            })),
            startTime: null,
            endTime: null,
            exerciseNotes: ''
          });
        });
      });
      setSessionData(prev => ({ ...prev, exercises }));
    }
  }, [session]);

  // Timer for overall session
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Rest timer
  useEffect(() => {
    let interval;
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            // Play sound or notification
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentExercise = sessionData.exercises[currentExerciseIndex];

  const updateActualSet = (setIndex, field, value) => {
    const updatedExercises = [...sessionData.exercises];
    updatedExercises[currentExerciseIndex].actualSets[setIndex][field] = value;
    setSessionData({ ...sessionData, exercises: updatedExercises });
  };

  const toggleSetComplete = (setIndex) => {
    const updatedExercises = [...sessionData.exercises];
    const set = updatedExercises[currentExerciseIndex].actualSets[setIndex];
    set.completed = !set.completed;
    
    if (set.completed && set.rest > 0) {
      setRestTimer(set.actualRest || set.rest);
      setIsResting(true);
    }
    
    setSessionData({ ...sessionData, exercises: updatedExercises });
  };

  const moveToNextExercise = () => {
    if (currentExerciseIndex < sessionData.exercises.length - 1) {
      // Mark current exercise end time
      const updatedExercises = [...sessionData.exercises];
      updatedExercises[currentExerciseIndex].endTime = new Date();
      setSessionData({ ...sessionData, exercises: updatedExercises });
      
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  const moveToPreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  const completeSession = () => {
    const completedSession = {
      ...session,
      ...sessionData,
      endTime: new Date(),
      duration: timer,
      completed: true
    };
    onSave(completedSession);
  };

  const calculateProgress = () => {
    let totalSets = 0;
    let completedSets = 0;
    
    sessionData.exercises.forEach(exercise => {
      totalSets += exercise.actualSets.length;
      completedSets += exercise.actualSets.filter(set => set.completed).length;
    });
    
    return totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
  };

  const moodOptions = ['😄 Great', '🙂 Good', '😐 Okay', '😕 Tired', '😣 Struggling'];

  if (!sessionData.exercises || sessionData.exercises.length === 0) {
    return (
      <div className="session-view">
        <div className="empty-session">
          <h2>No Exercises in Session</h2>
          <p>This session doesn't have any exercises assigned.</p>
          <p>Client: {client?.name || 'Unknown'}</p>
          <button onClick={onCancel} className="btn-cancel">
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  if (!currentExercise) {
    return <div>Loading session...</div>;
  }

  return (
    <div className="session-view">
      <div className="session-header">
        <div className="session-info">
          <h2>{sessionData.sessionType} Session</h2>
          <p>{client.name} • {new Date().toLocaleDateString()}</p>
          {sessionData.focusArea && (
            <p className="focus-area">Focus: {sessionData.focusArea}</p>
          )}
          {sessionData.lateMinutes > 0 && (
            <p className="late-notice">⏰ {sessionData.lateMinutes} min late</p>
          )}
        </div>
        
        <div className="session-stats">
          <div className="stat">
            <span className="stat-label">Duration</span>
            <span className="stat-value">{formatTime(timer)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Progress</span>
            <span className="stat-value">{calculateProgress()}%</span>
          </div>
          <div className="stat">
            <span className="stat-label">Exercise</span>
            <span className="stat-value">{currentExerciseIndex + 1}/{sessionData.exercises.length}</span>
          </div>
        </div>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${calculateProgress()}%` }}
        />
      </div>

      {/* Rest Timer Alert */}
      {isResting && (
        <div className="rest-timer-alert">
          <h3>Rest Period</h3>
          <div className="rest-timer-display">{formatTime(restTimer)}</div>
          <button onClick={() => setIsResting(false)}>Skip Rest</button>
        </div>
      )}

      <div className="exercise-container">
        <div className="exercise-nav">
          <button 
            onClick={moveToPreviousExercise}
            disabled={currentExerciseIndex === 0}
          >
            ← Previous
          </button>
          <h3>{currentExercise.name || currentExercise.title || 'Exercise'}</h3>
          <button 
            onClick={moveToNextExercise}
            disabled={currentExerciseIndex === sessionData.exercises.length - 1}
          >
            Next →
          </button>
        </div>

        <div className="exercise-details">
          <p className="exercise-info">
            {currentExercise.bodyPart} • {currentExercise.equipment}
          </p>
          {currentExercise.notes && (
            <p className="exercise-notes">Notes: {currentExercise.notes}</p>
          )}
        </div>

        <div className="sets-tracking">
          <table className="sets-table">
            <thead>
              <tr>
                <th>Set</th>
                <th>Target</th>
                <th>Actual Reps</th>
                <th>Actual Weight</th>
                <th>Unit</th>
                <th>Tempo</th>
                <th>Equipment Notes</th>
                <th>Form Notes</th>
                <th>✓</th>
              </tr>
            </thead>
            <tbody>
              {currentExercise.actualSets.map((set, index) => (
                <tr key={index} className={set.completed ? 'completed' : ''}>
                  <td>{index + 1}</td>
                  <td className="target">
                    {currentExercise.plannedSets[index].reps} × {currentExercise.plannedSets[index].weight}lbs
                  </td>
                  <td>
                    <input
                      type="number"
                      value={set.actualReps}
                      onChange={(e) => updateActualSet(index, 'actualReps', parseInt(e.target.value) || 0)}
                      className="input-small"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={set.actualWeight}
                      onChange={(e) => updateActualSet(index, 'actualWeight', parseInt(e.target.value) || 0)}
                      className="input-small"
                    />
                  </td>
                  <td>
                    <select
                      value={set.weightUnit || 'lb'}
                      onChange={(e) => updateActualSet(index, 'weightUnit', e.target.value)}
                      className="input-small"
                    >
                      <option value="lb">lb</option>
                      <option value="kg">kg</option>
                      <option value="bw">BW</option>
                      <option value="seconds">sec</option>
                      <option value="meters">m</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={set.tempo || ''}
                      onChange={(e) => updateActualSet(index, 'tempo', e.target.value)}
                      className="input-small"
                      placeholder="3-1-1"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={set.equipmentNotes || ''}
                      onChange={(e) => updateActualSet(index, 'equipmentNotes', e.target.value)}
                      className="input-small"
                      placeholder="Equipment notes"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={set.formNotes || ''}
                      onChange={(e) => updateActualSet(index, 'formNotes', e.target.value)}
                      className="input-small"
                      placeholder="Form feedback"
                    />
                  </td>
                  <td>
                    <button
                      className={`btn-check ${set.completed ? 'checked' : ''}`}
                      onClick={() => toggleSetComplete(index)}
                    >
                      {set.completed ? '✓' : '○'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="quick-actions">
            <button className="btn-quick" onClick={() => {
              // Copy last set
              const lastSet = currentExercise.actualSets[currentExercise.actualSets.length - 1];
              const updatedExercises = [...sessionData.exercises];
              updatedExercises[currentExerciseIndex].actualSets.push({
                ...lastSet,
                completed: false
              });
              setSessionData({ ...sessionData, exercises: updatedExercises });
            }}>
              + Add Set
            </button>
            
            <button className="btn-quick" onClick={() => {
              // Mark all sets complete
              const updatedExercises = [...sessionData.exercises];
              updatedExercises[currentExerciseIndex].actualSets.forEach(set => {
                set.completed = true;
              });
              setSessionData({ ...sessionData, exercises: updatedExercises });
            }}>
              Complete All
            </button>
          </div>

          <div className="exercise-feedback">
            <label>Exercise Notes:</label>
            <textarea
              value={currentExercise.exerciseNotes}
              onChange={(e) => {
                const updatedExercises = [...sessionData.exercises];
                updatedExercises[currentExerciseIndex].exerciseNotes = e.target.value;
                setSessionData({ ...sessionData, exercises: updatedExercises });
              }}
              placeholder="Form notes, adjustments, client feedback..."
              rows={2}
            />
          </div>
        </div>
      </div>

      <div className="session-footer">
        <div className="client-mood">
          <label>Client Mood:</label>
          <div className="mood-options">
            {moodOptions.map(mood => (
              <button
                key={mood}
                className={`mood-btn ${sessionData.clientMood === mood ? 'selected' : ''}`}
                onClick={() => setSessionData({ ...sessionData, clientMood: mood })}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        <div className="session-notes">
          <label>Session Notes:</label>
          <textarea
            value={sessionData.notes}
            onChange={(e) => setSessionData({ ...sessionData, notes: e.target.value })}
            placeholder="Overall session notes, observations, plan for next session..."
            rows={3}
          />
        </div>

        <div className="session-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel Session
          </button>
          <button className="btn-pause" onClick={() => setIsTimerRunning(!isTimerRunning)}>
            {isTimerRunning ? 'Pause' : 'Resume'} Timer
          </button>
          <button className="btn-complete" onClick={completeSession}>
            Complete Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionViewEnhanced;