import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://rolloffdumpstersoftware.com'),
  title: {
    default: 'Roll Off Dumpster Software — $0/Mo Dispatch & Online Booking',
    template: '%s | Roll Off Dumpster Software',
  },
  description:
    'Free roll off dumpster software for haulers. Zero monthly fee, automated 24/7 online booking, visual dispatch board, and mobile driver routes.',
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
