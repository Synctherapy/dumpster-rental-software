import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { addDays, today } from '../../src/lib/types';
import type { Workspace } from '../../src/lib/types';
const png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aZ1kAAAAASUVORK5CYII=',
  'base64',
);
test('customer booking → dispatch → mobile delivery proof → pickup → final invoice', async ({
  page,
  request,
  browser,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/book/greenline');
  await page.getByRole('button', { name: /20 yard dumpster/ }).click();
  await expect(page.locator('.summary-total')).toContainText('$425');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByLabel('Delivery ZIP code').fill('99999');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.locator('.error-box[role=alert]')).toContainText('don’t service');
  await page.getByLabel('Delivery ZIP code').fill('78704');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByLabel('Pickup date').fill(addDays(today(), 9));
  await expect(page.locator('.summary-total')).toContainText('$445');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByLabel('Full name').fill('Avery Browser Test');
  await page.getByLabel('Phone number').fill('+15125550123');
  await page.getByLabel('Email address').fill('avery@example.com');
  await page.getByLabel('Delivery address').fill('123 Test Street, Austin, TX');
  await page.getByRole('button', { name: 'Review booking' }).click();
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Confirm demo booking' }).click();
  await expect(page.getByRole('heading', { name: 'You’re all set, Avery.' })).toBeVisible();
  let data: Workspace = await (await request.get('/api/workspace')).json();
  const job = data.jobs.find((j) => j.customer_name === 'Avery Browser Test')!;
  expect(job.deposit_cents).toBe(44500);
  expect(job.signature.name).toBe('Avery Browser Test');
  await page.goto('/dashboard');
  await page.getByLabel('Search jobs').fill('Avery Browser Test');
  await page.getByRole('button', { name: 'Open Avery Browser Test job' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('combobox', { name: 'Driver', exact: true }).selectOption('driver-1');
  const available = data.containers.find((c) => c.size_yards === 20 && c.status === 'yard')!;
  await dialog.getByRole('combobox', { name: /^Container/ }).selectOption(available.id);
  await dialog.getByRole('button', { name: 'Assign & dispatch' }).click();
  await expect(dialog.getByRole('button', { name: 'Mark delivered' })).toBeVisible();
  await dialog.getByRole('button', { name: 'Close dialog' }).click();
  const link = await (
    await request.post('/api/driver-link', { data: { driver_id: 'driver-1' } })
  ).json();
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const route = await mobile.newPage();
  await route.goto(link.url);
  const card = route
    .locator('article')
    .filter({ has: route.getByRole('heading', { name: 'Avery Browser Test' }) });
  await card
    .getByLabel('Delivery photo')
    .setInputFiles({ name: 'proof.png', mimeType: 'image/png', buffer: png });
  await card.getByRole('button', { name: 'Mark delivered' }).click();
  await expect(card.getByRole('button', { name: 'Mark picked up' })).toBeVisible();
  await card.getByRole('button', { name: 'Mark picked up' }).click();
  await expect(card).toContainText('Picked up');
  await card.getByLabel('Actual disposal weight (tons)').fill('3.2');
  await card.getByRole('button', { name: 'Save weight' }).click();
  await expect(route.getByRole('status')).toContainText('tonnage saved');
  await mobile.close();
  await page.reload();
  await page.getByLabel('Search jobs').fill('Avery Browser Test');
  await page.getByRole('button', { name: 'Open Avery Browser Test job' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Close demo invoice' }).click();
  await expect(page.getByRole('dialog').getByText('Completed', { exact: true })).toBeVisible();
  data = await (await request.get('/api/workspace')).json();
  expect(data.containers.find((c) => c.id === available.id)?.status).toBe('yard');
  const payments = data.payments.filter((p) => p.job_id === job.id);
  expect(payments.reduce((sum, p) => sum + p.amount_cents, 0)).toBe(54700);
  expect(
    payments.every((p) => p.status === 'demo' && p.stripe_payment_intent_id === null),
  ).toBeTruthy();
  const replay = await request.post(`/api/jobs/${job.id}/invoice`, { data: {} });
  expect(replay.ok()).toBeTruthy();
  expect(
    (await (await request.get('/api/workspace')).json()).payments.filter(
      (p: { job_id: string }) => p.job_id === job.id,
    ),
  ).toHaveLength(2);
  expect(errors).toEqual([]);
});
test('server rejects price tampering, duplicate bookings, overbooking, missing proof, and forged driver links', async ({
  request,
}) => {
  const input = {
    slug: 'greenline',
    size_yards: 10,
    zip: '78704',
    delivery_date: addDays(today(), 2),
    pickup_date: addDays(today(), 9),
    customer_name: 'API Test',
    customer_phone: '+15125550123',
    customer_email: 'api@example.com',
    delivery_address: '123 API Test Street',
    notes: '',
    signature_name: 'API Test',
    accepted_terms: true,
    booking_key: randomUUID(),
  };
  expect((await request.post('/api/jobs', { data: { ...input, price_cents: 1 } })).status()).toBe(
    400,
  );
  const responses = await Promise.all([
    request.post('/api/jobs', { data: input }),
    request.post('/api/jobs', { data: input }),
  ]);
  const first = await responses[0].json();
  const second = await responses[1].json();
  expect(first.job.id).toBe(second.job.id);
  const data: Workspace = await (await request.get('/api/workspace')).json();
  expect(data.jobs.filter((j) => j.booking_key === input.booking_key)).toHaveLength(1);
  const occupied = data.containers.find((c) => c.status === 'on_site')!;
  const j = data.jobs.find((j) => j.status === 'booked' && j.size_yards === occupied.size_yards)!;
  expect(
    (
      await request.patch(`/api/jobs/${j.id}`, {
        data: { status: 'dispatched', driver_id: 'driver-1', container_id: occupied.id },
      })
    ).status(),
  ).toBe(400);
  const dispatched = data.jobs.find((j) => j.status === 'dispatched')!;
  expect(
    (await request.patch(`/api/jobs/${dispatched.id}`, { data: { status: 'delivered' } })).status(),
  ).toBe(400);
  expect((await request.get('/api/driver/forged.token')).status()).toBe(400);
  const wrong = await (
    await request.post('/api/driver-link', { data: { driver_id: 'driver-3' } })
  ).json();
  expect(
    (
      await request.post(wrong.url.replace('/driver/', '/api/driver/'), {
        data: { job_id: j.id, status: 'picked_up' },
      })
    ).status(),
  ).toBe(403);
});
test('dashboard, navigation, calendar, and booking work at desktop and phone widths', async ({
  page,
}) => {
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: 'Dispatch board', exact: true })).toBeVisible();
    await expect(page.locator('.kanban')).toBeVisible();
    await page.screenshot({
      path:
        viewport.width === 1440 ? 'artifacts/dispatch-board.png' : 'artifacts/dispatch-mobile.png',
      fullPage: true,
    });
    await page.getByRole('button', { name: 'Calendar', exact: true }).click();
    await expect(page.locator('.calendar-grid')).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBeTruthy();
    if (viewport.width === 1440)
      await page.screenshot({ path: 'artifacts/dashboard.png', fullPage: true });
    else await page.screenshot({ path: 'artifacts/dashboard-mobile.png', fullPage: true });
    await page.goto('/book/greenline');
    await expect(page.getByRole('button', { name: /10 yard dumpster/ })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBeTruthy();
  }
  await page.goto('/inventory');
  await expect(page.getByRole('heading', { name: 'Containers', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Add container', exact: true }).click();
  await page.getByLabel('Container number').fill('E2E-NEW');
  await page.getByRole('dialog').getByRole('button', { name: 'Add container' }).click();
  await expect(page.getByText('E2E-NEW', { exact: true })).toBeVisible();
});

test('reminder replay logs a single SMS and email per job', async ({ request }) => {
  const first = await request.get('/api/reminders');
  expect(first.ok()).toBeTruthy();
  const before: Workspace = await (await request.get('/api/workspace')).json();
  await request.get('/api/reminders');
  const after: Workspace = await (await request.get('/api/workspace')).json();
  expect(after.notifications_log.length).toBe(before.notifications_log.length);
  expect(
    after.notifications_log.some((n) => n.template === 'delivery_reminder' && n.channel === 'sms'),
  ).toBeTruthy();
  expect(
    after.notifications_log.some(
      (n) => n.template === 'delivery_reminder' && n.channel === 'email',
    ),
  ).toBeTruthy();
});
