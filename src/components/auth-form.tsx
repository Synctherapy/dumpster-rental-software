'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Check,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Brand } from './brand';
import { Button } from './ui/button';
import { api } from '@/lib/client';

export function AuthForm({ signup = false }: { signup?: boolean }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Plan & Upsell Selection
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'starter'>('free');
  const [addWebsite, setAddWebsite] = useState(false);
  const [addGbp, setAddGbp] = useState(false);

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !company.trim() || !email.trim() || password.length < 8) {
      setError('Please fill out all required fields (password must be at least 8 characters).');
      return;
    }
    setStep(2);
  };

  const handleFinalSubmit = async (e?: React.FormEvent, skipUpsells = false) => {
    if (e) e.preventDefault();
    setBusy(true);
    setError('');

    const useWebsite = skipUpsells ? false : addWebsite;
    const useGbp = skipUpsells ? false : addGbp;
    const needsCheckout = selectedPlan === 'starter' || useWebsite || useGbp;

    try {
      const result = await api<{
        confirmation?: boolean;
        demo?: boolean;
        ok?: boolean;
      }>('/api/auth', {
        method: 'POST',
        body: JSON.stringify({
          action: signup ? 'signup' : 'login',
          email,
          password,
          ...(signup ? { name, company, city, plan: selectedPlan, website_upsell: useWebsite, gbp_upsell: useGbp } : {}),
        }),
      });

      if (needsCheckout) {
        try {
          const billingRes = await api<{ url: string }>('/api/billing', {
            method: 'POST',
            body: JSON.stringify({
              plan: selectedPlan,
              website: useWebsite,
              gbp: useGbp,
              email,
              company,
              success_url: `${window.location.origin}/dashboard?onboarding=true&billing=success`,
              cancel_url: `${window.location.origin}/dashboard?onboarding=true&billing=cancelled`,
            }),
          });
          if (billingRes.url) {
            window.location.assign(billingRes.url);
            return;
          }
        } catch (billingErr) {
          console.warn('Billing checkout initiation failed, continuing to dashboard:', billingErr);
        }
      }

      if (result.confirmation) {
        setConfirmation(true);
      } else {
        window.location.href = signup ? '/dashboard?onboarding=true' : '/dashboard';
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed. Please try again.';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-story">
        <Brand />
        <div>
          <div className="eyebrow" style={{ color: '#a6bf80', marginBottom: 20 }}>
            FOR THE PEOPLE WHO KEEP THINGS MOVING
          </div>
          <h2>
            Less paperwork.
            <br />
            More rentals.
          </h2>
          <p>
            Your bookings, containers, and crew. Together in one workspace that works as hard as you
            do.
          </p>
          <p style={{ fontSize: 13, color: '#a6bf80', fontWeight: 600, marginTop: 20 }}>
            ✓ No credit card required &nbsp;•&nbsp; ✓ Up in 3 minutes
          </p>
        </div>
      </section>

      <section className="auth-form-area">
        <div className="auth-form" style={{ maxWidth: signup ? 440 : 380, width: '100%', boxSizing: 'border-box' }}>
          {/* Form Header */}
          <h1>
            {!signup
              ? 'Welcome back.'
              : step === 1
                ? 'Let’s get you rolling.'
                : step === 2
                  ? 'Choose your plan.'
                  : 'Fast-track your fleet.'}
          </h1>
          <p className="muted" style={{ marginBottom: 20 }}>
            {!signup
              ? 'Your next great day starts right here.'
              : step === 1
                ? 'A better way to run your dumpster rental business.'
                : step === 2
                  ? 'Start free or take a 14-day Pro trial with contractor accounts.'
                  : 'Special new hauler setup discounts (optional).'}
          </p>

          {confirmation ? (
            <div className="success-box">
              <CheckCircle2 size={21} style={{ marginBottom: 10 }} />
              <p>Check your email to confirm your account, then log in to set up your business.</p>
              <Link href="/login" className="btn" style={{ marginTop: 17 }}>
                Go to login
              </Link>
            </div>
          ) : !signup ? (
            /* Standard Login Form */
            <form
              className="form-stack"
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                setError('');
                const fields = new FormData(e.currentTarget);
                try {
                  const result = await api<{ ok?: boolean; demo?: boolean }>('/api/auth', {
                    method: 'POST',
                    body: JSON.stringify({
                      action: 'login',
                      email: fields.get('email'),
                      password: fields.get('password'),
                    }),
                  });
                  if (result.ok || result.demo) {
                    window.location.href = '/dashboard';
                  } else {
                    window.location.href = '/dashboard';
                  }
                } catch (e) {
                  setError((e as Error).message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              <label className="field">
                Email address
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@yourcompany.com"
                />
              </label>
              <label className="field">
                Password
                <input
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="At least 8 characters"
                />
              </label>
              {error && <div className="error-box" role="alert">{error}</div>}
              <Button variant="dark" disabled={busy} type="submit">
                {busy ? <Loader2 className="spin" size={15} /> : null}
                Log in
                <ArrowRight size={14} />
              </Button>
              {process.env.NODE_ENV !== 'production' && (
                <Button
                  type="button"
                  variant="ghost"
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    setError('');
                    try {
                      await api('/api/auth', {
                        method: 'POST',
                        body: JSON.stringify({
                          action: 'login',
                          email: 'darylstubbs11@gmail.com',
                          password: 'Password123!',
                        }),
                      });
                      window.location.href = '/settings';
                    } catch (e) {
                      setError((e as Error).message);
                    } finally {
                      setBusy(false);
                    }
                  }}
                  style={{ marginTop: 10, width: '100%', fontSize: 13, background: '#f8fafc' }}
                >
                  ⚡ One-Click Login as Owner (Sync Therapy)
                </Button>
              )}
            </form>
          ) : step === 1 ? (
            /* Signup Step 1: Input Information */
            <form className="form-stack" onSubmit={handleStep1Next}>
              <label className="field">
                Your name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                  minLength={2}
                  placeholder="Burt Reynolds"
                />
              </label>
              <label className="field">
                Business name
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  autoComplete="organization"
                  required
                  minLength={2}
                  placeholder="Apex Dumpster Rentals"
                />
              </label>
              <label className="field">
                City / Service Area <small style={{ color: '#64748b', fontWeight: 400 }}>(optional)</small>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  autoComplete="address-level2"
                  placeholder="e.g. Baltimore, Seattle, Austin"
                />
              </label>
              <label className="field">
                Email address
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="burt@apexdumpsters.com"
                />
              </label>
              <label className="field">
                Password
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                />
              </label>

              {error && <div className="error-box" role="alert">{error}</div>}

              <Button
                variant="orange"
                type="submit"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  whiteSpace: 'normal',
                  height: 'auto',
                  minHeight: '46px',
                  padding: '11px 16px',
                  lineHeight: 1.3,
                  textAlign: 'center',
                }}
              >
                Continue To Get Free Customers
                <ArrowRight size={14} style={{ flexShrink: 0, marginLeft: '6px' }} />
              </Button>
            </form>
          ) : step === 2 ? (
            /* Signup Step 2: Choose Plan Version */
            <div style={{ display: 'grid', gap: '16px', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
              {/* Plan 1: Free Plan */}
              <div
                onClick={() => setSelectedPlan('free')}
                style={{
                  border: `2px solid ${selectedPlan === 'free' ? '#ea580c' : '#e2e8f0'}`,
                  background: selectedPlan === 'free' ? '#fffaf5' : '#ffffff',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '8px' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Free Forever · No Credit Card Required
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#1f2d26' }}>Free Plan</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: '#1f2d26' }}>$0</div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>no monthly bill</div>
                  </div>
                </div>
                <div style={{ fontSize: '11.5px', color: '#475569', display: 'grid', gap: '5px', marginTop: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={13} color="#16a34a" /> 24/7 Website Booking Widget & Direct Link
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={13} color="#16a34a" /> Visual Drag & Drop Dispatch Whiteboard
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={13} color="#16a34a" /> Driver SMS Magic Links & Photo Proof
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={13} color="#16a34a" /> Driveway Damage Waivers & Digital Signatures
                  </div>
                </div>
                <div style={{ marginTop: '10px', fontSize: '11px', color: '#166534', background: '#f0fdf4', padding: '6px 10px', borderRadius: '6px', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={12} color="#16a34a" /> <strong>$0 Forever:</strong> No credit card needed. Jump straight into your workspace.
                </div>
              </div>

              {/* Plan 2: Starter Plan ($29/mo) with 14-Day Free Trial */}
              <div
                onClick={() => setSelectedPlan('starter')}
                style={{
                  border: `2px solid ${selectedPlan === 'starter' ? '#ea580c' : '#e2e8f0'}`,
                  background: selectedPlan === 'starter' ? '#fffaf5' : '#ffffff',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <span style={{ position: 'absolute', top: -10, right: 14, background: '#ea580c', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '10px' }}>
                  14-DAY FREE TRIAL · $0 DUE TODAY
                </span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '8px' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Best For Repeat Contractors
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#1f2d26' }}>Starter Plan</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: '#1f2d26' }}>$29<span style={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }}>/mo</span></div>
                    <div style={{ fontSize: '10px', color: '#16a34a', fontWeight: 600 }}>$0 today · 14 days free</div>
                  </div>
                </div>
                <div style={{ fontSize: '11.5px', color: '#475569', display: 'grid', gap: '6px', marginTop: '10px' }}>
                  <div style={{ fontWeight: 700, color: '#166534', fontSize: '11.5px', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Sparkles size={13} color="#166534" /> Everything in Free, plus:
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', lineHeight: 1.35 }}>
                    <Check size={13} color="#ea580c" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span><strong>Contractor Accounts Add-On:</strong> Dedicated VIP booking links with custom negotiated rates for repeat roofers & builders</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', lineHeight: 1.35 }}>
                    <Check size={13} color="#ea580c" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span><strong>Offline Payments ($0 Fee):</strong> Keep 100% on cash, company checks, Zelle & Net-30 invoice orders</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={13} color="#16a34a" /> <strong>1-Click Container Swaps:</strong> Pull full can & drop empty in one trip
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={13} color="#16a34a" /> <strong>Calendar Sync:</strong> 2-Way Google Calendar & Apple iCal feed
                  </div>
                </div>
                <div style={{ marginTop: '10px', fontSize: '11px', color: '#475569', background: '#f8fafc', padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={13} color="#0284c7" /> <span>Card required for trial · <strong>$0.00 charged today</strong> · 3-day reminder email before renewal.</span>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '8px', marginTop: '10px', width: '100%' }}>
                <Button
                  variant="orange"
                  type="button"
                  onClick={() => setStep(3)}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    whiteSpace: 'normal',
                    height: 'auto',
                    minHeight: '46px',
                    padding: '11px 16px',
                    lineHeight: 1.3,
                    textAlign: 'center',
                  }}
                >
                  One Step Away From Your First Customer
                  <ArrowRight size={14} style={{ flexShrink: 0, marginLeft: '6px' }} />
                </Button>
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => setStep(1)}
                    style={{ width: 'auto', fontSize: '12px', padding: '6px 12px' }}
                  >
                    <ArrowLeft size={13} /> Back
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* Signup Step 3: Hormozi One-Time Launch Offers */
            <div style={{ display: 'grid', gap: '16px', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', color: '#166534', width: '100%', boxSizing: 'border-box' }}>
                <strong>New Hauler Fast-Track Offers</strong>
                <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#15803d' }}>
                  One-time discounted setup available only during workspace creation.
                </p>
              </div>

              {/* Upsell 1: Website Builder ($499 -> $299) */}
              <div
                onClick={() => setAddWebsite(!addWebsite)}
                style={{
                  border: `2px solid ${addWebsite ? '#ea580c' : '#e2e8f0'}`,
                  background: addWebsite ? '#fffaf5' : '#ffffff',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <span style={{ position: 'absolute', top: -9, right: 14, background: '#166534', color: '#fff', fontSize: '9px', fontWeight: 800, padding: '2px 7px', borderRadius: '10px' }}>
                  SAVE $200 · 1 RENTAL PAYS FOR IT
                </span>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <input
                    type="checkbox"
                    checked={addWebsite}
                    onChange={() => {}}
                    style={{ marginTop: '4px', cursor: 'pointer', accentColor: '#ea580c' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, fontSize: '14px', color: '#1f2d26' }}>
                        Done-For-You 24/7 Booking Website
                      </span>
                      <span style={{ flexShrink: 0 }}>
                        <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '11px' }}>$499</span>{' '}
                        <strong style={{ color: '#ea580c', fontSize: '14px' }}>$299</strong>
                      </span>
                    </div>

                    <div style={{ fontSize: '11.5px', color: '#166534', fontWeight: 700, margin: '4px 0 2px 0' }}>
                      🔥 The Math: Just 1 dumpster booking covers 100% of this cost. Everything after is pure profit.
                    </div>

                    <p style={{ fontSize: '11px', color: '#475569', margin: '0 0 2px 0', lineHeight: 1.45 }}>
                      Agencies charge $3,000+ and take months. We write your sales copy, set up your town’s service areas, and plug in your 24/7 booking checkout with zero tech work from you.
                    </p>
                  </div>
                </div>
              </div>

              {/* Upsell 2: Google 3-Pack Optimization ($199 -> $79) */}
              <div
                onClick={() => setAddGbp(!addGbp)}
                style={{
                  border: `2px solid ${addGbp ? '#ea580c' : '#e2e8f0'}`,
                  background: addGbp ? '#fffaf5' : '#ffffff',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <span style={{ position: 'absolute', top: -9, right: 14, background: '#ea580c', color: '#fff', fontSize: '9px', fontWeight: 800, padding: '2px 7px', borderRadius: '10px' }}>
                  SAVE $120 · TOP RATED LOCAL HAULER
                </span>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <input
                    type="checkbox"
                    checked={addGbp}
                    onChange={() => {}}
                    style={{ marginTop: '4px', cursor: 'pointer', accentColor: '#ea580c' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, fontSize: '14px', color: '#1f2d26' }}>
                        Google Maps 3-Pack Domination Kit
                      </span>
                      <span style={{ flexShrink: 0 }}>
                        <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '11px' }}>$199</span>{' '}
                        <strong style={{ color: '#ea580c', fontSize: '14px' }}>$79</strong>
                      </span>
                    </div>

                    <div style={{ fontSize: '11.5px', color: '#9a3412', fontWeight: 700, margin: '4px 0 2px 0' }}>
                      📍 Why You Need This: 80% of local dumpster calls go to the top 3 spots on Google Maps.
                    </div>

                    <p style={{ fontSize: '11px', color: '#475569', margin: '0 0 5px 0', lineHeight: 1.45 }}>
                      When a roofer or homeowner searches &ldquo;dumpster rental near me&rdquo;, be the first company they call. We dial in your commercial waste categories and set up automatic 5-star review request texts on container pickup.
                    </p>

                    <div style={{ fontSize: '10.5px', color: '#166534', background: '#dcfce7', padding: '4px 8px', borderRadius: '6px', fontWeight: 700 }}>
                      ✓ 1 single customer phone call from Google Maps pays for this 5x over.
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              {(() => {
                const addonTotal = (addWebsite ? 299 : 0) + (addGbp ? 79 : 0);
                const isTrial = selectedPlan === 'starter';
                const hasAddons = addWebsite || addGbp;

                return (
                  <div style={{ background: '#f8faf6', border: '1px solid #dde4d4', borderRadius: '10px', padding: '12px 14px', fontSize: '12px', width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: '#64748b' }}>Software Plan:</span>
                      <span style={{ fontWeight: 600 }}>
                        {isTrial ? 'Starter ($29/mo · 14-day free trial)' : 'Free Plan ($0/mo forever)'}
                      </span>
                    </div>
                    {hasAddons && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#ea580c' }}>
                        <span>One-Time Add-ons:</span>
                        <span style={{ fontWeight: 700 }}>${addonTotal}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '6px', marginTop: '6px', fontWeight: 800 }}>
                      <span>Due Today:</span>
                      <span style={{ color: hasAddons ? '#ea580c' : '#166534', fontSize: '13px' }}>
                        {hasAddons
                          ? `$${addonTotal}.00`
                          : isTrial
                          ? '$0.00 (14-day trial)'
                          : '$0.00 (No card required)'}
                      </span>
                    </div>

                    {isTrial ? (
                      <div style={{ marginTop: '10px', fontSize: '11px', color: '#166534', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '8px 10px', borderRadius: '8px', lineHeight: 1.45 }}>
                        🔒 <strong>14-Day Free Trial:</strong> $0.00 charged today for software. We will email you a reminder 3 days before your trial ends. Cancel anytime in 1 click from your settings.
                      </div>
                    ) : hasAddons ? (
                      <div style={{ marginTop: '10px', fontSize: '11px', color: '#0369a1', background: '#f0f9ff', border: '1px solid #bae6fd', padding: '8px 10px', borderRadius: '8px', lineHeight: 1.45 }}>
                        💳 <strong>One-Time Setup Payment:</strong> You are only charged today for your selected launch add-on. Your software plan remains 100% free with $0 monthly bills.
                      </div>
                    ) : (
                      <div style={{ marginTop: '10px', fontSize: '11px', color: '#15803d', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '8px 10px', borderRadius: '8px', lineHeight: 1.45 }}>
                        ✨ <strong>Zero Credit Card Required:</strong> Launch your workspace immediately with free 24/7 online booking and visual dispatch whiteboard.
                      </div>
                    )}
                  </div>
                );
              })()}

              {error && <div className="error-box" role="alert">{error}</div>}

              <div style={{ display: 'grid', gap: '8px', marginTop: '6px', width: '100%' }}>
                <Button
                  variant="orange"
                  disabled={busy}
                  onClick={() => handleFinalSubmit()}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    whiteSpace: 'normal',
                    height: 'auto',
                    minHeight: '46px',
                    padding: '11px 16px',
                    lineHeight: 1.3,
                    textAlign: 'center',
                  }}
                >
                  {busy ? <Loader2 className="spin" size={15} /> : null}
                  {selectedPlan === 'free' && !addWebsite && !addGbp
                    ? 'Launch Free Workspace (No CC Required)'
                    : selectedPlan === 'starter' && !addWebsite && !addGbp
                    ? 'Start 14-Day Free Trial ($0 Today)'
                    : selectedPlan === 'starter'
                    ? `Continue to Checkout ($${(addWebsite ? 299 : 0) + (addGbp ? 79 : 0)} Today · 14-Day Trial)`
                    : `Continue to Checkout ($${(addWebsite ? 299 : 0) + (addGbp ? 79 : 0)} Today · $0/mo)`}
                  <ArrowRight size={14} style={{ flexShrink: 0, marginLeft: '6px' }} />
                </Button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button variant="ghost" type="button" onClick={() => setStep(2)} style={{ width: 'auto', fontSize: '12px', padding: '6px 12px' }}>
                    <ArrowLeft size={13} /> Back
                  </Button>
                  <button
                    type="button"
                    onClick={() => {
                      setAddWebsite(false);
                      setAddGbp(false);
                      handleFinalSubmit(undefined, true);
                    }}
                    style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Skip offers & launch {selectedPlan === 'starter' ? '14-day trial' : 'free'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <p className="auth-alt">
            {signup ? 'Already part of the crew?' : 'New around here?'}{' '}
            <Link href={signup ? '/login' : '/signup'}>
              {signup ? 'Log in' : 'Create your account'}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
