import React from 'react';
import * as Icons from 'lucide-react';

const Navigation = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'calendar', label: 'Calendar', icon: Icons.Calendar },
    { id: 'clients', label: 'Clients', icon: Icons.Users },
    { id: 'workouts', label: 'Workouts', icon: Icons.Dumbbell },
    { id: 'history', label: 'History', icon: Icons.History },
  ];

  return (
    <nav className="nav">
      <div className="nav-content">
        <h1>💪 Workout Tracker Pro</h1>
        <div className="nav-links">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id || 
              (activeView === 'client-detail' && item.id === 'clients') || 
              (activeView === 'session' && item.id === 'calendar');
              
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={isActive ? 'active' : ''}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
