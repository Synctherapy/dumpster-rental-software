'use client';
import { useState } from 'react';
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
} from 'lucide-react';
import { Modal } from './ui/dialog';
import { Button } from './ui/button';
import { api } from '@/lib/client';
import { money, dateLabel, statusLabels, type Workspace, type Job } from '@/lib/types';
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
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
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
            ...(status ? { status } : {}),
          }),
        }),
      status ? 'Job status updated.' : 'Job details saved.',
    );
  const upload = async (file: File) => {
    const form = new FormData();
    form.set('photo', file);
    form.set('job_id', job.id);
    await perform(async () => {
      const result = await api<{ url: string }>('/api/upload', { method: 'POST', body: form });
      setProof(result.url);
    }, 'Photo uploaded. Mark delivered to save it to the job.');
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
        <strong style={{ fontSize: 19 }}>{money(job.price_cents)}</strong>
      </div>
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
              <Check size={12} /> Logged & locked: {job.tons_actual} tons
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            placeholder="Weight after disposal (e.g. 2.5)"
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
            : `Driver or landfill scale weight in tons.`}
        </small>
        <div className="detail-line">
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
          <b>{money(Math.max(0, total.total - paid))}</b>
        </div>
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
        <h3>Signed rental agreement</h3>
        <div className="signature">{job.signature.name}</div>
        <p style={{ fontSize: 10, color: '#8c9890', lineHeight: 1.8 }}>
          Accepted {new Date(job.signature.timestamp).toLocaleString()}
          <br />
          IP record: {job.signature.ip}
        </p>
        <div
          style={{
            display: 'flex',
            gap: 6,
            alignItems: 'center',
            fontSize: 10,
            color: '#81975f',
            marginTop: 10,
          }}
        >
          <ShieldCheck size={12} />
          Electronic signature captured at booking
        </div>
      </section>
      {job.status === 'dispatched' && (
        <section className="drawer-section">
          <h3>Delivery proof</h3>
          <label className="field">
            <span>
              <Camera size={13} style={{ display: 'inline', marginRight: 5 }} />
              Upload a delivery photo
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png"
              capture="environment"
              disabled={busy}
              onChange={(e) => e.target.files?.[0] && void upload(e.target.files[0])}
            />
            <small>JPEG or PNG, up to 8 MB.</small>
          </label>
          {proof && (
            <a
              href={proof}
              target="_blank"
              rel="noreferrer"
              className="btn"
              style={{ marginTop: 12 }}
            >
              <Check size={13} />
              View uploaded proof
            </a>
          )}
        </section>
      )}
      {job.proof_url && job.status !== 'dispatched' && (
        <section className="drawer-section">
          <h3>Delivery proof photo</h3>
          <div style={{ marginTop: 8, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--line)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={job.proof_url}
              alt="Drop-off proof"
              style={{ width: '100%', maxHeight: 180, objectFit: 'cover', display: 'block' }}
            />
          </div>
          <a
            href={job.proof_url}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost"
            style={{ marginTop: 8, fontSize: 11, padding: '6px 0' }}
          >
            <Camera size={12} />
            Open full resolution photo <ExternalLink size={10} />
          </a>
        </section>
      )}
      {job.scale_ticket_url && (
        <section className="drawer-section">
          <h3>Landfill scale ticket</h3>
          <div style={{ marginTop: 8, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--line)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={job.scale_ticket_url}
              alt="Landfill scale ticket"
              style={{ width: '100%', maxHeight: 180, objectFit: 'cover', display: 'block' }}
            />
          </div>
          <a
            href={job.scale_ticket_url}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost"
            style={{ marginTop: 8, fontSize: 11, padding: '6px 0' }}
          >
            <FileText size={12} />
            Open scale ticket <ExternalLink size={10} />
          </a>
        </section>
      )}
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
        {['booked', 'dispatched', 'quoted'].includes(job.status) && (
          <Button variant="danger" disabled={busy} onClick={() => void save('cancelled')}>
            Cancel job
          </Button>
        )}
      </div>
    </Modal>
  );
}
