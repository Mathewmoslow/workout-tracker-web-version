// src/components/SessionViewEnhanced.js
import React, { useState, useEffect } from 'react';

const SessionViewEnhanced = ({ session, client, onSave, onCancel }) => {
  const [sessionData, setSessionData] = useState({
    startTime: new Date(),
    exercises: [],
    notes: '',
    overallFeedback: '',
    clientMood: '',
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

  if (!currentExercise) {
    return <div>Loading session...</div>;
  }

  return (
    <div className="session-view">
      <div className="session-header">
        <div className="session-info">
          <h2>{session.name}</h2>
          <p>{client.name} • {new Date().toLocaleDateString()}</p>
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
          <h3>{currentExercise.title}</h3>
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
                <th>Rest</th>
                <th>Effort</th>
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
                    <input
                      type="number"
                      value={set.actualRest}
                      onChange={(e) => updateActualSet(index, 'actualRest', parseInt(e.target.value) || 0)}
                      className="input-small"
                    />
                  </td>
                  <td>
                    <select
                      value={set.actualEffort}
                      onChange={(e) => updateActualSet(index, 'actualEffort', e.target.value)}
                      className="input-small"
                    >
                      <option value="Light">Light</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Hard">Hard</option>
                      <option value="Max">Max</option>
                    </select>
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

      <style jsx>{`
        .session-view {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .session-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .session-stats {
          display: flex;
          gap: 30px;
        }

        .stat {
          text-align: center;
        }

        .stat-label {
          display: block;
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }

        .stat-value {
          display: block;
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }

        .progress-bar {
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          margin-bottom: 20px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #4caf50;
          transition: width 0.3s;
        }

        .rest-timer-alert {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          text-align: center;
          z-index: 1000;
        }

        .rest-timer-display {
          font-size: 48px;
          font-weight: bold;
          color: #007bff;
          margin: 20px 0;
        }

        .exercise-container {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .exercise-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .exercise-nav button {
          background: #f0f0f0;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
        }

        .exercise-nav button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .exercise-details {
          margin-bottom: 20px;
        }

        .exercise-info {
          color: #666;
          margin-bottom: 10px;
        }

        .exercise-notes {
          background: #fffacd;
          padding: 10px;
          border-radius: 4px;
          font-size: 14px;
        }

        .sets-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }

        .sets-table th {
          background: #f8f9fa;
          padding: 10px;
          text-align: left;
          font-weight: 500;
        }

        .sets-table td {
          padding: 10px;
          border-bottom: 1px solid #e0e0e0;
        }

        .sets-table tr.completed {
          background: #e8f5e9;
        }

        .target {
          color: #666;
          font-size: 14px;
        }

        .input-small {
          width: 60px;
          padding: 4px 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .btn-check {
          width: 30px;
          height: 30px;
          border: 2px solid #ddd;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          font-size: 16px;
        }

        .btn-check.checked {
          background: #4caf50;
          color: white;
          border-color: #4caf50;
        }

        .quick-actions {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .btn-quick {
          background: #f0f0f0;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .exercise-feedback {
          margin-top: 20px;
        }

        .exercise-feedback label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
        }

        .exercise-feedback textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .session-footer {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .client-mood {
          margin-bottom: 20px;
        }

        .mood-options {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .mood-btn {
          background: #f0f0f0;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mood-btn.selected {
          background: #007bff;
          color: white;
        }

        .session-notes {
          margin-bottom: 20px;
        }

        .session-notes label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
        }

        .session-notes textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .session-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .btn-cancel {
          background: #6c757d;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn-pause {
          background: #ffc107;
          color: #333;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn-complete {
          background: #28a745;
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

export default SessionViewEnhanced;