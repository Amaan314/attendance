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
    return <p className="p-4">No lectures for the selected date.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Lectures</h2>
      <ul className="space-y-4">
        {lectures.map((lecture) => (
          <li key={lecture.id} className="p-4 bg-white rounded-lg shadow flex justify-between items-center">
            <div>
              <p className="font-bold">{lecture.subject.name}</p>
              <p className="text-gray-600">{lecture.subject.code}</p>
              <p className="text-gray-600">
                {lecture.start_time} - {lecture.end_time}
              </p>
            </div>
            <button
              onClick={() => handleStartAttendance(lecture.id)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Start Attendance
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LectureList;