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
            Driver
            <select
              value={driver}
              onChange={(e) => setDriver(e.target.value)}
              disabled={['completed', 'cancelled'].includes(job.status)}
            >
              <option value="">Select a driver</option>
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
            Container
            <select
              value={container}
              onChange={(e) => setContainer(e.target.value)}
              disabled={job.status !== 'booked'}
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
                        ? 'Available'
                        : c.status === 'on_site'
                          ? 'Already on site'
                          : 'Maintenance'}
                  </option>
                ))}
            </select>
            <small>On-site and maintenance containers cannot be dispatched.</small>
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
        <label className="field" style={{ marginTop: 17 }}>
          Actual tonnage
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            placeholder="Weight after disposal"
            value={tons}
            onChange={(e) => setTons(e.target.value)}
            disabled={job.status === 'completed'}
          />
        </label>
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
          <a href={job.proof_url} target="_blank" rel="noreferrer" className="btn">
            <Camera size={13} />
            View delivery proof
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
        {['booked', 'dispatched', 'quoted'].includes(job.status) && (
          <Button variant="danger" disabled={busy} onClick={() => void save('cancelled')}>
            Cancel job
          </Button>
        )}
      </div>
    </Modal>
  );
}
