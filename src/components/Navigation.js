// src/components/Navigation.js
import React, { useState } from "react";
import { Calendar, Users, Dumbbell, History, Database, Cloud, Sun, Moon } from "lucide-react";
import BackupManager from "./BackupManager";
import { useTheme } from "../contexts/ThemeContext";

const Navigation = ({ activeView, setActiveView }) => {
  const [showBackupManager, setShowBackupManager] = useState(false);
  const { theme, toggleTheme } = useTheme();
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
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-primary)',
              marginLeft: '8px'
            }}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
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
