import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Play } from 'lucide-react';

const CalendarView = ({ sessions, clients, selectedDate, setSelectedDate, onStartSession }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };
  
  const days = getDaysInMonth(currentMonth);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  
  const getSessionsForDate = (date) => {
    if (!date) return [];
    
    // Format the date to match session date format (YYYY-MM-DD)
    const dateStr = date.toISOString().split('T')[0];
    
    return sessions.filter(s => {
      // Handle both ISO date strings and YYYY-MM-DD format
      if (s.date.includes('T')) {
        // ISO format
        const sessionDateStr = new Date(s.date).toISOString().split('T')[0];
        return sessionDateStr === dateStr;
      } else {
        // YYYY-MM-DD format
        return s.date === dateStr;
      }
    });
  };

  const handleDateClick = (day) => {
    if (day) {
      setSelectedDate(day);
      
      const daySessions = getSessionsForDate(day);
      
      // If there are sessions for this day, show them
      if (daySessions.length > 0) {
        // Could open a modal to show all sessions for this day
        // For now, just select the date
        return;
      }
      
      // Otherwise, trigger new session creation
      if (clients.length === 0) {
        alert('Please add a client first');
        return;
      }
      
      // Simple client selector
      const clientNames = clients.map((c, i) => `${i + 1}. ${c.name}`).join('\n');
      const selection = prompt(`Select client:\n${clientNames}`);
      
      if (selection) {
        const clientIndex = parseInt(selection) - 1;
        if (clientIndex >= 0 && clientIndex < clients.length) {
          onStartSession(clients[clientIndex], day);
        }
      }
    }
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown';
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
          <ChevronLeft size={20} />
        </button>
        <h2>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h2>
        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}
        
        {days.map((day, index) => {
          const daySessions = day ? getSessionsForDate(day) : [];
          const isSelected = day && selectedDate && day.toDateString() === selectedDate.toDateString();
          const isToday = day && day.toDateString() === new Date().toDateString();
          
          return (
            <div
              key={index}
              className={`calendar-day ${!day ? 'empty' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${daySessions.length > 0 ? 'has-session' : ''}`}
              onClick={() => handleDateClick(day)}
            >
              {day && (
                <>
                  <div className="day-number">{day.getDate()}</div>
                  {daySessions.length > 0 && (
                    <div className="session-list">
                      {daySessions.slice(0, 2).map((session, i) => (
                        <div key={i} className="session-indicator">
                          <div className="session-time">{session.time}</div>
                          <div className="session-client">{getClientName(session.clientId)}</div>
                          {session.status === 'completed' && (
                            <span className="completed-badge">✓</span>
                          )}
                        </div>
                      ))}
                      {daySessions.length > 2 && (
                        <div className="more-sessions">+{daySessions.length - 2} more</div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .calendar {
          background: white;
          border-radius: 8px;
          padding: 20px;
        }

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .calendar-header h2 {
          font-size: 20px;
          font-weight: 600;
        }

        .calendar-header button {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .calendar-header button:hover {
          background: #f0f0f0;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 5px;
        }

        .calendar-day-header {
          text-align: center;
          font-weight: 600;
          padding: 10px 0;
          font-size: 14px;
          color: #666;
        }

        .calendar-day {
          min-height: 100px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          padding: 8px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .calendar-day:hover:not(.empty) {
          background-color: #f8f9fa;
          border-color: #007bff;
        }

        .calendar-day.empty {
          cursor: default;
          background: #fafafa;
        }

        .calendar-day.selected {
          background-color: #e3f2fd;
          border-color: #007bff;
        }

        .calendar-day.today {
          background-color: #fff8dc;
        }

        .calendar-day.has-session {
          border-color: #28a745;
          border-width: 2px;
        }

        .day-number {
          font-weight: 600;
          margin-bottom: 5px;
        }

        .session-list {
          font-size: 11px;
        }

        .session-indicator {
          background: #e3f2fd;
          padding: 2px 4px;
          border-radius: 3px;
          margin-bottom: 2px;
          position: relative;
        }

        .session-time {
          font-weight: 600;
          color: #1976d2;
        }

        .session-client {
          color: #666;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .completed-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          color: #28a745;
          font-weight: bold;
        }

        .more-sessions {
          color: #666;
          font-style: italic;
          text-align: center;
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
};

export default CalendarView;