import type { MetadataRoute } from 'next';

const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true';

export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard',
        '/dashboard/',
        '/settings',
        '/settings/',
        '/payments',
        '/payments/',
        '/driver/*',
        '/agreement/*',
      ],
    },
    sitemap: 'https://rolloffdumpstersoftware.com/sitemap.xml',
  };
}
