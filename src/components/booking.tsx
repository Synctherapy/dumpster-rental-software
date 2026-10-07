'use client';
import { useEffect, useState, Fragment } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Leaf,
  Loader2,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  FlaskConical,
} from 'lucide-react';
import { Dumpster } from './brand';
import { Button } from './ui/button';
import { api } from '@/lib/client';
import {
  addDays,
  dateLabel,
  money,
  today,
  type Organization,
  type PricingRule,
  type Job,
} from '@/lib/types';
import { quote } from '@/lib/pricing';
type PublicData = { organization: Organization; pricing_rules: PricingRule[]; demo: boolean };
const guidance: Record<number, string> = {
  10: 'Garage cleanouts, small remodels, and yard debris.',
  20: 'Kitchen remodels, roofing, and home cleanouts.',
  30: 'Major renovations and construction projects.',
  40: 'Large demolitions and commercial cleanouts.',
};
export function Booking({ slug, embed = false }: { slug: string; embed?: boolean }) {
  const [data, setData] = useState<PublicData | null>(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState(0);
  const [size, setSize] = useState(20);
  const [zip, setZip] = useState('');
  const [delivery, setDelivery] = useState(addDays(today(), 1));
  const [pickup, setPickup] = useState(addDays(today(), 8));
  const [busy, setBusy] = useState(false);
  const [confirmed, setConfirmed] = useState<Job | null>(null);
  const [key] = useState(() => globalThis.crypto?.randomUUID?.() ?? '');
  const [customer, setCustomer] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    delivery_address: '',
    notes: '',
    protective_boards: false,
    signature_name: '',
    accepted_terms: false,
  });
  useEffect(() => {
    api<PublicData>(`/api/public/${slug}`)
      .then((d) => {
        setData(d);
        const noticeHours = d.organization.min_notice_hours ?? d.organization.pricing_config?.min_notice_hours ?? 24;
        const minLeadDays = Math.max(1, Math.ceil(noticeHours / 24));
        const earliest = addDays(today(), minLeadDays);
        setDelivery(earliest);
        const selectedRule = d.pricing_rules.find((r) => r.size_yards === 20) ?? d.pricing_rules[0];
        if (selectedRule) {
          setPickup(addDays(earliest, selectedRule.included_days));
        }
        setSize(
          d.pricing_rules.some((r) => r.size_yards === 20)
            ? 20
            : (d.pricing_rules[0]?.size_yards ?? 20),
        );
      })
      .catch((e) => setError(e.message));
  }, [slug]);
  if (!data)
    return (
      <div className="booking-page">
        <div className="loading">
          {error ? (
            <>
              <MapPin size={28} />
              <h2>Booking isn’t available here yet.</h2>
              <p>{error}</p>
              <Link href="/" className="btn">
                Back to RollOS
              </Link>
            </>
          ) : (
            <>
              <Loader2 className="spin" />
              <p>Getting your rental ready…</p>
            </>
          )}
        </div>
      </div>
    );
  const rule = data.pricing_rules.find((r) => r.size_yards === size);
  if (!rule)
    return (
      <div className="loading">
        <h2>This hauler is setting up their prices.</h2>
        <p>Please check back soon.</p>
      </div>
    );
  let price: ReturnType<typeof quote> | null = null;
  const customerFee = data.organization.pricing_config?.customer_fee_enabled !== false;
  try {
    price = quote(rule, delivery, pickup, 100, {
      customerFee,
      boards: customer.protective_boards,
    });
  } catch {}
  const changeDelivery = (date: string) => {
    setDelivery(date);
    setPickup(addDays(date, rule.included_days));
  };
  const next = () => {
    setError('');
    if (step === 1 && !rule.service_zips.includes(zip)) {
      setError(
        'We don’t service that ZIP code yet. Please try another address or call the hauler.',
      );
      return;
    }
    if (step === 2) {
      const noticeHours = data.organization.min_notice_hours ?? data.organization.pricing_config?.min_notice_hours ?? 24;
      const minLeadDays = Math.max(1, Math.ceil(noticeHours / 24));
      const earliest = addDays(today(), minLeadDays);
      if (!price || delivery < earliest) {
        setError(`Please choose a delivery date at least ${noticeHours} hours from now (${dateLabel(earliest)}).`);
        return;
      }
    }
    setStep(step + 1);
  };
  const submit = async () => {
    setBusy(true);
    setError('');
    try {
      const result = await api<{ job?: Job; url?: string; demo: boolean }>('/api/jobs', {
        method: 'POST',
        body: JSON.stringify({
          slug,
          size_yards: size,
          delivery_date: delivery,
          pickup_date: pickup,
          zip,
          ...customer,
          booking_key: key,
        }),
      });
      if (result.url) {
        window.location.assign(result.url);
        return;
      }
      setConfirmed(result.job!);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <main
      className="booking-page"
      style={embed ? { padding: '18px', minHeight: 'auto' } : undefined}
    >
      <div className="booking-nav">
        <Link className="booking-org" href={embed ? '#' : '/'}>
          <span className="org-logo">
            <Leaf size={21} />
          </span>
          {data.organization.name}
        </Link>
        <span className="booking-powered">
          Powered by <b>rollos</b>
        </span>
      </div>
      {confirmed ? (
        <section className="confirmation" aria-live="polite">
          <div className="check-icon">
            <CheckCircle2 size={32} />
          </div>
          <div className="eyebrow" style={{ color: '#94a778', marginBottom: 15 }}>
            {data.demo ? 'DEMO BOOKING CONFIRMED' : 'YOU’RE ON THE SCHEDULE'}
          </div>
          <h1>You’re all set, {confirmed.customer_name.split(' ')[0]}.</h1>
          <p>
            Your {confirmed.size_yards} yard dumpster is booked.
            <br />
            {data.demo
              ? 'This is a demo reservation. No card was charged or SMS sent.'
              : 'We’ll be in touch before your delivery.'}
          </p>
          <div className="confirmation-details">
            <div className="summary-line">
              <span>Reference</span>
              <strong>#{confirmed.id.slice(0, 8).toUpperCase()}</strong>
            </div>
            <div className="summary-line">
              <span>Delivery</span>
              <strong>{dateLabel(confirmed.delivery_date)}</strong>
            </div>
            <div className="summary-line">
              <span>Pickup</span>
              <strong>{dateLabel(confirmed.pickup_date)}</strong>
            </div>
            <div className="summary-line">
              <span>Address</span>
              <strong style={{ maxWidth: 240, textAlign: 'right' }}>
                {confirmed.delivery_address}
              </strong>
            </div>
            <div className="summary-line">
              <span>Rental total</span>
              <strong>{money(confirmed.price_cents)}</strong>
            </div>
            <div className="summary-line">
              <span>Paid today</span>
              <strong>{money(confirmed.deposit_cents)}</strong>
            </div>
          </div>
          <Link href="/dashboard" className="btn btn-primary">
            View the dispatch board <ArrowRight size={14} />
          </Link>
        </section>
      ) : (
        <>
          <div className="booking-header">
            <div className="eyebrow">LESS HASSLE. MORE GETTING IT DONE.</div>
            <h1>A dumpster for whatever’s next.</h1>
            <p>Simple pricing. Easy booking. We’ll handle the heavy lifting.</p>
          </div>
          <div className="booking-layout">
            <section className="panel booking-main">
              {data.demo && (
                <div className="booking-notice">
                  <FlaskConical size={13} />
                  Demo booking · No real payment or delivery · Try Austin ZIP 78704
                </div>
              )}
              <div className="steps">
                {['Size', 'Location', 'Dates', 'Details', 'Confirm'].map((label, i) => (
                  <Fragment key={label}>
                    {i > 0 && <div className="step-line" />}
                    <div className={`step ${i === step ? 'active' : i < step ? 'done' : ''}`}>
                      <span className="step-number">{i < step ? <Check size={11} /> : i + 1}</span>
                      <span>{label}</span>
                    </div>
                  </Fragment>
                ))}
              </div>
              {step === 0 && (
                <>
                  <h2>Find your fit.</h2>
                  <p className="intro">
                    Every rental includes delivery, pickup, and responsible disposal.
                  </p>
                  <div className="size-cards">
                    {data.pricing_rules
                      .sort((a, b) => a.size_yards - b.size_yards)
                      .map((r) => (
                        <button
                          key={r.id}
                          className={`size-card ${size === r.size_yards ? 'selected' : ''}`}
                          onClick={() => {
                            setSize(r.size_yards);
                            setPickup(addDays(delivery, r.included_days));
                          }}
                          aria-pressed={size === r.size_yards}
                        >
                          <span className="selection-check">
                            {size === r.size_yards && <Check size={11} />}
                          </span>
                          <Dumpster size={r.size_yards} />
                          <h3>{r.size_yards} yard dumpster</h3>
                          <p>{guidance[r.size_yards]}</p>
                          <strong>From {money(r.base_price_cents)}</strong>
                          {r.size_yards === 20 && <span className="popular">Most popular</span>}
                        </button>
                      ))}
                  </div>
                </>
              )}
              {step === 1 && (
                <>
                  <h2>Let’s make sure we can reach you.</h2>
                  <p className="intro">Enter the ZIP code where you need your dumpster.</p>
                  <label className="field">
                    Delivery ZIP code
                    <input
                      inputMode="numeric"
                      maxLength={5}
                      placeholder="e.g. 78704"
                      value={zip}
                      onChange={(e) => {
                        setZip(e.target.value.replace(/\D/g, ''));
                        setError('');
                      }}
                    />
                  </label>
                  {zip.length === 5 && rule.service_zips.includes(zip) && (
                    <div
                      className="success-box"
                      style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center' }}
                    >
                      <CheckCircle2 size={15} />
                      Good news — you’re in our service area.
                    </div>
                  )}
                  <p className="intro" style={{ marginTop: 24 }}>
                    Outside our service area?{' '}
                    <a
                      href={`tel:${data.organization.phone}`}
                      style={{ textDecoration: 'underline' }}
                    >
                      Give us a call
                    </a>{' '}
                    and we’ll see what we can do.
                  </p>
                </>
              )}
              {step === 2 && (() => {
                const noticeHours = data.organization.min_notice_hours ?? data.organization.pricing_config?.min_notice_hours ?? 24;
                const minLeadDays = Math.max(1, Math.ceil(noticeHours / 24));
                const earliestDelivery = addDays(today(), minLeadDays);

                return (
                  <>
                    <h2>Pick your project days.</h2>
                    <p className="intro">
                      Your rental includes {rule.included_days} days. Extra days are{' '}
                      {money(rule.extra_day_cents)} each. Need fewer days? We will pick it up early at no extra cost.
                    </p>
                    <div className="form-row">
                      <label className="field">
                        Delivery date
                        <input
                          type="date"
                          value={delivery < earliestDelivery ? earliestDelivery : delivery}
                          min={earliestDelivery}
                          onChange={(e) => e.target.value && changeDelivery(e.target.value)}
                        />
                      </label>
                      <label className="field">
                        Pickup date
                        <input
                          type="date"
                          value={pickup}
                          min={addDays(delivery < earliestDelivery ? earliestDelivery : delivery, 1)}
                          max={addDays(delivery < earliestDelivery ? earliestDelivery : delivery, 365)}
                          onChange={(e) => setPickup(e.target.value)}
                        />
                      </label>
                    </div>
                    <div className="deposit-note" style={{ marginTop: 23 }}>
                      Online bookings require at least {noticeHours} hours advance notice to schedule equipment.
                      {data.organization.phone && (
                        <span>
                          {' '}Need same-day or emergency delivery? Call our dispatch desk at{' '}
                          <a href={`tel:${data.organization.phone}`} style={{ textDecoration: 'underline', fontWeight: 600 }}>
                            {data.organization.phone}
                          </a>.
                        </span>
                      )}
                    </div>
                  </>
                );
              })()}
              {step === 3 && (
                <form
                  id="customer-form"
                  className="form-stack"
                  onSubmit={(e) => {
                    e.preventDefault();
                    next();
                  }}
                >
                  <div>
                    <h2>Who are we delivering to?</h2>
                    <p className="intro" style={{ marginBottom: 0 }}>
                      A few details so your delivery goes smoothly.
                    </p>
                  </div>
                  <label className="field">
                    Full name
                    <input
                      autoComplete="name"
                      required
                      value={customer.customer_name}
                      onChange={(e) =>
                        setCustomer({
                          ...customer,
                          customer_name: e.target.value,
                          signature_name: e.target.value,
                        })
                      }
                      placeholder="Your first and last name"
                      minLength={2}
                    />
                  </label>
                  <div className="form-row">
                    <label className="field">
                      Phone number
                      <input
                        type="tel"
                        autoComplete="tel"
                        required
                        pattern="\+[1-9][0-9]{7,14}"
                        placeholder="+15125551234"
                        value={customer.customer_phone}
                        onChange={(e) =>
                          setCustomer({ ...customer, customer_phone: e.target.value })
                        }
                      />
                      <small>Include your country code (+1 for US).</small>
                    </label>
                    <label className="field">
                      Email address
                      <input
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="you@example.com"
                        value={customer.customer_email}
                        onChange={(e) =>
                          setCustomer({ ...customer, customer_email: e.target.value })
                        }
                      />
                    </label>
                  </div>
                  <label className="field">
                    Delivery address
                    <input
                      autoComplete="street-address"
                      required
                      minLength={8}
                      placeholder="Street address, city, state"
                      value={customer.delivery_address}
                      onChange={(e) =>
                        setCustomer({ ...customer, delivery_address: e.target.value })
                      }
                    />
                  </label>
                  <label className="field">
                    Placement instructions <small>Optional</small>
                    <textarea
                      placeholder="Driveway location, gate code, or anything we should know…"
                      maxLength={1000}
                      value={customer.notes}
                      onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                    />
                  </label>
                  <label
                    style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border, #e2e8f0)',
                      background: customer.protective_boards ? 'rgba(0, 0, 0, 0.03)' : 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={customer.protective_boards}
                      onChange={(e) =>
                        setCustomer({ ...customer, protective_boards: e.target.checked })
                      }
                      style={{ marginTop: '3px' }}
                    />
                    <div>
                      <strong style={{ display: 'block', fontSize: '14px' }}>
                        Protective wood boards under container rails (+{money(1900)})
                      </strong>
                      <span style={{ fontSize: '13px', color: 'var(--muted, #666)' }}>
                        Driver places wood blocking under rollers during delivery.
                      </span>
                    </div>
                  </label>
                </form>
              )}
              {step === 4 && (
                <form
                  id="confirm-form"
                  className="form-stack"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void submit();
                  }}
                >
                  <div>
                    <h2>One last thing. Then you’re rolling.</h2>
                    <p className="intro" style={{ marginBottom: 0 }}>
                      Review your details and sign your rental agreement.
                    </p>
                  </div>
                  <div style={{ background: '#f6f8f2', borderRadius: 8, padding: 18 }}>
                    <h3 style={{ fontSize: 13, marginBottom: 8 }}>{customer.customer_name}</h3>
                    <p style={{ fontSize: 12, color: '#859476', lineHeight: 1.8 }}>
                      {customer.delivery_address}
                      <br />
                      {zip} · {customer.customer_phone}
                      <br />
                      {customer.customer_email}
                    </p>
                  </div>
                  <label className="field">
                    Your electronic signature
                    <input
                      required
                      minLength={2}
                      placeholder="Type your full name"
                      value={customer.signature_name}
                      onChange={(e) => setCustomer({ ...customer, signature_name: e.target.value })}
                    />
                  </label>
                  <label className="terms-box">
                    <input
                      type="checkbox"
                      required
                      checked={customer.accepted_terms}
                      onChange={(e) =>
                        setCustomer({ ...customer, accepted_terms: e.target.checked })
                      }
                    />
                    <span>
                      I agree to the{' '}
                      <Link href="/terms" target="_blank" style={{ textDecoration: 'underline' }}>
                        rental terms
                      </Link>
                      . I pay the full base rental today. Extra days and tonnage over the included
                      weight can be charged later to this card, and I will receive the scale ticket
                      with that charge. I consent to service-related SMS updates.
                    </span>
                  </label>
                  <div className="deposit-note">
                    {data.demo
                      ? 'Demo checkout simulates the full rental. No card details are needed and no money moves.'
                      : 'You’ll pay the full base rental on Stripe. Your card is saved only for extra days and tonnage, and only if a scale ticket is attached.'}
                  </div>
                </form>
              )}
              {error && (
                <div role="alert" className="error-box" style={{ marginTop: 18 }}>
                  {error}
                </div>
              )}
              <div className="booking-buttons">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setStep(Math.max(0, step - 1));
                    setError('');
                  }}
                  disabled={step === 0 || busy}
                >
                  <ArrowLeft size={13} />
                  Back
                </Button>
                {step < 3 ? (
                  <Button variant="primary" onClick={next}>
                    Continue <ArrowRight size={14} />
                  </Button>
                ) : step === 3 ? (
                  <Button variant="primary" type="submit" form="customer-form">
                    Review booking <ArrowRight size={14} />
                  </Button>
                ) : (
                  <Button variant="primary" type="submit" form="confirm-form" disabled={busy}>
                    {busy ? <Loader2 size={14} className="spin" /> : <LockKeyhole size={13} />}{' '}
                    {data.demo
                      ? 'Confirm demo booking'
                      : `Pay ${money(price?.total ?? 0)}`}
                  </Button>
                )}
              </div>
            </section>
            <aside className="panel booking-summary">
              <div className="eyebrow">YOUR PROJECT, AT A GLANCE</div>
              <Dumpster size={size} />
              <h3>{size} yard dumpster</h3>
              <div className="summary-line">
                <span>Base rental · {rule.included_days} days</span>
                <strong>{money(rule.base_price_cents)}</strong>
              </div>
              <div className="summary-line">
                <span>Included disposal</span>
                <strong>{rule.included_tons} tons</strong>
              </div>
              {step >= 2 && (
                <>
                  <div className="summary-line">
                    <span>Delivery</span>
                    <strong>{dateLabel(delivery)}</strong>
                  </div>
                  <div className="summary-line">
                    <span>Pickup</span>
                    <strong>{pickup ? dateLabel(pickup) : 'Choose date'}</strong>
                  </div>
                </>
              )}
              {price && price.extraDays > 0 && (
                <div className="summary-line">
                  <span>
                    {price.extraDays} extra day{price.extraDays > 1 ? 's' : ''}
                  </span>
                  <strong>{money(price.extra)}</strong>
                </div>
              )}
              {price && price.reservationFee > 0 && (
                <div className="summary-line">
                  <span>Priority dispatch & reservation</span>
                  <strong>{money(price.reservationFee)}</strong>
                </div>
              )}
              {price && price.boardsFee > 0 && (
                <div className="summary-line">
                  <span>Protective wood boards</span>
                  <strong>{money(price.boardsFee)}</strong>
                </div>
              )}
              <div className="summary-total">
                <span>Rental total</span>
                <strong>{price ? money(price.total) : '—'}</strong>
              </div>
              <div className="deposit-note">
                <b>{price ? money(price.total) : '—'} due today.</b>
                <br />
                Extra days and disposal above {rule.included_tons} tons (
                {money(rule.overage_per_ton_cents)}/ton) are charged after pickup, with the scale
                ticket.
              </div>
              <div className="summary-trust">
                <ShieldCheck size={13} />
                Transparent prices. No surprise software fees.
              </div>
            </aside>
          </div>
        </>
      )}
    </main>
  );
}
