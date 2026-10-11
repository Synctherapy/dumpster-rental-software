import type { MetadataRoute } from 'next';

const origin = 'https://rolloffdumpstersoftware.com';

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
    '/compare',
    '/vs',
    '/vs/docket',
    '/vs/dumpster-rental-systems',
    '/vs/servicecore',
    '/pricing',
    '/calculator',
    '/uses/dumpster-booking-system',
    '/uses/roll-off-dispatch-software',
    '/privacy',
    '/terms-of-service',
    '/terms',
  ];
  return paths.map((path) => ({
    url: `${origin}${path}`,
    changeFrequency: path === '' || path === '/pricing' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path === '/pricing' ? 0.8 : 0.6,
  }));
}
