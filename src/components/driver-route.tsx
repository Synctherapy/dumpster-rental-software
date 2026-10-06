'use client';
import { useCallback, useEffect, useState } from 'react';
import { Camera, Check, CheckCircle2, Loader2, Navigation, Truck } from 'lucide-react';
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
              <div style={{ fontSize: 12, color: '#95a087', lineHeight: 1.8 }}>
                Delivery {dateLabel(job.delivery_date)} · Pickup {dateLabel(job.pickup_date)}
              </div>
              <Button asChild>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(job.delivery_address + ' ' + job.zip)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Navigation size={18} />
                  Navigate to job
                </a>
              </Button>
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
                      onChange={(e) =>
                        e.target.files?.[0] && setPhotos({ ...photos, [job.id]: e.target.files[0] })
                      }
                    />
                  </label>
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
                      onChange={(e) =>
                        e.target.files?.[0] && setPhotos({ ...photos, ['ticket-' + job.id]: e.target.files[0] })
                      }
                    />
                  </label>
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
                <div className="tons">
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
