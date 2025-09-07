'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { getMe, scanAttendance } from '@/lib/api';
import Header from '@/components/Header';

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMe(token)
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('token');
          router.push('/login');
        });
    } else {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    let scanner;
    if (showScanner) {
      scanner = new Html5QrcodeScanner(
        'reader',
        {
          qrbox: {
            width: 250,
            height: 250,
          },
          fps: 5,
        },
        false
      );

      const onScanSuccess = (decodedText, decodedResult) => {
        setScanResult(decodedText);
        setShowScanner(false);
        handleScan(decodedText);
        scanner.clear();
      };

      const onScanFailure = (error) => {
        // console.warn(`Code scan error = ${error}`);
      };

      scanner.render(onScanSuccess, onScanFailure);
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(error => console.error("Failed to clear scanner", error));
      }
    };
  }, [showScanner]);

  const handleScan = async (qrData) => {
    const token = localStorage.getItem('token');
    try {
        // Assuming qrData is a JSON string with session_id and token
        const { session_id, token: qrToken } = JSON.parse(qrData);
        await scanAttendance(token, session_id, qrToken);
        setScanResult('Attendance marked successfully!');
        setError(null);
    } catch (error) { 
        setError(error.message || "Invalid QR Code");
        setScanResult(null);
    }
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header user={user} />
      <main className="container mx-auto p-4 md:p-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
        <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
            <button
              onClick={() => setShowScanner(!showScanner)}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 text-lg"
            >
              {showScanner ? 'Close Scanner' : 'Scan Attendance QR'}
            </button>

            {showScanner && <div id="reader" className="mt-6 w-full"></div>}
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            {scanResult && <p className="text-green-500 mt-4 text-center">{scanResult}</p>}
        </div>
      </main>
    </div>
  );
}