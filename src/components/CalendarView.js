import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    return sessions.filter(s => {
      const sessionDate = new Date(s.date);
      return sessionDate.toDateString() === date.toDateString();
    });
  };

  const handleDateClick = (day) => {
    if (day) {
      setSelectedDate(day);
      if (clients.length === 0) {
        alert('Please add a client first');
        return;
      }
      
      // Simple client selector
      const clientNames = clients.map((c, i) => `${i + 1}. ${c.name}`).join('\\n');
      const selection = prompt(`Select client:\\n${clientNames}`);
      
      if (selection) {
        const clientIndex = parseInt(selection) - 1;
        if (clientIndex >= 0 && clientIndex < clients.length) {
          onStartSession(clients[clientIndex], day);
        }
      }
    }
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
                  {daySessions.map((session, i) => {
                    const client = clients.find(c => c.id === session.clientId);
                    return (
                      <div key={i} className="session-indicator">
                        {client?.name}
                      </div>
                    );
                  })}
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
