'use client';

import { useRouter } from 'next/navigation';
import { startAttendanceSession } from '@/lib/api';

const LectureList = ({ lectures }) => {
  const router = useRouter();

  const handleStartAttendance = async (slotId) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { session_id, initial_token } = await startAttendanceSession(token, slotId);
        router.push(`/dashboard/teacher/attendance/${session_id}?initial_token=${initial_token}`);
      } catch (error) {
        console.error('Failed to start attendance session:', error);
        alert('Failed to start attendance session.');
      }
    }
  };

  if (!lectures || lectures.length === 0) {
    return <p className="text-gray-400">No lectures for the selected date.</p>;
  }

  return (
    <div className="space-y-4">
      {lectures.map((lecture) => (
        <div key={lecture.id} className="bg-gray-700 p-4 rounded-lg shadow-md flex justify-between items-center">
          <div>
            <p className="font-bold text-lg text-gray-100">{lecture.subject.name}</p>
            <p className="text-gray-300">{lecture.subject.code}</p>
            <p className="text-gray-400">
              {lecture.start_time} - {lecture.end_time}
            </p>
          </div>
          <button
            onClick={() => handleStartAttendance(lecture.id)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Start Attendance
          </button>
        </div>
      ))}
    </div>
  );
};

export default LectureList;