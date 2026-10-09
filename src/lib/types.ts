export type JobStatus =
  'quoted' | 'booked' | 'dispatched' | 'delivered' | 'picked_up' | 'completed' | 'cancelled';
export type Role = 'owner' | 'dispatcher' | 'driver';
export interface Organization {
  id: string;
  name: string;
  slug: string;
  phone: string;
  timezone: string;
  currency?: string; // 'usd' | 'cad'
  stripe_connect_account_id: string | null;
  subscription_status?: string;
  stripe_subscription_id?: string | null;
  is_paid_plan?: boolean;
  pricing_config: {
    deposit_percent: number;
    currency?: string;
    customer_fee_enabled?: boolean;
    google_review_url?: string;
    calendar_token?: string;
    min_notice_hours?: number;
    prohibited_items?: string[];
    operating_days?: number[]; // 0 = Sun, 1 = Mon, ..., 6 = Sat
    tax_rate_percent?: number;
  };
  google_review_url?: string;
  calendar_token?: string;
  min_notice_hours?: number;
  prohibited_items?: string[];
  operating_days?: number[];
  tax_rate_percent?: number;
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
  protective_boards?: boolean;
  scale_ticket_url?: string | null;
  driver_notes?: string | null;
  stripe_checkout_session_id?: string | null;
  stripe_customer_id: string | null;
  stripe_payment_method_id: string | null;
  booking_key: string;
  pricing_snapshot: PricingRule;
  is_swap?: boolean;
  payment_type?: string | null;
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
export function money(cents: number, currency: string = 'USD') {
  const curr = currency.toUpperCase() === 'CAD' ? 'CAD' : 'USD';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: curr,
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

export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  if (raw.startsWith('+') && digits.length >= 8) return `+${digits}`;
  return raw;
}

/**
 * Normalizes both US 5-digit ZIPs ("78704") and Canadian postal codes ("v8w 1w4" -> "V8W 1W4").
 */
export function normalizePostalCode(raw: string): string {
  const clean = raw.trim().toUpperCase().replace(/\s+/g, '');
  if (/^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(clean)) {
    return `${clean.slice(0, 3)} ${clean.slice(3)}`;
  }
  return clean;
}

export function isValidPostalCode(raw: string): boolean {
  const clean = raw.trim().toUpperCase().replace(/\s+/g, '');
  // US 5-digit ZIP or Canadian 6-char Postal Code
  return /^\d{5}$/.test(clean) || /^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(clean);
}
