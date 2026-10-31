// IndexNow URL submission script
// Submits all site URLs to Bing, Yandex, and other search engines using the IndexNow API.

const KEY = process.env.INDEXNOW_KEY || '798fbd580fd545afa4ffee7e3fd40dae';
const HOST = (process.env.APP_URL ? new URL(process.env.APP_URL).host : 'rolloffdumpstersoftware.com').replace(/^https?:\/\//, '');
const BASE_URL = `https://${HOST}`;

const PATHS = [
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

const urlList = PATHS.map((path) => `${BASE_URL}${path}`);

async function submitIndexNow() {
  console.log(`Submitting ${urlList.length} URLs to IndexNow for host "${HOST}"...`);
  console.log(`Key file: ${BASE_URL}/${KEY}.txt`);

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: `${BASE_URL}/${KEY}.txt`,
    urlList,
  };

  try {
    const response = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 200) {
      console.log('✅ IndexNow submission successful (HTTP 200: OK)!');
    } else if (response.status === 202) {
      console.log('✅ IndexNow submission accepted (HTTP 202: Accepted - key pending validation).');
    } else {
      const text = await response.text();
      console.error(`⚠️ IndexNow responded with HTTP ${response.status}: ${response.statusText}`);
      if (text) console.error(`Response details: ${text}`);
      if (response.status === 403) {
        console.warn('Note: 403 occurs if the key file is not yet deployed and live on your production domain.');
      }
    }
  } catch (err) {
    console.error('Failed to submit to IndexNow:', err);
  }
}

submitIndexNow();
