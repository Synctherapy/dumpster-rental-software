import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  async headers() {
    return [
      { source: '/:path*', headers: [{ key: 'X-Content-Type-Options', value: 'nosniff' }] },
      { source: '/api/:path*', headers: [{ key: 'Cache-Control', value: 'no-store' }] },
      {
        source: '/driver/:path*',
        headers: [
          { key: 'Referrer-Policy', value: 'no-referrer' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
    ];
  },
};

export default nextConfig;
