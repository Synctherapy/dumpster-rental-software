'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Brand } from './brand';
import { Button } from './ui/button';
import { api } from '@/lib/client';
export function AuthForm({ signup = false }: { signup?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(false);
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
        </div>
        <p style={{ fontSize: 11 }}>Free to start. $0/month, or upgrade to $29 or $149. The free plan includes a $12 customer reservation fee.</p>
      </section>
      <section className="auth-form-area">
        <div className="auth-form">
          <h1>{signup ? 'Let’s get you rolling.' : 'Welcome back.'}</h1>
          <p className="muted">
            {signup
              ? 'A better way to run your dumpster rental business.'
              : 'Your next great day starts right here.'}
          </p>
          {confirmation ? (
            <div className="success-box">
              <CheckCircle2 size={21} style={{ marginBottom: 10 }} />
              <p>Check your email to confirm your account, then log in to set up your business.</p>
              <Link href="/login" className="btn" style={{ marginTop: 17 }}>
                Go to login
              </Link>
            </div>
          ) : (
            <form
              className="form-stack"
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                setError('');
                const fields = new FormData(e.currentTarget);
                try {
                  const result = await api<{ confirmation?: boolean; demo?: boolean }>(
                    '/api/auth',
                    {
                      method: 'POST',
                      body: JSON.stringify({
                        action: signup ? 'signup' : 'login',
                        email: fields.get('email'),
                        password: fields.get('password'),
                        ...(signup
                          ? { name: fields.get('name'), company: fields.get('company') }
                          : {}),
                      }),
                    },
                  );
                  if (result.confirmation) {
                    setConfirmation(true);
                  } else if (result.demo) {
                    setError(
                      'Authentication is not connected in this local demo. Use “Explore the demo workspace” below; no account was created.',
                    );
                  } else window.location.href = signup ? '/settings' : '/dashboard';
                } catch (e) {
                  setError((e as Error).message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              {signup && (
                <>
                  <label className="field">
                    Your name
                    <input
                      name="name"
                      autoComplete="name"
                      required
                      minLength={2}
                      placeholder="Alex Morgan"
                    />
                  </label>
                  <label className="field">
                    Business name
                    <input
                      name="company"
                      autoComplete="organization"
                      required
                      minLength={2}
                      placeholder="Your hauling company"
                    />
                  </label>
                </>
              )}
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
                  minLength={8}
                  autoComplete={signup ? 'new-password' : 'current-password'}
                  placeholder="At least 8 characters"
                />
              </label>
              {error && (
                <div className="error-box" role="alert">
                  {error}
                </div>
              )}
              <Button variant="dark" disabled={busy} type="submit">
                {busy ? <Loader2 className="spin" size={15} /> : null}
                {signup ? 'Create your workspace' : 'Log in'}
                <ArrowRight size={14} />
              </Button>
              <Link href="/dashboard" className="btn btn-ghost">
                Explore the demo workspace
              </Link>
            </form>
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
