'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Building2,
  RefreshCw,
  PlusCircle,
  FileText,
  Truck,
  MapPin,
  Calendar,
  CheckCircle2,
  Printer,
  ShieldCheck,
  Sparkles,
  Scale,
  ArrowRight,
  Loader2,
  Phone,
} from 'lucide-react';
import {
  addDays,
  dateLabel,
  money,
  statusLabels,
  today,
  type Container,
  type Job,
  type Organization,
  type PricingRule,
} from '@/lib/types';
import type {
  ContractorStatement,
  ContractorStatementLineItem,
} from '@/app/api/contractor/[slug]/route';

interface ContractorPortalResponse {
  organization: Organization;
  pricing_rules: PricingRule[];
  containers: Container[];
  jobs: Job[];
  statement: ContractorStatement;
  demo: boolean;
}

function readPortalToken() {
  if (typeof window === 'undefined') return '';
  return (new URLSearchParams(window.location.search).get('t') || '').trim();
}

export function ContractorPortal({ slug }: { slug: string }) {
  const [portalToken] = useState(readPortalToken);
  const [accountName, setAccountName] = useState(() => {
    if (typeof window !== 'undefined') {
      const fromQuery = (new URLSearchParams(window.location.search).get('account') || '').trim();
      if (fromQuery) return fromQuery;
    }
    return 'Apex Roofing & Construction';
  });
  const [editingAccount, setEditingAccount] = useState(false);
  const [accountDraft, setAccountDraft] = useState(() => {
    if (typeof window !== 'undefined') {
      const fromQuery = (new URLSearchParams(window.location.search).get('account') || '').trim();
      if (fromQuery) return fromQuery;
    }
    return 'Apex Roofing & Construction';
  });
  const [activeTab, setActiveTab] = useState<'swaps' | 'order' | 'statement'>('swaps');

  const [data, setData] = useState<ContractorPortalResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; error?: boolean } | null>(null);

  // Per-job swap configuration state
  const [swapConfig, setSwapConfig] = useState<
    Record<
      string,
      {
        size_yards: number;
        dateMode: 'today' | 'tomorrow' | 'custom';
        customDate: string;
        notes: string;
        submitting?: boolean;
        swapped?: boolean;
      }
    >
  >({});

  // Quick New Site Drop state
  const [orderAddress, setOrderAddress] = useState('');
  const [orderZip, setOrderZip] = useState('78704');
  const [orderSize, setOrderSize] = useState<number>(20);
  const [orderDate, setOrderDate] = useState<string>(() => addDays(today(), 1));
  const [orderForeman, setOrderForeman] = useState('');
  const [orderPhone, setOrderPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [orderSubmitting, setOrderSubmitting] = useState(false);

  const showToast = useCallback((message: string, error = false) => {
    setToast({ message, error });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  }, []);

  const loadPortal = useCallback(
    async (acct: string) => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/contractor/${encodeURIComponent(slug)}?account=${encodeURIComponent(acct)}${
            portalToken ? `&t=${encodeURIComponent(portalToken)}` : ''
          }`,
          { cache: 'no-store' },
        );
        const json = (await res.json()) as ContractorPortalResponse & { error?: string };
        if (!res.ok || json.error) {
          throw new Error(json.error || 'Failed to load contractor portal');
        }
        setData(json);
        if (json.pricing_rules?.length) {
          const defaultRule =
            json.pricing_rules.find((r) => r.size_yards === 20) || json.pricing_rules[0];
          if (defaultRule) setOrderSize(defaultRule.size_yards);
          if (defaultRule?.service_zips?.[0]) setOrderZip(defaultRule.service_zips[0]);
        }
      } catch (err) {
        showToast((err as Error).message || 'Could not load portal', true);
      } finally {
        setLoading(false);
      }
    },
    [slug, showToast, portalToken],
  );

  useEffect(() => {
    let cancelled = false;
    fetch(
      `/api/contractor/${encodeURIComponent(slug)}?account=${encodeURIComponent(accountName)}${
        portalToken ? `&t=${encodeURIComponent(portalToken)}` : ''
      }`,
      { cache: 'no-store' },
    )
      .then((res) => res.json().then((json) => ({ ok: res.ok, json })))
      .then(({ ok, json }: { ok: boolean; json: ContractorPortalResponse & { error?: string } }) => {
        if (cancelled) return;
        if (!ok || json.error) {
          throw new Error(json.error || 'Failed to load contractor portal');
        }
        setData(json);
        if (json.pricing_rules?.length) {
          const defaultRule =
            json.pricing_rules.find((r) => r.size_yards === 20) || json.pricing_rules[0];
          if (defaultRule) setOrderSize(defaultRule.size_yards);
          if (defaultRule?.service_zips?.[0]) setOrderZip(defaultRule.service_zips[0]);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          showToast((err as Error).message || 'Could not load portal', true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [accountName, slug, showToast, portalToken]);

  const currency = data?.organization?.pricing_config?.currency || 'USD';

  const activeJobs = useMemo(() => {
    if (!data) return [];
    return data.jobs.filter((j) =>
      ['delivered', 'dispatched', 'booked'].includes(j.status),
    );
  }, [data]);

  const getContainerLabel = (job: Job): string => {
    if (!data?.containers) return `BIN-${job.size_yards}YD`;
    const found = data.containers.find((c) => c.id === job.container_id);
    if (found) return found.label;
    return job.status === 'booked' ? 'Awaiting Assignment' : `GL-${job.size_yards}0`;
  };

  const getJobSwapConfig = (job: Job) => {
    return (
      swapConfig[job.id] ?? {
        size_yards: job.size_yards,
        dateMode: 'tomorrow' as const,
        customDate: addDays(today(), 1),
        notes: '',
      }
    );
  };

  const updateJobSwapConfig = (
    jobId: string,
     fallbackJob: Job,
    patch: Partial<{
      size_yards: number;
      dateMode: 'today' | 'tomorrow' | 'custom';
      customDate: string;
      notes: string;
      submitting: boolean;
      swapped: boolean;
    }>,
  ) => {
    setSwapConfig((prev) => {
      const current = prev[jobId] ?? {
        size_yards: fallbackJob.size_yards,
        dateMode: 'tomorrow' as const,
        customDate: addDays(today(), 1),
        notes: '',
      };
      return {
        ...prev,
        [jobId]: { ...current, ...patch },
      };
    });
  };

  const handleRequestSwap = async (job: Job) => {
    const cfg = getJobSwapConfig(job);
    const deliveryDate =
      cfg.dateMode === 'today'
        ? today()
        : cfg.dateMode === 'tomorrow'
          ? addDays(today(), 1)
          : cfg.customDate || addDays(today(), 1);

    updateJobSwapConfig(job.id, job, { submitting: true });
    try {
      const res = await fetch(`/api/contractor/${encodeURIComponent(slug)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'swap',
          t: portalToken || undefined,
          job_id: job.id,
          account_name: accountName,
          target_size: cfg.size_yards,
          delivery_date: deliveryDate,
          notes: cfg.notes.trim() || undefined,
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Swap request failed');
      }
      updateJobSwapConfig(job.id, job, { submitting: false, swapped: true, notes: '' });
      showToast(
        `1-Tap Swap Dispatched! Replacement ${cfg.size_yards} yd bin scheduled for ${dateLabel(deliveryDate)} (Billed to Net-30).`,
      );
      await loadPortal(accountName);
    } catch (err) {
      updateJobSwapConfig(job.id, job, { submitting: false });
      showToast((err as Error).message || 'Could not request swap', true);
    }
  };

  const handleQuickOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderAddress.trim()) {
      showToast('Enter the jobsite street address.', true);
      return;
    }
    setOrderSubmitting(true);
    try {
      const res = await fetch(`/api/contractor/${encodeURIComponent(slug)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'order',
          t: portalToken || undefined,
          account_name: accountName,
          customer_name: orderForeman.trim() || accountName,
          customer_phone: orderPhone.trim() || '+15125550199',
          delivery_address: orderAddress.trim(),
          zip: orderZip.trim(),
          size_yards: orderSize,
          delivery_date: orderDate,
          notes: orderNotes.trim(),
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Order failed');
      }
      showToast(
        `New ${orderSize} yd site drop booked for ${dateLabel(orderDate)}! Added to your Net-30 statement.`,
      );
      setOrderAddress('');
      setOrderNotes('');
      await loadPortal(accountName);
      setActiveTab('swaps');
    } catch (err) {
      showToast((err as Error).message || 'Failed to place commercial order', true);
    } finally {
      setOrderSubmitting(false);
    }
  };

  const applyAccountSwitch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = accountDraft.trim() || 'Apex Roofing & Construction';
    setAccountName(cleaned);
    setEditingAccount(false);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('account', cleaned);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const statement = data?.statement;
  const selectedRule =
    data?.pricing_rules?.find((r) => r.size_yards === orderSize) ||
    data?.pricing_rules?.[0];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f4f7f4',
        color: '#0f172a',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        paddingBottom: '64px',
      }}
    >
      {/* Top VIP Header */}
      <header
        style={{
          background: 'linear-gradient(135deg, #111f16 0%, #193022 100%)',
          color: '#ffffff',
          padding: '20px 16px',
          borderBottom: '1px solid #264531',
        }}
      >
        <div
          style={{
            maxWidth: '980px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(214,239,124,0.16)',
                color: '#d6ef7c',
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '999px',
                letterSpacing: '0.04em',
                marginBottom: '8px',
              }}
            >
              <Sparkles size={13} />
              VIP COMMERCIAL TRADE PORTAL · NET-30 ACCOUNT
            </div>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#ffffff' }}>
              {data?.organization?.name || 'Greenline Hauling'} · 1-Tap Jobsite Dispatch
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#bbf7d0' }}>
              Zero credit card entry · Instant 1-tap dump &amp; return swaps · Consolidated monthly Net-30 statement
            </p>
          </div>

          {/* Contractor Company Switcher */}
          <div
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.16)',
              borderRadius: '12px',
              padding: '10px 14px',
              minWidth: '260px',
            }}
          >
            <div
              style={{
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#86efac',
                fontWeight: 700,
                marginBottom: '4px',
              }}
            >
              Active Trade Account
            </div>
            {editingAccount ? (
              <form onSubmit={applyAccountSwitch} style={{ display: 'flex', gap: '6px' }}>
                <input
                  value={accountDraft}
                  onChange={(e) => setAccountDraft(e.target.value)}
                  placeholder="Contractor company name"
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px solid #4ade80',
                    background: '#0c1710',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: '#d6ef7c',
                    color: '#111f16',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Save
                </button>
              </form>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={16} color="#d6ef7c" />
                  <span style={{ fontWeight: 700, fontSize: '14px', color: '#ffffff' }}>
                    {accountName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAccountDraft(accountName);
                    setEditingAccount(true);
                  }}
                  style={{
                    background: 'transparent',
                    color: '#bbf7d0',
                    border: '1px solid rgba(187,247,208,0.35)',
                    borderRadius: '6px',
                    padding: '3px 8px',
                    fontSize: '11px',
                    cursor: 'pointer',
                  }}
                >
                  Switch
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '980px', margin: '0 auto', padding: '20px 16px' }}>
        {toast && (
          <div
            role="status"
            style={{
              marginBottom: '16px',
              padding: '12px 16px',
              borderRadius: '10px',
              background: toast.error ? '#fef2f2' : '#ecfdf5',
              border: `1px solid ${toast.error ? '#fecaca' : '#6ee7b7'}`,
              color: toast.error ? '#991b1b' : '#065f46',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle2 size={16} />
            <span>{toast.message}</span>
          </div>
        )}

        {/* Quick KPI Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #dce4d6',
              borderRadius: '12px',
              padding: '14px 16px',
            }}
          >
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
              ACTIVE CANS ON SITE
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#14532d', marginTop: '2px' }}>
              {activeJobs.length} Bins
            </div>
            <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '2px' }}>
              Ready for 1-tap dump &amp; return
            </div>
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #dce4d6',
              borderRadius: '12px',
              padding: '14px 16px',
            }}
          >
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
              MONTHLY SWAPS &amp; DROPS
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
              {statement?.jobs_count ?? 0} Hauls ({statement?.swap_count ?? 0} Swaps)
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              {statement?.billing_period || 'Current Net-30 Billing Cycle'}
            </div>
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #dce4d6',
              borderRadius: '12px',
              padding: '14px 16px',
            }}
          >
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
              CONSOLIDATED NET-30 BALANCE
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#ea580c', marginTop: '2px' }}>
              {money(statement?.total_due_cents ?? 0, currency)}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              1 single monthly invoice · Zero per-bin card charges
            </div>
          </div>
        </div>

        {/* 3 Navigation Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '8px',
            marginBottom: '20px',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('swaps')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '13px 16px',
              borderRadius: '10px',
              border: activeTab === 'swaps' ? '2px solid #166534' : '1px solid #cbd5e1',
              background: activeTab === 'swaps' ? '#166534' : '#ffffff',
              color: activeTab === 'swaps' ? '#ffffff' : '#1e293b',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={15} />
            1. 1-Tap Jobsite Swaps ({activeJobs.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('order')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '13px 16px',
              borderRadius: '10px',
              border: activeTab === 'order' ? '2px solid #ea580c' : '1px solid #cbd5e1',
              background: activeTab === 'order' ? '#ea580c' : '#ffffff',
              color: activeTab === 'order' ? '#ffffff' : '#1e293b',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            <PlusCircle size={15} />
            2. Quick New Site Drop (No Card)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('statement')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '13px 16px',
              borderRadius: '10px',
              border: activeTab === 'statement' ? '2px solid #1e40af' : '1px solid #cbd5e1',
              background: activeTab === 'statement' ? '#1e40af' : '#ffffff',
              color: activeTab === 'statement' ? '#ffffff' : '#1e293b',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            <FileText size={15} />
            3. Consolidated Net-30 Statement
          </button>
        </div>

        {loading && !data ? (
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '48px',
              textAlign: 'center',
              color: '#64748b',
            }}
          >
            Loading active jobsite containers &amp; Net-30 trade statement...
          </div>
        ) : null}

        {/* TAB 1: 1-Tap Jobsite Swaps (Active Bins) */}
        {activeTab === 'swaps' && data && (
          <section style={{ display: 'grid', gap: '16px' }}>
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #dce4d6',
                borderRadius: '12px',
                padding: '16px 20px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
                  Active Containers on Your Jobsites
                </h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                  Foremen can trigger a <strong>Dump &amp; Return Swap</strong> in 1 tap. Driver picks up the full can and drops an empty bin in the exact same spot.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('order')}
                style={{
                  background: '#f0fdf4',
                  color: '#166534',
                  border: '1px solid #bbf7d0',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <PlusCircle size={14} /> Drop Bin at New Jobsite
              </button>
            </div>

            {activeJobs.length === 0 ? (
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '32px',
                  textAlign: 'center',
                }}
              >
                <p style={{ margin: '0 0 12px 0', color: '#475569', fontSize: '14px' }}>
                  No active bins currently on site for {accountName}.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('order')}
                  style={{
                    background: '#ea580c',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Order a New Site Drop (Net-30)
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '16px',
                }}
              >
                {activeJobs.map((job) => {
                  const cfg = getJobSwapConfig(job);
                  const canSwap = ['delivered', 'dispatched'].includes(job.status);
                  const containerLabel = getContainerLabel(job);

                  return (
                    <div
                      key={job.id}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #d8e2d5',
                        borderRadius: '14px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '14px',
                        boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
                      }}
                    >
                      <div>
                        {/* Header badges */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '8px',
                            marginBottom: '10px',
                          }}
                        >
                          <span
                            style={{
                              background: '#166534',
                              color: '#ffffff',
                              fontSize: '12px',
                              fontWeight: 800,
                              padding: '4px 10px',
                              borderRadius: '6px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <Truck size={13} />
                            {containerLabel} · {job.size_yards} YD
                          </span>

                          <span
                            style={{
                              background:
                                job.status === 'delivered'
                                  ? '#dcfce7'
                                  : job.status === 'dispatched'
                                    ? '#dbeafe'
                                    : '#fef3c7',
                              color:
                                job.status === 'delivered'
                                  ? '#166534'
                                  : job.status === 'dispatched'
                                    ? '#1e40af'
                                    : '#92400e',
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '3px 8px',
                              borderRadius: '999px',
                            }}
                          >
                            {statusLabels[job.status]}
                          </span>
                        </div>

                        {/* Address & dates */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            marginBottom: '8px',
                          }}
                        >
                          <MapPin size={16} color="#16a34a" style={{ marginTop: '2px', flexShrink: 0 }} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>
                              {job.delivery_address}
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>
                              ZIP {job.zip} · Dropped {dateLabel(job.delivery_date)} · Scheduled Pickup{' '}
                              {dateLabel(job.pickup_date)}
                            </div>
                          </div>
                        </div>

                        {job.notes && (
                          <div
                            style={{
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              padding: '8px 10px',
                              fontSize: '11px',
                              color: '#475569',
                              marginBottom: '10px',
                            }}
                          >
                            <strong>Site Note:</strong> {job.notes}
                          </div>
                        )}
                      </div>

                      {/* 1-Tap Dump & Return Swap Controls */}
                      {canSwap ? (
                        <div
                          style={{
                            background: '#f8faf6',
                            border: '1px solid #dce4d6',
                            borderRadius: '10px',
                            padding: '12px',
                            display: 'grid',
                            gap: '10px',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '11px',
                              fontWeight: 800,
                              color: '#166534',
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <RefreshCw size={12} />
                            Dump &amp; Return Swap Options
                          </div>

                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr',
                              gap: '8px',
                            }}
                          >
                            <label style={{ fontSize: '11px', fontWeight: 600, color: '#334155' }}>
                              Replacement Size
                              <select
                                value={cfg.size_yards}
                                onChange={(e) =>
                                  updateJobSwapConfig(job.id, job, {
                                    size_yards: Number(e.target.value),
                                  })
                                }
                                style={{
                                  width: '100%',
                                  marginTop: '4px',
                                  padding: '7px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid #cbd5e1',
                                  background: '#ffffff',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                }}
                              >
                                {(data.pricing_rules || []).map((r) => (
                                  <option key={r.size_yards} value={r.size_yards}>
                                    {r.size_yards} Yard ({money(r.base_price_cents, currency)})
                                  </option>
                                ))}
                              </select>
                            </label>

                            <label style={{ fontSize: '11px', fontWeight: 600, color: '#334155' }}>
                              Swap Date
                              <select
                                value={cfg.dateMode}
                                onChange={(e) =>
                                  updateJobSwapConfig(job.id, job, {
                                    dateMode: e.target.value as 'today' | 'tomorrow' | 'custom',
                                  })
                                }
                                style={{
                                  width: '100%',
                                  marginTop: '4px',
                                  padding: '7px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid #cbd5e1',
                                  background: '#ffffff',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                }}
                              >
                                <option value="today">Today ({dateLabel(today())})</option>
                                <option value="tomorrow">
                                  Tomorrow ({dateLabel(addDays(today(), 1))})
                                </option>
                                <option value="custom">Pick Date...</option>
                              </select>
                            </label>
                          </div>

                          {cfg.dateMode === 'custom' && (
                            <input
                              type="date"
                              min={today()}
                              value={cfg.customDate}
                              onChange={(e) =>
                                updateJobSwapConfig(job.id, job, { customDate: e.target.value })
                              }
                              style={{
                                width: '100%',
                                padding: '7px 8px',
                                borderRadius: '6px',
                                border: '1px solid #cbd5e1',
                                fontSize: '12px',
                              }}
                            />
                          )}

                          <input
                            type="text"
                            placeholder="Optional foreman note (e.g. Gate code 4412, drop by garage)"
                            value={cfg.notes}
                            onChange={(e) =>
                              updateJobSwapConfig(job.id, job, { notes: e.target.value })
                            }
                            style={{
                              width: '100%',
                              padding: '7px 10px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              fontSize: '12px',
                              background: '#ffffff',
                            }}
                          />

                          <button
                            type="button"
                            disabled={cfg.submitting}
                            onClick={() => handleRequestSwap(job)}
                            style={{
                              width: '100%',
                              padding: '11px 14px',
                              borderRadius: '8px',
                              border: 'none',
                              background: '#ea580c',
                              color: '#ffffff',
                              fontWeight: 800,
                              fontSize: '13px',
                              cursor: cfg.submitting ? 'wait' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                            }}
                          >
                            {cfg.submitting ? (
                              <Loader2 size={15} className="spin" />
                            ) : (
                              <RefreshCw size={15} />
                            )}
                            Request 1-Tap Swap (Net-30)
                          </button>
                        </div>
                      ) : (
                        <div
                          style={{
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '10px 12px',
                            fontSize: '12px',
                            color: '#475569',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span>Scheduled for drop on {dateLabel(job.delivery_date)}</span>
                          <span style={{ color: '#166534', fontWeight: 700 }}>Billed Net-30</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* TAB 2: Quick New Site Drop (No Card Required) */}
        {activeTab === 'order' && data && (
          <section
            style={{
              background: '#ffffff',
              border: '1px solid #dce4d6',
              borderRadius: '14px',
              padding: '24px',
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#ecfdf5',
                color: '#065f46',
                border: '1px solid #a7f3d0',
                padding: '5px 12px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 700,
                marginBottom: '12px',
              }}
            >
              <ShieldCheck size={15} />
              Billed to Consolidated Monthly Net-30 Trade Statement — No Credit Card Entry Required
            </div>

            <h2 style={{ margin: '0 0 6px 0', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
              30-Second Commercial Jobsite Drop
            </h2>
            <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#64748b' }}>
              Dispatch a roll-off container to a new jobsite under <strong>{accountName}</strong>. Priority commercial routing is automatically applied.
            </p>

            <form onSubmit={handleQuickOrder} style={{ display: 'grid', gap: '16px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr',
                  gap: '12px',
                }}
              >
                <label style={{ display: 'grid', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
                  Jobsite Street Address *
                  <input
                    required
                    value={orderAddress}
                    onChange={(e) => setOrderAddress(e.target.value)}
                    placeholder="e.g. 4810 Burnet Rd, Austin, TX"
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                    }}
                  />
                </label>

                <label style={{ display: 'grid', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
                  Jobsite ZIP / Postal *
                  <input
                    required
                    value={orderZip}
                    onChange={(e) => setOrderZip(e.target.value)}
                    placeholder="78704"
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                    }}
                  />
                </label>
              </div>

              {/* Container Size Selector */}
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
                  Select Roll-Off Container Size *
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))',
                    gap: '10px',
                  }}
                >
                  {(data.pricing_rules || []).map((rule) => {
                    const selected = orderSize === rule.size_yards;
                    return (
                      <button
                        key={rule.size_yards}
                        type="button"
                        onClick={() => setOrderSize(rule.size_yards)}
                        style={{
                          padding: '12px',
                          borderRadius: '10px',
                          border: selected ? '2px solid #166534' : '1px solid #cbd5e1',
                          background: selected ? '#f0fdf4' : '#ffffff',
                          textAlign: 'left',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ fontWeight: 800, fontSize: '16px', color: '#0f172a' }}>
                          {rule.size_yards} Yard
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: '#166534' }}>
                          {money(rule.base_price_cents, currency)}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                          Incl. {rule.included_tons} tons · {rule.included_days} days
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '12px',
                }}
              >
                <label style={{ display: 'grid', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <Calendar size={14} /> Delivery Date *
                  </span>
                  <input
                    type="date"
                    required
                    min={today()}
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                    }}
                  />
                </label>

                <label style={{ display: 'grid', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
                  Foreman / Site Contact
                  <input
                    value={orderForeman}
                    onChange={(e) => setOrderForeman(e.target.value)}
                    placeholder={accountName}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                    }}
                  />
                </label>

                <label style={{ display: 'grid', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <Phone size={14} /> Foreman Cell (SMS Alerts)
                  </span>
                  <input
                    value={orderPhone}
                    onChange={(e) => setOrderPhone(e.target.value)}
                    placeholder="(512) 555-0199"
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                    }}
                  />
                </label>
              </div>

              <label style={{ display: 'grid', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
                Placement &amp; Gate Instructions
                <textarea
                  rows={2}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g. Drop on left side of driveway, gate code #1942, watch overhead power line"
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                  }}
                />
              </label>

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                }}
              >
                <div style={{ fontSize: '12px', color: '#334155' }}>
                  <div>
                    <strong>Trade Account:</strong> {accountName} (Net-30 Approved)
                  </div>
                  <div>
                    <strong>Rate:</strong>{' '}
                    {selectedRule ? money(selectedRule.base_price_cents, currency) : '$425'} base ·{' '}
                    {selectedRule?.included_tons ?? 2} tons included
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={orderSubmitting}
                  style={{
                    background: '#166534',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 20px',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: orderSubmitting ? 'wait' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  {orderSubmitting ? <Loader2 size={16} className="spin" /> : null}
                  Dispatch Site Drop (Net-30) <ArrowRight size={15} />
                </button>
              </div>
            </form>
          </section>
        )}

        {/* TAB 3: Consolidated Monthly Net-30 Statement */}
        {activeTab === 'statement' && data && statement && (
          <section
            style={{
              background: '#ffffff',
              border: '1px solid #dce4d6',
              borderRadius: '14px',
              padding: '24px',
              display: 'grid',
              gap: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '16px',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '16px',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    marginBottom: '6px',
                  }}
                >
                  <Scale size={13} />
                  SOLVES MICRO-TRANSACTION INVOICING FATIGUE
                </div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
                  Consolidated Monthly Net-30 Trade Statement
                </h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                  Account: <strong>{statement.account_name}</strong> · Billing Period:{' '}
                  <strong>{statement.billing_period}</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                style={{
                  background: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Printer size={15} />
                Print / Download Monthly Statement (PDF)
              </button>
            </div>

            {/* Summary Breakdown Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
              }}
            >
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '12px 14px',
                }}
              >
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                  BASE RENTALS &amp; SWAPS ({statement.jobs_count})
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                  {money(statement.base_rental_cents, currency)}
                </div>
              </div>

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '12px 14px',
                }}
              >
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                  1-TAP SWAPS EXECUTED
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#166534', marginTop: '4px' }}>
                  {statement.swap_count} Swaps
                </div>
              </div>

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '12px 14px',
                }}
              >
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                  CERTIFIED TONNAGE OVERAGES ({statement.overage_tons} T)
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#b45309', marginTop: '4px' }}>
                  {money(statement.overage_cents, currency)}
                </div>
              </div>

              <div
                style={{
                  background: '#f0fdf4',
                  border: '1px solid #86efac',
                  borderRadius: '10px',
                  padding: '12px 14px',
                }}
              >
                <div style={{ fontSize: '11px', color: '#166534', fontWeight: 700 }}>
                  SINGLE MONTHLY NET-30 TOTAL
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#14532d', marginTop: '4px' }}>
                  {money(statement.total_due_cents, currency)}
                </div>
              </div>
            </div>

            {/* Bookkeeper Line Items Table */}
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '12px',
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: '#f1f5f9',
                      color: '#334155',
                      textAlign: 'left',
                      borderBottom: '2px solid #cbd5e1',
                    }}
                  >
                    <th style={{ padding: '10px 12px' }}>Drop Date</th>
                    <th style={{ padding: '10px 12px' }}>Jobsite Address</th>
                    <th style={{ padding: '10px 12px' }}>Bin / Type</th>
                    <th style={{ padding: '10px 12px' }}>Landfill Scale Weight</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Base Haul</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Tonnage Overage</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {statement.line_items.map((item: ContractorStatementLineItem) => (
                    <tr
                      key={item.job_id}
                      style={{
                        borderBottom: '1px solid #e2e8f0',
                      }}
                    >
                      <td style={{ padding: '10px 12px', whiteSpace: 'nowrap', fontWeight: 600 }}>
                        {dateLabel(item.delivery_date)}
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>
                          {item.delivery_address}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          Ref #{item.job_id.slice(0, 8)} · {item.status}
                        </div>
                      </td>
                      <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                        <span style={{ fontWeight: 700 }}>{item.size_yards} YD</span>{' '}
                        {item.container_label ? `(${item.container_label})` : ''}
                        {item.is_swap && (
                          <span
                            style={{
                              marginLeft: '6px',
                              background: '#ffedd5',
                              color: '#c2410c',
                              fontSize: '10px',
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: '4px',
                            }}
                          >
                            1-TAP SWAP
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        {item.tons_actual !== null ? (
                          <span>
                            <strong>{item.tons_actual}t</strong> actual / {item.tons_included}t incl.
                            {item.extra_tons > 0 ? (
                              <span style={{ color: '#b45309', fontWeight: 700 }}>
                                {' '}
                                (+{item.extra_tons}t over)
                              </span>
                            ) : null}
                          </span>
                        ) : (
                          <span style={{ color: '#64748b' }}>
                            {item.tons_included}t incl. (Scale pending)
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>
                        {money(item.base_cents, currency)}
                      </td>
                      <td
                        style={{
                          padding: '10px 12px',
                          textAlign: 'right',
                          color: item.overage_cents > 0 ? '#b45309' : '#64748b',
                          fontWeight: item.overage_cents > 0 ? 700 : 400,
                        }}
                      >
                        {item.overage_cents > 0 ? money(item.overage_cents, currency) : '—'}
                      </td>
                      <td
                        style={{
                          padding: '10px 12px',
                          textAlign: 'right',
                          fontWeight: 800,
                          color: '#0f172a',
                        }}
                      >
                        {money(item.total_cents, currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: '#f8fafc', fontWeight: 800, fontSize: '13px' }}>
                    <td colSpan={4} style={{ padding: '12px', textAlign: 'right' }}>
                      Consolidated Monthly Net-30 Total Due:
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      {money(statement.base_rental_cents, currency)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', color: '#b45309' }}>
                      {money(statement.overage_cents, currency)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', color: '#166534' }}>
                      {money(statement.total_due_cents, currency)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
