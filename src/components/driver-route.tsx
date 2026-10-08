'use client';
import { useCallback, useEffect, useState } from 'react';
import {
  Camera,
  Check,
  CheckCircle2,
  Loader2,
  Truck,
  Phone,
  MessageSquare,
  Compass,
  AlertTriangle,
} from 'lucide-react';
import { Brand } from './brand';
import { Button } from './ui/button';
import { api } from '@/lib/client';
import { dateLabel, today, type Job } from '@/lib/types';
type RouteData = { driver: { name: string }; jobs: Job[]; demo: boolean };
export function DriverRoute({ token }: { token: string }) {
  const [data, setData] = useState<RouteData | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Record<string, File>>({});
  const [photoPreviews, setPhotoPreviews] = useState<Record<string, string>>({});
  const [driverNotes, setDriverNotes] = useState<Record<string, string>>({});
  const [weights, setWeights] = useState<Record<string, string>>({});
  const reload = useCallback(() => api<RouteData>(`/api/driver/${token}`).then(setData), [token]);
  useEffect(() => {
    reload().catch((e) => setError(e.message));
  }, [reload]);
  const action = async (job: Job, patch: Record<string, unknown>) => {
    setBusy(job.id);
    setError('');
    setMessage('');
    try {
      if (patch.status === 'delivered') {
        const form = new FormData();
        form.set('photo', photos[job.id]);
        form.set('job_id', job.id);
        form.set('token', token);
        const { url } = await api<{ url: string }>('/api/upload', { method: 'POST', body: form });
        patch.proof_url = url;
      }
      await api(`/api/driver/${token}`, {
        method: 'POST',
        body: JSON.stringify({ job_id: job.id, ...patch }),
      });
      await reload();
      setMessage(
        patch.status === 'delivered'
          ? 'Delivery recorded. Nice work.'
          : patch.status === 'picked_up'
            ? 'Pickup recorded. Your container is back in the yard.'
            : 'Actual tonnage saved.',
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  };
  return (
    <main className="driver-page">
      <header className="driver-header">
        <Brand />
        <span className="pill">
          <Truck size={13} />
          Driver route
        </span>
      </header>
      {!data ? (
        <div className="loading">
          {error ? (
            <div className="error-box" role="alert">
              {error}
            </div>
          ) : (
            <Loader2 className="spin" />
          )}
        </div>
      ) : (
        <>
          <section className="driver-welcome">
            <div className="eyebrow" style={{ color: '#91a976', marginBottom: 13 }}>
              {dateLabel(today())} · LET’S KEEP IT MOVING
            </div>
            <h1>Hey, {data.driver?.name?.split(' ')[0] ?? 'driver'}.</h1>
            <p>
              {data.jobs.filter((j) => j.status !== 'picked_up').length} active jobs on your route.
            </p>
          </section>
          {data.demo && <div className="booking-notice">Demo route · No SMS or real delivery</div>}
          {error && (
            <div className="error-box" role="alert" style={{ marginBottom: 20 }}>
              {error}
            </div>
          )}
          {message && (
            <div className="success-box" role="status" style={{ marginBottom: 20 }}>
              {message}
            </div>
          )}
          {data.jobs.map((job) => (
            <article className="panel driver-job" key={job.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className={`size-tag s${job.size_yards}`}>{job.size_yards} yd dumpster</span>
                <span className="pill">
                  {job.status === 'dispatched'
                    ? 'Ready for delivery'
                    : job.status === 'delivered'
                      ? 'On site'
                      : 'Picked up'}
                </span>
              </div>
              {job.notes && (
                <div className="booking-notice" style={{ margin: '12px 0' }}>
                  Placement: {job.notes}
                </div>
              )}
              <h2>{job.customer_name}</h2>
              <p className="address">
                {job.delivery_address} {job.zip}
              </p>
              <div style={{ fontSize: 12, color: '#95a087', lineHeight: 1.8, marginBottom: 12 }}>
                Delivery {dateLabel(job.delivery_date)} · Pickup {dateLabel(job.pickup_date)}
              </div>

              {/* 1-Tap Customer Contact Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                <a
                  href={`tel:${job.customer_phone}`}
                  className="btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    minHeight: 46,
                    fontSize: 13,
                    background: '#edf3e5',
                    color: '#2d4734',
                    border: '1px solid #c9ddb5',
                    borderRadius: 8,
                    fontWeight: 600,
                    textDecoration: 'none',
                    margin: 0,
                  }}
                >
                  <Phone size={15} />
                  Call Customer
                </a>
                <a
                  href={`sms:${job.customer_phone}`}
                  className="btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    minHeight: 46,
                    fontSize: 13,
                    background: '#edf3e5',
                    color: '#2d4734',
                    border: '1px solid #c9ddb5',
                    borderRadius: 8,
                    fontWeight: 600,
                    textDecoration: 'none',
                    margin: 0,
                  }}
                >
                  <MessageSquare size={15} />
                  Text Customer
                </a>
              </div>

              {/* Multi-App Navigation Bar */}
              <div style={{ background: '#f4f7ee', padding: 12, borderRadius: 10, marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#687959', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Compass size={13} /> Open Navigation In:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(job.delivery_address + ' ' + job.zip)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px 4px',
                      fontSize: 11,
                      minHeight: 44,
                      background: 'white',
                      border: '1px solid #d4dfc9',
                      borderRadius: 6,
                      color: '#243b2a',
                      fontWeight: 600,
                      textDecoration: 'none',
                      margin: 0,
                    }}
                  >
                    Google Maps
                  </a>
                  <a
                    href={`maps://?daddr=${encodeURIComponent(job.delivery_address + ' ' + job.zip)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px 4px',
                      fontSize: 11,
                      minHeight: 44,
                      background: 'white',
                      border: '1px solid #d4dfc9',
                      borderRadius: 6,
                      color: '#243b2a',
                      fontWeight: 600,
                      textDecoration: 'none',
                      margin: 0,
                    }}
                  >
                    Apple Maps
                  </a>
                  <a
                    href={`https://waze.com/ul?q=${encodeURIComponent(job.delivery_address + ' ' + job.zip)}&navigate=yes`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px 4px',
                      fontSize: 11,
                      minHeight: 44,
                      background: 'white',
                      border: '1px solid #d4dfc9',
                      borderRadius: 6,
                      color: '#243b2a',
                      fontWeight: 600,
                      textDecoration: 'none',
                      margin: 0,
                    }}
                  >
                    Waze
                  </a>
                </div>
              </div>

              {job.status === 'dispatched' && (
                <>
                  <Button
                    disabled={busy === job.id}
                    onClick={async () => {
                      setBusy(job.id);
                      try {
                        const result = await api<{ status: string }>(
                          `/api/driver/${token}/en-route`,
                          { method: 'POST', body: JSON.stringify({ job_id: job.id }) },
                        );
                        setMessage(
                          result.status === 'demo'
                            ? 'Demo en-route update recorded.'
                            : result.status === 'not_configured'
                              ? 'SMS is not configured.'
                              : 'En-route notification recorded: ' + result.status,
                        );
                      } catch (e) {
                        setError((e as Error).message);
                      } finally {
                        setBusy(null);
                      }
                    }}
                  >
                    I’m on my way
                  </Button>
                  <label className="field">
                    <span>
                      <Camera size={15} style={{ display: 'inline', marginRight: 8 }} />
                      Delivery photo
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      capture="environment"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPhotos({ ...photos, [job.id]: file });
                          setPhotoPreviews({ ...photoPreviews, [job.id]: URL.createObjectURL(file) });
                        }
                      }}
                    />
                  </label>
                  {photoPreviews[job.id] && (
                    <div style={{ marginTop: 8, marginBottom: 12, borderRadius: 8, overflow: 'hidden', border: '2px solid #7c9842', position: 'relative' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photoPreviews[job.id]}
                        alt="Delivery proof preview"
                        style={{ width: '100%', maxHeight: 220, objectFit: 'cover', display: 'block' }}
                      />
                      <div style={{ background: '#7c9842', color: 'white', padding: '4px 8px', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Check size={12} /> Ready to submit with delivery
                      </div>
                    </div>
                  )}
                  <Button
                    variant="primary"
                    disabled={!photos[job.id] || busy === job.id}
                    onClick={() => void action(job, { status: 'delivered' })}
                  >
                    {busy === job.id ? <Loader2 className="spin" size={18} /> : <Check size={18} />}
                    Mark delivered
                  </Button>
                </>
              )}
              {job.status === 'delivered' && (
                <>
                  <label className="field">
                    <span>
                      <Camera size={15} style={{ display: 'inline', marginRight: 8 }} />
                      Landfill scale ticket
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      capture="environment"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPhotos({ ...photos, ['ticket-' + job.id]: file });
                          setPhotoPreviews({ ...photoPreviews, ['ticket-' + job.id]: URL.createObjectURL(file) });
                        }
                      }}
                    />
                  </label>
                  {photoPreviews['ticket-' + job.id] && (
                    <div style={{ marginTop: 8, marginBottom: 12, borderRadius: 8, overflow: 'hidden', border: '2px solid #3c5440', position: 'relative' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photoPreviews['ticket-' + job.id]}
                        alt="Scale ticket preview"
                        style={{ width: '100%', maxHeight: 220, objectFit: 'cover', display: 'block' }}
                      />
                      <div style={{ background: '#3c5440', color: 'white', padding: '4px 8px', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Check size={12} /> Scale ticket ready to upload
                      </div>
                    </div>
                  )}
                  <Button
                    disabled={!photos['ticket-' + job.id] || busy === job.id}
                    onClick={async () => {
                      setBusy(job.id);
                      try {
                        const form = new FormData();
                        form.set('photo', photos['ticket-' + job.id]);
                        form.set('job_id', job.id);
                        form.set('token', token);
                        const { url } = await api<{ url: string }>('/api/upload', { method: 'POST', body: form });
                        await api(`/api/driver/${token}`, {
                          method: 'POST',
                          body: JSON.stringify({ job_id: job.id, scale_ticket_url: url }),
                        });
                        await reload();
                        setMessage('Scale ticket saved.');
                      } catch (e) {
                        setError((e as Error).message);
                      } finally {
                        setBusy(null);
                      }
                    }}
                  >
                    Save scale ticket
                  </Button>
                <Button
                  variant="primary"
                  disabled={busy === job.id}
                  onClick={() => void action(job, { status: 'picked_up' })}
                >
                  {busy === job.id ? <Loader2 className="spin" size={18} /> : <Check size={18} />}
                  Mark picked up
                </Button>
                </>
              )}
              {['delivered', 'picked_up'].includes(job.status) && (
                <div className="tons" style={{ marginTop: 15 }}>
                  <label className="field">
                    Actual disposal weight (tons)
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min="0"
                      max="100"
                      value={weights[job.id] ?? job.tons_actual ?? ''}
                      onChange={(e) => setWeights({ ...weights, [job.id]: e.target.value })}
                      placeholder="e.g. 2.5"
                    />
                  </label>
                  <Button
                    disabled={busy === job.id || (weights[job.id] ?? job.tons_actual ?? '') === ''}
                    onClick={() =>
                      void action(job, { tons_actual: Number(weights[job.id] ?? job.tons_actual) })
                    }
                  >
                    Save weight
                  </Button>
                </div>
              )}

              {/* Driver Field Notes & Obstacle Presets */}
              <div style={{ marginTop: 22, paddingTop: 16, borderTop: '1px solid #e1e9d8' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#445b3f', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <AlertTriangle size={13} style={{ color: '#c4892c' }} />
                    Driver field note / site obstacles
                  </label>
                  {job.driver_notes && (
                    <span style={{ fontSize: 10, color: '#7e9072', fontWeight: 500 }}>Saved</span>
                  )}
                </div>
                <p style={{ fontSize: 11, color: '#7a8c6e', marginBottom: 8 }}>
                  Notify dispatch about driveway obstructions, damage, or container placement notes.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
                  {[
                    'Driveway blocked by cars',
                    'Container placed on wood boards',
                    'Overfilled past water level',
                    'Gate locked upon arrival',
                    'Low hanging tree branches',
                    'Drop-off approved by homeowner',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        const current = driverNotes[job.id] ?? job.driver_notes ?? '';
                        const next = current ? `${current}. ${preset}` : preset;
                        setDriverNotes({ ...driverNotes, [job.id]: next });
                      }}
                      style={{
                        fontSize: 10,
                        padding: '4px 8px',
                        background: '#eaf1e3',
                        border: '1px solid #c7d8be',
                        borderRadius: 4,
                        color: '#2e4933',
                        cursor: 'pointer',
                        fontWeight: 500,
                      }}
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <textarea
                    rows={2}
                    value={driverNotes[job.id] ?? job.driver_notes ?? ''}
                    onChange={(e) => setDriverNotes({ ...driverNotes, [job.id]: e.target.value })}
                    placeholder="Enter notes for dispatch (e.g., parked behind white SUV)..."
                    style={{
                      flex: 1,
                      fontSize: 12,
                      padding: 8,
                      borderRadius: 6,
                      border: '1px solid #c7d8be',
                      background: 'white',
                    }}
                  />
                  <Button
                    disabled={
                      busy === job.id ||
                      (driverNotes[job.id] ?? job.driver_notes ?? '') === (job.driver_notes ?? '')
                    }
                    onClick={() =>
                      void action(job, {
                        driver_notes: (driverNotes[job.id] ?? job.driver_notes ?? '').trim(),
                      })
                    }
                    style={{ minHeight: 46, fontSize: 12, alignSelf: 'stretch', padding: '0 14px' }}
                  >
                    Save Note
                  </Button>
                </div>
              </div>
            </article>
          ))}
          {!data.jobs.length && (
            <div className="panel empty">
              <CheckCircle2 size={37} />
              <h2>You’re all caught up.</h2>
              <p>Your next job will show up here when dispatch assigns it.</p>
            </div>
          )}
        </>
      )}
    </main>
  );
}
