import type { MetadataRoute } from 'next';

const origin = 'https://rolloffdumpstersoftware.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '',
    '/pricing',
    '/uses/dumpster-booking-system',
    '/uses/roll-off-dispatch-software',
    '/templates/dumpster-rental-contract',
    '/templates/dumpster-invoice',
    '/tools/tonnage-calculator',
    '/vs/docket',
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
