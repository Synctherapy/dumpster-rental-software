import type { Metadata } from 'next';
import './globals.css';
import { StickyConversionBar } from '@/components/mobile-sticky-cta';

const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING !== 'false';

export const metadata: Metadata = {
  metadataBase: new URL('https://rolloffdumpstersoftware.com'),
  title: {
    default: 'Dumpster Rental Software for Roll-Off Haulers | RollOS',
    template: '%s | RollOS',
  },
  description:
    'Dumpster rental software for roll-off haulers. Free to start, then $29 or $149 a month. Online booking, dispatch, driver links, and tonnage billing. Stripe fees are separate.',
  openGraph: {
    title: 'Dumpster Rental Software for Roll-Off Haulers | RollOS',
    description:
      'Dumpster rental software for roll-off haulers. Free to start, then $29 or $149 a month. Online booking, dispatch, driver links, and tonnage billing.',
    url: 'https://rolloffdumpstersoftware.com',
    siteName: 'RollOS',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/screenshots/roll-off-dumpster-dispatch-board-software.png',
        width: 1440,
        height: 900,
        alt: 'RollOS - Dumpster Rental Software Dispatch Board',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dumpster Rental Software for Roll-Off Haulers | RollOS',
    description:
      'Dumpster rental software for roll-off haulers. Free to start, then $29 or $149 a month. Online booking, dispatch, driver links, and tonnage billing.',
    images: ['/images/screenshots/roll-off-dumpster-dispatch-board-software.png'],
  },
  robots: allowIndexing
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      }
    : {
        index: false,
        follow: false,
      },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <StickyConversionBar />
      </body>
    </html>
  );
}
