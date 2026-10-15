import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: [
    '192.168.1.240',
    'localhost',
    '127.0.0.1',
    '*.loca.lt',
    '*.trycloudflare.com',
  ],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        // Protect administrative and customer pages from clickjacking
        source: '/((?!embed).*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
        ],
      },
      {
        // Allow external embedding only for the public booking widget
        source: '/embed/:path*',
        headers: [{ key: 'Content-Security-Policy', value: 'frame-ancestors *' }],
      },
      { source: '/api/:path*', headers: [{ key: 'Cache-Control', value: 'no-store' }] },
      {
        source: '/driver/:path*',
        headers: [
          { key: 'Referrer-Policy', value: 'no-referrer' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      {
        source: '/:path(dashboard|bookings|calendar|inventory|drivers|payments|settings|growth|reports|login|signup|auth|book|embed)/:rest*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/:path(dashboard|bookings|calendar|inventory|drivers|payments|settings|growth|reports|login|signup)',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/compare',
        destination: '/vs',
        permanent: true,
      },
      {
        source: '/calculator',
        destination: '/tools/savings-calculator',
        permanent: true,
      },
      {
        source: '/uses',
        destination: '/features',
        permanent: true,
      },
      {
        source: '/uses/dumpster-booking-system',
        destination: '/features/online-booking',
        permanent: true,
      },
      {
        source: '/uses/roll-off-dispatch-software',
        destination: '/features/dispatch-board',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
