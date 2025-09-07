"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import CalendarComponent from "@/components/Calendar";
import LectureList from "@/components/LectureList";
import { getTeacherLectures } from "@/lib/api";

export default function TeacherDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [lectures, setLectures] = useState([]);

  useEffect(() => {
    const fetchLectures = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const dateString = selectedDate.toISOString().split("T")[0];
          const lectureData = await getTeacherLectures(token, dateString);
          setLectures(lectureData);
        } catch (error) {
          console.error("Failed to fetch lectures:", error);
        }
      }
    };

    fetchLectures();
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <main className="container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">🗓️ Calendar</h2>
            <CalendarComponent
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </div>
          <div className="md:col-span-2 bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">🗓️ Today's Lectures</h2>
            <LectureList lectures={lectures} />
          </div>
        </div>
      </main>
    </div>
  );
}
