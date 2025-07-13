// src/components/WorkoutsView.js
import React, { useState } from 'react';

const WorkoutsView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBodyPart, setFilterBodyPart] = useState('');
  const [filterEquipment, setFilterEquipment] = useState('');
  
  // Get exercise database from window object (set in App.js)
  const exerciseDatabase = window.exerciseDatabase || [];
  
  // Get unique values for filters
  const bodyParts = [...new Set(exerciseDatabase.map(e => e.bodyPart))].sort();
  const equipment = [...new Set(exerciseDatabase.map(e => e.equipment))].sort();
  
  // Filter exercises
  const filteredExercises = exerciseDatabase.filter(exercise => {
    if (searchTerm && !exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !exercise.desc.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterBodyPart && exercise.bodyPart !== filterBodyPart) return false;
    if (filterEquipment && exercise.equipment !== filterEquipment) return false;
    return true;
  });

  return (
    <div>
      <h2>Exercise Database</h2>
      <p className="mb-20">Browse all {exerciseDatabase.length} exercises from your database</p>
      
      <div className="filters grid grid-3 mb-20">
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
      
      <div className="card mb-20" style={{ padding: '15px', background: '#f0f0f0' }}>
        <p>Showing {filteredExercises.length} exercises</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {filteredExercises.map(exercise => (
          <div key={exercise.id} className="card">
            <h3>{exercise.title}</h3>
            <div className="exercise-meta mb-10">
              {exercise.bodyPart} • {exercise.equipment} • {exercise.type} • {exercise.level}
            </div>
            <p className="exercise-desc mb-10">{exercise.desc}</p>
            <div className="rating">
              <span>Rating: </span>
              <div className="rating-bar">
                <div 
                  className="rating-fill"
                  style={{ width: `${(exercise.rating / 10) * 100}%` }}
                />
              </div>
              <span style={{ marginLeft: '8px' }}>{exercise.rating}/10 - {exercise.ratingDesc}</span>
            </div>
          </div>
        ))}
      </div>
      

    </div>
  );
};

export default WorkoutsView;