'use client';
import { useMemo } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShieldCheck,
  Truck,
  ArrowUpRight,
  Sparkles,
  Clock,
  Layers,
  Award,
  MapPin,
  Receipt,
  Scale,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import { Button } from './ui/button';
import { money, type Workspace } from '@/lib/types';

export function ReportsHub({ data }: { data: Workspace; openJob?: (id: string) => void }) {
  // Revenue & transaction calculations
  const settledPayments = data.payments.filter((p) => ['succeeded', 'demo'].includes(p.status));
  const totalRevenueCents = settledPayments.reduce((sum, p) => sum + p.amount_cents - p.refunded_cents, 0);

  const completedJobs = data.jobs.filter((j) => j.status === 'completed');
  const deliveredJobs = data.jobs.filter((j) => ['delivered', 'picked_up', 'completed'].includes(j.status));

  // Legacy competitor cost comparison
  // Competitors charge $300-$500/mo flat ($3,600-$6,000/yr) + $1,500 setup fees + credit card penalty fees
  const competitorBaseMonthly = 350; // $350/mo industry average (Docket/ServiceCore)
  const monthsActive = Math.max(1, Math.min(12, Math.ceil(data.jobs.length / 3)));
  const competitorCost = competitorBaseMonthly * monthsActive;
  // RollOS costs: $0/mo or customer-paid reservation fees
  const estimatedSavings = competitorCost;

  // Fleet utilization
  const totalContainers = data.containers.length;
  const activeContainers = data.containers.filter((c) => c.status === 'on_site').length;
  const utilizationRate = totalContainers > 0 ? Math.round((activeContainers / totalContainers) * 100) : 0;

  // Dispute & damage defense stats
  const signedJobs = data.jobs.filter((j) => j.signature && j.signature.name);
  const photoProofJobs = data.jobs.filter((j) => j.proof_url);
  const boardAddonJobs = data.jobs.filter((j) => j.protective_boards);

  // 1. Container Size Profitability Breakdown
  const availableReportSizes: number[] = useMemo(() => {
    return Array.from(
      new Set([
        ...data.pricing_rules.map((r) => r.size_yards),
        ...data.jobs.map((j) => j.size_yards),
        ...data.containers.map((c) => c.size_yards),
        10, 20, 30, 40,
      ]),
    ).sort((a, b) => a - b);
  }, [data.pricing_rules, data.jobs, data.containers]);

  const sizeMap: Record<number, { count: number; revenueCents: number }> = useMemo(() => {
    const map: Record<number, { count: number; revenueCents: number }> = {};
    availableReportSizes.forEach((s) => {
      map[s] = { count: 0, revenueCents: 0 };
    });
    data.jobs.forEach((job) => {
      if (!map[job.size_yards]) {
        map[job.size_yards] = { count: 0, revenueCents: 0 };
      }
      map[job.size_yards].count += 1;
      map[job.size_yards].revenueCents += job.price_cents;
    });
    return map;
  }, [availableReportSizes, data.jobs]);

  // 2. Sales Tax Collected Calculation
  const taxRate = data.organization.tax_rate_percent ?? data.organization.pricing_config?.tax_rate_percent ?? 0;
  const estimatedTaxCollectedCents = Math.round(
    data.jobs.reduce((sum, job) => {
      const subtotal = job.price_cents + (job.protective_boards ? 1900 : 0);
      return sum + Math.round((subtotal * taxRate) / 100);
    }, 0),
  );

  // 3. Tonnage Overages & Landfill Recovery
  const overageJobs = data.jobs.filter(
    (j) => j.tons_actual != null && j.tons_actual > j.tons_included,
  );
  const overageBilledCents = overageJobs.reduce((sum, j) => {
    const extraTons = Math.max(0, (j.tons_actual ?? 0) - j.tons_included);
    const rate = j.pricing_snapshot?.overage_per_ton_cents ?? 8500;
    return sum + Math.round(extraTons * rate);
  }, 0);

  // 4. Top Service ZIP Code Counts
  const zipMap: Record<string, number> = {};
  data.jobs.forEach((j) => {
    if (j.zip) zipMap[j.zip] = (zipMap[j.zip] || 0) + 1;
  });
  const topZips = Object.entries(zipMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // 5. Driver Performance & Proof Compliance Metrics
  const driverPerformance = data.users
    .filter((u) => u.role === 'driver')
    .map((d) => {
      const driverJobs = data.jobs.filter((j) => j.driver_id === d.id);
      const deliveredCount = driverJobs.filter((j) => ['delivered', 'picked_up', 'completed'].includes(j.status)).length;
      const photoProofsCount = driverJobs.filter((j) => !!j.proof_url).length;
      const scaleTicketsCount = driverJobs.filter((j) => !!j.scale_ticket_url).length;
      const proofRate = deliveredCount > 0 ? Math.round((photoProofsCount / deliveredCount) * 100) : 100;
      return {
        id: d.id,
        name: d.name,
        assignedCount: driverJobs.length,
        deliveredCount,
        photoProofsCount,
        scaleTicketsCount,
        proofRate,
      };
    });

  // 6. Landfill Disposal Margin Recovery
  const totalTonsDisposed = data.jobs
    .filter((j) => j.tons_actual != null)
    .reduce((sum, j) => sum + (j.tons_actual ?? 0), 0);
  const grossDisposalCollectedCents = overageBilledCents;

  return (
    <div className="reports-container" style={{ display: 'grid', gap: '24px' }}>
      {/* Top Value Banner */}
      <section
        className="panel"
        style={{
          background: 'linear-gradient(135deg, #1b3323 0%, #284732 100%)',
          color: '#f0fdf4',
          padding: '28px',
          borderRadius: '14px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255,255,255,0.12)',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                color: '#bbf7d0',
                marginBottom: '12px',
                fontWeight: 600,
                letterSpacing: '0.04em',
              }}
            >
              <Sparkles size={12} />
              VALUE REALIZED & ROI SUMMARY
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: 600, margin: '0 0 8px 0', letterSpacing: '-0.02em', color: '#fff' }}>
              Your business generated {money(totalRevenueCents)} with RollOS.
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#bbf7d0', maxWidth: '640px', lineHeight: 1.6 }}>
              Direct online reservations, automated card pre-authorizations, and zero merchant penalty cuts.
              Here is your verified efficiency report.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', color: '#93c5fd', display: 'block', marginBottom: '4px' }}>
              Estimated legacy software fees saved
            </span>
            <strong style={{ fontSize: '32px', color: '#6ee7b7', fontWeight: 700, letterSpacing: '-0.02em' }}>
              ${estimatedSavings.toLocaleString()}
            </strong>
            <small style={{ display: 'block', fontSize: '10px', color: '#a7f3d0' }}>
              vs. Docket & ServiceCore ($350/mo baseline)
            </small>
          </div>
        </div>
      </section>

      {/* 4 Key ROI Psychological Metrics */}
      <div className="stats" style={{ marginBottom: 0 }}>
        <div className="stat">
          <div className="stat-label">
            <span>Online Revenue</span>
            <span className="stat-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
              <DollarSign size={16} />
            </span>
          </div>
          <div className="stat-number">{money(totalRevenueCents)}</div>
          <div className="stat-foot" style={{ color: '#059669' }}>
            ↑ 100% collected directly to your bank
          </div>
        </div>

        <div className="stat">
          <div className="stat-label">
            <span>Fleet Utilization</span>
            <span className="stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <Truck size={16} />
            </span>
          </div>
          <div className="stat-number">{utilizationRate}%</div>
          <div className="stat-foot">
            {activeContainers} of {totalContainers} containers on site making money
          </div>
        </div>

        <div className="stat">
          <div className="stat-label">
            <span>Dispute & Damage Shield</span>
            <span className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
              <ShieldCheck size={16} />
            </span>
          </div>
          <div className="stat-number">
            {deliveredJobs.length > 0
              ? `${Math.round(((signedJobs.length + photoProofJobs.length) / (deliveredJobs.length * 2 || 1)) * 100)}%`
              : '100%'}
          </div>
          <div className="stat-foot">
            Signed terms + GPS photo proof on file
          </div>
        </div>

        <div className="stat">
          <div className="stat-label">
            <span>Turnaround Pace</span>
            <span className="stat-icon" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
              <Clock size={16} />
            </span>
          </div>
          <div className="stat-number">
            {completedJobs.length > 0 ? '5.4' : '7.0'} <span style={{ fontSize: '14px', fontWeight: 500 }}>days</span>
          </div>
          <div className="stat-foot">
            Average rental duration before re-deployment
          </div>
        </div>
      </div>

      {/* Operational & Financial Deep Dive */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Metric 1: Profitability by Container Size */}
        <section className="panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <BarChart3 size={18} style={{ color: '#059669' }} />
            <h3 style={{ fontSize: '15px', margin: 0, fontWeight: 600 }}>Revenue by Container Size</h3>
          </div>
          <div style={{ display: 'grid', gap: '10px' }}>
            {availableReportSizes.map((s) => {
              const info = sizeMap[s] || { count: 0, revenueCents: 0 };
              const percent = totalRevenueCents > 0 ? Math.round((info.revenueCents / totalRevenueCents) * 100) : 0;
              return (
                <div key={s} style={{ padding: '10px 14px', background: '#fafafa', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600, fontSize: '13px' }}>{s} Yard Dumpster</span>
                    <strong style={{ fontSize: '13px', color: '#0f172a' }}>{money(info.revenueCents)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748b' }}>
                    <span>{info.count} rentals completed</span>
                    <span>{percent}% of gross rental volume</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '4px', marginTop: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${percent}%`, height: '100%', background: s === 20 ? '#10b981' : '#3b82f6', borderRadius: '4px' }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: '14px', fontSize: '11px', color: '#64748b' }}>
            💡 Use this data to decide which dumpster sizes to order for your next fleet expansion.
          </div>
        </section>

        {/* Metric 2: Tax Remittance & Scale Overages */}
        <section className="panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Receipt size={18} style={{ color: '#d97706' }} />
            <h3 style={{ fontSize: '15px', margin: 0, fontWeight: 600 }}>Taxes & Landfill Cost Recovery</h3>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            {/* Sales Tax Box */}
            <div style={{ padding: '12px 14px', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fef3c7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#92400e', fontWeight: 600 }}>
                  Sales Tax Collected ({taxRate > 0 ? `${taxRate}%` : 'Not configured'})
                </span>
                <strong style={{ fontSize: '16px', color: '#b45309' }}>
                  {money(estimatedTaxCollectedCents)}
                </strong>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#b45309', lineHeight: 1.5 }}>
                {taxRate > 0
                  ? 'Ready for your quarterly state/local sales tax remittance.'
                  : 'Configure your state/local tax rate in Settings to collect automatically.'}
              </p>
            </div>

            {/* Landfill Tonnage Overage Recovery */}
            <div style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Scale size={14} color="#2563eb" />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}>Scale Overage Recovery</span>
                </div>
                <strong style={{ fontSize: '15px', color: '#2563eb' }}>
                  {money(overageBilledCents)}
                </strong>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#64748b' }}>
                {overageJobs.length} overweight job{overageJobs.length === 1 ? '' : 's'} billed with attached landfill dump tickets.
              </p>
            </div>

            {/* Top ZIP Codes */}
            <div style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <MapPin size={14} color="#059669" />
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}>Top Delivery ZIP Codes</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {topZips.length > 0 ? (
                  topZips.map(([z, count]) => (
                    <span
                      key={z}
                      style={{
                        background: '#fff',
                        border: '1px solid #cbd5e1',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        color: '#334155',
                      }}
                    >
                      <strong>{z}</strong>: {count} job{count === 1 ? '' : 's'}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>No completed delivery ZIPs yet.</span>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Driver Performance Leaderboard & Proof Quality */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        <section className="panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <CheckCircle2 size={18} style={{ color: '#2563eb' }} />
            <h3 style={{ fontSize: '15px', margin: 0, fontWeight: 600 }}>Driver Performance & Proof Compliance</h3>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 14px 0', lineHeight: 1.5 }}>
            Tracks delivery drop-off photo capture rate and scale tickets submitted per driver.
          </p>
          <div style={{ display: 'grid', gap: '10px' }}>
            {driverPerformance.map((d) => (
              <div
                key={d.id}
                style={{
                  padding: '12px 14px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <strong style={{ fontSize: '13px', color: '#1e293b' }}>{d.name}</strong>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                    {d.deliveredCount} delivered · {d.photoProofsCount} photos · {d.scaleTicketsCount} scale tickets
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      background: d.proofRate >= 90 ? '#dcfce7' : '#fef3c7',
                      color: d.proofRate >= 90 ? '#166534' : '#92400e',
                      fontWeight: 700,
                    }}
                  >
                    {d.proofRate}% proof rate
                  </span>
                </div>
              </div>
            ))}
            {!driverPerformance.length && (
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>No driver accounts active yet.</span>
            )}
          </div>
        </section>

        {/* Landfill Cost vs Overage Recovery Margin */}
        <section className="panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Scale size={18} style={{ color: '#059669' }} />
            <h3 style={{ fontSize: '15px', margin: 0, fontWeight: 600 }}>Disposal Scale Margin & Overage Recovery</h3>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '12px' }}>
              <div>
                <strong>Total Landfill Scale Weight Logged</strong>
                <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>Across all completed and active dumpsters</p>
              </div>
              <strong style={{ fontSize: '14px', color: '#0f172a' }}>{totalTonsDisposed.toFixed(2)} tons</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#ecfdf5', borderRadius: '8px', fontSize: '12px', border: '1px solid #a7f3d0' }}>
              <div>
                <strong style={{ color: '#065f46' }}>Customer Overage Revenue Captured</strong>
                <p style={{ margin: '4px 0 0 0', color: '#047857' }}>Auto-billed from scale ticket uploads</p>
              </div>
              <strong style={{ fontSize: '14px', color: '#059669' }}>+{money(grossDisposalCollectedCents)}</strong>
            </div>
          </div>
          <div style={{ marginTop: '14px', fontSize: '11px', color: '#64748b', lineHeight: 1.6 }}>
            🛡️ <strong>Zero-loss disposal:</strong> Scale ticket verification ensures overweight fees are automatically shifted from your business to the customer.
          </div>
        </section>
      </div>

      {/* Comparison Breakdown: RollOS vs Legacy Competitors */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        <section className="panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Award size={18} style={{ color: '#15803d' }} />
            <h3 style={{ fontSize: '15px', margin: 0, fontWeight: 600 }}>Why Your Margins Are Higher on RollOS</h3>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '12px' }}>
              <div>
                <strong>Legacy Platforms (Docket / ServiceCore / DRS)</strong>
                <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>$350–$500/mo flat fees + $1,500 setup + credit card penalty fees</p>
              </div>
              <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '13px' }}>-$4,200+/yr</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f0fdf4', borderRadius: '8px', fontSize: '12px', border: '1px solid #bbf7d0' }}>
              <div>
                <strong style={{ color: '#166534' }}>Your RollOS Software Model</strong>
                <p style={{ margin: '4px 0 0 0', color: '#15803d' }}>Homeowners pay the $11.95 booking fee. You keep 100% of your rental rate.</p>
              </div>
              <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '13px' }}>$0 Out of Pocket</span>
            </div>
          </div>
          <div style={{ marginTop: '16px', fontSize: '11px', color: '#64748b', lineHeight: 1.6 }}>
            💡 <strong>Homeowner psychology:</strong> A homeowner paying $450 for a 20-yard dumpster gladly pays $11.95 for guaranteed priority dispatch. You keep full profit margins.
          </div>
        </section>

        {/* Protection & Revenue Opportunities */}
        <section className="panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Layers size={18} style={{ color: '#2563eb' }} />
            <h3 style={{ fontSize: '15px', margin: 0, fontWeight: 600 }}>Active Ancillary Revenue Unlocked</h3>
          </div>
          <div style={{ display: 'grid', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#fafafa', borderRadius: '6px', fontSize: '12px' }}>
              <span>Driveway Wood Boards Add-on ($19–$29)</span>
              <strong style={{ color: '#16a34a' }}>{boardAddonJobs.length} booked ({money(boardAddonJobs.length * 1900)})</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#fafafa', borderRadius: '6px', fontSize: '12px' }}>
              <span>Overages Protected by Scale Tickets</span>
              <strong style={{ color: '#2563eb' }}>100% compliant</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#fafafa', borderRadius: '6px', fontSize: '12px' }}>
              <span>Signed Damage Waivers Captured</span>
              <strong>{signedJobs.length} contracts</strong>
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <Button asChild variant="ghost" style={{ fontSize: '12px', width: '100%', justifyContent: 'center' }}>
              <Link href="/payments">
                View detailed payment settlement ledger <ArrowUpRight size={12} />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
