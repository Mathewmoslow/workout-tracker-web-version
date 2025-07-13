import React, { useState } from 'react';
import { Plus, Eye, Edit, Trash2, X } from 'lucide-react';

const ClientsView = ({ clients, setClients, showModal, setShowModal, onViewClient }) => {
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
    setEditingClient(client);
    setFormData(client);
    setShowModal(true);
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
            <h3>{client.name}</h3>
            <div className="client-info">
              {client.email && <p>📧 {client.email}</p>}
              {client.phone && <p>📱 {client.phone}</p>}
              {client.experience && <p>🏋️ {client.experience}</p>}
              {client.goals && <p className="truncate">🎯 {client.goals}</p>}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingClient ? 'Edit' : 'Add'} Client</h2>
              <button className="secondary" onClick={resetForm}>
                <X size={20} />
              </button>
            </div>

            <div className="form-grid">
              <div>
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              
              <div>
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                </select>
              </div>
              
              <div>
                <label>Experience Level</label>
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              
              <div>
                <label>Height (cm)</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                />
              </div>
              
              <div>
                <label>Weight (kg)</label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <label>Goals</label>
              <textarea
                value={formData.goals}
                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                rows={3}
                placeholder="What are their fitness goals?"
              />
            </div>
            
            <div>
              <label>Injuries/Limitations</label>
              <textarea
                value={formData.injuries}
                onChange={(e) => setFormData({ ...formData, injuries: e.target.value })}
                rows={2}
                placeholder="Any injuries or physical limitations?"
              />
            </div>
            
            <div>
              <label>Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="Additional notes..."
              />
            </div>
            
            <div className="flex mt-20">
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
