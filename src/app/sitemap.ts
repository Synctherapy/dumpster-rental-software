import type { MetadataRoute } from 'next';

const origin = (process.env.APP_URL || 'https://rolloffdumpstersoftware.com').replace(/\/$/, '');

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '',
    '/features',
    '/features/online-booking',
    '/features/dispatch-board',
    '/features/driver-routes',
    '/features/tonnage-billing',
    '/tools',
    '/tools/tonnage-calculator',
    '/tools/savings-calculator',
    '/templates',
    '/templates/dumpster-rental-contract',
    '/templates/dumpster-invoice',
    '/vs',
    '/vs/docket',
    '/vs/icans',
    '/vs/bin-boss',
    '/vs/curbwaste',
    '/vs/trash-flow',
    '/vs/dumpster-rental-systems',
    '/vs/servicecore',
    '/pricing',
    '/blog',
    '/blog/how-to-start-a-dumpster-rental-business',
    '/blog/how-to-price-dumpster-rentals',
    '/blog/roll-off-truck-vs-dump-trailer',
    '/blog/dumpster-rental-profit-margins',
    '/about',
    '/contact',
    '/privacy',
    '/terms-of-service',
  ];
  const now = new Date();
  return paths.map((path) => ({
    url: `${origin}${path}`,
    lastModified: now,
    changeFrequency: path === '' || path === '/pricing' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path === '/pricing' ? 0.8 : 0.6,
  }));
}
