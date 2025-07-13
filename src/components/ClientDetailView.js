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
