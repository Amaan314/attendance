"use client";
import { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import Header from '@/components/Header';
import { refreshQrToken } from '@/lib/api';

const AttendancePage = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const { session_id } = params;
    const initialToken = searchParams.get('initial_token');

    const [token, setToken] = useState(initialToken);
    const [presentStudents, setPresentStudents] = useState([]);

    const refreshToken = useCallback(async () => {
        const authToken = localStorage.getItem('token');
        if (authToken) {
            try {
                const data = await refreshQrToken(authToken, session_id);
                setToken(data.token);
            } catch (error) {
                console.error('Failed to refresh QR token:', error);
            }
        }
    }, [session_id]);

    useEffect(() => {
        // QR Code Refresh Logic
        const qrInterval = setInterval(() => {
            refreshToken();
        }, 15000); // Refresh QR every 15 seconds

        // WebSocket Connection Logic
        const authToken = localStorage.getItem('token');
        if (!authToken) {
            console.error("Authentication token not found");
            // Redirect or show error
            return;
        }

        const ws = new WebSocket(`ws://127.0.0.1:8000/teacher/ws/attendance/${session_id}?token=${authToken}`);

        ws.onopen = () => {
            console.log('WebSocket connection established');
        };

        ws.onmessage = (event) => {
            try {
                const student = JSON.parse(event.data);
                setPresentStudents((prevStudents) => {
                    // Avoid adding duplicates
                    if (!prevStudents.some(s => s.id === student.id)) {
                        return [...prevStudents, student];
                    }
                    return prevStudents;
                });
            } catch (error) {
                console.error("Failed to parse WebSocket message:", error);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        // Cleanup function
        return () => {
            clearInterval(qrInterval);
            ws.close();
        };
    }, [session_id, refreshToken]);


    return (
        <div>
            <Header />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Attendance Session: {session_id}</h1>
                
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left side: QR Code */}
                    <div className="md:w-1/2 flex flex-col items-center">
                        <h2 className="text-xl mb-2">Scan QR Code</h2>
                        {token ? (
                            <QRCodeSVG value={token} size={256} />
                        ) : (
                            <p>Loading QR Code...</p>
                        )}
                    </div>

                    {/* Right side: List of Present Students */}
                    <div className="md:w-1/2">
                        <h2 className="text-xl mb-2">Present Students ({presentStudents.length})</h2>
                        <ul className="list-disc pl-5 bg-gray-100 p-4 rounded-lg">
                            {presentStudents.map((student) => (
                                <li key={student.id} className="text-gray-800">{student.name} ({student.email})</li>
                            ))}
                        </ul>
                        {presentStudents.length === 0 && <p className="text-gray-500 mt-4">No students have marked their attendance yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendancePage;