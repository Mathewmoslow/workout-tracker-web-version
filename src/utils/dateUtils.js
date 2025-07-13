import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';

export const formatDate = (date) => format(date, 'yyyy-MM-dd');
export const formatDateTime = (date) => format(date, 'yyyy-MM-dd HH:mm');
export const formatTime = (date) => format(date, 'HH:mm');
export const formatMonthYear = (date) => format(date, 'MMMM yyyy');

export const getMonthDays = (date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return eachDayOfInterval({ start, end });
};

export const hasSession = (date, sessions) => {
  return sessions.some(session => 
    isSameDay(parseISO(session.date), date)
  );
};

export const getDaySessions = (date, sessions) => {
  return sessions.filter(session => 
    isSameDay(parseISO(session.date), date)
  );
};
