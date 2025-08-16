// src/components/ClientsView.js - Fixed version
import React, { useState } from 'react';
import { Plus, Eye, Edit, Trash2, X } from 'lucide-react';

const ClientsView = ({ 
  clients, 
  setClients, 
  showModal, 
  setShowModal, 
  onViewClient, 
  onEditClient, 
  useEnhancedModal 
}) => {
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: '',
    height: '',
    weight: '',
    goals: '',
    injuries: '',
    experience: 'beginner',
    notes: ''
  });

  const handleSubmit = () => {
    if (!formData.name) {
      alert('Please enter a name');
      return;
    }
    
    if (editingClient) {
      setClients(clients.map(c => c.id === editingClient.id ? { ...formData, id: editingClient.id } : c));
    } else {
      setClients([...clients, { ...formData, id: Date.now() }]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '', email: '', phone: '', birthDate: '', gender: '', 
      height: '', weight: '', goals: '', injuries: '', experience: 'beginner', notes: ''
    });
    setEditingClient(null);
    setShowModal(false);
  };

  const handleEdit = (client) => {
    if (useEnhancedModal && onEditClient) {
      // Use enhanced modal through parent
      onEditClient(client);
    } else {
      // Use built-in modal
      setEditingClient(client);
      setFormData(client);
      setShowModal(true);
    }
  };

  return (
    <div>
      <div className="flex-between mb-20">
        <h2>Clients</h2>
        <button onClick={() => setShowModal(true)}>
          <Plus size={16} />
          Add Client
        </button>
      </div>

      <div className="grid grid-3">
        {clients.map(client => (
          <div key={client.id} className="card">
            <div className="card-actions">
              <button onClick={() => onViewClient(client)} className="icon-btn">
                <Eye size={16} />
              </button>
              <button onClick={() => handleEdit(client)} className="icon-btn">
                <Edit size={16} />
              </button>
              <button 
                onClick={() => {
                  if (window.confirm('Delete this client?')) {
                    setClients(clients.filter(c => c.id !== client.id));
                  }
                }}
                className="icon-btn danger"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <h3 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: '600' }}>{client.name}</h3>
            <div className="client-info" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {client.email && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>📧</span>
                  <span style={{ wordBreak: 'break-word', fontSize: '14px', color: 'var(--text-secondary)' }}>{client.email}</span>
                </div>
              )}
              {client.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>📱</span>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{client.phone}</span>
                </div>
              )}
              {client.experience && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>🏋️</span>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{client.experience}</span>
                </div>
              )}
              {client.goals && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>🎯</span>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {Array.isArray(client.goals) ? client.goals.map(g => g.target || g.type).join(', ') : client.goals}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Only show built-in modal if not using enhanced version */}
      {showModal && !useEnhancedModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingClient ? 'Edit' : 'Add'} Client</h2>
              <button className="secondary" onClick={resetForm}>
                <X size={20} />
              </button>
            </div>

            <div className="form-grid">
              <label>
                Name *
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </label>
              
              <label>
                Email
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </label>
              
              <label>
                Phone
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </label>
              
              <label>
                Birth Date
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                />
              </label>
              
              <label>
                Experience Level
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </label>
              
              <label>
                Height (cm)
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                />
              </label>
              
              <label>
                Weight (kg)
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                />
              </label>
              
              <label className="full-width">
                Goals
                <textarea
                  rows="3"
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  placeholder="What are the client's fitness goals?"
                />
              </label>
              
              <label className="full-width">
                Injuries/Limitations
                <textarea
                  rows="3"
                  value={formData.injuries}
                  onChange={(e) => setFormData({ ...formData, injuries: e.target.value })}
                  placeholder="Any injuries or physical limitations?"
                />
              </label>
              
              <label className="full-width">
                Notes
                <textarea
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes..."
                />
              </label>
            </div>
            
            <div className="modal-footer">
              <button onClick={handleSubmit}>
                {editingClient ? 'Update' : 'Add'} Client
              </button>
              <button className="secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsView;