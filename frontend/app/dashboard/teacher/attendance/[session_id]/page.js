
'use client';

import { useSearchParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import Header from '@/components/Header';

export default function AttendancePage({ params }) {
  const searchParams = useSearchParams();
  const initialToken = searchParams.get('initial_token');
  const { session_id } = params;

  return (
    <div>
      <Header />
      <div className="flex p-4">
        <div className="w-1/2 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">Scan QR Code for Attendance</h2>
          {initialToken ? (
            <QRCodeSVG value={initialToken} size={256} />
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
