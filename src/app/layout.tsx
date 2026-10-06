import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'RollOS — A better way to roll', template: '%s | RollOS' },
  description:
    'Booking-first dumpster rental software. Manage your fleet, dispatch drivers, and keep your business moving. Free to start, 1% per transaction.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
