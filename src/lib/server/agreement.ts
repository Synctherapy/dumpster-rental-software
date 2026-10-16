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

function toPublicAgreementOrg(rawOrg: Partial<Organization>): Organization {
  const cfg = (rawOrg?.pricing_config || {}) as Record<string, unknown>;
  const cleanPricingConfig = { ...cfg };
  delete cleanPricingConfig.calendar_token;

  return {
    id: rawOrg.id,
    name: rawOrg.name,
    phone: rawOrg.phone || '',
    slug: rawOrg.slug,
    timezone: rawOrg.timezone,
    currency: rawOrg.currency || cfg.currency || 'usd',
    prohibited_items: rawOrg.prohibited_items || cfg.prohibited_items,
    landfill_surcharges: rawOrg.landfill_surcharges || cfg.landfill_surcharges,
    operating_days: rawOrg.operating_days || cfg.operating_days,
    pricing_config: cleanPricingConfig,
  } as Organization;
}

export async function getJobAgreement(jobId: string): Promise<AgreementData | null> {
  if (isDemo()) {
    const demoData = await readDemo();
    const job = demoData.jobs.find((j) => j.id === jobId);
    if (!job) return null;

    const organization = toPublicAgreementOrg(demoData.organization);
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

  if (jobError || !job) {
    try {
      const demoData = await readDemo();
      const demoJob = demoData.jobs.find((j) => j.id === jobId);
      if (!demoJob) return null;
      const organization = toPublicAgreementOrg(demoData.organization);
      const pricingRule =
        demoJob.pricing_snapshot ||
        demoData.pricing_rules.find((r) => r.size_yards === demoJob.size_yards) || {
          id: 'snapshot',
          org_id: organization.id,
          size_yards: demoJob.size_yards,
          base_price_cents: demoJob.price_cents,
          included_days: 7,
          extra_day_cents: demoJob.extra_day_cents || 1500,
          included_tons: demoJob.tons_included || 2,
          overage_per_ton_cents: 8500,
          service_zips: [demoJob.zip],
        };
      const deliveryTime = new Date(demoJob.delivery_date).getTime();
      const pickupTime = new Date(demoJob.pickup_date).getTime();
      const diffDays = Math.max(1, Math.round((pickupTime - deliveryTime) / (1000 * 60 * 60 * 24)));
      const currency = (
        organization.currency ||
        organization.pricing_config?.currency ||
        'usd'
      ).toUpperCase();
      return {
        job: demoJob,
        organization,
        pricingRule,
        rentalDays: diffDays,
        currency,
      };
    } catch {
      return null;
    }
  }

  const { data: organization, error: orgError } = await db
    .from('organizations')
    .select('id, name, phone, slug, timezone, pricing_config')
    .eq('id', job.org_id)
    .single();

  if (orgError || !organization) return null;
  const publicOrg = toPublicAgreementOrg(organization);

  const pricingRule: PricingRule =
    job.pricing_snapshot || {
      id: 'snapshot',
      org_id: publicOrg.id,
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
    publicOrg.currency ||
    publicOrg.pricing_config?.currency ||
    'usd'
  ).toUpperCase();

  return {
    job: job as Job,
    organization: publicOrg,
    pricingRule,
    rentalDays: diffDays,
    currency,
  };
}
