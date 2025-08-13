import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Play } from 'lucide-react';
import './CalendarView.css';

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
      
      // If there are sessions for this day, just select the date
      // The parent component can handle showing session details
      if (daySessions.length > 0) {
        return;
      }
      
      // For empty days, the parent can show a new session form
      // No prompts needed - just update the selected date
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

    </div>
  );
};

export default CalendarView;