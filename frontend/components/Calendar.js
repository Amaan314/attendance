
'use client';

import Calendar from 'react-calendar';
import '../app/calendar.css'; // Import custom calendar styles

const CalendarComponent = ({ selectedDate, setSelectedDate }) => {
  return (
    <div>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
      />
    </div>
  );
};

export default CalendarComponent;
