import React, { useState } from 'react';
import { formatDate, getMonthDays, formatMonthYear, hasSession, getDaySessions } from '../utils/dateUtils';

const Calendar = ({ sessions, clients, onDateSelect, onSessionClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const monthDays = getMonthDays(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDayClick = (day) => {
    setSelectedDate(day);
    onDateSelect(day);
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown';
  };

  const styles = {
    weekDay: {
      textAlign: 'center',
      fontWeight: 'bold',
      padding: '10px',
      backgroundColor: '#f8f9fa'
    },
    dayContent: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    dayNumber: {
      fontWeight: 'bold',
      marginBottom: '5px'
    },
    sessionIndicator: {
      fontSize: '10px',
      color: '#2196f3',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={() => navigateMonth(-1)}>←</button>
        <h2>{formatMonthYear(currentDate)}</h2>
        <button onClick={() => navigateMonth(1)}>→</button>
      </div>

      <div className="calendar-grid">
        {weekDays.map(day => (
          <div key={day} style={styles.weekDay}>{day}</div>
        ))}
        
        {Array(monthDays[0].getDay()).fill(null).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        
        {monthDays.map(day => {
          const daySessions = getDaySessions(day, sessions);
          const isSelected = selectedDate && formatDate(day) === formatDate(selectedDate);
          const hasSessions = daySessions.length > 0;
          
          return (
            <div
              key={day.getTime()}
              className={`calendar-day ${hasSessions ? 'has-session' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => handleDayClick(day)}
            >
              <div style={styles.dayContent}>
                <div style={styles.dayNumber}>{day.getDate()}</div>
                {daySessions.slice(0, 2).map((session, i) => (
                  <div 
                    key={i} 
                    style={styles.sessionIndicator}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSessionClick(session);
                    }}
                  >
                    {getClientName(session.clientId)}
                  </div>
                ))}
                {daySessions.length > 2 && (
                  <div style={styles.sessionIndicator}>+{daySessions.length - 2} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
