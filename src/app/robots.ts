import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard',
        '/bookings',
        '/calendar',
        '/inventory',
        '/drivers',
        '/payments',
        '/settings',
        '/growth',
        '/reports',
        '/login',
        '/signup',
        '/auth',
        '/book/',
        '/embed/',
        '/driver/',
        '/api/',
      ],
    },
    sitemap: 'https://rolloffdumpstersoftware.com/sitemap.xml',
  };
}
