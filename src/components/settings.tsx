'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
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
  const [deposit, setDeposit] = useState(data.organization.pricing_config.deposit_percent);
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
          deposit_percent: deposit,
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
                Deposit percentage
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={deposit}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                />
                <small>Percent of rental total collected at booking.</small>
              </label>
            </div>
            <label className="field">
              Service ZIP codes
              <textarea
                required
                value={zips}
                onChange={(e) => setZips(e.target.value)}
                placeholder="78701, 78702, 78704"
              />
              <small>Separate five-digit ZIP codes with commas or spaces.</small>
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
