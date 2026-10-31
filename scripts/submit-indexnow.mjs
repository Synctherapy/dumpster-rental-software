// IndexNow URL submission script
// Submits all site URLs directly to Bing and the IndexNow central hub.

const KEY = process.env.INDEXNOW_KEY || '798fbd580fd545afa4ffee7e3fd40dae';
const HOST = (process.env.APP_URL ? new URL(process.env.APP_URL).host : 'rolloffdumpstersoftware.com').replace(/^https?:\/\//, '');
const BASE_URL = `https://${HOST}`;

const PATHS = [
  '/',
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

const urlList = PATHS.map((path) => (path === '/' ? `${BASE_URL}/` : `${BASE_URL}${path}`));

const ENDPOINTS = [
  { name: 'Bing IndexNow', url: 'https://www.bing.com/IndexNow' },
  { name: 'IndexNow Central Hub', url: 'https://api.indexnow.org/IndexNow' },
];

async function submitIndexNow() {
  console.log(`Submitting ${urlList.length} URLs for host "${HOST}"...`);
  console.log(`Key file: ${BASE_URL}/${KEY}.txt\n`);

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: `${BASE_URL}/${KEY}.txt`,
    urlList,
  };

  for (const endpoint of ENDPOINTS) {
    try {
      console.log(`Sending to ${endpoint.name} (${endpoint.url})...`);
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 200) {
        console.log(`  ✅ [${endpoint.name}] HTTP 200: Successfully received and acknowledged!`);
      } else if (response.status === 202) {
        console.log(`  ✅ [${endpoint.name}] HTTP 202: Accepted (queued for processing).`);
      } else {
        const text = await response.text();
        console.error(`  ⚠️ [${endpoint.name}] HTTP ${response.status}: ${response.statusText} ${text}`);
      }
    } catch (err) {
      console.error(`  ❌ Failed to send to ${endpoint.name}:`, err.message);
    }
  }
}

submitIndexNow();
