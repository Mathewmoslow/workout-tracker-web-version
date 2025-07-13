// src/components/ExerciseDatabase.js
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import exerciseDatabase from '../data/exercises.json';

const ExerciseDatabase = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBodyPart, setFilterBodyPart] = useState('');
  const [filterEquipment, setFilterEquipment] = useState('');
  
  // Use the imported exercise database
  const exercises = exerciseDatabase;
  
  // Get unique values for filters
  const bodyParts = [...new Set(exercises.map(e => e.bodyPart))].filter(Boolean).sort();
  const equipment = [...new Set(exercises.map(e => e.equipment))].filter(Boolean).sort();
  
  // Filter exercises
  const filteredExercises = exercises.filter(exercise => {
    if (searchTerm && 
        !exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !exercise.desc.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterBodyPart && exercise.bodyPart !== filterBodyPart) return false;
    if (filterEquipment && exercise.equipment !== filterEquipment) return false;
    return true;
  });

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '10px' }}>
        Exercise Database
      </h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Browse all {exercises.length} exercises from your database
      </p>
      
      {/* Filters */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#666'
          }} />
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 10px 10px 40px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>
        <select
          value={filterBodyPart}
          onChange={(e) => setFilterBodyPart(e.target.value)}
          style={{
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            background: 'white'
          }}
        >
          <option value="">All Body Parts</option>
          {bodyParts.map(part => (
            <option key={part} value={part}>{part}</option>
          ))}
        </select>
        <select
          value={filterEquipment}
          onChange={(e) => setFilterEquipment(e.target.value)}
          style={{
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            background: 'white'
          }}
        >
          <option value="">All Equipment</option>
          {equipment.map(eq => (
            <option key={eq} value={eq}>{eq}</option>
          ))}
        </select>
      </div>
      
      {/* Results count */}
      <div style={{ 
        padding: '15px', 
        background: '#f0f0f0',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <p style={{ margin: 0 }}>Showing {filteredExercises.length} exercises</p>
      </div>
      
      {/* Exercise Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: '20px' 
      }}>
        {filteredExercises.map(exercise => (
          <div key={exercise.id} style={{
            background: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '20px',
            transition: 'box-shadow 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              marginBottom: '10px',
              marginTop: '0'
            }}>
              {exercise.title}
            </h3>
            
            <div style={{ 
              fontSize: '14px', 
              color: '#666', 
              marginBottom: '12px' 
            }}>
              {[
                exercise.bodyPart,
                exercise.equipment,
                exercise.type,
                exercise.level
              ].filter(Boolean).join(' • ')}
            </div>
            
            <p style={{ 
              fontSize: '14px', 
              color: '#333', 
              marginBottom: '15px',
              lineHeight: '1.5'
            }}>
              {exercise.desc}
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '14px', color: '#666' }}>Rating:</span>
              <div style={{
                flex: 1,
                height: '8px',
                background: '#e0e0e0',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(exercise.rating / 10) * 100}%`,
                  height: '100%',
                  background: '#4caf50',
                  transition: 'width 0.3s'
                }} />
              </div>
              <span style={{ 
                fontSize: '13px', 
                color: '#666',
                minWidth: '60px'
              }}>
                {exercise.rating}/10
              </span>
              {exercise.ratingDesc && (
                <span style={{ 
                  fontSize: '12px', 
                  color: '#888'
                }}>
                  {exercise.ratingDesc}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {filteredExercises.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          color: '#666'
        }}>
          <p>No exercises found matching your criteria.</p>
          <p>Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
};

export default ExerciseDatabase;