import { test, expect } from '@playwright/test';
import path from 'node:path';

test('capture high resolution SEO screenshots of RollOS software', async ({ page }) => {
  // Set high DPI / Retina desktop viewport
  await page.setViewportSize({ width: 1440, height: 900 });

  // 1. Dispatch Dashboard
  await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.board-panel', { timeout: 15000 });
  await page.screenshot({
    path: path.join(process.cwd(), 'public/images/screenshots/roll-off-dumpster-dispatch-board-software.png'),
    fullPage: false,
  });

  // 2. Calendar View
  await page.goto('/calendar', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.board-panel, .panel', { timeout: 15000 });
  await page.screenshot({
    path: path.join(process.cwd(), 'public/images/screenshots/roll-off-container-delivery-pickup-calendar.png'),
    fullPage: false,
  });

  // 3. Inventory / Containers
  await page.goto('/inventory', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.panel', { timeout: 15000 });
  await page.screenshot({
    path: path.join(process.cwd(), 'public/images/screenshots/dumpster-fleet-inventory-management-software.png'),
    fullPage: false,
  });

  // 4. Bookings Management
  await page.goto('/bookings', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.panel', { timeout: 15000 });
  await page.screenshot({
    path: path.join(process.cwd(), 'public/images/screenshots/dumpster-rental-online-booking-system.png'),
    fullPage: false,
  });

  // 5. Drivers Team Management View
  await page.goto('/drivers', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.panel', { timeout: 15000 });
  await page.screenshot({
    path: path.join(process.cwd(), 'public/images/screenshots/mobile-driver-sms-delivery-proof-app.png'),
    fullPage: false,
  });
});
