'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CalendarComponent from '@/components/Calendar';
import LectureList from '@/components/LectureList';
import { getTeacherLectures } from '@/lib/api';

export default function TeacherDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [lectures, setLectures] = useState([]);

  useEffect(() => {
    const fetchLectures = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const dateString = selectedDate.toISOString().split('T')[0];
          const lectureData = await getTeacherLectures(token, dateString);
          setLectures(lectureData);
        } catch (error) {
          console.error('Failed to fetch lectures:', error);
        }
      }
    };

    fetchLectures();
  }, [selectedDate]);

  return (
    <div>
      <Header />
      <div className="flex">
        <div className="w-1/3">
          <CalendarComponent
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>
        <div className="w-2/3">
          <LectureList lectures={lectures} />
        </div>
      </div>
    </div>
  );
}