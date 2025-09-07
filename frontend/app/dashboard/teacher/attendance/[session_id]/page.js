"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import Header from "@/components/Header";
import { refreshQrToken } from "@/lib/api";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

const AttendancePage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const { session_id } = params;
  const initialToken = searchParams.get("initial_token");

  const [token, setToken] = useState(initialToken);
  const [presentStudents, setPresentStudents] = useState([]);

  const refreshToken = useCallback(async () => {
    const authToken = localStorage.getItem("token");
    if (authToken) {
      try {
        const data = await refreshQrToken(authToken, session_id);
        setToken(data.token);
      } catch (error) {
        console.error("Failed to refresh QR token:", error);
      }
    }
  }, [session_id]);

  useEffect(() => {
    const qrInterval = setInterval(() => {
      refreshToken();
    }, 10000);

    const authToken = localStorage.getItem("token");
    if (!authToken) {
      console.error("Authentication token not found");
      return;
    }
    // const ws = new WebSocket(`ws://127.0.0.1:8000/teacher/ws/attendance/${session_id}?token=${authToken}`);
    const ws = new WebSocket(`${WS_URL}/${session_id}?token=${authToken}`);

    ws.onopen = () => console.log("WebSocket connection established");
    ws.onclose = () => console.log("WebSocket connection closed");
    ws.onerror = (error) => console.error("WebSocket error:", error);

    ws.onmessage = (event) => {
      try {
        const student = JSON.parse(event.data);
        setPresentStudents((prev) => [
          student,
          ...prev.filter((s) => s.id !== student.id),
        ]);
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    return () => {
      clearInterval(qrInterval);
      ws.close();
    };
  }, [session_id, refreshToken]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <main className="container mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Attendance Session
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Session ID: {session_id}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4">Scan QR Code</h2>
            <div className="bg-white p-4 rounded-lg">
              {token ? (
                <QRCodeSVG
                  value={JSON.stringify({ session_id, token })}
                  size={256}
                />
              ) : (
                <p className="text-gray-800">Loading QR Code...</p>
              )}
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">
              Present Students ({presentStudents.length})
            </h2>
            <div className="overflow-y-auto h-96 pr-2">
              <ul className="space-y-3">
                {presentStudents.map((student) => (
                  <li
                    key={student.id}
                    className="bg-gray-700 p-3 rounded-lg flex items-center"
                  >
                    <span className="text-lg text-gray-100">
                      {student.name}
                    </span>
                    <span className="text-sm text-gray-400 ml-auto">
                      {student.email}
                    </span>
                  </li>
                ))}
              </ul>
              {presentStudents.length === 0 && (
                <p className="text-gray-400 mt-4 text-center">
                  No students have marked attendance yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AttendancePage;
