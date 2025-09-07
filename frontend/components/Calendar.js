
'use client';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarComponent = ({ selectedDate, setSelectedDate }) => {
  return (
    <div className="p-4">
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        className="rounded-lg border-none shadow-lg"
      />
    </div>
  );
};

export default CalendarComponent;
