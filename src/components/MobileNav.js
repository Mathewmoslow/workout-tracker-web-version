import React, { useState } from "react";
import { Calendar, Users, Dumbbell, History, Database, Cloud, Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const MobileNav = ({ activeView, setActiveView, onBackupClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "clients", label: "Clients", icon: Users },
    { id: "workouts", label: "Workouts", icon: Dumbbell },
    { id: "exercise-db", label: "Exercise DB", icon: Database },
    { id: "history", label: "History", icon: History },
  ];

  const handleItemClick = (viewId) => {
    setActiveView(viewId);
    setMenuOpen(false);
  };

  const handleBackupClick = () => {
    onBackupClick();
    setMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Navigation Bar */}
      <div className="mobile-nav">
        <button 
          className="hamburger-btn" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <img
          src="/logos/logo-horizontal.png"
          alt="Workout Tracker"
          className="mobile-nav-logo"
        />
        
        <button
          className="hamburger-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-menu-overlay ${menuOpen ? 'active' : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile Slide Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`mobile-menu-item ${activeView === id ? 'active' : ''}`}
            onClick={() => handleItemClick(id)}
          >
            <Icon size={20} />
            {label}
          </button>
        ))}
        
        <div style={{ borderTop: '1px solid var(--border-light)', margin: '8px 0' }} />
        
        <button
          className="mobile-menu-item"
          onClick={handleBackupClick}
        >
          <Cloud size={20} />
          Backup & Sync
        </button>
      </div>
    </>
  );
};

export default MobileNav;