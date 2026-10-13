'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Globe,
  Loader2,
  MapPin,
  MessageSquare,
  Phone,
  Rocket,
  Sparkles,
  Truck,
  Zap,
} from 'lucide-react';
import { Modal } from './ui/dialog';
import { Button } from './ui/button';
import { api } from '@/lib/client';
import type { Workspace, PricingRule } from '@/lib/types';

interface OnboardingWizardProps {
  open: boolean;
  onClose: () => void;
  data: Workspace;
  reload: () => Promise<void>;
  notify: (message: string, error?: boolean) => void;
  initialStep?: 1 | 2 | 3;
}

export function OnboardingWizard({
  open,
  onClose,
  data,
  reload,
  notify,
  initialStep = 1,
}: OnboardingWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(initialStep);
  const [busy, setBusy] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Step 1: Business & Service Area
  const [name, setName] = useState(data.organization.name);
  const [slug, setSlug] = useState(data.organization.slug);
  const [phone, setPhone] = useState(data.organization.phone || '');
  const [zips, setZips] = useState(
    data.pricing_rules[0]?.service_zips?.length
      ? data.pricing_rules[0].service_zips.join(', ')
      : '78701, 78702, 78704, 78745'
  );

  // Step 2: Pricing rules
  const [rules, setRules] = useState<PricingRule[]>(
    data.pricing_rules.length
      ? data.pricing_rules
      : [
          {
            id: 'rule-10',
            org_id: data.organization.id,
            size_yards: 10,
            base_price_cents: 34500,
            included_days: 7,
            extra_day_cents: 1500,
            included_tons: 1,
            overage_per_ton_cents: 8500,
            service_zips: ['78701', '78702'],
          },
          {
            id: 'rule-15',
            org_id: data.organization.id,
            size_yards: 15,
            base_price_cents: 39500,
            included_days: 7,
            extra_day_cents: 2000,
            included_tons: 2,
            overage_per_ton_cents: 8500,
            service_zips: ['78701', '78702'],
          },
          {
            id: 'rule-20',
            org_id: data.organization.id,
            size_yards: 20,
            base_price_cents: 44500,
            included_days: 7,
            extra_day_cents: 2000,
            included_tons: 3,
            overage_per_ton_cents: 8500,
            service_zips: ['78701', '78702'],
          },
        ]
  );

  const [activeSocialTab, setActiveSocialTab] = useState<'facebook' | 'instagram' | 'google' | 'embed' | 'sms'>('facebook');

  const bookingUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/book/${slug}`
      : `https://roll-os.com/book/${slug}`;

  const embedSnippet = `<iframe src="${bookingUrl}" width="100%" height="950" style="border:0;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.08);" title="Rent a dumpster"></iframe>`;

  const facebookPostText = `Need a dumpster for a home cleanout, renovation, or job site? 🚛\n\nWe now have 24/7 instant online booking! Check available delivery dates, transparent pricing, and reserve your container in 60 seconds:\n\n👉 ${bookingUrl}\n\nFast delivery, reliable pickup, zero hidden fees!`;

  const instagramBioText = `📍 Roll-off Dumpster Rentals in ${name || 'Your Area'}\n⚡ Instant 24/7 Online Booking\n👇 Reserve Your Container in 60s:\n${bookingUrl}`;

  const smsText = `Hey! We now have online booking for our roll-off dumpsters. Next time you need a bin dropped off on a job or driveway, you can check availability and lock it in directly here: ${bookingUrl}`;

  const copyToClipboard = async (text: string, type: string, feedbackMsg: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      notify(feedbackMsg);
      setTimeout(() => setCopiedType(null), 3500);
    } catch {
      notify('Could not copy automatically. Please copy the text manually.', true);
    }
  };

  const updateRulePrice = (size_yards: number, basePriceDollars: number) => {
    setRules((prev) =>
      prev.map((r) =>
        r.size_yards === size_yards
          ? { ...r, base_price_cents: Math.round(basePriceDollars * 100) }
          : r
      )
    );
  };

  const updateRuleDays = (size_yards: number, days: number) => {
    setRules((prev) =>
      prev.map((r) => (r.size_yards === size_yards ? { ...r, included_days: days } : r))
    );
  };

  const toggleSize = (size_yards: number) => {
    if (rules.some((r) => r.size_yards === size_yards)) {
      if (rules.length <= 1) {
        notify('You must keep at least 1 dumpster size active.', true);
        return;
      }
      setRules((prev) => prev.filter((r) => r.size_yards !== size_yards));
    } else {
      const defaultPrice = size_yards <= 10 ? 34500 : size_yards <= 15 ? 39500 : size_yards <= 20 ? 44500 : 54500;
      setRules((prev) => [
        ...prev,
        {
          id: `rule-${size_yards}`,
          org_id: data.organization.id,
          size_yards,
          base_price_cents: defaultPrice,
          included_days: 7,
          extra_day_cents: 2000,
          included_tons: size_yards <= 10 ? 1 : size_yards <= 15 ? 2 : size_yards <= 20 ? 3 : 4,
          overage_per_ton_cents: 8500,
          service_zips: zips.split(/[\s,]+/).filter(Boolean),
        },
      ].sort((a, b) => a.size_yards - b.size_yards));
    }
  };

  const handleSaveStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    const zipArray = zips.split(/[\s,]+/).filter(Boolean);
    if (!zipArray.length) {
      notify('Please enter at least one service ZIP code.', true);
      return;
    }
    setStep(2);
  };

  const handleSaveStep2 = async () => {
    setBusy(true);
    try {
      const zipArray = zips.split(/[\s,]+/).filter(Boolean);
      await api('/api/settings', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim() || data.organization.name,
          slug: slug.trim() || data.organization.slug,
          phone: phone.trim() || data.organization.phone || '555-0199',
          currency: data.organization.currency || 'usd',
          deposit_percent: 100,
          customer_fee_enabled: true,
          google_review_url: data.organization.google_review_url || '',
          min_notice_hours: data.organization.min_notice_hours ?? 24,
          prohibited_items: data.organization.prohibited_items ?? [
            'Tires & automotive batteries',
            'Wet paint, oils & hazardous chemicals',
            'Refrigerators, AC units & Freon appliances',
            'Mattresses & box springs',
          ],
          operating_days: data.organization.operating_days ?? [1, 2, 3, 4, 5, 6],
          tax_rate_percent: data.organization.tax_rate_percent ?? 0,
          landfill_surcharges: {
            tire_cents: 2500,
            mattress_cents: 5000,
            freon_cents: 7500,
            propane_cents: 3500,
          },
          pricing_rules: rules.map((r) => ({
            size_yards: r.size_yards,
            base_price_cents: r.base_price_cents,
            included_days: r.included_days,
            extra_day_cents: r.extra_day_cents,
            included_tons: r.included_tons,
            overage_per_ton_cents: r.overage_per_ton_cents,
            service_zips: zipArray,
          })),
        }),
      });
      await reload();
      notify('Settings & pricing saved! Your booking page is live.');
      setStep(3);
    } catch (err) {
      notify((err as Error).message, true);
    } finally {
      setBusy(false);
    }
  };

  const handleFinish = () => {
    try {
      localStorage.setItem(`onboarding_completed_${data.organization.id}`, 'true');
    } catch {}
    onClose();
    notify("🎉 Setup complete! You're ready to receive online dumpster rentals.");
  };

  return (
    <Modal
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
      title=""
      className="onboarding-modal"
    >
      <div style={{ padding: '4px 0 10px 0' }}>
        {/* Stepper Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#166534', background: '#dcfce7', padding: '3px 10px', borderRadius: '12px', marginBottom: '6px' }}>
              <Rocket size={12} />
              FAST-TRACK SETUP (2 MINUTES)
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#0f172a' }}>
              {step === 1 && 'Where do you deliver?'}
              {step === 2 && 'Confirm your dumpster pricing'}
              {step === 3 && 'Your booking page is live! Get your 1st client'}
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748b', margin: '4px 0 0 0' }}>
              {step === 1 && 'Set your service ZIP codes and dispatch contact.'}
              {step === 2 && 'Review standard industry rates or tweak numbers in seconds.'}
              {step === 3 && 'Share your custom booking link on Facebook, Instagram, or Google.'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                  background: step === s ? '#166534' : step > s ? '#bbf7d0' : '#f1f5f9',
                  color: step === s ? '#ffffff' : step > s ? '#166534' : '#94a3b8',
                  transition: 'all 0.2s ease',
                }}
              >
                {step > s ? <Check size={14} /> : s}
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: SERVICE AREA & CONTACT */}
        {step === 1 && (
          <form onSubmit={handleSaveStep1} className="form-stack">
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'grid', gap: '14px' }}>
                <label className="field">
                  <span>Business Name</span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alamo Roll-Offs"
                  />
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <label className="field">
                    <span>Dispatch Phone Number</span>
                    <div style={{ position: 'relative' }}>
                      <Phone size={14} style={{ position: 'absolute', left: '12px', top: '15px', color: '#94a3b8' }} />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(555) 234-5678"
                        style={{ paddingLeft: '34px' }}
                      />
                    </div>
                    <small>Customers will see this for delivery questions</small>
                  </label>

                  <label className="field">
                    <span>Custom Booking URL Slug</span>
                    <div style={{ position: 'relative' }}>
                      <Globe size={14} style={{ position: 'absolute', left: '12px', top: '15px', color: '#94a3b8' }} />
                      <input
                        type="text"
                        required
                        pattern="[a-z0-9]+(-[a-z0-9]+)*"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                        placeholder="my-dumpsters"
                        style={{ paddingLeft: '34px' }}
                      />
                    </div>
                    <small>/book/{slug}</small>
                  </label>
                </div>

                <label className="field">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Service ZIP Codes</span>
                    <span style={{ fontSize: '11px', color: '#166534', fontWeight: 600 }}>Comma-separated</span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={14} style={{ position: 'absolute', left: '12px', top: '15px', color: '#94a3b8' }} />
                    <input
                      type="text"
                      required
                      value={zips}
                      onChange={(e) => setZips(e.target.value)}
                      placeholder="78701, 78702, 78704, 78745"
                      style={{ paddingLeft: '34px' }}
                    />
                  </div>
                  <small>Homeowners entering these ZIPs will be able to book instantly. You can add more later.</small>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <Button type="button" variant="ghost" onClick={onClose}>
                Skip for now
              </Button>
              <Button type="submit" variant="primary" style={{ background: '#166534', color: '#fff', fontWeight: 600 }}>
                Next: Confirm Pricing <ArrowRight size={14} />
              </Button>
            </div>
          </form>
        )}

        {/* STEP 2: DUMPSTER SIZES & PRICING */}
        {step === 2 && (
          <div className="form-stack">
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Active Dumpster Sizes</span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Click size to enable/disable</span>
              </div>

              {/* Quick Size Toggle Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                {[10, 15, 20, 30, 40].map((size) => {
                  const isActive = rules.some((r) => r.size_yards === size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        border: isActive ? '2px solid #166534' : '1px solid #cbd5e1',
                        background: isActive ? '#dcfce7' : '#ffffff',
                        color: isActive ? '#14532d' : '#64748b',
                        fontWeight: 700,
                        fontSize: '12.5px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      {isActive && <Check size={13} />}
                      {size} Yard
                    </button>
                  );
                })}
              </div>

              {/* Pricing Cards Grid */}
              <div style={{ display: 'grid', gap: '10px' }}>
                {rules.map((rule) => (
                  <div
                    key={rule.size_yards}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '130px' }}>
                      <div
                        style={{
                          background: '#f1f5f9',
                          width: '38px',
                          height: '38px',
                          borderRadius: '8px',
                          display: 'grid',
                          placeItems: 'center',
                          fontWeight: 800,
                          fontSize: '14px',
                          color: '#0f172a',
                        }}
                      >
                        {rule.size_yards}y
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#0f172a' }}>
                          {rule.size_yards} Yard Dumpster
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          Includes {rule.included_tons} {rule.included_tons === 1 ? 'ton' : 'tons'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px' }}>
                        <span style={{ color: '#64748b' }}>Price:</span>
                        <div style={{ position: 'relative', width: '88px' }}>
                          <span style={{ position: 'absolute', left: '8px', top: '9px', fontSize: '12px', color: '#64748b' }}>$</span>
                          <input
                            type="number"
                            min={50}
                            max={5000}
                            value={Math.round(rule.base_price_cents / 100)}
                            onChange={(e) => updateRulePrice(rule.size_yards, Number(e.target.value))}
                            style={{ padding: '6px 8px 6px 18px', minHeight: '34px', fontSize: '13px', fontWeight: 700 }}
                          />
                        </div>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px' }}>
                        <span style={{ color: '#64748b' }}>Days:</span>
                        <div style={{ width: '64px' }}>
                          <input
                            type="number"
                            min={1}
                            max={60}
                            value={rule.included_days}
                            onChange={(e) => updateRuleDays(rule.size_yards, Number(e.target.value))}
                            style={{ padding: '6px 8px', minHeight: '34px', fontSize: '13px', textAlign: 'center' }}
                          />
                        </div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <Button type="button" variant="ghost" onClick={() => setStep(1)} disabled={busy}>
                <ArrowLeft size={14} /> Back
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleSaveStep2}
                disabled={busy}
                style={{ background: '#166534', color: '#fff', fontWeight: 600 }}
              >
                {busy ? <Loader2 size={14} className="spin" /> : null}
                Save & Open Launchpad <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: FIRST-CLIENT LAUNCHPAD */}
        {step === 3 && (
          <div className="form-stack">
            {/* Live URL Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, #182820 0%, #1c3626 100%)',
                color: '#ffffff',
                padding: '16px 20px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#86efac', fontWeight: 700, marginBottom: '4px' }}>
                  <Sparkles size={12} />
                  READY TO ACCEPT BOOKINGS 24/7
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, wordBreak: 'break-all' }}>
                  {bookingUrl}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                  onClick={() => copyToClipboard(bookingUrl, 'main_url', 'Booking URL copied to clipboard!')}
                  style={{ background: '#ffffff', color: '#0f172a', fontWeight: 600, fontSize: '12.5px' }}
                >
                  {copiedType === 'main_url' ? <Check size={14} /> : <Copy size={14} />}
                  Copy Link
                </Button>
                <Button
                  asChild
                  style={{ background: '#22c55e', color: '#ffffff', fontWeight: 700, fontSize: '12.5px' }}
                >
                  <Link href={`/book/${slug}`} target="_blank">
                    <ExternalLink size={14} /> Test Live Page
                  </Link>
                </Button>
              </div>
            </div>

            {/* Social & Web Distribution Tabs */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', gap: '6px', marginBottom: '14px', overflowX: 'auto', paddingBottom: '4px' }}>
                {[
                  { id: 'facebook', label: 'Facebook Post' },
                  { id: 'instagram', label: 'Instagram Bio' },
                  { id: 'google', label: 'Google Business' },
                  { id: 'embed', label: 'Website Embed' },
                  { id: 'sms', label: 'Contractor SMS' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveSocialTab(tab.id as typeof activeSocialTab)}
                    style={{
                      padding: '7px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      background: activeSocialTab === tab.id ? '#ffffff' : 'transparent',
                      color: activeSocialTab === tab.id ? '#166534' : '#64748b',
                      fontWeight: activeSocialTab === tab.id ? 700 : 500,
                      fontSize: '12px',
                      cursor: 'pointer',
                      boxShadow: activeSocialTab === tab.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab: Facebook */}
              {activeSocialTab === 'facebook' && (
                <div>
                  <p style={{ fontSize: '12px', color: '#475569', marginBottom: '8px' }}>
                    Post this directly on your <b>Facebook Business Page</b> or local community groups (e.g. HOA, buy-sell-trade):
                  </p>
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px', fontSize: '12.5px', color: '#1e293b', whiteSpace: 'pre-wrap', lineHeight: 1.5, maxHeight: '140px', overflowY: 'auto' }}>
                    {facebookPostText}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <Button
                      onClick={() => copyToClipboard(facebookPostText, 'fb', 'Facebook post copied to clipboard!')}
                      variant="primary"
                      style={{ background: '#1877f2', color: '#fff', fontSize: '12px' }}
                    >
                      {copiedType === 'fb' ? <Check size={13} /> : <Copy size={13} />} Copy Facebook Post
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      style={{ fontSize: '12px' }}
                    >
                      <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                        Open Facebook <ExternalLink size={12} />
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              {/* Tab: Instagram */}
              {activeSocialTab === 'instagram' && (
                <div>
                  <p style={{ fontSize: '12px', color: '#475569', marginBottom: '8px' }}>
                    Put your booking link in your <b>Instagram profile bio</b> so followers can book with one tap:
                  </p>
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px', fontSize: '12.5px', color: '#1e293b', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                    {instagramBioText}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <Button
                      onClick={() => copyToClipboard(instagramBioText, 'ig', 'Instagram bio copied!')}
                      variant="primary"
                      style={{ background: '#e1306c', color: '#fff', fontSize: '12px' }}
                    >
                      {copiedType === 'ig' ? <Check size={13} /> : <Copy size={13} />} Copy Instagram Bio
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      style={{ fontSize: '12px' }}
                    >
                      <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                        Open Instagram <ExternalLink size={12} />
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              {/* Tab: Google Business */}
              {activeSocialTab === 'google' && (
                <div>
                  <p style={{ fontSize: '12px', color: '#475569', marginBottom: '8px' }}>
                    Capture homeowners searching Google for <i>&quot;dumpster rental near me&quot;</i>:
                  </p>
                  <ol style={{ fontSize: '12px', color: '#334155', paddingLeft: '18px', margin: '8px 0', lineHeight: 1.6 }}>
                    <li>Go to your <b>Google Business Profile</b>.</li>
                    <li>Click <b>Edit profile</b> → <b>Online appointments</b> (or <b>Website</b>).</li>
                    <li>Paste your booking URL: <code style={{ background: '#e2e8f0', padding: '2px 4px', borderRadius: '4px' }}>{bookingUrl}</code></li>
                  </ol>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <Button
                      onClick={() => copyToClipboard(bookingUrl, 'gbp', 'Google booking link copied!')}
                      variant="primary"
                      style={{ background: '#166534', color: '#fff', fontSize: '12px' }}
                    >
                      {copiedType === 'gbp' ? <Check size={13} /> : <Copy size={13} />} Copy Link for Google
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      style={{ fontSize: '12px' }}
                    >
                      <a href="https://business.google.com" target="_blank" rel="noopener noreferrer">
                        Open Google Business <ExternalLink size={12} />
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              {/* Tab: Embed */}
              {activeSocialTab === 'embed' && (
                <div>
                  <p style={{ fontSize: '12px', color: '#475569', marginBottom: '8px' }}>
                    Embed the checkout widget directly into your WordPress, Squarespace, or Wix site:
                  </p>
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px', fontSize: '11.5px', fontFamily: 'monospace', color: '#0f172a', wordBreak: 'break-all' }}>
                    {embedSnippet}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <Button
                      onClick={() => copyToClipboard(embedSnippet, 'embed', 'Website embed snippet copied!')}
                      variant="primary"
                      style={{ background: '#0f172a', color: '#fff', fontSize: '12px' }}
                    >
                      {copiedType === 'embed' ? <Check size={13} /> : <Copy size={13} />} Copy Embed Code
                    </Button>
                  </div>
                </div>
              )}

              {/* Tab: SMS */}
              {activeSocialTab === 'sms' && (
                <div>
                  <p style={{ fontSize: '12px', color: '#475569', marginBottom: '8px' }}>
                    Send this quick text message to contractors, roofers, or past customers to land an immediate order:
                  </p>
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px', fontSize: '12.5px', color: '#1e293b', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                    {smsText}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <Button
                      onClick={() => copyToClipboard(smsText, 'sms', 'Contractor SMS copied!')}
                      variant="primary"
                      style={{ background: '#166534', color: '#fff', fontSize: '12px' }}
                    >
                      {copiedType === 'sms' ? <Check size={13} /> : <Copy size={13} />} Copy SMS Template
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Complete CTA */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <Button type="button" variant="ghost" onClick={() => setStep(2)}>
                <ArrowLeft size={14} /> Back
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleFinish}
                style={{ background: '#166534', color: '#fff', fontWeight: 700, padding: '10px 20px' }}
              >
                Go to Dispatch Board <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
