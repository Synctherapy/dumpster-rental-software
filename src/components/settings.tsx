'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Copy,
  CreditCard,
  ExternalLink,
  Globe,
  Loader2,
  Save,
  Truck,
  UserRound,
} from 'lucide-react';
import { Button } from './ui/button';
import { api } from '@/lib/client';
import type { Workspace, PricingRule } from '@/lib/types';
export function Settings({
  data,
  reload,
  notify,
}: {
  data: Workspace;
  reload: () => Promise<void>;
  notify: (message: string, error?: boolean) => void;
}) {
  const [name, setName] = useState(data.organization.name);
  const [slug, setSlug] = useState(data.organization.slug);
  const [phone, setPhone] = useState(data.organization.phone);
  const [currency, setCurrency] = useState(
    data.organization.currency || data.organization.pricing_config?.currency || 'usd',
  );
  const [customerFeeEnabled, setCustomerFeeEnabled] = useState(
    data.organization.pricing_config?.customer_fee_enabled !== false,
  );
  const [googleReviewUrl, setGoogleReviewUrl] = useState(
    data.organization.google_review_url || data.organization.pricing_config?.google_review_url || '',
  );
  const [minNoticeHours, setMinNoticeHours] = useState<number>(
    data.organization.min_notice_hours ?? data.organization.pricing_config?.min_notice_hours ?? 24,
  );
  const [prohibitedItems, setProhibitedItems] = useState<string[]>(
    data.organization.prohibited_items ??
      data.organization.pricing_config?.prohibited_items ?? [
        'Tires & automotive batteries',
        'Wet paint, oils & hazardous chemicals',
        'Refrigerators, AC units & Freon appliances',
        'Mattresses & box springs',
        'Asbestos & medical waste',
      ],
  );
  const [newProhibitedItem, setNewProhibitedItem] = useState('');
  const [operatingDays, setOperatingDays] = useState<number[]>(
    data.organization.operating_days ??
      data.organization.pricing_config?.operating_days ?? [1, 2, 3, 4, 5, 6], // default Mon-Sat
  );
  const [taxRatePercent, setTaxRatePercent] = useState<number>(
    data.organization.tax_rate_percent ?? data.organization.pricing_config?.tax_rate_percent ?? 0,
  );
  const [rules, setRules] = useState(data.pricing_rules);
  const [zips, setZips] = useState(data.pricing_rules[0]?.service_zips.join(', ') ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const edit = (size: number, field: keyof PricingRule, value: number) =>
    setRules(rules.map((r) => (r.size_yards === size ? { ...r, [field]: value } : r)));
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/api/settings', {
        method: 'POST',
        body: JSON.stringify({
          name,
          slug,
          phone,
          currency,
          deposit_percent: 100,
          customer_fee_enabled: customerFeeEnabled,
          google_review_url: googleReviewUrl,
          min_notice_hours: minNoticeHours,
          prohibited_items: prohibitedItems,
          operating_days: operatingDays,
          tax_rate_percent: taxRatePercent,
          pricing_rules: rules.map(
            ({
              size_yards,
              base_price_cents,
              included_days,
              extra_day_cents,
              included_tons,
              overage_per_ton_cents,
            }) => ({
              size_yards,
              base_price_cents,
              included_days,
              extra_day_cents,
              included_tons,
              overage_per_ton_cents,
              service_zips: zips.split(/[\s,]+/).filter(Boolean),
            }),
          ),
        }),
      });
      await reload();
      notify('Business settings and pricing saved.');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const copy = async (embed = false) => {
    try {
      const url = `${window.location.origin}/${embed ? 'embed' : 'book'}/${data.organization.slug}`;
      await navigator.clipboard.writeText(
        embed
          ? `<iframe src="${url}" title="Book a dumpster" width="100%" height="1000" style="border:0;border-radius:12px"></iframe>`
          : url,
      );
      notify(embed ? 'Embed snippet copied.' : 'Booking link copied.');
    } catch {
      notify('Clipboard is unavailable. Copy the link from the box below.', true);
    }
  };
  const copyCalendar = async () => {
    try {
      const token = data.organization.calendar_token || data.organization.id;
      const url = `${window.location.origin}/api/calendar?token=${token}`;
      await navigator.clipboard.writeText(url);
      notify('Calendar feed URL copied to clipboard.');
    } catch {
      notify('Clipboard is unavailable.', true);
    }
  };
  const connect = async () => {
    setBusy(true);
    try {
      const { url } = await api<{ url: string }>('/api/connect', { method: 'POST', body: '{}' });
      window.location.assign(url);
    } catch (e) {
      notify((e as Error).message, true);
      setBusy(false);
    }
  };
  return (
    <div className="settings-grid">
      <form onSubmit={save}>
        <section className="panel">
          <div className="panel-heading">
            <h3>Your business, your way.</h3>
            <span className="pill">Business settings</span>
          </div>
          <div className="settings-body">
            <div className="form-row">
              <label className="field">
                Business name
                <input
                  required
                  minLength={2}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="field">
                Business phone
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </label>
            </div>
            <div className="form-row">
              <label className="field">
                Booking URL slug
                <input
                  required
                  pattern="[a-z0-9]+(-[a-z0-9]+)*"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
                <small>/book/{slug}</small>
              </label>
              <label className="field">
                Collected at booking
                <input type="number" value={100} readOnly />
                <small>The full base rental is collected. Extra days and tonnage are billed after pickup.</small>
              </label>
            </div>
            <div
              style={{
                padding: '14px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border, #e2e8f0)',
                background: 'var(--panel, #fff)',
                marginBottom: '16px',
              }}
            >
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: data.organization.subscription_status === 'active' ? 'pointer' : 'not-allowed', fontWeight: 600, fontSize: '14px' }}>
                <input
                  type="checkbox"
                  checked={customerFeeEnabled}
                  disabled={data.organization.subscription_status !== 'active'}
                  onChange={(e) => {
                    if (data.organization.subscription_status !== 'active' && !e.target.checked) {
                      notify('Upgrading to a paid plan is required to remove the $11.95 customer fee.', true);
                      return;
                    }
                    setCustomerFeeEnabled(e.target.checked);
                  }}
                />
                Pass $11.95 Online Reservation Fee to customer at checkout
                {data.organization.subscription_status !== 'active' && (
                  <span style={{ fontSize: '11px', background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                    Paid Plan Required to Disable
                  </span>
                )}
              </label>
              <p style={{ margin: '4px 0 0 24px', fontSize: '13px', color: 'var(--muted, #666)' }}>
                {data.organization.subscription_status === 'active'
                  ? 'On your paid plan, you can disable this fee if you prefer absorbing customer checkout charges or keeping prices flat.'
                  : 'On the free plan, the $11.95 reservation fee covers your hosting, booking engine, and driver links. Upgrade to a paid plan to remove this fee.'}
              </p>
            </div>
            <div className="form-row">
              <label className="field">
                Google Business Review Link
                <input
                  type="url"
                  value={googleReviewUrl}
                  onChange={(e) => setGoogleReviewUrl(e.target.value)}
                  placeholder="https://g.page/r/your-business/review"
                />
                <small>
                  Automatically texted to customers upon container pickup to boost your 5-star ratings.
                </small>
              </label>
              <label className="field">
                Minimum Online Booking Advance Notice
                <select
                  value={minNoticeHours}
                  onChange={(e) => setMinNoticeHours(Number(e.target.value))}
                >
                  <option value={12}>12 hours</option>
                  <option value={24}>24 hours (Recommended · 1 business day)</option>
                  <option value={48}>48 hours (2 business days)</option>
                  <option value={72}>72 hours (3 business days)</option>
                </select>
                <small>
                  Prevents customers from booking bins overnight with zero warning. Emergency requests must call.
                </small>
              </label>
              <label className="field">
                Billing Currency
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="usd">USD ($) · United States Dollar</option>
                  <option value="cad">CAD ($) · Canadian Dollar</option>
                </select>
                <small>
                  Sets your customer checkout currency and Stripe Connect payout denomination.
                </small>
              </label>
              <label className="field">
                Sales Tax Rate (%)
                <input
                  type="number"
                  min="0"
                  max="30"
                  step="0.01"
                  value={taxRatePercent}
                  onChange={(e) => setTaxRatePercent(Number(e.target.value))}
                  placeholder="e.g. 8.25"
                />
                <small>
                  Calculated automatically on base rentals and addons. Set 0 if prices include tax.
                </small>
              </label>
            </div>
            <div className="form-row">
              <div className="field">
                <span style={{ fontWeight: 600, fontSize: '13px' }}>Allowed Delivery Days</span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {[
                    { label: 'Sun', day: 0 },
                    { label: 'Mon', day: 1 },
                    { label: 'Tue', day: 2 },
                    { label: 'Wed', day: 3 },
                    { label: 'Thu', day: 4 },
                    { label: 'Fri', day: 5 },
                    { label: 'Sat', day: 6 },
                  ].map(({ label, day }) => {
                    const checked = operatingDays.includes(day);
                    return (
                      <label
                        key={day}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: checked ? '1px solid #166534' : '1px solid var(--border, #cbd5e1)',
                          background: checked ? '#f0fdf4' : '#fff',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: checked ? 600 : 400,
                          color: checked ? '#166534' : '#64748b',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setOperatingDays([...operatingDays, day].sort());
                            } else {
                              if (operatingDays.length <= 1) {
                                notify('You must allow at least one delivery day.', true);
                                return;
                              }
                              setOperatingDays(operatingDays.filter((d) => d !== day));
                            }
                          }}
                        />
                        {label}
                      </label>
                    );
                  })}
                </div>
                <small>Unchecked days will be blocked from customer delivery selection on the booking calendar.</small>
              </div>
            </div>

            {/* Prohibited Items Manager */}
            <div
              style={{
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid var(--border, #e2e8f0)',
                background: 'var(--panel, #fff)',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>Prohibited Materials & Landfill Rules</h4>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Displayed & signed at checkout</span>
              </div>
              <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#64748b' }}>
                Customers must review and agree to these prohibited items before paying. This protects your business against landfill surcharges and hazardous waste fines.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                {prohibitedItems.map((item, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      color: '#991b1b',
                      padding: '4px 10px',
                      borderRadius: '16px',
                      fontSize: '12px',
                    }}
                  >
                    🚫 {item}
                    <button
                      type="button"
                      onClick={() => setProhibitedItems(prohibitedItems.filter((_, i) => i !== idx))}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#991b1b',
                        cursor: 'pointer',
                        padding: '0 2px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        lineHeight: 1,
                      }}
                      title="Remove item"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Add item (e.g. Dirt / Concrete, Propane tanks, Paint cans)..."
                  value={newProhibitedItem}
                  onChange={(e) => setNewProhibitedItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (newProhibitedItem.trim()) {
                        setProhibitedItems([...prohibitedItems, newProhibitedItem.trim()]);
                        setNewProhibitedItem('');
                      }
                    }
                  }}
                  style={{ flex: 1, fontSize: '13px' }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (newProhibitedItem.trim()) {
                      setProhibitedItems([...prohibitedItems, newProhibitedItem.trim()]);
                      setNewProhibitedItem('');
                    }
                  }}
                >
                  Add Item
                </Button>
              </div>
            </div>

            <label className="field">
              Service ZIP / Postal codes
              <textarea
                required
                value={zips}
                onChange={(e) => setZips(e.target.value)}
                placeholder="78701, 78702, 78704 or V8W 1W4, V8W 2S8"
              />
              <small>Separate US 5-digit ZIP codes or Canadian 6-character postal codes with commas or spaces.</small>
            </label>
            <div>
              <h3 style={{ fontSize: 13, marginBottom: 15 }}>Pricing by dumpster size</h3>
              <div className="pricing-grid">
                {rules.map((r) => (
                  <section className="pricing-editor" key={r.size_yards}>
                    <h4>
                      <Truck size={14} />
                      {r.size_yards} yard dumpster
                    </h4>
                    <div className="form-row">
                      <label className="field">
                        Base price ($)
                        <input
                          type="number"
                          min="1"
                          step="0.01"
                          required
                          value={r.base_price_cents / 100}
                          onChange={(e) =>
                            edit(
                              r.size_yards,
                              'base_price_cents',
                              Math.round(Number(e.target.value) * 100),
                            )
                          }
                        />
                      </label>
                      <label className="field">
                        Included days
                        <input
                          type="number"
                          min="1"
                          max="90"
                          required
                          value={r.included_days}
                          onChange={(e) =>
                            edit(r.size_yards, 'included_days', Number(e.target.value))
                          }
                        />
                      </label>
                    </div>
                    <div className="form-row">
                      <label className="field">
                        Extra day ($)
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          required
                          value={r.extra_day_cents / 100}
                          onChange={(e) =>
                            edit(
                              r.size_yards,
                              'extra_day_cents',
                              Math.round(Number(e.target.value) * 100),
                            )
                          }
                        />
                      </label>
                      <label className="field">
                        Included tons
                        <input
                          type="number"
                          min="0"
                          max="50"
                          step="0.1"
                          required
                          value={r.included_tons}
                          onChange={(e) =>
                            edit(r.size_yards, 'included_tons', Number(e.target.value))
                          }
                        />
                      </label>
                    </div>
                    <label className="field">
                      Overage per ton ($)
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={r.overage_per_ton_cents / 100}
                        onChange={(e) =>
                          edit(
                            r.size_yards,
                            'overage_per_ton_cents',
                            Math.round(Number(e.target.value) * 100),
                          )
                        }
                      />
                    </label>
                  </section>
                ))}
              </div>
            </div>
            {error && (
              <div className="error-box" role="alert">
                {error}
              </div>
            )}
            <Button
              variant="primary"
              disabled={busy}
              type="submit"
              style={{ justifySelf: 'start' }}
            >
              {busy ? <Loader2 size={14} className="spin" /> : <Save size={14} />}Save business
              settings
            </Button>
          </div>
        </section>
      </form>
      <aside className="settings-side">
        <section className="panel">
          <div className="panel-heading">
            <h3>Let’s get you rolling.</h3>
            <span className="pill">Setup</span>
          </div>
          {[
            {
              icon: CheckCircle2,
              title: 'Make it yours',
              text: 'Set your company name, service area, and rental prices.',
            },
            {
              icon: Truck,
              title: 'Build your fleet',
              text: `${data.containers.length} containers in your inventory.`,
            },
            {
              icon: UserRound,
              title: 'Bring your crew',
              text: `${data.users.filter((u) => u.role === 'driver').length} drivers ready to be assigned.`,
            },
            {
              icon: CreditCard,
              title: 'Connect your payouts',
              text: data.demo
                ? 'Connect Supabase and Stripe test keys to verify payments.'
                : data.organization.stripe_connect_account_id
                  ? 'Stripe account linked. Finish Express onboarding to enable test charges.'
                  : 'Create your Stripe Express account to receive payments.',
            },
          ].map((s) => (
            <div className="setup-step" key={s.title}>
              <s.icon size={17} />
              <div>
                <h4>{s.title}</h4>
                <p>{s.text}</p>
              </div>
            </div>
          ))}
          <div style={{ padding: '0 21px 20px' }}>
            <Button onClick={() => void connect()} disabled={busy} style={{ width: '100%' }}>
              <CreditCard size={13} />
              {data.organization.stripe_connect_account_id
                ? 'Continue Stripe setup'
                : 'Connect Stripe (test)'}
              <ExternalLink size={11} />
            </Button>
            <Button
              style={{ width: '100%', marginTop: 8 }}
              disabled={busy || data.demo}
              onClick={async () => {
                setBusy(true);
                try {
                  const { url } = await api<{ url: string }>('/api/billing', { method: 'POST', body: '{}' });
                  window.location.assign(url);
                } catch (e) {
                  notify((e as Error).message, true);
                  setBusy(false);
                }
              }}
            >
              Start $49/month plan
            </Button>
          </div>
        </section>
        <section className="panel">
          <div className="panel-heading">
            <h3>Bookings, wherever you are.</h3>
            <Globe size={15} color="#96a380" />
          </div>
          <div className="settings-body" style={{ gap: 16 }}>
            <p style={{ fontSize: 11, color: '#91a080', lineHeight: 1.8 }}>
              Share your link. Put it in your bio. Add it to your website. Let customers book on
              their schedule.
            </p>
            <div className="code-snippet">/book/{data.organization.slug}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button onClick={() => void copy()}>
                <Copy size={12} />
                Copy link
              </Button>
              <Button asChild variant="primary">
                <Link href={`/book/${data.organization.slug}`} target="_blank">
                  Preview <ArrowRight size={12} />
                </Link>
              </Button>
            </div>
            <Button onClick={() => void copy(true)}>
              <Copy size={12} />
              Copy website embed
            </Button>
          </div>
        </section>
        <section className="panel">
          <div className="panel-heading">
            <h3>Calendar feed (iCal).</h3>
            <CalendarDays size={15} color="#96a380" />
          </div>
          <div className="settings-body" style={{ gap: 14 }}>
            <p style={{ fontSize: 11, color: '#91a080', lineHeight: 1.8 }}>
              Sync all deliveries and pickups directly with Apple Calendar, Google Calendar, or Outlook.
            </p>
            <div className="code-snippet" style={{ fontSize: 11, wordBreak: 'break-all' }}>
              /api/calendar?token={data.organization.calendar_token || data.organization.id}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button onClick={() => void copyCalendar()}>
                <Copy size={12} />
                Copy feed URL
              </Button>
              <Button
                asChild
                variant="primary"
              >
                <a
                  href={`webcal://${typeof window !== 'undefined' ? window.location.host : ''}/api/calendar?token=${data.organization.calendar_token || data.organization.id}`}
                >
                  Subscribe
                </a>
              </Button>
            </div>
          </div>
        </section>
        <section className="panel" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 12, marginBottom: 9 }}>Test mode, by design.</h3>
          <p style={{ fontSize: 11, color: '#909d86', lineHeight: 1.9 }}>
            Live charges stay disabled until webhook retry, failed payment, refund, and
            reconciliation tests are verified. Service credentials belong in environment settings.
          </p>
        </section>
      </aside>
    </div>
  );
}
