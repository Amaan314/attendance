
'use client';

import { useSearchParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import Header from '@/components/Header';
import { useState, useEffect, useCallback } from 'react';
import { refreshQrToken } from '@/lib/api';

export default function AttendancePage({ params }) {
  const searchParams = useSearchParams();
  const initialToken = searchParams.get('initial_token');
  const { session_id } = params;
  const [token, setToken] = useState(initialToken);

  const refreshToken = useCallback(async () => {
    const authToken = localStorage.getItem('token');
    if (authToken) {
      try {
        const data = await refreshQrToken(authToken, session_id);
        setToken(data.token);
      } catch (error) {
        console.error('Failed to refresh QR token:', error);
        // Optionally, handle the error in the UI, e.g., show a message
      }
    }
  }, [session_id]);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshToken();
    }, 5000);

    return () => clearInterval(interval);
  }, [refreshToken]);


  return (
    <div>
      <Header />
      <div className="flex p-4">
        <div className="w-1/2 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">Scan QR Code for Attendance</h2>
          {token ? (
            <QRCodeSVG value={token} size={256} />
          ) : (
            <p>Loading QR Code...</p>
          )}
          <p className="mt-4">Session ID: {session_id}</p>
        </div>
        <div className="w-1/2 p-4">
          {/* Right section to be implemented later */}
          <h2 className="text-2xl font-bold mb-4">Students Present</h2>
        </div>
      </div>
    </div>
  );
}
