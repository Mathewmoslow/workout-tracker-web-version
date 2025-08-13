import React from 'react';
import SessionViewEnhanced from './SessionViewEnhanced';

const SessionTracker = ({ session, client, onSave, onCancel }) => {
  const handleSave = (completedSession) => {
    // Ensure clientId is properly set from the client object
    const sessionWithClient = {
      ...completedSession,
      clientId: client.id || client._id,
      clientName: client.name
    };
    onSave(sessionWithClient);
  };

  return (
    <SessionViewEnhanced
      session={session}
      client={client}
      onSave={handleSave}
      onCancel={onCancel}
    />
  );
};

export default SessionTracker;