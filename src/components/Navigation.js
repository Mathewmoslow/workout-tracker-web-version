// src/components/Navigation.js
import React from "react";
import { Calendar, Users, Dumbbell, History, Database } from "lucide-react";

const Navigation = ({ activeView, setActiveView }) => {
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
          src="logos/logo-horizontal.png"
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
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
