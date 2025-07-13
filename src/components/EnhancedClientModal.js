// src/components/EnhancedClientModal.js
import React, { useState } from 'react';
import { X, ChevronRight, ChevronDown } from 'lucide-react';

const EnhancedClientModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingClient = null,
  useEnhancedVersion = true // Toggle between old and new versions
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState(editingClient || {
    // Basic Info
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: '',
    
    // Physical Info
    height: '',
    weight: '',
    experience: 'beginner',
    
    // Goals & Notes
    goals: '',
    notes: '',
    
    // Enhanced Assessment
    assessment: {
      injuries: [],
      painPoints: [],
      medicalConditions: [],
      medications: '',
      lifestyle: {
        activityLevel: '',
        stressLevel: '',
        sleepHours: '',
        nutrition: ''
      }
    }
  });

  // Assessment options
  const injuryOptions = [
    'Shoulder', 'Back', 'Knee', 'Hip', 'Ankle', 'Wrist', 'Elbow', 'Neck', 'Other'
  ];
  
  const conditionOptions = [
    'High Blood Pressure', 'Diabetes', 'Heart Disease', 'Arthritis', 
    'Asthma', 'Previous Surgery', 'Chronic Pain', 'Other'
  ];

  const [expandedSections, setExpandedSections] = useState({
    injuries: false,
    conditions: false,
    lifestyle: false
  });

  const [customInputs, setCustomInputs] = useState({
    injury: '',
    condition: '',
    painLocation: '',
    painLevel: 5
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleInjuryToggle = (injury) => {
    const injuries = formData.assessment.injuries || [];
    const isSelected = injuries.some(i => i.type === injury);
    
    if (isSelected) {
      setFormData({
        ...formData,
        assessment: {
          ...formData.assessment,
          injuries: injuries.filter(i => i.type !== injury)
        }
      });
    } else {
      setFormData({
        ...formData,
        assessment: {
          ...formData.assessment,
          injuries: [...injuries, { 
            type: injury, 
            notes: '',
            severity: 'mild'
          }]
        }
      });
    }
  };

  const handleConditionToggle = (condition) => {
    const conditions = formData.assessment.medicalConditions || [];
    const isSelected = conditions.includes(condition);
    
    if (isSelected) {
      setFormData({
        ...formData,
        assessment: {
          ...formData.assessment,
          medicalConditions: conditions.filter(c => c !== condition)
        }
      });
    } else {
      setFormData({
        ...formData,
        assessment: {
          ...formData.assessment,
          medicalConditions: [...conditions, condition]
        }
      });
    }
  };

  const handleSubmit = () => {
    if (!formData.name) {
      alert('Please enter a name');
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  // If using old version, return the original modal
  if (!useEnhancedVersion) {
    // Return your original modal code here
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-enhanced" 
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '800px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div className="modal-header" style={{ borderBottom: '1px solid #e0e0e0' }}>
          <h2>{editingClient ? 'Edit' : 'Add New'} Client</h2>
          <button onClick={onClose} className="icon-btn">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid #e0e0e0',
          padding: '0 20px'
        }}>
          {['basic', 'physical', 'assessment', 'goals'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 20px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #007bff' : 'none',
                color: activeTab === tab ? '#007bff' : '#666',
                fontWeight: activeTab === tab ? '600' : '400',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab === 'basic' && '1. Basic Info'}
              {tab === 'physical' && '2. Physical'}
              {tab === 'assessment' && '3. Health Assessment'}
              {tab === 'goals' && '4. Goals & Notes'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ 
          flex: 1, 
          padding: '20px', 
          overflowY: 'auto'
        }}>
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="tab-content">
              <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                <div>
                  <label>Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div>
                  <label>Birth Date</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  />
                </div>
                
                <div>
                  <label>Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="">Select...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Physical Tab */}
          {activeTab === 'physical' && (
            <div className="tab-content">
              <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <div>
                  <label>Height (cm)</label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    placeholder="175"
                  />
                </div>
                
                <div>
                  <label>Weight (kg)</label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="70"
                  />
                </div>
                
                <div>
                  <label>Experience Level</label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  >
                    <option value="beginner">Beginner (0-1 years)</option>
                    <option value="intermediate">Intermediate (1-3 years)</option>
                    <option value="advanced">Advanced (3+ years)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Assessment Tab */}
          {activeTab === 'assessment' && (
            <div className="tab-content">
              {/* Injuries Section */}
              <div className="assessment-section">
                <button
                  onClick={() => toggleSection('injuries')}
                  className="section-header"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    padding: '15px',
                    background: '#f5f5f5',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginBottom: '10px'
                  }}
                >
                  {expandedSections.injuries ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  <h3 style={{ margin: '0 0 0 10px' }}>Current Injuries or Physical Limitations</h3>
                </button>
                
                {expandedSections.injuries && (
                  <div style={{ padding: '15px', background: '#fafafa', borderRadius: '4px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                      {injuryOptions.map(injury => (
                        <button
                          key={injury}
                          onClick={() => handleInjuryToggle(injury)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: '1px solid #ddd',
                            background: formData.assessment.injuries?.some(i => i.type === injury) 
                              ? '#007bff' : 'white',
                            color: formData.assessment.injuries?.some(i => i.type === injury) 
                              ? 'white' : '#333',
                            cursor: 'pointer'
                          }}
                        >
                          {injury}
                        </button>
                      ))}
                    </div>
                    
                    {formData.assessment.injuries?.map((injury, index) => (
                      <div key={index} style={{ 
                        marginBottom: '10px', 
                        padding: '10px', 
                        background: 'white',
                        borderRadius: '4px',
                        border: '1px solid #e0e0e0'
                      }}>
                        <h4>{injury.type}</h4>
                        <div style={{ marginTop: '10px' }}>
                          <label>Severity</label>
                          <select
                            value={injury.severity}
                            onChange={(e) => {
                              const updatedInjuries = [...formData.assessment.injuries];
                              updatedInjuries[index].severity = e.target.value;
                              setFormData({
                                ...formData,
                                assessment: {
                                  ...formData.assessment,
                                  injuries: updatedInjuries
                                }
                              });
                            }}
                            style={{ marginBottom: '10px' }}
                          >
                            <option value="mild">Mild</option>
                            <option value="moderate">Moderate</option>
                            <option value="severe">Severe</option>
                          </select>
                          
                          <label>Additional Notes</label>
                          <textarea
                            value={injury.notes}
                            onChange={(e) => {
                              const updatedInjuries = [...formData.assessment.injuries];
                              updatedInjuries[index].notes = e.target.value;
                              setFormData({
                                ...formData,
                                assessment: {
                                  ...formData.assessment,
                                  injuries: updatedInjuries
                                }
                              });
                            }}
                            rows={2}
                            placeholder="When did it occur? Any specific limitations?"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Medical Conditions Section */}
              <div className="assessment-section">
                <button
                  onClick={() => toggleSection('conditions')}
                  className="section-header"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    padding: '15px',
                    background: '#f5f5f5',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginBottom: '10px'
                  }}
                >
                  {expandedSections.conditions ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  <h3 style={{ margin: '0 0 0 10px' }}>Medical Conditions</h3>
                </button>
                
                {expandedSections.conditions && (
                  <div style={{ padding: '15px', background: '#fafafa', borderRadius: '4px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                      {conditionOptions.map(condition => (
                        <button
                          key={condition}
                          onClick={() => handleConditionToggle(condition)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: '1px solid #ddd',
                            background: formData.assessment.medicalConditions?.includes(condition) 
                              ? '#dc3545' : 'white',
                            color: formData.assessment.medicalConditions?.includes(condition) 
                              ? 'white' : '#333',
                            cursor: 'pointer'
                          }}
                        >
                          {condition}
                        </button>
                      ))}
                    </div>
                    
                    <div>
                      <label>Current Medications</label>
                      <textarea
                        value={formData.assessment.medications}
                        onChange={(e) => setFormData({
                          ...formData,
                          assessment: {
                            ...formData.assessment,
                            medications: e.target.value
                          }
                        })}
                        rows={2}
                        placeholder="List any medications or supplements..."
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Lifestyle Section */}
              <div className="assessment-section">
                <button
                  onClick={() => toggleSection('lifestyle')}
                  className="section-header"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    padding: '15px',
                    background: '#f5f5f5',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginBottom: '10px'
                  }}
                >
                  {expandedSections.lifestyle ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  <h3 style={{ margin: '0 0 0 10px' }}>Lifestyle Assessment</h3>
                </button>
                
                {expandedSections.lifestyle && (
                  <div style={{ padding: '15px', background: '#fafafa', borderRadius: '4px' }}>
                    <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                      <div>
                        <label>Activity Level</label>
                        <select
                          value={formData.assessment.lifestyle.activityLevel}
                          onChange={(e) => setFormData({
                            ...formData,
                            assessment: {
                              ...formData.assessment,
                              lifestyle: {
                                ...formData.assessment.lifestyle,
                                activityLevel: e.target.value
                              }
                            }
                          })}
                        >
                          <option value="">Select...</option>
                          <option value="sedentary">Sedentary</option>
                          <option value="lightly-active">Lightly Active</option>
                          <option value="moderately-active">Moderately Active</option>
                          <option value="very-active">Very Active</option>
                        </select>
                      </div>
                      
                      <div>
                        <label>Stress Level (1-10)</label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={formData.assessment.lifestyle.stressLevel || 5}
                          onChange={(e) => setFormData({
                            ...formData,
                            assessment: {
                              ...formData.assessment,
                              lifestyle: {
                                ...formData.assessment.lifestyle,
                                stressLevel: e.target.value
                              }
                            }
                          })}
                        />
                        <div style={{ textAlign: 'center' }}>
                          {formData.assessment.lifestyle.stressLevel || 5}
                        </div>
                      </div>
                      
                      <div>
                        <label>Average Sleep (hours)</label>
                        <input
                          type="number"
                          min="0"
                          max="24"
                          step="0.5"
                          value={formData.assessment.lifestyle.sleepHours}
                          onChange={(e) => setFormData({
                            ...formData,
                            assessment: {
                              ...formData.assessment,
                              lifestyle: {
                                ...formData.assessment.lifestyle,
                                sleepHours: e.target.value
                              }
                            }
                          })}
                          placeholder="7.5"
                        />
                      </div>
                      
                      <div>
                        <label>Nutrition Quality</label>
                        <select
                          value={formData.assessment.lifestyle.nutrition}
                          onChange={(e) => setFormData({
                            ...formData,
                            assessment: {
                              ...formData.assessment,
                              lifestyle: {
                                ...formData.assessment.lifestyle,
                                nutrition: e.target.value
                              }
                            }
                          })}
                        >
                          <option value="">Select...</option>
                          <option value="poor">Poor</option>
                          <option value="fair">Fair</option>
                          <option value="good">Good</option>
                          <option value="excellent">Excellent</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Goals & Notes Tab */}
          {activeTab === 'goals' && (
            <div className="tab-content">
              <div>
                <label>Fitness Goals</label>
                <textarea
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  rows={4}
                  placeholder="What are their main fitness goals? (e.g., lose weight, build muscle, improve endurance, etc.)"
                  style={{ marginBottom: '20px' }}
                />
              </div>
              
              <div>
                <label>Additional Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  placeholder="Any other important information about this client..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ 
          padding: '20px', 
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '14px', color: '#666' }}>
            {activeTab !== 'goals' && 'Fill all tabs or click Save to finish'}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onClose} className="secondary">
              Cancel
            </button>
            <button onClick={handleSubmit} className="primary">
              {editingClient ? 'Update' : 'Save'} Client
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedClientModal;