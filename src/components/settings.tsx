'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  ExternalLink,
  Globe,
  Loader2,
  Lock,
  Plus,
  Save,
  Trash2,
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
  const [showAddSizeModal, setShowAddSizeModal] = useState(false);
  const [newSizeYards, setNewSizeYards] = useState(15);
  const [newBasePrice, setNewBasePrice] = useState(375);
  const [newDays, setNewDays] = useState(7);
  const [newExtraDay, setNewExtraDay] = useState(20);
  const [newTons, setNewTons] = useState(2);
  const [newOverageTon, setNewOverageTon] = useState(85);
  const [zips, setZips] = useState(data.pricing_rules[0]?.service_zips.join(', ') ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const edit = (size: number, field: keyof PricingRule, value: number) =>
    setRules(rules.map((r) => (r.size_yards === size ? { ...r, [field]: value } : r)));

  const removeSize = (size: number) => {
    if (rules.length <= 1) {
      notify('You must keep at least 1 dumpster size in your pricing rules.', true);
      return;
    }
    setRules(rules.filter((r) => r.size_yards !== size));
    notify(`Removed ${size} yard dumpster.`);
  };

  const addCustomSize = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSizeYards < 1 || newSizeYards > 100) {
      notify('Size must be between 1 and 100 yards.', true);
      return;
    }
    if (rules.some((r) => r.size_yards === newSizeYards)) {
      notify(`A ${newSizeYards} yard dumpster already exists. Remove or edit the existing size.`, true);
      return;
    }
    if (rules.length >= 12) {
      notify('You can configure up to 12 custom dumpster sizes.', true);
      return;
    }
    const newRule: PricingRule = {
      id: `rule-${newSizeYards}`,
      org_id: data.organization.id,
      size_yards: newSizeYards,
      base_price_cents: Math.round(newBasePrice * 100),
      included_days: newDays,
      extra_day_cents: Math.round(newExtraDay * 100),
      included_tons: newTons,
      overage_per_ton_cents: Math.round(newOverageTon * 100),
      service_zips: rules[0]?.service_zips ?? [],
    };
    setRules([...rules, newRule].sort((a, b) => a.size_yards - b.size_yards));
    setShowAddSizeModal(false);
    notify(`Added ${newSizeYards} yard dumpster to pricing.`);
  };
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
      const token =
        data.organization.calendar_token ||
        (data.organization.pricing_config as { calendar_token?: string })?.calendar_token ||
        '';
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
                      notify('Upgrading to a Starter ($29/mo) or Growth ($149/mo) plan is required to disable this fee.', true);
                      return;
                    }
                    setCustomerFeeEnabled(e.target.checked);
                  }}
                />
                Pass $12 Online Reservation Fee to customer at checkout
                {data.organization.subscription_status !== 'active' && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', background: '#fef3c7', color: '#b45309', padding: '3px 8px', borderRadius: '12px', fontWeight: 600, border: '1px solid #fde68a' }}>
                    <Lock size={12} />
                    Paid Plan Required to Disable
                  </span>
                )}
              </label>
              <p style={{ margin: '6px 0 0 24px', fontSize: '13px', color: 'var(--muted, #666)', lineHeight: 1.5 }}>
                {data.organization.subscription_status === 'active'
                  ? 'On your paid plan, you can disable this fee if you prefer absorbing customer checkout charges or keeping prices flat.'
                  : 'On the free plan, the $12 reservation fee covers your hosting, booking engine, and driver links. Upgrading to Starter ($29/mo) or Growth ($149/mo) is required to disable this fee.'}
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
            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--line, #e2e8f0)' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: 16,
                  padding: '14px 18px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div>
                  <h3 style={{ fontSize: 16, margin: 0, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Truck size={18} style={{ color: '#166534' }} />
                    Dumpster Sizes & Custom Containers
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#64748b' }}>
                    Set rental rates, included days, and weight allowances. Supports any size from 1 to 100 yards.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="primary"
                  style={{
                    fontSize: 14,
                    padding: '8px 16px',
                    minHeight: 38,
                    background: '#166534',
                    color: '#ffffff',
                    fontWeight: 600,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  }}
                  onClick={() => setShowAddSizeModal(true)}
                  disabled={rules.length >= 12}
                >
                  <Plus size={16} style={{ marginRight: 6 }} />
                  + Add Custom Dumpster Size
                </Button>
              </div>

              {showAddSizeModal && (
                <div
                  style={{
                    padding: '20px',
                    borderRadius: '10px',
                    border: '2px solid #86efac',
                    background: '#f0fdf4',
                    marginBottom: '20px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Plus size={16} />
                        Add New Custom Dumpster Size
                      </h4>
                      <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#15803d' }}>
                        Pick a popular size preset below or type any custom yardage (1 to 100 yards).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddSizeModal(false)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#166534', fontWeight: 'bold' }}
                    >
                      ×
                    </button>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#166534', display: 'block', marginBottom: '6px' }}>
                      Quick Presets:
                    </span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {[6, 12, 14, 15, 16, 25, 30, 40].map((preset) => {
                        const alreadyExists = rules.some((r) => r.size_yards === preset);
                        return (
                          <button
                            key={preset}
                            type="button"
                            disabled={alreadyExists}
                            onClick={() => {
                              setNewSizeYards(preset);
                              if (preset === 6) {
                                setNewBasePrice(275);
                                setNewTons(1.0);
                              } else if (preset === 12) {
                                setNewBasePrice(375);
                                setNewTons(2.0);
                              } else if (preset === 14 || preset === 15 || preset === 16) {
                                setNewBasePrice(425);
                                setNewTons(2.5);
                              } else if (preset === 25) {
                                setNewBasePrice(525);
                                setNewTons(3.5);
                              }
                            }}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              border: alreadyExists ? '1px dashed #cbd5e1' : '1px solid #86efac',
                              background: newSizeYards === preset ? '#166534' : alreadyExists ? '#f1f5f9' : '#ffffff',
                              color: newSizeYards === preset ? '#ffffff' : alreadyExists ? '#94a3b8' : '#166534',
                              cursor: alreadyExists ? 'not-allowed' : 'pointer',
                              fontSize: '12px',
                              fontWeight: 600,
                            }}
                          >
                            {preset} Yard{alreadyExists ? ' (Active)' : ''}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="form-row">
                    <label className="field">
                      Size in yards (1-100)
                      <input
                        type="number"
                        min="1"
                        max="100"
                        required
                        value={newSizeYards}
                        onChange={(e) => setNewSizeYards(Math.max(1, Math.min(100, parseInt(e.target.value, 10) || 1)))}
                      />
                    </label>
                    <label className="field">
                      Base price ($)
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        required
                        value={newBasePrice}
                        onChange={(e) => setNewBasePrice(Number(e.target.value))}
                      />
                    </label>
                  </div>
                  <div className="form-row" style={{ marginTop: '10px' }}>
                    <label className="field">
                      Included days
                      <input
                        type="number"
                        min="1"
                        max="90"
                        required
                        value={newDays}
                        onChange={(e) => setNewDays(Math.max(1, Math.min(90, parseInt(e.target.value, 10) || 1)))}
                      />
                    </label>
                    <label className="field">
                      Extra day ($)
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={newExtraDay}
                        onChange={(e) => setNewExtraDay(Number(e.target.value))}
                      />
                    </label>
                  </div>
                  <div className="form-row" style={{ marginTop: '10px' }}>
                    <label className="field">
                      Included tons
                      <input
                        type="number"
                        min="0"
                        max="50"
                        step="0.1"
                        required
                        value={newTons}
                        onChange={(e) => setNewTons(Number(e.target.value))}
                      />
                    </label>
                    <label className="field">
                      Overage per ton ($)
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={newOverageTon}
                        onChange={(e) => setNewOverageTon(Number(e.target.value))}
                      />
                    </label>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '14px' }}>
                    <Button type="button" variant="ghost" onClick={() => setShowAddSizeModal(false)}>
                      Cancel
                    </Button>
                    <Button type="button" variant="primary" onClick={addCustomSize}>
                      Add {newSizeYards} Yard Dumpster
                    </Button>
                  </div>
                </div>
              )}

              <div className="pricing-grid">
                {rules.map((r) => (
                  <section className="pricing-editor" key={r.size_yards}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Truck size={14} />
                        {r.size_yards} yard dumpster
                      </h4>
                      {rules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSize(r.size_yards)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#dc2626',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            fontWeight: 500,
                            padding: '2px 6px',
                            borderRadius: '4px',
                          }}
                          title={`Remove ${r.size_yards} yard dumpster`}
                        >
                          <Trash2 size={12} />
                          Remove
                        </button>
                      )}
                    </div>
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
                {rules.length < 12 && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddSizeModal(true);
                      window.scrollTo({ top: 600, behavior: 'smooth' });
                    }}
                    style={{
                      border: '2px dashed #166534',
                      background: 'rgba(240, 253, 244, 0.7)',
                      borderRadius: '8px',
                      padding: '24px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      minHeight: '220px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: '#dcfce7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#166534',
                      }}
                    >
                      <Plus size={24} />
                    </div>
                    <strong style={{ fontSize: 15, color: '#166534' }}>+ Add Custom Dumpster Size</strong>
                    <span style={{ fontSize: 12, color: '#15803d', textAlign: 'center', maxWidth: 200, lineHeight: 1.4 }}>
                      Click to add 12, 15, 25, or any size (1 to 100 yards)
                    </span>
                  </button>
                )}
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
          </div>
        </section>
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Subscription & Plans</h3>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--muted, #64748b)' }}>
                Scale your dumpster operations with high-conversion fleet tools.
              </p>
            </div>
            {data.organization.subscription_status === 'active' ? (
              <span className="pill" style={{ color: '#15803d', background: '#dcfce7', fontWeight: 600 }}>
                <Check size={11} style={{ marginRight: 3 }} /> Active Plan
              </span>
            ) : (
              <span className="pill" style={{ color: '#854d0e', background: '#fef9c3' }}>
                Free Plan
              </span>
            )}
          </div>
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {data.demo && (
              <div
                style={{
                  padding: '12px 14px',
                  background: '#f8fafc',
                  border: '1px dashed #cbd5e1',
                  borderRadius: 8,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Demo Plan Switcher
                  </span>
                  <span style={{ fontSize: 11, color: '#64748b' }}>
                    Status: <strong style={{ color: data.organization.subscription_status === 'active' ? '#166534' : '#b45309' }}>{data.organization.subscription_status === 'active' ? 'Active' : 'Inactive (Free)'}</strong>
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <Button
                    type="button"
                    variant={data.organization.subscription_status !== 'active' ? 'primary' : 'ghost'}
                    disabled={busy}
                    style={{ fontSize: 12, padding: '6px 10px', minHeight: 30 }}
                    onClick={async () => {
                      setBusy(true);
                      try {
                        await api('/api/billing', {
                          method: 'POST',
                          body: JSON.stringify({ status: 'inactive' }),
                        });
                        await reload();
                        notify('Switched to Free Tier (Inactive).');
                      } catch (e) {
                        notify((e as Error).message, true);
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    Free Tier (Inactive)
                  </Button>
                  <Button
                    type="button"
                    variant={data.organization.subscription_status === 'active' ? 'primary' : 'ghost'}
                    disabled={busy}
                    style={{ fontSize: 12, padding: '6px 10px', minHeight: 30 }}
                    onClick={async () => {
                      setBusy(true);
                      try {
                        await api('/api/billing', {
                          method: 'POST',
                          body: JSON.stringify({ plan: 'starter', status: 'active' }),
                        });
                        await reload();
                        notify('Switched to Starter ($29/mo).');
                      } catch (e) {
                        notify((e as Error).message, true);
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    Starter ($29/mo)
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={busy}
                    style={{ fontSize: 12, padding: '6px 10px', minHeight: 30 }}
                    onClick={async () => {
                      setBusy(true);
                      try {
                        await api('/api/billing', {
                          method: 'POST',
                          body: JSON.stringify({ plan: 'growth', status: 'active' }),
                        });
                        await reload();
                        notify('Switched to Growth ($149/mo).');
                      } catch (e) {
                        notify((e as Error).message, true);
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    Growth ($149/mo)
                  </Button>
                </div>
              </div>
            )}
            {/* Starter Plan */}
            <div
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                padding: '16px',
                background: '#fafafa',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1e293b' }}>
                  Starter Plan
                </h4>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                  $29<span style={{ fontSize: 12, fontWeight: 500, color: '#64748b' }}>/mo</span>
                </div>
              </div>
              <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 10px' }}>
                Essential dispatch and payment flexibility for independent haulers.
              </p>
              <ul style={{ margin: '0 0 14px', paddingLeft: 18, fontSize: 12, color: '#334155', lineHeight: 1.8 }}>
                <li>Offline Cash/Check payments</li>
                <li>Calendar Sync</li>
                <li>0% Platform fee option</li>
              </ul>
              <Button
                style={{ width: '100%' }}
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    const { url } = await api<{ url: string }>('/api/billing', {
                      method: 'POST',
                      body: JSON.stringify({ plan: 'starter' }),
                    });
                    window.location.assign(url);
                  } catch (e) {
                    notify((e as Error).message, true);
                    setBusy(false);
                  }
                }}
              >
                {data.organization.subscription_status === 'active'
                  ? 'Switch to Starter ($29/mo)'
                  : 'Start Starter Plan ($29/mo)'}
              </Button>
            </div>

            {/* Growth Fleet Plan */}
            <div
              style={{
                border: '1px solid #a7f3d0',
                borderRadius: 10,
                padding: '16px',
                background: '#f0fdf4',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -10,
                  right: 14,
                  background: '#059669',
                  color: 'white',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Recommended for Fleets
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#064e3b' }}>
                  Growth Fleet Plan
                </h4>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#064e3b' }}>
                  $149<span style={{ fontSize: 12, fontWeight: 500, color: '#047857' }}>/mo</span>
                </div>
              </div>
              <p style={{ fontSize: 11, color: '#047857', margin: '0 0 10px' }}>
                Fleet plan. Same operating tools as Starter, for a larger operation.
              </p>
              <ul style={{ margin: '0 0 14px', paddingLeft: 18, fontSize: 12, color: '#065f46', lineHeight: 1.8 }}>
                <li>Everything in Starter</li>
                <li>Customer reservation fee can be turned off</li>
                <li>Priced for more than one truck</li>
                <li>No annual contract</li>
              </ul>
              <Button
                variant="primary"
                style={{ width: '100%' }}
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    const { url } = await api<{ url: string }>('/api/billing', {
                      method: 'POST',
                      body: JSON.stringify({ plan: 'growth' }),
                    });
                    window.location.assign(url);
                  } catch (e) {
                    notify((e as Error).message, true);
                    setBusy(false);
                  }
                }}
              >
                {data.organization.subscription_status === 'active'
                  ? 'Switch to Growth Fleet ($149/mo)'
                  : 'Start Growth Fleet Plan ($149/mo)'}
              </Button>
            </div>
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
              /api/calendar?token=
              {data.organization.calendar_token ||
                (data.organization.pricing_config as { calendar_token?: string })?.calendar_token ||
                ''}
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
                  href={`webcal://${typeof window !== 'undefined' ? window.location.host : ''}/api/calendar?token=${data.organization.calendar_token || (data.organization.pricing_config as { calendar_token?: string })?.calendar_token || ''}`}
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
