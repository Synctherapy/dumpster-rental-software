import 'server-only';
import { isDemo, readDemo } from './store';
import { admin } from './supabase';
import type { Job, Organization, PricingRule } from '../types';

export interface AgreementData {
  job: Job;
  organization: Organization;
  pricingRule: PricingRule;
  rentalDays: number;
  currency: string;
}

export async function getJobAgreement(jobId: string): Promise<AgreementData | null> {
  if (isDemo()) {
    const demoData = await readDemo();
    const job = demoData.jobs.find((j) => j.id === jobId);
    if (!job) return null;

    const organization = demoData.organization;
    const pricingRule =
      job.pricing_snapshot ||
      demoData.pricing_rules.find((r) => r.size_yards === job.size_yards) || {
        id: 'snapshot',
        org_id: organization.id,
        size_yards: job.size_yards,
        base_price_cents: job.price_cents,
        included_days: 7,
        extra_day_cents: job.extra_day_cents || 1500,
        included_tons: job.tons_included || 2,
        overage_per_ton_cents: 8500,
        service_zips: [job.zip],
      };

    const deliveryTime = new Date(job.delivery_date).getTime();
    const pickupTime = new Date(job.pickup_date).getTime();
    const diffDays = Math.max(1, Math.round((pickupTime - deliveryTime) / (1000 * 60 * 60 * 24)));

    const currency = (
      organization.currency ||
      organization.pricing_config?.currency ||
      'usd'
    ).toUpperCase();

    return {
      job,
      organization,
      pricingRule,
      rentalDays: diffDays,
      currency,
    };
  }

  const db = admin();
  const { data: job, error: jobError } = await db
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  if (jobError || !job) return null;

  const { data: organization, error: orgError } = await db
    .from('organizations')
    .select('*')
    .eq('id', job.org_id)
    .single();

  if (orgError || !organization) return null;

  const pricingRule: PricingRule =
    job.pricing_snapshot || {
      id: 'snapshot',
      org_id: organization.id,
      size_yards: job.size_yards,
      base_price_cents: job.price_cents,
      included_days: 7,
      extra_day_cents: job.extra_day_cents || 1500,
      included_tons: job.tons_included || 2,
      overage_per_ton_cents: 8500,
      service_zips: [job.zip],
    };

  const deliveryTime = new Date(job.delivery_date).getTime();
  const pickupTime = new Date(job.pickup_date).getTime();
  const diffDays = Math.max(1, Math.round((pickupTime - deliveryTime) / (1000 * 60 * 60 * 24)));

  const currency = (
    organization.currency ||
    organization.pricing_config?.currency ||
    'usd'
  ).toUpperCase();

  return {
    job: job as Job,
    organization: organization as Organization,
    pricingRule,
    rentalDays: diffDays,
    currency,
  };
}
