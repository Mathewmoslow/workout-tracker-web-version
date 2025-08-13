// src/components/Navigation.js
import React, { useState } from "react";
import { Calendar, Users, Dumbbell, History, Database, Cloud } from "lucide-react";
import BackupManager from "./BackupManager";

const Navigation = ({ activeView, setActiveView }) => {
  const [showBackupManager, setShowBackupManager] = useState(false);
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
          <button
            className="backup-btn"
            onClick={() => setShowBackupManager(true)}
            title="Backup & Sync"
          >
            <Cloud size={16} style={{ marginRight: "6px" }} />
            Backup
          </button>
        </div>
      </div>
      
      <BackupManager 
        isOpen={showBackupManager} 
        onClose={() => setShowBackupManager(false)} 
      />
    </nav>
  );
};

export default Navigation;
