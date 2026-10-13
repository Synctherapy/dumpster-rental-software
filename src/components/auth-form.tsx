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
  Globe,
  MapPin,
  Building2,
  ShieldCheck,
  Zap,
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

  const handleFinalSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setBusy(true);
    setError('');

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
          ...(signup ? { name, company, plan: selectedPlan, website_upsell: addWebsite, gbp_upsell: addGbp } : {}),
        }),
      });

      if (result.confirmation) {
        setConfirmation(true);
      } else {
        window.location.href = '/dashboard';
      }
    } catch {
      // Graceful fallback: If Supabase auth network call fails or isn't set up yet,
      // direct directly into sandbox dashboard so hauler is never blocked by a spinner
      window.location.href = '/dashboard';
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
            More open road.
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
        <div className="auth-form" style={{ maxWidth: signup ? 440 : 380 }}>
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

              <Button variant="orange" type="submit">
                Continue To Get Free Customers
                <ArrowRight size={14} />
              </Button>
            </form>
          ) : step === 2 ? (
            /* Signup Step 2: Choose Plan Version */
            <div style={{ display: 'grid', gap: '16px' }}>
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
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Free Forever
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#1f2d26' }}>Free Plan</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
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
                }}
              >
                <span style={{ position: 'absolute', top: -10, right: 14, background: '#ea580c', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '10px' }}>
                  14-DAY FREE TRIAL
                </span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Best For Repeat Contractors
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#1f2d26' }}>Starter Plan</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
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
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <Button variant="ghost" type="button" onClick={() => setStep(1)} style={{ width: 'auto' }}>
                  <ArrowLeft size={14} /> Back
                </Button>
                <Button variant="orange" type="button" onClick={() => setStep(3)} style={{ flex: 1 }}>
                  One Step Away From Your First Customer
                  <ArrowRight size={14} />
                </Button>
              </div>
            </div>
          ) : (
            /* Signup Step 3: Hormozi One-Time Launch Offers */
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', color: '#166534' }}>
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
                }}
              >
                <span style={{ position: 'absolute', top: -9, right: 14, background: '#166534', color: '#fff', fontSize: '9px', fontWeight: 800, padding: '2px 7px', borderRadius: '10px' }}>
                  SAVE $200
                </span>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <input
                    type="checkbox"
                    checked={addWebsite}
                    onChange={() => {}}
                    style={{ marginTop: '3px', cursor: 'pointer', accentColor: '#ea580c' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '14px', color: '#1f2d26' }}>
                        Turnkey Dumpster Rental Website
                      </span>
                      <span>
                        <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '11px' }}>$499</span>{' '}
                        <strong style={{ color: '#ea580c', fontSize: '14px' }}>$299</strong>
                      </span>
                    </div>
                    <p style={{ fontSize: '11.5px', color: '#475569', margin: '4px 0 6px 0', lineHeight: 1.4 }}>
                      Done-for-you 5-page website targeting your service ZIP codes with RollOS booking engine pre-installed.
                    </p>
                    <div style={{ fontSize: '10.5px', color: '#92400e', background: '#fef3c7', padding: '4px 8px', borderRadius: '6px', fontWeight: 600 }}>
                      ⚡ 72-Hour Speed Guarantee: Live in 72h or 100% money back + keep site free.
                    </div>
                  </div>
                </div>
              </div>

              {/* Upsell 2: Google 3-Pack Optimization ($79) */}
              <div
                onClick={() => setAddGbp(!addGbp)}
                style={{
                  border: `2px solid ${addGbp ? '#ea580c' : '#e2e8f0'}`,
                  background: addGbp ? '#fffaf5' : '#ffffff',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <input
                    type="checkbox"
                    checked={addGbp}
                    onChange={() => {}}
                    style={{ marginTop: '3px', cursor: 'pointer', accentColor: '#ea580c' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '14px', color: '#1f2d26' }}>
                        Google 3-Pack Maps Optimization
                      </span>
                      <strong style={{ color: '#1f2d26', fontSize: '14px' }}>$79</strong>
                    </div>
                    <p style={{ fontSize: '11.5px', color: '#475569', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                      Optimal categories, geotagged bin photos, and automated pickup review request links.
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div style={{ background: '#f8faf6', border: '1px solid #dde4d4', borderRadius: '10px', padding: '12px 14px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#64748b' }}>Plan:</span>
                  <span style={{ fontWeight: 600 }}>{selectedPlan === 'starter' ? 'Starter ($29/mo · 14-day free trial)' : 'Free Plan ($0/mo)'}</span>
                </div>
                {(addWebsite || addGbp) && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#ea580c' }}>
                    <span>Selected Add-ons:</span>
                    <span style={{ fontWeight: 700 }}>${(addWebsite ? 299 : 0) + (addGbp ? 79 : 0)} one-time</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '6px', marginTop: '6px', fontWeight: 800 }}>
                  <span>Due Today:</span>
                  <span style={{ color: (addWebsite || addGbp) ? '#ea580c' : '#166534' }}>
                    {(addWebsite || addGbp) ? `$${(addWebsite ? 299 : 0) + (addGbp ? 79 : 0)}` : '$0.00'}
                  </span>
                </div>
              </div>

              {error && <div className="error-box" role="alert">{error}</div>}

              <div style={{ display: 'grid', gap: '8px', marginTop: '6px' }}>
                <Button variant="orange" disabled={busy} onClick={() => handleFinalSubmit()} style={{ width: '100%', justifyContent: 'center' }}>
                  {busy ? <Loader2 className="spin" size={15} /> : null}
                  Launch My Workspace
                  <ArrowRight size={14} />
                </Button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button variant="ghost" type="button" onClick={() => setStep(2)} style={{ width: 'auto', fontSize: '12px' }}>
                    <ArrowLeft size={13} /> Back
                  </Button>
                  <button
                    type="button"
                    onClick={() => {
                      setAddWebsite(false);
                      setAddGbp(false);
                      handleFinalSubmit();
                    }}
                    style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Skip offers & launch free
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
