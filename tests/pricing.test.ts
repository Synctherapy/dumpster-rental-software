import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quote, invoice, platformFee } from '../src/lib/pricing';
import { seed } from '../src/lib/seed';
test('10 and 20 yard prices include seven days and use integer cents', () => {
  const data = seed();
  for (const [size, total] of [
    [10, 32500],
    [20, 42500],
  ]) {
    const rule = data.pricing_rules.find((r) => r.size_yards === size)!;
    const q = quote(rule, '2026-10-07', '2026-10-14', 25);
    assert.equal(q.total, total);
    assert.equal(q.extraDays, 0);
    assert.equal(q.deposit, total / 4);
  }
});
test('extra days and fractional tons are charged from the retained pricing rule', () => {
  const job = seed().jobs.find((j) => j.size_yards === 20)!;
  const result = invoice({
    ...job,
    delivery_date: '2026-10-07',
    pickup_date: '2026-10-15',
    tons_actual: 3.2,
  });
  assert.equal(result.extra, 2000);
  assert.equal(result.overage, 10200);
  assert.equal(result.total, 54700);
  assert.equal(platformFee(43575), 0);
  assert.equal(platformFee(200000), 0);
});
test('no overweight charge applies under the included tonnage', () => {
  const job = seed().jobs[0];
  assert.equal(invoice({ ...job, tons_actual: 1 }).overage, 0);
});
test('invalid rental dates and invalid monetary amounts are rejected', () => {
  const rule = seed().pricing_rules[0];
  assert.throws(() => quote(rule, '2026-10-07', '2026-10-07', 25));
  assert.throws(() => quote(rule, '2026-10-07', '2026-10-06', 25));
  assert.throws(() => quote(rule, 'bad', '2026-10-15', 25));
  assert.throws(() => platformFee(-1));
  assert.throws(() => platformFee(3.2));
});
test('reservation fee and protective boards are added to quote when enabled', () => {
  const rule = seed().pricing_rules.find((r) => r.size_yards === 20)!;
  const q = quote(rule, '2026-10-07', '2026-10-14', 100, { customerFee: true, boards: true });
  assert.equal(q.baseRental, 42500);
  assert.equal(q.reservationFee, 1195);
  assert.equal(q.boardsFee, 1900);
  assert.equal(q.total, 42500 + 1195 + 1900);
  assert.equal(q.fee, 1195 + 900);
});

test('sales tax calculation produces consistent Stripe line items matching total and deposit', () => {
  const rule = seed().pricing_rules.find((r) => r.size_yards === 20)!;
  const q = quote(rule, '2026-10-07', '2026-10-14', 100, {
    customerFee: true,
    boards: true,
    taxPercent: 8.25,
  });
  // baseRental: 42500, boardsFee: 1900 -> subtotal: 44400
  // tax: 44400 * 0.0825 = 3663 cents ($36.63)
  // reservationFee: 1195 ($11.95)
  // total: 44400 + 1195 + 3663 = 49258 cents ($492.58)
  assert.equal(q.taxPercent, 8.25);
  assert.equal(q.taxCents, 3663);
  assert.equal(q.total, 49258);
  assert.equal(q.deposit, 49258);

  // Stripe line items as constructed in jobs.ts:
  const stripeLineItems = [
    { unit_amount: q.baseRental, quantity: 1 },
    ...(q.reservationFee > 0 ? [{ unit_amount: q.reservationFee, quantity: 1 }] : []),
    ...(q.boardsFee > 0 ? [{ unit_amount: q.boardsFee, quantity: 1 }] : []),
    ...(q.taxCents > 0 ? [{ unit_amount: q.taxCents, quantity: 1 }] : []),
  ];

  const totalChargedByStripe = stripeLineItems.reduce((acc, item) => acc + item.unit_amount * item.quantity, 0);
  assert.equal(totalChargedByStripe, q.total);
  assert.equal(totalChargedByStripe, q.deposit);
});

