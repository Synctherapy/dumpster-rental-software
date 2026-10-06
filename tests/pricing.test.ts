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
  assert.equal(platformFee(43575), 300);
  assert.equal(platformFee(200000), 1000);
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
