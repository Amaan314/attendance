'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { getMe, scanAttendance } from '../../../lib/api';
import Header from '../../../components/Header';

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const scannerRef = useRef(null);

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
    if (showScanner) {
      const scanner = new Html5QrcodeScanner(
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

      scannerRef.current = scanner;

      const onScanSuccess = (decodedText, decodedResult) => {
        setScanResult(decodedText);
        setShowScanner(false);
        scanner.clear();
        handleScan(decodedText);
      };

      const onScanFailure = (error) => {
        // console.warn(`Code scan error = ${error}`);
      };

      scanner.render(onScanSuccess, onScanFailure);

      return () => {
        if (scannerRef.current) {
          scannerRef.current.clear();
        }
      };
    }
  }, [showScanner]);

  const handleScan = async (sessionId) => {
    const token = localStorage.getItem('token');
    try {
      await scanAttendance(token, sessionId);
      router.push('/dashboard/student');
    } catch (error) { 
      setError(error.message);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header user={user} />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
        <button
          onClick={() => setShowScanner(!showScanner)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {showScanner ? 'Close Scanner' : 'Scan Attendance'}
        </button>

        {showScanner && <div id="reader" className="mt-4"></div>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {scanResult && <p className="text-green-500 mt-4">Scan successful!</p>}
      </div>
    </div>
  );
}