'use client';
import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Camera,
  Check,
  Download,
  ExternalLink,
  Loader2,
  MapPin,
  Save,
  ShieldCheck,
  Star,
  AlertTriangle,
  FileText,
  Lock,
  Edit2,
  MessageSquare,
  CreditCard,
  Clock,
  RefreshCw,
  Printer,
  Smartphone,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { Modal } from './ui/dialog';
import { Button } from './ui/button';
import { api } from '@/lib/client';
import { money, dateLabel, statusLabels, today, type Workspace, type Job } from '@/lib/types';
import { invoice } from '@/lib/pricing';
import { statusColors } from './dispatch-board';
export function JobDrawer({
  job,
  data,
  onClose,
  onUpdate,
  notify,
}: {
  job: Job;
  data: Workspace;
  onClose: () => void;
  onUpdate: () => Promise<void>;
  notify: (message: string, error?: boolean) => void;
}) {
  const [driver, setDriver] = useState(job.driver_id ?? '');
  const [container, setContainer] = useState(job.container_id ?? '');
  const [delivery, setDelivery] = useState(job.delivery_date);
  const [pickup, setPickup] = useState(job.pickup_date);
  const [notes, setNotes] = useState(job.notes);
  const [tons, setTons] = useState(job.tons_actual === null ? '' : String(job.tons_actual));
  const [unlockTons, setUnlockTons] = useState(false);
  const [proof, setProof] = useState(job.proof_url ?? '');
  const [pickupProof, setPickupProof] = useState(job.pickup_proof_url ?? '');
  const [scaleTicket, setScaleTicket] = useState(job.scale_ticket_url ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const isPaid =
    data.organization.subscription_status === 'active' || Boolean(data.organization.is_paid_plan);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const swapSizes: number[] = useMemo(() => {
    const fromRules = data.pricing_rules.map((r) => r.size_yards);
    const fromContainers = data.containers.map((c) => c.size_yards);
    return Array.from(new Set([...fromRules, ...fromContainers, 10, 20, 30, 40])).sort((a, b) => a - b);
  }, [data.pricing_rules, data.containers]);
  const [swapSize, setSwapSize] = useState<number>(job.size_yards || 20);
  const [swapDeliveryDate, setSwapDeliveryDate] = useState(today());
  const [swapDriverId, setSwapDriverId] = useState(job.driver_id ?? '');
  const [swapNotes, setSwapNotes] = useState('');
  const [swapBusy, setSwapBusy] = useState(false);
  const [swapError, setSwapError] = useState('');
  const [sendingWaiver, setSendingWaiver] = useState(false);
  const [copiedWaiver, setCopiedWaiver] = useState(false);

  const sendWaiver = async () => {
    setSendingWaiver(true);
    try {
      await api(`/api/jobs/${job.id}/send-waiver`, { method: 'POST' });
      notify(`Waiver link sent via SMS to ${job.customer_phone}`);
    } catch (e) {
      notify((e as Error).message, true);
    } finally {
      setSendingWaiver(false);
    }
  };

  const copyWaiverLink = async () => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      await navigator.clipboard.writeText(`${origin}/agreement/${job.id}`);
      setCopiedWaiver(true);
      notify('Waiver signing link copied to clipboard!');
      setTimeout(() => setCopiedWaiver(false), 3000);
    } catch {
      notify('Could not copy link', true);
    }
  };

  const total = invoice({ ...job, tons_actual: tons === '' ? null : Number(tons) });
  const payments = data.payments.filter((p) => p.job_id === job.id);
  const paid = payments
    .filter((p) => ['demo', 'succeeded'].includes(p.status))
    .reduce((n, p) => n + p.amount_cents - p.refunded_cents, 0);
  const perform = async (fn: () => Promise<unknown>, message: string) => {
    setBusy(true);
    setError('');
    try {
      await fn();
      await onUpdate();
      notify(message);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const save = async (status?: string) =>
    perform(
      () =>
        api(`/api/jobs/${job.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            driver_id: driver || null,
            container_id: container || null,
            delivery_date: delivery,
            pickup_date: pickup,
            notes,
            ...(tons !== '' ? { tons_actual: Number(tons) } : {}),
            ...(proof ? { proof_url: proof } : {}),
            ...(pickupProof ? { pickup_proof_url: pickupProof } : {}),
            ...(scaleTicket ? { scale_ticket_url: scaleTicket } : {}),
            ...(status ? { status } : {}),
          }),
        }),
      status ? 'Job status updated.' : 'Job details saved.',
    );
  const upload = async (
    file: File,
    kind: 'delivery' | 'pickup' | 'scale_ticket' = 'delivery',
  ) => {
    const form = new FormData();
    form.set('photo', file);
    form.set('job_id', job.id);
    await perform(async () => {
      const result = await api<{ url: string }>('/api/upload', { method: 'POST', body: form });
      if (kind === 'delivery') {
        setProof(result.url);
      } else if (kind === 'pickup') {
        setPickupProof(result.url);
      } else {
        setScaleTicket(result.url);
        await api(`/api/jobs/${job.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ scale_ticket_url: result.url }),
        });
      }
    }, kind === 'delivery' ? 'Delivery drop photo uploaded.' : kind === 'pickup' ? 'Pickup driveway photo uploaded.' : 'Landfill scale ticket uploaded.');
  };
  const download = () => {
    const text = `RollOS rental invoice\n${data.organization.name}\nJob ${job.id}\nCustomer: ${job.customer_name}\nAddress: ${job.delivery_address}\nRental: ${dateLabel(job.delivery_date)} - ${dateLabel(job.pickup_date)}\nBase: ${money(total.base)}\nExtra days: ${money(total.extra)}\nOverage: ${money(total.overage)}\nTotal: ${money(total.total)}\nPayments applied: ${money(paid)}\nBalance: ${money(Math.max(0, total.total - paid))}\n${data.demo ? 'DEMO ONLY — NO MONEY MOVED' : ''}`;
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${job.id.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <Modal
      open
      onOpenChange={(o) => !o && onClose()}
      title={job.customer_name}
      description={`Rental #${job.id.slice(0, 8).toUpperCase()} · ${job.size_yards} yard dumpster`}
      drawer
    >
      <div className="drawer-status">
        <span className="pill" style={{ color: statusColors[job.status] }}>
          <span className="dot" />
          {statusLabels[job.status]}
        </span>
        {job.is_swap && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              fontSize: 11,
              fontWeight: 700,
              background: '#ecfdf5',
              color: '#065f46',
              border: '1px solid #a7f3d0',
              padding: '2px 8px',
              borderRadius: 4,
            }}
          >
            🔄 SWAP
          </span>
        )}
        {(job.is_commercial ||
          job.payment_type === 'net_30' ||
          job.notes?.includes('VIP CONTRACTOR') ||
          job.notes?.includes('VIP Contractor')) && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              fontSize: 11,
              fontWeight: 700,
              background: '#eff6ff',
              color: '#1d4ed8',
              border: '1px solid #bfdbfe',
              padding: '2px 8px',
              borderRadius: 4,
            }}
          >
            🏗️ VIP NET-30 TRADE ACCOUNT
          </span>
        )}
        <strong style={{ fontSize: 19 }}>{money(job.price_cents)}</strong>
      </div>
      {(job.is_commercial ||
        job.payment_type === 'net_30' ||
        job.notes?.includes('VIP CONTRACTOR') ||
        job.notes?.includes('VIP Contractor')) && (
        <div
          style={{
            marginBottom: 14,
            padding: '10px 12px',
            borderRadius: 8,
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ fontSize: 12, color: '#1e3a8a', lineHeight: 1.4 }}>
            <strong style={{ display: 'block', fontSize: 12.5 }}>
              Commercial Trade Account ({job.customer_name})
            </strong>
            <span>Billed to consolidated monthly Net-30 statement · 1-Tap Swap enabled</span>
          </div>
          <a
            href={`/contractor/${data.organization.slug}?account=${encodeURIComponent(job.customer_name)}`}
            target="_blank"
            rel="noreferrer"
            className="btn"
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              padding: '6px 10px',
              background: '#1d4ed8',
              color: '#ffffff',
              border: 'none',
              borderRadius: 6,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            Open Contractor Portal & Net-30 Statement <ExternalLink size={11} />
          </a>
        </div>
      )}
      <section className="drawer-section">
        <h3>Customer & delivery</h3>
        <p style={{ fontSize: 12, lineHeight: 1.8, color: '#7a8980' }}>
          {job.delivery_address}
          <br />
          {job.zip}
        </p>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.delivery_address + ' ' + job.zip)}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-ghost"
          style={{ padding: '7px 0', fontSize: 11 }}
        >
          <MapPin size={12} />
          Open in maps <ExternalLink size={10} />
        </a>
        <div className="detail-line">
          <span>Phone</span>
          <a href={`tel:${job.customer_phone}`}>{job.customer_phone}</a>
        </div>
        <div className="detail-line">
          <span>Email</span>
          <a href={`mailto:${job.customer_email}`}>{job.customer_email}</a>
        </div>
      </section>
      <section className="drawer-section">
        <h3>Dispatch details</h3>
        <div className="form-stack">
          <div className="form-row">
            <label className="field">
              Delivery
              <input
                type="date"
                value={delivery}
                onChange={(e) => setDelivery(e.target.value)}
                disabled={job.status !== 'booked'}
              />
            </label>
            <label className="field">
              Pickup
              <input
                type="date"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                disabled={['completed', 'cancelled'].includes(job.status)}
              />
            </label>
          </div>
          <label className="field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Driver assignment & workload</span>
              {driver && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ fontSize: 11, padding: '2px 6px', height: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}
                  onClick={async () => {
                    const u = data.users.find((user) => user.id === driver);
                    if (!u?.phone) {
                      notify('Please add a phone number for this driver in the Drivers tab first.', true);
                      return;
                    }
                    try {
                      const result = await api<{ status: string; demo: boolean }>(
                        '/api/invite-driver',
                        { method: 'POST', body: JSON.stringify({ driver_id: u.id }) },
                      );
                      notify(
                        result.demo
                          ? `Demo SMS route link logged for ${u.name}.`
                          : `Route link sent to ${u.name} via SMS.`,
                      );
                    } catch (e) {
                      notify((e as Error).message, true);
                    }
                  }}
                >
                  <MessageSquare size={11} />
                  SMS route link
                </button>
              )}
            </div>
            <select
              value={driver}
              onChange={(e) => setDriver(e.target.value)}
              disabled={['completed', 'cancelled'].includes(job.status)}
            >
              <option value="">Select a driver</option>
              {data.users
                .filter((u) => u.role === 'driver')
                .map((u) => {
                  const activeCount = data.jobs.filter(
                    (j) => j.driver_id === u.id && ['dispatched', 'delivered'].includes(j.status),
                  ).length;
                  return (
                    <option key={u.id} value={u.id}>
                      {u.name} · {activeCount} active jobs
                    </option>
                  );
                })}
            </select>
            <small>Shows current active truck load to help balance daily routes.</small>
          </label>
          <label className="field">
            Container
            <select
              value={container}
              onChange={(e) => setContainer(e.target.value)}
              disabled={['completed', 'cancelled'].includes(job.status)}
            >
              <option value="">Select a container</option>
              {data.containers
                .filter((c) => c.size_yards === job.size_yards)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label} · {c.size_yards} yd ·{' '}
                    {c.current_job_id === job.id
                      ? 'Assigned to this job'
                      : c.status === 'yard'
                        ? 'Available in yard'
                        : c.status === 'on_site'
                          ? 'Already on site'
                          : 'Maintenance'}
                  </option>
                ))}
            </select>
            <small>Swap container if the wrong unit was dropped, or choose an available unit.</small>
          </label>
          <label className="field">
            Job notes
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={2000}
              disabled={['completed', 'cancelled'].includes(job.status)}
            />
          </label>
          {job.driver_notes && (
            <div
              style={{
                marginTop: 10,
                padding: '10px 12px',
                background: '#fff9e6',
                border: '1px solid #fedf89',
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#93530e',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  marginBottom: 4,
                }}
              >
                <AlertTriangle size={13} />
                Driver field alert / site note
              </div>
              <p style={{ fontSize: 12, color: '#7a3e07', margin: 0, lineHeight: 1.5 }}>
                {job.driver_notes}
              </p>
            </div>
          )}
        </div>
      </section>
      <section className="drawer-section">
        <h3>Rental breakdown</h3>
        <div className="detail-line">
          <span>Base rental ({job.pricing_snapshot.included_days} days)</span>
          <b>{money(total.base)}</b>
        </div>
        <div className="detail-line">
          <span>Extra days ({total.extraDays})</span>
          <b>{money(total.extra)}</b>
        </div>
        <div className="detail-line">
          <span>Included tonnage</span>
          <b>{job.tons_included} tons</b>
        </div>
        <div style={{ marginTop: 17, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#334839' }}>Actual landfill weight</span>
          {job.tons_actual !== null && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
                color: '#3d6d45',
                background: '#eef6ea',
                padding: '2px 8px',
                borderRadius: 4,
                fontWeight: 600,
              }}
            >
              <Check size={12} /> Logged: {job.tons_actual} tons
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            placeholder={`Enter scale weight (included: ${job.tons_included} tons)`}
            value={tons}
            onChange={(e) => setTons(e.target.value)}
            disabled={job.status === 'completed' || (job.tons_actual !== null && !unlockTons)}
            style={{
              flex: 1,
              background: job.tons_actual !== null && !unlockTons ? '#f4f6f4' : 'white',
              color: job.tons_actual !== null && !unlockTons ? '#566657' : '#1e2d24',
              cursor: job.tons_actual !== null && !unlockTons ? 'not-allowed' : 'text',
            }}
          />
          {job.tons_actual !== null && job.status !== 'completed' && (
            <button
              type="button"
              onClick={() => setUnlockTons(!unlockTons)}
              className="btn btn-ghost"
              style={{
                fontSize: 11,
                padding: '6px 10px',
                minHeight: 38,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                border: '1px solid #d0dcd1',
              }}
              title="Unlock to adjust weight"
            >
              {unlockTons ? <Lock size={12} /> : <Edit2 size={12} />}
              {unlockTons ? 'Lock' : 'Edit'}
            </button>
          )}
        </div>
        <small style={{ color: '#889886', fontSize: 11, marginTop: 4, display: 'block' }}>
          {job.tons_actual !== null
            ? `Protected from accidental edits. Click 'Edit' to make corrections.`
            : `Enter the landfill scale ticket weight in tons. Overages calculate automatically.`}
        </small>
        {tons !== '' && Number(tons) > job.tons_included && (
          <div
            style={{
              marginTop: 10,
              padding: '10px 12px',
              background: '#fef3c7',
              border: '1px solid #fde68a',
              borderRadius: 8,
              fontSize: 12,
              color: '#92400e',
            }}
          >
            <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
              <AlertTriangle size={14} />
              <span>Overage: +{(Number(tons) - job.tons_included).toFixed(2)} tons over included {job.tons_included} tons</span>
            </div>
            <span>
              Overage fee: <b>{money(total.overage)}</b>.
              {!scaleTicket && !job.scale_ticket_url ? ' Attach the landfill scale ticket below to charge the card on file.' : ' Scale ticket attached. Click below to charge the card on file.'}
            </span>
            {!scaleTicket && !job.scale_ticket_url && (
              <div style={{ marginTop: 8 }}>
                <label
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: '#d97706',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: 11,
                    padding: '7px 12px',
                    borderRadius: 6,
                    cursor: busy ? 'not-allowed' : 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  }}
                >
                  <span>📸 Snap / Attach Landfill Weight Slip Now (Prevents Chargebacks)</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    capture="environment"
                    disabled={busy}
                    style={{ display: 'none' }}
                    onChange={(e) => e.target.files?.[0] && void upload(e.target.files[0], 'scale_ticket')}
                  />
                </label>
              </div>
            )}
            <div style={{ fontSize: 11, color: '#78350f', marginTop: 6, fontStyle: 'italic' }}>
              Certified weight slip is automatically attached to the customer&apos;s final SMS receipt.
            </div>
          </div>
        )}
        {tons !== '' && Number(tons) <= job.tons_included && (
          <div
            style={{
              marginTop: 10,
              padding: '8px 12px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 8,
              fontSize: 11,
              color: '#166534',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <CheckCircle2 size={13} className="text-emerald-600 flex-shrink-0" />
            <span>Under weight allowance! {tons} tons is within the {job.tons_included}-ton allowance. No overage fee applies.</span>
          </div>
        )}
        <div className="detail-line" style={{ marginTop: 12 }}>
          <span>Disposal overage</span>
          <b>{money(total.overage)}</b>
        </div>
        <div className="detail-line" style={{ borderTop: '1px solid var(--line)', paddingTop: 12 }}>
          <span>Invoice total</span>
          <b>{money(total.total)}</b>
        </div>
        <div className="detail-line">
          <span>{data.demo ? 'Simulated payments' : 'Paid'}</span>
          <b>{money(paid)}</b>
        </div>
        <div className="detail-line">
          <span>Balance</span>
          <b style={{ color: Math.max(0, total.total - paid) > 0 ? '#ea580c' : '#1e2d24' }}>
            {money(Math.max(0, total.total - paid))}
          </b>
        </div>
        {/* Card on File Authorization Status */}
        <div
          style={{
            marginTop: 12,
            padding: '8px 12px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 11,
            color: '#334155',
          }}
        >
          <CreditCard size={14} className="text-emerald-600 flex-shrink-0" />
          <div>
            <span style={{ fontWeight: 600 }}>Stripe Card on File: </span>
            <span style={{ color: '#64748b' }}>
              Authorized off-session for excess tonnage & extra days.
            </span>
          </div>
        </div>
        {total.overage > 0 && !scaleTicket && !job.scale_ticket_url && (
          <div
            style={{
              marginTop: 8,
              padding: '8px 12px',
              background: '#fffbeb',
              border: '1px solid #fef08a',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 11,
              color: '#854d0e',
            }}
          >
            <AlertTriangle size={14} className="flex-shrink-0" />
            <span>
              Attach scale ticket below to verify this overage before billing card on file.
            </span>
          </div>
        )}
        {Math.max(0, total.total - paid) === 0 && (
          <div
            style={{
              marginTop: 10,
              padding: '8px 12px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 8,
              fontSize: 11,
              color: '#166534',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <CheckCircle2 size={13} className="text-emerald-600 flex-shrink-0" />
            <span>Balance paid in full ($0.00). Entering disposal weight over {job.tons_included} tons calculates the overage and opens the charge button.</span>
          </div>
        )}
        {Math.max(0, total.total - paid) > 0 && job.status !== 'cancelled' && (
          <Button
            variant="primary"
            disabled={busy}
            style={{ width: '100%', marginTop: 10, fontSize: 12, minHeight: 40 }}
            onClick={() =>
              void perform(
                async () => {
                  if (tons !== '' && Number(tons) !== job.tons_actual) {
                    await api(`/api/jobs/${job.id}`, {
                      method: 'PATCH',
                      body: JSON.stringify({ tons_actual: Number(tons) }),
                    });
                  }
                  return api(`/api/jobs/${job.id}/invoice`, { method: 'POST', body: '{}' });
                },
                data.demo
                  ? 'Demo payment charged successfully. Balance settled.'
                  : 'Customer card on file charged for outstanding balance.',
              )
            }
          >
            {busy ? <Loader2 size={13} className="spin" /> : <CreditCard size={13} />}
            Charge card on file ({money(Math.max(0, total.total - paid))})
          </Button>
        )}
        <Button variant="ghost" onClick={download} style={{ padding: '10px 0', marginTop: 5 }}>
          <Download size={13} />
          Download invoice
        </Button>
        {payments.map((p) => (
          <div className="detail-line" key={p.id} style={{ fontSize: 10 }}>
            <span>
              {p.status === 'demo' ? 'Demo transaction' : (p.stripe_payment_intent_id ?? 'Pending')}
            </span>
            <span className="pill">
              {p.status} · {money(p.amount_cents)}
            </span>
          </div>
        ))}
      </section>

      {/* Timestamped Job Activity Timeline */}
      <section className="drawer-section">
        <h3>
          <Clock size={13} style={{ display: 'inline', marginRight: 5, color: '#627c54' }} />
          Job activity timeline
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
          <div style={{ display: 'flex', gap: 10, fontSize: 11 }}>
            <span className="dot" style={{ background: '#3b523f', marginTop: 4 }} />
            <div>
              <b style={{ color: '#263b2c' }}>Job booked online</b>
              <div style={{ color: '#889886', fontSize: 10 }}>
                {new Date(job.created_at).toLocaleString()} · Initial reservation
              </div>
            </div>
          </div>
          {job.driver_id && (
            <div style={{ display: 'flex', gap: 10, fontSize: 11 }}>
              <span className="dot" style={{ background: '#3b523f', marginTop: 4 }} />
              <div>
                <b style={{ color: '#263b2c' }}>Assigned to {data.users.find((u) => u.id === job.driver_id)?.name ?? 'Driver'}</b>
                <div style={{ color: '#889886', fontSize: 10 }}>
                  Scheduled for delivery on {dateLabel(job.delivery_date)}
                </div>
              </div>
            </div>
          )}
          {job.delivered_at && (
            <div style={{ display: 'flex', gap: 10, fontSize: 11 }}>
              <span className="dot" style={{ background: '#45793b', marginTop: 4 }} />
              <div>
                <b style={{ color: '#263b2c' }}>Container delivered</b>
                <div style={{ color: '#889886', fontSize: 10 }}>
                  {new Date(job.delivered_at).toLocaleString()}
                  {job.proof_url ? ' · Photo proof captured' : ''}
                </div>
              </div>
            </div>
          )}
          {job.picked_up_at && (
            <div style={{ display: 'flex', gap: 10, fontSize: 11 }}>
              <span className="dot" style={{ background: '#45793b', marginTop: 4 }} />
              <div>
                <b style={{ color: '#263b2c' }}>Container picked up</b>
                <div style={{ color: '#889886', fontSize: 10 }}>
                  {new Date(job.picked_up_at).toLocaleString()} · Returned to yard
                </div>
              </div>
            </div>
          )}
          {job.tons_actual !== null && (
            <div style={{ display: 'flex', gap: 10, fontSize: 11 }}>
              <span className="dot" style={{ background: '#698741', marginTop: 4 }} />
              <div>
                <b style={{ color: '#263b2c' }}>Landfill scale weight logged: {job.tons_actual} tons</b>
                <div style={{ color: '#889886', fontSize: 10 }}>
                  {job.tons_actual > job.tons_included
                    ? `Disposal overage: ${(job.tons_actual - job.tons_included).toFixed(2)} tons billed`
                    : 'Within included tonnage'}
                </div>
              </div>
            </div>
          )}
          {job.status === 'completed' && (
            <div style={{ display: 'flex', gap: 10, fontSize: 11 }}>
              <span className="dot" style={{ background: '#253a2b', marginTop: 4 }} />
              <div>
                <b style={{ color: '#263b2c' }}>Rental completed & closed</b>
                <div style={{ color: '#889886', fontSize: 10 }}>
                  Invoice finalized · Account settled
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <section className="drawer-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={16} className="text-[#ea580c]" />
            Signed Rental Agreement & Waiver
          </h3>
          {job.signed_by_customer !== false && job.signature.ip !== 'dispatch-phone' ? (
            <span className="pill" style={{ background: '#ecfdf5', color: '#065f46', fontSize: 10, fontWeight: 700 }}>
              <Check size={11} /> Legally Binding E-Sign
            </span>
          ) : (
            <span className="pill" style={{ background: '#fff7ed', color: '#c2410c', fontSize: 10, fontWeight: 700 }}>
              ⚠️ Signature Pending
            </span>
          )}
        </div>

        {job.signed_by_customer === false || job.signature.ip === 'dispatch-phone' ? (
          <div style={{ padding: '10px 12px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, margin: '8px 0' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9a3412', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <AlertTriangle size={13} className="text-[#ea580c]" /> Customer Remote Signature Needed
            </div>
            <p style={{ fontSize: 11, color: '#7c2d12', margin: '0 0 8px 0', lineHeight: 1.4 }}>
              Order recorded over phone. Send signing link via SMS/email so customer can sign the property damage waiver from their mobile phone before drop-off.
            </p>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                type="button"
                onClick={sendWaiver}
                disabled={sendingWaiver}
                className="btn btn-primary"
                style={{ fontSize: 11, padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: 4 }}
              >
                <Smartphone size={12} /> {sendingWaiver ? 'Sending SMS…' : 'Text Waiver Link'}
              </button>
              <button
                type="button"
                onClick={copyWaiverLink}
                className="btn btn-secondary"
                style={{ fontSize: 11, padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: 4 }}
              >
                <Copy size={12} /> {copiedWaiver ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        ) : null}

        <div className="signature">{job.signature.name}</div>
        <p style={{ fontSize: 11, color: '#687864', lineHeight: 1.6, marginTop: 6, marginBottom: 8 }}>
          Signed: <b>{new Date(job.signature.timestamp).toLocaleString()}</b>
          <br />
          Audit IP: <span style={{ fontFamily: 'monospace' }}>{job.signature.ip}</span>
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 4, background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', fontWeight: 600 }}>
            ✓ Driveway Damage Waiver
          </span>
          <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 4, background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', fontWeight: 600 }}>
            ✓ Prohibited Hazmat Terms ($150-$500 Fine)
          </span>
          <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 4, background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', fontWeight: 600 }}>
            ✓ Card on File Overage Rights
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 10 }}>
          <Link
            href={`/agreement/${job.id}`}
            target="_blank"
            className="btn btn-secondary"
            style={{ fontSize: 11, padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
          >
            <Printer size={13} className="text-[#ea580c]" /> View & Print Executed Agreement <ExternalLink size={10} />
          </Link>
          <Link
            href="/templates/dumpster-rental-contract"
            target="_blank"
            className="btn btn-ghost"
            style={{ fontSize: 11, padding: '4px 6px', display: 'inline-flex', alignItems: 'center', gap: 4, color: '#687864' }}
          >
            <FileText size={12} /> Master Template <ExternalLink size={10} />
          </Link>
        </div>
      </section>

      {/* Driveway Condition Photos (Drop & Pick) */}
      <section className="drawer-section">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <Camera size={16} className="text-[#ea580c]" />
          Driveway Condition Photos (Drop & Pick)
        </h3>
        <p style={{ fontSize: 11, color: '#687864', marginBottom: 12, lineHeight: 1.5 }}>
          Timestamped surface photos prior to placement and after retrieval to prove roll-off wheels didn’t cause driveway cracks.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {/* Drop Photo */}
          <div style={{ border: '1px solid var(--line)', borderRadius: 8, padding: 10, background: '#fafcf9' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#1e2d24' }}>1. Placement / Drop Photo</span>
              {job.delivered_at && (
                <span style={{ fontSize: 10, color: '#687864' }}>
                  {new Date(job.delivered_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              )}
            </div>
            {proof || job.proof_url ? (
              <>
                <div style={{ borderRadius: 6, overflow: 'hidden', border: '1px solid var(--line)', maxHeight: 130 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={proof || job.proof_url!}
                    alt="Drop photo"
                    style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <a
                  href={proof || job.proof_url!}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost"
                  style={{ marginTop: 6, fontSize: 11, padding: '4px 0', width: '100%', justifyContent: 'center' }}
                >
                  <Camera size={11} /> View full resolution <ExternalLink size={10} />
                </a>
              </>
            ) : (
              <div style={{ padding: '20px 10px', textAlign: 'center', background: '#f4f6f4', borderRadius: 6, border: '1px dashed #cbd5c4' }}>
                <Camera size={20} style={{ margin: '0 auto 6px', color: '#94a778' }} />
                <span style={{ fontSize: 11, color: '#738372', display: 'block' }}>Pending drop photo</span>
              </div>
            )}
            <label style={{ display: 'block', marginTop: 8 }}>
              <span style={{ fontSize: 10, color: '#566657', cursor: 'pointer', textDecoration: 'underline' }}>
                {proof || job.proof_url ? 'Replace drop photo' : 'Upload drop photo'}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png"
                capture="environment"
                disabled={busy}
                style={{ display: 'none' }}
                onChange={(e) => e.target.files?.[0] && void upload(e.target.files[0], 'delivery')}
              />
            </label>
          </div>

          {/* Pick Photo */}
          <div style={{ border: '1px solid var(--line)', borderRadius: 8, padding: 10, background: '#fafcf9' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#1e2d24' }}>2. Retrieval / Pick Photo</span>
              {job.picked_up_at && (
                <span style={{ fontSize: 10, color: '#687864' }}>
                  {new Date(job.picked_up_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              )}
            </div>
            {pickupProof || job.pickup_proof_url ? (
              <>
                <div style={{ borderRadius: 6, overflow: 'hidden', border: '1px solid var(--line)', maxHeight: 130 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pickupProof || job.pickup_proof_url!}
                    alt="Pick retrieval photo"
                    style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <a
                  href={pickupProof || job.pickup_proof_url!}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost"
                  style={{ marginTop: 6, fontSize: 11, padding: '4px 0', width: '100%', justifyContent: 'center' }}
                >
                  <Camera size={11} /> View full resolution <ExternalLink size={10} />
                </a>
              </>
            ) : (
              <div style={{ padding: '20px 10px', textAlign: 'center', background: '#f4f6f4', borderRadius: 6, border: '1px dashed #cbd5c4' }}>
                <Camera size={20} style={{ margin: '0 auto 6px', color: '#94a778' }} />
                <span style={{ fontSize: 11, color: '#738372', display: 'block' }}>Pending retrieval photo</span>
              </div>
            )}
            <label style={{ display: 'block', marginTop: 8 }}>
              <span style={{ fontSize: 10, color: '#566657', cursor: 'pointer', textDecoration: 'underline' }}>
                {pickupProof || job.pickup_proof_url ? 'Replace pick photo' : 'Upload pick photo'}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png"
                capture="environment"
                disabled={busy}
                style={{ display: 'none' }}
                onChange={(e) => e.target.files?.[0] && void upload(e.target.files[0], 'pickup')}
              />
            </label>
          </div>
        </div>
      </section>

      {/* Landfill Scale Ticket */}
      <section className="drawer-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            <FileText size={16} className="text-[#ea580c]" />
            Landfill Scale Ticket & Weight Slip
          </h3>
          {scaleTicket || job.scale_ticket_url ? (
            <span className="pill" style={{ background: '#ecfdf5', color: '#065f46', fontSize: 10, fontWeight: 700 }}>
              <Check size={11} /> Verified Scale Slip
            </span>
          ) : (
            <span className="pill" style={{ background: '#fffbeb', color: '#92400e', fontSize: 10, fontWeight: 600 }}>
              Slip Required for Overages
            </span>
          )}
        </div>
        {scaleTicket || job.scale_ticket_url ? (
          <>
            <div style={{ marginTop: 8, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--line)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={scaleTicket || job.scale_ticket_url!}
                alt="Landfill scale ticket"
                style={{ width: '100%', maxHeight: 180, objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
              <a
                href={scaleTicket || job.scale_ticket_url!}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost"
                style={{ fontSize: 11, padding: '4px 0' }}
              >
                <FileText size={12} />
                Open full scale ticket <ExternalLink size={10} />
              </a>
              <label style={{ display: 'inline-block' }}>
                <span style={{ fontSize: 11, color: '#566657', cursor: 'pointer', textDecoration: 'underline' }}>
                  Replace scale ticket
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  capture="environment"
                  disabled={busy}
                  style={{ display: 'none' }}
                  onChange={(e) => e.target.files?.[0] && void upload(e.target.files[0], 'scale_ticket')}
                />
              </label>
            </div>
          </>
        ) : (
          <div style={{ marginTop: 8, padding: '14px', background: '#fafcf9', border: '1px dashed #cbd5c4', borderRadius: 8, textAlign: 'center' }}>
            <FileText size={22} style={{ margin: '0 auto 6px', color: '#94a778' }} />
            <p style={{ fontSize: 11, color: '#687864', margin: '0 0 10px 0' }}>
              Drivers can upload the scale slip directly from their route, or dispatch can upload it here from desktop.
            </p>
            <label className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, cursor: 'pointer', margin: '0 auto' }}>
              <Camera size={13} /> Upload Landfill Scale Ticket
              <input
                type="file"
                accept="image/jpeg,image/png"
                capture="environment"
                disabled={busy}
                style={{ display: 'none' }}
                onChange={(e) => e.target.files?.[0] && void upload(e.target.files[0], 'scale_ticket')}
              />
            </label>
          </div>
        )}
      </section>
      {error && (
        <div role="alert" className="error-box" style={{ marginTop: 20 }}>
          {error}
        </div>
      )}
      <div className="drawer-actions">
        {!['completed', 'cancelled'].includes(job.status) && (
          <Button disabled={busy} onClick={() => void save()}>
            <Save size={13} />
            Save changes
          </Button>
        )}
        {job.status === 'booked' && (
          <Button variant="primary" disabled={busy} onClick={() => void save('dispatched')}>
            {busy ? <Loader2 size={14} className="spin" /> : <ArrowRight size={14} />}Assign &
            dispatch
          </Button>
        )}
        {job.status === 'dispatched' && (
          <Button
            variant="primary"
            disabled={busy || !proof}
            onClick={() => void save('delivered')}
          >
            <Check size={14} />
            Mark delivered
          </Button>
        )}
        {job.status === 'delivered' && (
          <Button variant="primary" disabled={busy} onClick={() => void save('picked_up')}>
            <Check size={14} />
            Mark picked up
          </Button>
        )}
        {job.status === 'picked_up' && (
          <Button
            variant="primary"
            disabled={busy || tons === ''}
            onClick={() =>
              void perform(
                async () => {
                  await api(`/api/jobs/${job.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({ tons_actual: Number(tons), pickup_date: pickup, notes }),
                  });
                  return api(`/api/jobs/${job.id}/invoice`, { method: 'POST', body: '{}' });
                },
                data.demo
                  ? 'Demo invoice closed. No real charge was made.'
                  : 'Invoice submitted. Payment confirmation will update the job.',
              )
            }
          >
            {busy ? <Loader2 size={14} className="spin" /> : <Check size={14} />}{' '}
            {data.demo ? 'Close demo invoice' : 'Charge final balance'}
          </Button>
        )}
        {['delivered', 'picked_up', 'completed'].includes(job.status) && (
          <Button
            variant="ghost"
            disabled={busy}
            onClick={() =>
              void perform(
                () => api(`/api/jobs/${job.id}/review-request`, { method: 'POST', body: '{}' }),
                'Google review request SMS sent to customer.',
              )
            }
          >
            <Star size={13} style={{ color: '#d9a74a' }} />
            Send review request
          </Button>
        )}
        {['delivered', 'dispatched'].includes(job.status) && (
          <Button
            type="button"
            disabled={busy}
            onClick={() => {
              if (!isPaid) {
                setShowUpgradeModal(true);
              } else {
                setShowSwapModal(true);
              }
            }}
          >
            {isPaid ? <RefreshCw size={13} /> : <Lock size={13} />}
            Dump & Return (Swap Can)
          </Button>
        )}
        {['booked', 'dispatched', 'quoted'].includes(job.status) && (
          <Button variant="danger" disabled={busy} onClick={() => void save('cancelled')}>
            Cancel job
          </Button>
        )}
      </div>

      {showUpgradeModal && (
        <Modal
          open={showUpgradeModal}
          onOpenChange={(o) => setShowUpgradeModal(o)}
          title="Unlock 1-Click Contractor Swaps"
          description="Instant dump & return container swaps are exclusive to paid RollOS plans."
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 8,
                background: '#fef3c7',
                border: '1px solid #fde68a',
                color: '#92400e',
              }}
            >
              <Lock size={20} style={{ flexShrink: 0 }} />
              <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                1-click contractor swaps require an active <strong>Starter ($29/mo)</strong> or{' '}
                <strong>Growth Fleet ($99/mo)</strong> plan.
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#566657', margin: 0, lineHeight: 1.6 }}>
              Quickly haul off full containers and dispatch replacements for ongoing contractor jobs without re-entering addresses, billing details, or customer info.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
              <Button variant="ghost" onClick={() => setShowUpgradeModal(false)}>
                Cancel
              </Button>
              <Button asChild variant="primary">
                <Link href="/settings">
                  Upgrade in Settings
                </Link>
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {showSwapModal && (
        <Modal
          open={showSwapModal}
          onOpenChange={(o) => setShowSwapModal(o)}
          title="Dump & Return (Swap Can)"
          description={`Schedule a pickup of current container and dispatch a replacement to ${job.customer_name}.`}
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setSwapBusy(true);
              setSwapError('');
              try {
                await api(`/api/jobs/${job.id}/swap`, {
                  method: 'POST',
                  body: JSON.stringify({
                    target_size: Number(swapSize),
                    delivery_date: swapDeliveryDate,
                    driver_id: swapDriverId || null,
                    notes: swapNotes || undefined,
                  }),
                });
                setShowSwapModal(false);
                onClose();
                await onUpdate();
                notify('Container swap booked! Replacement job dispatched.');
              } catch (err) {
                setSwapError((err as Error).message);
              } finally {
                setSwapBusy(false);
              }
            }}
            className="form-stack"
          >
            <div className="form-row">
              <label className="field">
                Replacement container size
                <select
                  value={swapSize}
                  onChange={(e) => setSwapSize(Number(e.target.value))}
                >
                  {swapSizes.map((s) => (
                    <option key={s} value={s}>{s} Yard</option>
                  ))}
                </select>
              </label>
              <label className="field">
                Target delivery date
                <input
                  type="date"
                  required
                  min={today()}
                  value={swapDeliveryDate}
                  onChange={(e) => setSwapDeliveryDate(e.target.value)}
                />
              </label>
            </div>
            <label className="field">
              Assign driver (optional)
              <select
                value={swapDriverId}
                onChange={(e) => setSwapDriverId(e.target.value)}
              >
                <option value="">Keep current driver or assign later</option>
                {data.users
                  .filter((u) => u.role === 'driver')
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
              </select>
            </label>
            <label className="field">
              Swap instructions & notes
              <textarea
                rows={2}
                value={swapNotes}
                onChange={(e) => setSwapNotes(e.target.value)}
                placeholder="e.g. Drop empty 20yd on left side, haul off full 20yd."
              />
            </label>
            {swapError && (
              <div className="error-box" role="alert">
                {swapError}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <Button
                variant="ghost"
                type="button"
                disabled={swapBusy}
                onClick={() => setShowSwapModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={swapBusy}>
                {swapBusy ? <Loader2 size={14} className="spin" /> : <RefreshCw size={14} />}
                Confirm Container Swap
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </Modal>
  );
}
