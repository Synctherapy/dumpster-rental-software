import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://rolloffdumpstersoftware.com'),
  title: {
    default: 'Dumpster Rental Software for Roll-Off Haulers | RollOS',
    template: '%s | RollOS',
  },
  description:
    'Dumpster rental software for roll-off haulers. Free to start, then $29 or $149 a month. Online booking, dispatch, driver links, and tonnage billing. Stripe fees are separate.',
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
