// src/components/Navigation.js
import React from "react";
import { Calendar, Users, Dumbbell, History, Database } from "lucide-react";

const Navigation = ({ activeView, setActiveView, onLoadTrainerData }) => {
  const navItems = [
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "clients", label: "Clients", icon: Users },
    { id: "workouts", label: "Workouts", icon: Dumbbell },
    { id: "exercise-db", label: "Exercise DB", icon: Database },
    { id: "history", label: "History", icon: History },
  ];

  return (
    <nav className="nav">
      <div className="nav-content">
        <img
          src="/logos/logo-horizontal.png"
          alt="Workout Tracker Pro"
          className="nav-logo"
        />
        <div className="nav-links">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={activeView === id ? "active" : ""}
              onClick={() => setActiveView(id)}
            >
              <Icon size={16} style={{ marginRight: "6px" }} />
              {label}
            </button>
          ))}
          
          {onLoadTrainerData && (
            <button
              className="trainer-data-btn"
              onClick={onLoadTrainerData}
              style={{ 
                marginLeft: 'auto', 
                backgroundColor: '#007bff', 
                color: 'white',
                padding: '8px 12px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              📋 Load Trainer Data
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
