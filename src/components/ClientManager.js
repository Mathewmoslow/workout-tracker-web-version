import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ClientManager = ({ clients, onAddClient, onUpdateClient, onDeleteClient }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingClient) {
      onUpdateClient({ ...editingClient, ...formData });
    } else {
      onAddClient({
        id: uuidv4(),
        ...formData,
        createdAt: new Date().toISOString()
      });
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', notes: '' });
    setEditingClient(null);
    setShowForm(false);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      notes: client.notes || ''
    });
    setShowForm(true);
  };

  const styles = {
    header: {
      marginBottom: '20px'
    },
    clientCard: {
      cursor: 'pointer',
      transition: 'transform 0.2s',
      position: 'relative'
    },
    clientInfo: {
      marginBottom: '5px'
    },
    actions: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      display: 'flex',
      gap: '10px'
    }
  };

  return (
    <div>
      <div style={styles.header} className="flex-between">
        <h2>Clients</h2>
        <button onClick={() => setShowForm(true)}>Add New Client</button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingClient ? 'Edit Client' : 'Add New Client'}</h2>
              <button className="secondary" onClick={resetForm}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
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
                Notes
                <textarea
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </label>
              <div className="flex mt-20">
                <button type="submit">
                  {editingClient ? 'Update' : 'Add'} Client
                </button>
                <button type="button" className="secondary" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-3">
        {clients.map(client => (
          <div key={client.id} className="card" style={styles.clientCard}>
            <div style={styles.actions}>
              <button onClick={() => handleEdit(client)}>Edit</button>
              <button 
                className="danger" 
                onClick={() => {
                  if (window.confirm('Delete this client?')) {
                    onDeleteClient(client.id);
                  }
                }}
              >
                Delete
              </button>
            </div>
            <h3>{client.name}</h3>
            {client.email && <p style={styles.clientInfo}>📧 {client.email}</p>}
            {client.phone && <p style={styles.clientInfo}>📱 {client.phone}</p>}
            {client.notes && <p style={styles.clientInfo}>📝 {client.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientManager;
