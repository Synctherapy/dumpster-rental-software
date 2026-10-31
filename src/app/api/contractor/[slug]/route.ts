import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { isDemo, mutateDemo, readDemo } from '@/lib/server/store';
import { admin, maybeIdentity } from '@/lib/server/supabase';
import { publicOrganization } from '@/lib/server/workspace';
import { failure, assertSameOrigin } from '@/lib/server/http';
import { enforceRateLimit } from '@/lib/server/rate-limit';
import { invoice, quote } from '@/lib/pricing';
import { swapContainer, recordBookingOccurred } from '@/lib/server/jobs';
import { verifyContractorToken } from '@/lib/server/tokens';
import {
  addDays,
  today,
  normalizePhone,
  normalizePostalCode,
  isValidPostalCode,
  type Container,
  type Job,
  type PricingRule,
} from '@/lib/types';

export interface ContractorStatementLineItem {
  job_id: string;
  delivery_date: string;
  pickup_date: string;
  delivery_address: string;
  size_yards: number;
  container_label: string | null;
  status: string;
  is_swap: boolean;
  tons_included: number;
  tons_actual: number | null;
  extra_tons: number;
  base_cents: number;
  overage_cents: number;
  total_cents: number;
  scale_ticket_url: string | null;
  notes: string;
}

export interface ContractorStatement {
  account_name: string;
  billing_period: string;
  jobs_count: number;
  base_rental_cents: number;
  swap_count: number;
  overage_tons: number;
  overage_cents: number;
  total_due_cents: number;
  line_items: ContractorStatementLineItem[];
}

function buildStatement(
  accountName: string,
  jobs: Job[],
  containers: Container[],
): ContractorStatement {
  const now = new Date();
  const billingPeriod = `${now.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })} · Consolidated Net-30`;

  let baseRentalCents = 0;
  let swapCount = 0;
  let overageTons = 0;
  let overageCents = 0;
  let totalDueCents = 0;

  const lineItems: ContractorStatementLineItem[] = jobs
    .filter((j) => j.status !== 'cancelled')
    .map((job) => {
      const inv = invoice(job);
      const baseCents = inv.total - inv.overage;
      const isSwap = Boolean(
        job.is_swap ||
          job.notes?.toLowerCase().includes('swap') ||
          job.signature?.name?.toLowerCase().includes('swap'),
      );
      const container = containers.find((c) => c.id === job.container_id);
      const containerLabel = container?.label ?? null;

      baseRentalCents += baseCents;
      if (isSwap) swapCount += 1;
      overageTons += inv.extraTons;
      overageCents += inv.overage;
      totalDueCents += inv.total;

      return {
        job_id: job.id,
        delivery_date: job.delivery_date,
        pickup_date: job.pickup_date,
        delivery_address: job.delivery_address,
        size_yards: job.size_yards,
        container_label: containerLabel,
        status: job.status,
        is_swap: isSwap,
        tons_included: job.tons_included,
        tons_actual: job.tons_actual,
        extra_tons: Math.round(inv.extraTons * 100) / 100,
        base_cents: baseCents,
        overage_cents: inv.overage,
        total_cents: inv.total,
        scale_ticket_url: job.scale_ticket_url ?? null,
        notes: job.notes,
      };
    });

  return {
    account_name: accountName,
    billing_period: billingPeriod,
    jobs_count: lineItems.length,
    base_rental_cents: baseRentalCents,
    swap_count: swapCount,
    overage_tons: Math.round(overageTons * 100) / 100,
    overage_cents: overageCents,
    total_due_cents: totalDueCents,
    line_items: lineItems,
  };
}

const DEFAULT_DEMO_ACCOUNT = 'Apex Roofing & Construction';

async function readAccountFromBody(request: Request) {
  try {
    const body = (await request.clone().json()) as { account_name?: unknown };
    return String(body?.account_name ?? '').trim();
  } catch {
    return '';
  }
}

/**
 * A contractor proves who they are with the signed `t` token in their VIP link.
 * The open demo keeps working without one so prospects can look around before
 * they sign up; a real organization always requires the token.
 */
async function resolveContractorAccess(request: Request, slug: string) {
  const url = new URL(request.url);
  const pub = await publicOrganization(slug);
  const orgId = (pub.organization as { id: string }).id;
  const demo = isDemo() || pub.demo;

  if (demo) {
    // The open demo has nothing to protect, so the caller may name the trade
    // account directly: in the body for portal actions, in the query for a view.
    let requested = '';
    if (request.method !== 'GET') {
      requested = await readAccountFromBody(request);
    }
    if (!requested) requested = (url.searchParams.get('account') || '').trim();
    return {
      demo: true,
      pub,
      orgId,
      account: requested.slice(0, 120) || DEFAULT_DEMO_ACCOUNT,
    };
  }

  // The hauler previewing their own portal from the dashboard is already
  // authenticated; they do not need to mint a link to look.
  const ident = await maybeIdentity();
  if (
    ident &&
    ident.member.org_id === orgId &&
    ['owner', 'dispatcher'].includes(ident.member.role)
  ) {
    const requested = (url.searchParams.get('account') || '').trim();
    return { demo: false, pub, orgId, account: requested || DEFAULT_DEMO_ACCOUNT };
  }

  let token = (url.searchParams.get('t') || '').trim();
  if (!token && request.method !== 'GET') {
    try {
      token = String(((await request.clone().json()) as { t?: unknown })?.t ?? '').trim();
    } catch {}
  }
  if (!token)
    throw new Error(
      'This portal needs your VIP link. Ask your hauler to send you a new one.',
    );

  const claim = verifyContractorToken(token);
  if (claim.org !== orgId) throw new Error('FORBIDDEN');
  return { demo: false, pub, orgId, account: claim.account };
}

/** Never hand a contractor another party's payment handles or booking secrets. */
function publicJob(job: Job): Job {
  return {
    ...job,
    booking_key: '',
    stripe_customer_id: null,
    stripe_payment_method_id: null,
    signature: job.signature ? { ...job.signature, ip: '' } : job.signature,
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const access = await resolveContractorAccess(request, slug);
    const pub = access.pub;
    const accountName = access.account;
    const accountLower = accountName.toLowerCase();

    if (access.demo) {
      const d = await readDemo();
      const org =
        slug === d.organization.slug
          ? pub.organization
          : { ...pub.organization, slug };

      const matchedJobs = d.jobs.filter((j) => {
        const inNotes = j.notes?.toLowerCase().includes(accountLower);
        const inName = j.customer_name?.toLowerCase().includes(accountLower);
        return Boolean(inNotes || inName || j.is_commercial);
      });

      // Ensure demo portal is immediately populated and interactive out-of-the-box
      // with active delivered/dispatched/booked bins AND completed tonnage jobs
      const fallbackDemoJobs = d.jobs.filter((j) =>
        ['delivered', 'dispatched', 'booked', 'completed'].includes(j.status),
      );

      const combinedMap = new Map<string, Job>();
      for (const j of matchedJobs) combinedMap.set(j.id, j);
      for (const j of fallbackDemoJobs) {
        if (!combinedMap.has(j.id)) combinedMap.set(j.id, j);
      }

      const contractorJobs = Array.from(combinedMap.values());
      const statement = buildStatement(accountName, contractorJobs, d.containers);

      return NextResponse.json(
        {
          organization: org,
          pricing_rules: d.pricing_rules,
          containers: d.containers,
          jobs: contractorJobs,
          statement,
          demo: true,
        },
        { headers: { 'Cache-Control': 'no-store' } },
      );
    }

    const db = admin();
    const orgId = access.orgId;

    const [{ data: allJobs, error: jobsError }, { data: containersData }] =
      await Promise.all([
        db
          .from('jobs')
          .select('*')
          .eq('org_id', orgId)
          .order('created_at', { ascending: false }),
        db.from('containers').select('*').eq('org_id', orgId),
      ]);

    if (jobsError) throw new Error(jobsError.message);

    const containers = (containersData || []) as Container[];
    const jobsList = (allJobs || []) as Job[];

    // Only this trade account's own work. Previously an unmatched account name
    // widened to every commercial job, and no account name at all returned the
    // organization's entire active book of business.
    const contractorJobs = jobsList
      .filter(
        (j) =>
          j.notes?.toLowerCase().includes(accountLower) ||
          j.customer_name?.toLowerCase().includes(accountLower),
      )
      .map(publicJob);

    const statement = buildStatement(accountName, contractorJobs, containers);

    return NextResponse.json(
      {
        organization: pub.organization,
        pricing_rules: pub.pricing_rules,
        containers,
        jobs: contractorJobs,
        statement,
        demo: false,
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (e) {
    return failure(e);
  }
}

const swapActionSchema = z.object({
  action: z.literal('swap'),
  t: z.string().optional(),
  job_id: z.string().min(1),
  account_name: z.string().trim().min(1).max(120).default('Apex Roofing & Construction'),
  target_size: z.number().int().min(1).max(100).optional(),
  delivery_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  notes: z.string().max(1000).optional(),
});

const orderActionSchema = z.object({
  action: z.literal('order'),
  t: z.string().optional(),
  account_name: z.string().trim().min(1).max(120).default('Apex Roofing & Construction'),
  customer_name: z.string().trim().min(2).max(100).optional(),
  customer_phone: z.string().trim().min(7).max(25).optional(),
  customer_email: z.string().trim().email().or(z.literal('')).optional(),
  delivery_address: z.string().trim().min(5).max(300),
  zip: z.string().refine(isValidPostalCode, { message: 'Enter a valid ZIP or postal code.' }),
  size_yards: z.number().int().min(1).max(100),
  delivery_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().max(1000).optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    assertSameOrigin(request);
    await enforceRateLimit(request, 'contractor');
    const { slug } = await params;
    const access = await resolveContractorAccess(request, slug);
    const rawBody = (await request.json()) as Record<string, unknown>;
    const action = rawBody.action;

    if (action === 'swap') {
      const body = swapActionSchema.parse(rawBody);
      const accountName = access.account;
      const formattedNotes = body.notes
        ? `[VIP CONTRACTOR: ${accountName}] ${body.notes}`
        : `[VIP CONTRACTOR: ${accountName}] 1-Tap Portal Swap`;

      if (isDemo()) {
        // Ensure demo org allows contractor VIP swap seamlessly even if subscription_status is inactive
        let previousStatus: string | undefined;
        await mutateDemo((d) => {
          previousStatus = d.organization.subscription_status;
          if (d.organization.subscription_status !== 'active') {
            d.organization.subscription_status = 'active';
          }
        });

        try {
          const result = await swapContainer(body.job_id, {
            target_size: body.target_size,
            delivery_date: body.delivery_date,
            notes: formattedNotes,
          });

          const updatedSwapJob = await mutateDemo((d) => {
            if (previousStatus !== undefined) {
              d.organization.subscription_status = previousStatus;
            }
            const sj = d.jobs.find((j) => j.id === result.swap_job.id);
            if (sj) {
              sj.is_commercial = true;
              sj.payment_type = 'net_30';
              return sj;
            }
            result.swap_job.is_commercial = true;
            result.swap_job.payment_type = 'net_30';
            return result.swap_job;
          });

          return NextResponse.json({
            ok: true,
            swap_job: updatedSwapJob,
            previous_job: result.previous_job,
          });
        } catch (err) {
          if (previousStatus !== undefined) {
            await mutateDemo((d) => {
              d.organization.subscription_status = previousStatus;
            });
          }
          throw err;
        }
      }

      // A logged-in hauler goes through swapContainer, which enforces their role.
      // A contractor has no session, so they fall through to the scoped path below,
      // which is now reachable only with a verified VIP token.
      try {
        const result = await swapContainer(body.job_id, {
          target_size: body.target_size,
          delivery_date: body.delivery_date,
          notes: formattedNotes,
        });
        result.swap_job.is_commercial = true;
        result.swap_job.payment_type = 'net_30';
        try {
          await admin()
            .from('jobs')
            .update({ is_commercial: true, payment_type: 'net_30' })
            .eq('id', result.swap_job.id);
        } catch {}
        return NextResponse.json({
          ok: true,
          swap_job: result.swap_job,
          previous_job: result.previous_job,
        });
      } catch {
        const pub = access.pub;
        const orgId = access.orgId;
        const db = admin();
        const { data: prevJob, error: prevErr } = await db
          .from('jobs')
          .select('*')
          .eq('id', body.job_id)
          .eq('org_id', orgId)
          .single();
        if (prevErr || !prevJob) throw new Error('Job not found');
        const accountLower = accountName.toLowerCase();
        const ownsJob =
          prevJob.notes?.toLowerCase().includes(accountLower) ||
          prevJob.customer_name?.toLowerCase().includes(accountLower);
        if (!ownsJob) throw new Error('FORBIDDEN');
        if (!['delivered', 'dispatched'].includes(prevJob.status)) {
          throw new Error('Only delivered or dispatched jobs can be swapped');
        }

        const targetSize = body.target_size ?? prevJob.size_yards;
        const rule =
          pub.pricing_rules.find((r) => r.size_yards === targetSize) ??
          (prevJob.pricing_snapshot as PricingRule);
        const deliveryDate = body.delivery_date ?? today();
        const pickupDate = addDays(deliveryDate, rule.included_days || 7);
        const price = quote(rule, deliveryDate, pickupDate, 100, { customerFee: false });

        let containerLabel = prevJob.container_id || 'current unit';
        if (prevJob.container_id) {
          const { data: c } = await db
            .from('containers')
            .select('label')
            .eq('id', prevJob.container_id)
            .single();
          if (c?.label) containerLabel = c.label;
        }
        const { data: yardContainers } = await db
          .from('containers')
          .select('id')
          .eq('org_id', orgId)
          .eq('size_yards', targetSize)
          .eq('status', 'yard')
          .limit(1);
        const nextContainerId = yardContainers?.[0]?.id ?? null;

        const swapJobRow: Record<string, unknown> = {
          id: randomUUID(),
          org_id: orgId,
          customer_name: prevJob.customer_name,
          customer_phone: prevJob.customer_phone,
          customer_email: prevJob.customer_email,
          delivery_address: prevJob.delivery_address,
          zip: prevJob.zip,
          size_yards: targetSize,
          delivery_date: deliveryDate,
          pickup_date: pickupDate,
          status: prevJob.driver_id ? 'dispatched' : 'booked',
          price_cents: price.total,
          deposit_cents: price.total,
          tons_included: rule.included_tons,
          tons_actual: null,
          extra_day_cents: rule.extra_day_cents,
          driver_id: prevJob.driver_id ?? null,
          container_id: nextContainerId,
          swap_parent_job_id: prevJob.id,
          swapped_from_container_label: containerLabel,
          notes: `Swap replacement for ${containerLabel}. ${formattedNotes}`.trim(),
          signature: {
            name: `${body.account_name} (VIP 1-Tap Swap)`,
            timestamp: new Date().toISOString(),
            ip: 'contractor-portal',
          },
          pricing_snapshot: rule,
          booking_key: randomUUID(),
          created_at: new Date().toISOString(),
          is_swap: true,
          is_commercial: true,
          payment_type: 'net_30',
        };

        let { data: inserted, error: insertErr } = await db
          .from('jobs')
          .insert(swapJobRow)
          .select('*')
          .single();
        if (insertErr && insertErr.message?.includes('column')) {
          const fallbackRow = { ...swapJobRow };
          delete fallbackRow.is_swap;
          delete fallbackRow.is_commercial;
          delete fallbackRow.swap_parent_job_id;
          delete fallbackRow.swapped_from_container_label;
          delete fallbackRow.payment_type;
          const retry = await db.from('jobs').insert(fallbackRow).select('*').single();
          inserted = retry.data;
          insertErr = retry.error;
        }
        if (insertErr || !inserted) throw new Error(insertErr?.message || 'Swap failed');
        if (nextContainerId) {
          await db.from('containers').update({ status: 'on_site' }).eq('id', nextContainerId);
        }
        await recordBookingOccurred(orgId);
        return NextResponse.json({
          ok: true,
          swap_job: inserted,
          previous_job: prevJob,
        });
      }
    }

    if (action === 'order') {
      const body = orderActionSchema.parse(rawBody);
      if (body.delivery_date < today()) {
        throw new Error('Delivery date cannot be in the past.');
      }

      const accountName = access.account;
      const pub = access.pub;
      const org = pub.organization as {
        id: string;
        name: string;
        pricing_config?: { tax_rate_percent?: number };
      };
      const rule = pub.pricing_rules.find((r) => r.size_yards === body.size_yards);
      if (!rule) throw new Error('Selected dumpster size is unavailable.');

      const formattedZip = normalizePostalCode(body.zip);
      const formattedPhone = normalizePhone(body.customer_phone || '+15125550199');
      const customerName = body.customer_name?.trim() || accountName;
      const customerEmail =
        body.customer_email?.trim() ||
        `${accountName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'contractor'}@net30.rollos`;

      const pickupDate = addDays(body.delivery_date, rule.included_days || 7);
      const taxPercent = org.pricing_config?.tax_rate_percent ?? 0;
      const price = quote(rule, body.delivery_date, pickupDate, 100, {
        customerFee: false,
        taxPercent,
      });

      const jobNotes = `[VIP CONTRACTOR: ${accountName}] ${body.notes || ''}`.trim();

      const newJob: Job = {
        id: randomUUID(),
        org_id: org.id,
        customer_name: customerName,
        customer_phone: formattedPhone,
        customer_email: customerEmail,
        delivery_address: body.delivery_address,
        zip: formattedZip,
        size_yards: body.size_yards,
        delivery_date: body.delivery_date,
        pickup_date: pickupDate,
        status: 'booked',
        price_cents: price.total,
        deposit_cents: price.total,
        tons_included: rule.included_tons,
        tons_actual: null,
        extra_day_cents: rule.extra_day_cents,
        driver_id: null,
        container_id: null,
        notes: jobNotes,
        signature: {
          name: `${accountName} (Net-30 Trade Account)`,
          timestamp: new Date().toISOString(),
          ip: 'contractor-portal',
        },
        signed_by_customer: true,
        created_at: new Date().toISOString(),
        delivered_at: null,
        picked_up_at: null,
        proof_url: null,
        protective_boards: false,
        stripe_customer_id: null,
        stripe_payment_method_id: null,
        booking_key: randomUUID(),
        pricing_snapshot: rule,
        is_commercial: true,
        payment_type: 'net_30',
      };

      if (access.demo) {
        const savedJob = await mutateDemo((d) => {
          d.jobs.unshift(newJob);
          d.payments.unshift({
            id: randomUUID(),
            org_id: org.id,
            job_id: newJob.id,
            stripe_payment_intent_id: null,
            amount_cents: price.total,
            application_fee_cents: 0,
            status: 'demo',
            idempotency_key: `net30-${newJob.id}`,
            created_at: new Date().toISOString(),
            refunded_cents: 0,
          });
          return newJob;
        });
        await recordBookingOccurred(org.id);
        return NextResponse.json({ ok: true, job: savedJob });
      }

      const db = admin();
      let { data: inserted, error: insertErr } = await db
        .from('jobs')
        .insert(newJob)
        .select('*')
        .single();
      if (insertErr && insertErr.message?.includes('column')) {
        const fallbackRow: Record<string, unknown> = { ...newJob };
        delete fallbackRow.is_commercial;
        delete fallbackRow.signed_by_customer;
        delete fallbackRow.payment_type;
        const retry = await db.from('jobs').insert(fallbackRow).select('*').single();
        inserted = retry.data;
        insertErr = retry.error;
      }
      if (insertErr || !inserted) {
        throw new Error(insertErr?.message || 'Unable to create commercial Net-30 order');
      }
      await recordBookingOccurred(org.id);
      return NextResponse.json({ ok: true, job: inserted });
    }

    throw new Error('Invalid contractor portal action.');
  } catch (e) {
    return failure(e);
  }
}
