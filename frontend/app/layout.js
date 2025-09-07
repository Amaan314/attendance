
import './globals.css';

export const metadata = {
  title: 'Attendance App',
  description: 'Smart Attendance System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
