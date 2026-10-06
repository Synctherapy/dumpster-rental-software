export type JobStatus =
  'quoted' | 'booked' | 'dispatched' | 'delivered' | 'picked_up' | 'completed' | 'cancelled';
export type Role = 'owner' | 'dispatcher' | 'driver';
export interface Organization {
  id: string;
  name: string;
  slug: string;
  phone: string;
  timezone: string;
  stripe_connect_account_id: string | null;
  pricing_config: { deposit_percent: number };
}
export interface User {
  id: string;
  org_id: string;
  name: string;
  phone: string;
  role: Role;
}
export interface Container {
  id: string;
  org_id: string;
  label: string;
  size_yards: number;
  status: 'yard' | 'on_site' | 'maintenance';
  current_job_id: string | null;
}
export interface PricingRule {
  id: string;
  org_id: string;
  size_yards: number;
  base_price_cents: number;
  included_days: number;
  extra_day_cents: number;
  included_tons: number;
  overage_per_ton_cents: number;
  service_zips: string[];
}
export interface Job {
  id: string;
  org_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_address: string;
  zip: string;
  size_yards: number;
  delivery_date: string;
  pickup_date: string;
  status: JobStatus;
  price_cents: number;
  deposit_cents: number;
  tons_included: number;
  tons_actual: number | null;
  extra_day_cents: number;
  driver_id: string | null;
  container_id: string | null;
  notes: string;
  signature: { name: string; timestamp: string; ip: string };
  created_at: string;
  delivered_at: string | null;
  picked_up_at: string | null;
  proof_url: string | null;
  scale_ticket_url?: string | null;
  stripe_checkout_session_id?: string | null;
  stripe_customer_id: string | null;
  stripe_payment_method_id: string | null;
  booking_key: string;
  pricing_snapshot: PricingRule;
}
export interface Payment {
  id: string;
  org_id: string;
  job_id: string;
  stripe_payment_intent_id: string | null;
  amount_cents: number;
  application_fee_cents: number;
  status: 'succeeded' | 'pending' | 'failed' | 'refunded' | 'demo';
  idempotency_key: string;
  created_at: string;
  refunded_cents: number;
}
export interface Notification {
  id: string;
  org_id: string;
  job_id: string | null;
  channel: 'sms' | 'email';
  template: string;
  to: string;
  status: string;
  sent_at: string;
  dedupe_key?: string;
}
export interface Workspace {
  organization: Organization;
  users: User[];
  containers: Container[];
  jobs: Job[];
  payments: Payment[];
  pricing_rules: PricingRule[];
  notifications_log: Notification[];
  demo: boolean;
}
export const statuses: JobStatus[] = [
  'booked',
  'dispatched',
  'delivered',
  'picked_up',
  'completed',
];
export const statusLabels: Record<JobStatus, string> = {
  quoted: 'Awaiting payment',
  booked: 'Booked',
  dispatched: 'Dispatched',
  delivered: 'On site',
  picked_up: 'Picked up',
  completed: 'Completed',
  cancelled: 'Cancelled',
};
export function money(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: cents % 100 ? 2 : 0,
  }).format(cents / 100);
}
export function dateLabel(date: string) {
  return new Date(date + 'T12:00:00Z').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
export function addDays(date: string, days: number) {
  const d = new Date(date + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
export function today() {
  return new Date().toISOString().slice(0, 10);
}
