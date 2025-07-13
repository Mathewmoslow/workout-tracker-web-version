import React, { useState } from 'react';
import { formatDate } from '../utils/dateUtils';

const History = ({ history, clients, workouts }) => {
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('');

  // Get unique exercises from all workouts
  const allExercises = workouts.reduce((acc, workout) => {
    workout.exercises.forEach(exercise => {
      if (!acc.find(e => e.title === exercise.title)) {
        acc.push({ title: exercise.title, bodyPart: exercise.bodyPart });
      }
    });
    return acc;
  }, []);

  const filteredHistory = history.filter(session => {
    const matchesClient = !selectedClient || session.clientId === selectedClient;
    const matchesExercise = !selectedExercise || 
      session.workout?.exercises.some(ex => ex.title === selectedExercise);
    return matchesClient && matchesExercise;
  });

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown';
  };

  const getMaxWeight = (session, exerciseTitle) => {
    const exercise = session.workout?.exercises.find(ex => ex.title === exerciseTitle);
    if (!exercise || !session.actualSets[exercise.id]) return 0;
    
    return Math.max(...session.actualSets[exercise.id].map(set => set.actualWeight || 0));
  };

  const getTotalVolume = (session, exerciseTitle) => {
    const exercise = session.workout?.exercises.find(ex => ex.title === exerciseTitle);
    if (!exercise || !session.actualSets[exercise.id]) return 0;
    
    return session.actualSets[exercise.id].reduce((total, set) => {
      return total + (set.actualReps * set.actualWeight);
    }, 0);
  };

  const styles = {
    filters: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
      marginBottom: '20px'
    },
    sessionCard: {
      marginBottom: '20px'
    },
    exerciseDetail: {
      backgroundColor: '#f8f9fa',
      padding: '10px',
      marginTop: '10px',
      borderRadius: '4px'
    },
    setDetail: {
      display: 'flex',
      gap: '20px',
      marginBottom: '5px',
      fontSize: '14px'
    },
    stats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '10px',
      marginTop: '10px'
    },
    statCard: {
      backgroundColor: '#e3f2fd',
      padding: '10px',
      borderRadius: '4px',
      textAlign: 'center'
    }
  };

  return (
    <div>
      <h2 className="mb-20">Workout History</h2>

      <div style={styles.filters}>
        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
        >
          <option value="">All Clients</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>

        <select
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
        >
          <option value="">All Exercises</option>
          {allExercises.map(exercise => (
            <option key={exercise.title} value={exercise.title}>
              {exercise.title} ({exercise.bodyPart})
            </option>
          ))}
        </select>
      </div>

      {selectedExercise && filteredHistory.length > 0 && (
        <div style={styles.stats}>
          <div style={styles.statCard}>
            <strong>Max Weight</strong>
            <div style={{ fontSize: '24px' }}>
              {Math.max(...filteredHistory.map(s => getMaxWeight(s, selectedExercise)))} lbs
            </div>
          </div>
          <div style={styles.statCard}>
            <strong>Sessions</strong>
            <div style={{ fontSize: '24px' }}>
              {filteredHistory.filter(s => 
                s.workout?.exercises.some(ex => ex.title === selectedExercise)
              ).length}
            </div>
          </div>
        </div>
      )}

      {filteredHistory.map(session => (
        <div key={session.id} className="card" style={styles.sessionCard}>
          <div className="flex-between">
            <div>
              <h3>{getClientName(session.clientId)}</h3>
              <p>{session.workout?.name || 'Unnamed Workout'}</p>
              <p style={{ color: '#666', fontSize: '14px' }}>
                {formatDate(new Date(session.date))}
              </p>
            </div>
          </div>

          {session.workout?.exercises.map(exercise => {
            if (selectedExercise && exercise.title !== selectedExercise) return null;
            
            const sets = session.actualSets[exercise.id] || [];
            const completedSets = sets.filter(set => set.completed);
            
            return (
              <div key={exercise.id} style={styles.exerciseDetail}>
                <strong>{exercise.title}</strong>
                <div>
                  {completedSets.map((set, i) => (
                    <div key={i} style={styles.setDetail}>
                      <span>Set {i + 1}:</span>
                      <span>{set.actualReps} reps × {set.actualWeight} lbs</span>
                      <span>Volume: {set.actualReps * set.actualWeight} lbs</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                  Total Volume: {getTotalVolume(session, exercise.title)} lbs
                </div>
              </div>
            );
          })}

          {session.notes && (
            <div style={{ marginTop: '10px', fontStyle: 'italic', color: '#666' }}>
              Notes: {session.notes}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default History;
