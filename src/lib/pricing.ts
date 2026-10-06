import type { Job, PricingRule } from './types';
export function rentalDays(delivery: string, pickup: string) {
  const days = (Date.parse(pickup + 'T00:00:00Z') - Date.parse(delivery + 'T00:00:00Z')) / 86400000;
  if (!Number.isInteger(days) || days < 1 || days > 365)
    throw new Error('Choose a pickup date after delivery, within one year.');
  return days;
}
export function quote(rule: PricingRule, delivery: string, pickup: string, depositPercent: number) {
  const days = rentalDays(delivery, pickup);
  const extraDays = Math.max(0, days - rule.included_days);
  const total = rule.base_price_cents + extraDays * rule.extra_day_cents;
  return {
    base: rule.base_price_cents,
    days,
    extraDays,
    extra: extraDays * rule.extra_day_cents,
    total,
    deposit: Math.round((total * depositPercent) / 100),
    fee: platformFee(total),
  };
}
export function invoice(job: Job) {
  const pricing = quote(job.pricing_snapshot, job.delivery_date, job.pickup_date, 100);
  const extraTons = Math.max(0, (job.tons_actual ?? 0) - job.tons_included);
  const overage = Math.round(extraTons * job.pricing_snapshot.overage_per_ton_cents);
  return { ...pricing, extraTons, overage, total: pricing.total + overage };
}
/** 0.5% of the charge, with a $3 minimum. Zero-balance invoices have no fee. */
export function platformFee(amount: number) {
  if (!Number.isSafeInteger(amount) || amount < 0) throw new Error('Invalid amount');
  if (amount === 0) return 0;
  return Math.max(300, Math.round(amount * 0.005));
}
export const SUBSCRIPTION_CENTS = 4900;
