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
  Filter,
  Lock,
  Edit3,
  WifiOff,
  Search,
  Box,
  ShieldCheck,
} from 'lucide-react';
import { Brand } from './brand';
import { Button } from './ui/button';
import { api } from '@/lib/client';
import { dateLabel, today, type Job, type Container } from '@/lib/types';
type RouteData = {
  driver: { name: string };
  jobs: Job[];
  containers: Container[];
  organization?: { name: string; subscription_status: string; is_paid_plan: boolean };
  demo: boolean;
};
export function DriverRoute({ token }: { token: string }) {
  const [data, setData] = useState<RouteData | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Record<string, File>>({});
  const [photoPreviews, setPhotoPreviews] = useState<Record<string, string>>({});
  const [driverNotes, setDriverNotes] = useState<Record<string, string>>({});
  const [weights, setWeights] = useState<Record<string, string>>({});
  const [unlockWeight, setUnlockWeight] = useState<Record<string, boolean>>({});
  const [filterTab, setFilterTab] = useState<'active' | 'all' | 'dispatched' | 'delivered' | 'picked_up'>('active');
  const [sortBy, setSortBy] = useState<'delivery' | 'pickup' | 'customer'>('delivery');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const reload = useCallback(() => api<RouteData>(`/api/driver/${token}`).then(setData), [token]);
  useEffect(() => {
    reload().catch((e) => setError(e.message));
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
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

          {/* Offline indicator banner */}
          {!isOnline && (
            <div
              style={{
                background: data.organization?.is_paid_plan ? '#2e4334' : '#fff3cd',
                color: data.organization?.is_paid_plan ? 'white' : '#856404',
                padding: '10px 14px',
                borderRadius: 8,
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12,
                border: data.organization?.is_paid_plan ? '1px solid #415a49' : '1px solid #ffeeba',
              }}
            >
              <WifiOff size={16} />
              <div>
                <strong>Offline Mode:</strong>{' '}
                {data.organization?.is_paid_plan ? (
                  <span>
                    Your active route is cached locally on your device. Actions will sync once cellular connectivity returns.
                  </span>
                ) : (
                  <span>
                    No internet connection detected. Upgrade to RollOS Pro for full offline route synchronization at remote landfills.
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Route Filter, Search & Sort Toolbar */}
          <section style={{ background: 'white', padding: '14px 16px', borderRadius: 12, border: '1px solid #dbe5d4', marginBottom: 20, boxShadow: '0 2px 6px #00000008' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#334839' }}>
                <Filter size={15} style={{ color: '#687e59' }} /> Filter Route:
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, color: '#74866f', fontWeight: 600 }}>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'delivery' | 'pickup' | 'customer')}
                  style={{
                    fontSize: 11,
                    padding: '5px 8px',
                    borderRadius: 6,
                    border: '1px solid #ccd8c5',
                    background: '#fcfdfb',
                    color: '#2b3f30',
                    fontWeight: 600,
                  }}
                >
                  <option value="delivery">Delivery Date</option>
                  <option value="pickup">Pickup Date</option>
                  <option value="customer">Customer Name</option>
                </select>
              </div>
            </div>

            {/* Mobile Search Input */}
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: '#7f927b' }} />
              <input
                type="text"
                placeholder="Search by customer, street address, or ZIP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 10px 7px 32px',
                  fontSize: 12,
                  borderRadius: 6,
                  border: '1px solid #ccd8c5',
                  background: '#fbfcf9',
                }}
              />
            </div>

            {/* Segmented Filter Pills */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[
                { id: 'active', label: 'Active Tasks', count: data.jobs.filter((j) => j.status !== 'picked_up').length },
                { id: 'dispatched', label: 'To Deliver', count: data.jobs.filter((j) => j.status === 'dispatched').length },
                { id: 'delivered', label: 'On Site', count: data.jobs.filter((j) => j.status === 'delivered').length },
                { id: 'picked_up', label: 'Picked Up', count: data.jobs.filter((j) => j.status === 'picked_up').length },
                { id: 'all', label: 'All Jobs', count: data.jobs.length },
              ].map((tab) => {
                const isActive = filterTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilterTab(tab.id as typeof filterTab)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      fontSize: 12,
                      padding: '6px 11px',
                      borderRadius: 20,
                      border: isActive ? '1px solid #2d4533' : '1px solid #d4dfce',
                      background: isActive ? '#2d4533' : '#f7faf4',
                      color: isActive ? 'white' : '#495d4e',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{tab.label}</span>
                    <span
                      style={{
                        fontSize: 10,
                        padding: '1px 5px',
                        borderRadius: 10,
                        background: isActive ? '#415e49' : '#e4ece0',
                        color: isActive ? 'white' : '#576a5b',
                        fontWeight: 700,
                      }}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {data.jobs
            .filter((j) => {
              if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matches =
                  j.customer_name.toLowerCase().includes(q) ||
                  j.delivery_address.toLowerCase().includes(q) ||
                  j.zip.toLowerCase().includes(q);
                if (!matches) return false;
              }
              if (filterTab === 'active') return j.status !== 'picked_up';
              if (filterTab === 'dispatched') return j.status === 'dispatched';
              if (filterTab === 'delivered') return j.status === 'delivered';
              if (filterTab === 'picked_up') return j.status === 'picked_up';
              return true;
            })
            .sort((a, b) => {
              if (sortBy === 'pickup') return a.pickup_date.localeCompare(b.pickup_date);
              if (sortBy === 'customer') return a.customer_name.localeCompare(b.customer_name);
              return a.delivery_date.localeCompare(b.delivery_date);
            })
            .map((job) => (
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

              {/* Specific Container Unit ID & Yard Stencil Selector */}
              <div style={{ marginTop: 12, marginBottom: 12, padding: 12, background: '#f5f8ef', borderRadius: 8, border: '1px solid #d4dfc7' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#314936', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Box size={13} style={{ color: '#4a673d' }} />
                    Assigned Container Unit
                  </label>
                  {job.container_id && (
                    <span style={{ fontSize: 10, color: '#2b5735', fontWeight: 700, background: '#e1ecd6', padding: '1px 6px', borderRadius: 4 }}>
                      Verified Can
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <select
                    value={job.container_id ?? ''}
                    disabled={job.status === 'picked_up'}
                    onChange={(e) => {
                      const newCanId = e.target.value || null;
                      void action(job, { container_id: newCanId });
                    }}
                    style={{
                      flex: 1,
                      fontSize: 13,
                      fontWeight: 600,
                      padding: '8px 10px',
                      borderRadius: 6,
                      border: '1px solid #bccdb0',
                      background: 'white',
                      color: '#1a3022',
                    }}
                  >
                    <option value="">⚠️ Select container hooked up in yard...</option>
                    {(data.containers || [])
                      .filter((c) => c.size_yards === job.size_yards)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label} ({c.size_yards} yd) — {c.current_job_id === job.id ? 'Hooked to this job' : c.status === 'yard' ? 'Available in Yard' : 'On Site'}
                        </option>
                      ))}
                  </select>
                </div>
                <small style={{ fontSize: 10, color: '#6e806c', marginTop: 4, display: 'block' }}>
                  {job.container_id
                    ? `Grab Unit #${(data.containers || []).find((c) => c.id === job.container_id)?.label ?? job.container_id} from yard. Tap to swap if blocked.`
                    : `Check container stencil number before pulling out of the yard.`}
                </small>
              </div>

              {/* Pre-Trip Yard Checklist (Wood Boards & Placement Target) */}
              <div style={{ marginBottom: 14, display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
                {job.protective_boards ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fef3c7', padding: '9px 12px', borderRadius: 8, border: '1px solid #fde68a', color: '#92400e', fontSize: 12, fontWeight: 600 }}>
                    <ShieldCheck size={16} style={{ color: '#b45309', flexShrink: 0 }} />
                    <div>
                      <span>Customer paid for Wood Boards Add-on</span>
                      <small style={{ display: 'block', fontWeight: 500, fontSize: 10, color: '#78350f' }}>
                        Load 2x8 wood boards onto truck now to place under steel rollers upon delivery.
                      </small>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f4f6f1', padding: '6px 10px', borderRadius: 6, border: '1px solid #e1e8db', color: '#687764', fontSize: 11 }}>
                    <Check size={12} /> Standard delivery · No protective boards requested
                  </div>
                )}
              </div>

              {job.notes && (
                <div style={{ margin: '0 0 14px 0', padding: '10px 12px', background: '#eef6ea', border: '1px solid #c9dec1', borderRadius: 8, color: '#274b2f', fontSize: 12 }}>
                  <strong style={{ display: 'block', marginBottom: 2, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#446e4d' }}>
                    📍 Homeowner Placement Instructions:
                  </strong>
                  {job.notes}
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
                <div style={{ marginTop: 15, background: '#f5f8f0', padding: 12, borderRadius: 8, border: '1px solid #d9e4d1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#314736' }}>Actual Disposal Weight (tons)</span>
                    {job.tons_actual !== null && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 11,
                          color: '#34663e',
                          fontWeight: 600,
                        }}
                      >
                        <Check size={12} /> Saved: {job.tons_actual} tons
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min="0"
                      max="100"
                      value={weights[job.id] ?? job.tons_actual ?? ''}
                      onChange={(e) => setWeights({ ...weights, [job.id]: e.target.value })}
                      placeholder="e.g. 2.5"
                      disabled={job.tons_actual !== null && !unlockWeight[job.id]}
                      style={{
                        flex: 1,
                        fontSize: 13,
                        padding: '8px 10px',
                        borderRadius: 6,
                        border: '1px solid #c9d8bf',
                        background: job.tons_actual !== null && !unlockWeight[job.id] ? '#e8ece3' : 'white',
                      }}
                    />
                    {job.tons_actual !== null && (
                      <button
                        type="button"
                        onClick={() => setUnlockWeight({ ...unlockWeight, [job.id]: !unlockWeight[job.id] })}
                        style={{
                          fontSize: 11,
                          padding: '0 10px',
                          borderRadius: 6,
                          border: '1px solid #c9d8bf',
                          background: 'white',
                          color: '#2e4533',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          fontWeight: 600,
                        }}
                      >
                        {unlockWeight[job.id] ? <Lock size={12} /> : <Edit3 size={12} />}
                        {unlockWeight[job.id] ? 'Lock' : 'Edit'}
                      </button>
                    )}
                    {(job.tons_actual === null || unlockWeight[job.id]) && (
                      <Button
                        disabled={busy === job.id || (weights[job.id] ?? job.tons_actual ?? '') === ''}
                        onClick={() =>
                          void action(job, { tons_actual: Number(weights[job.id] ?? job.tons_actual) })
                        }
                        style={{ minHeight: 40, fontSize: 12, padding: '0 14px' }}
                      >
                        Save weight
                      </Button>
                    )}
                  </div>
                  {((Number(weights[job.id] ?? job.tons_actual ?? 0) > job.tons_included)) && (
                    <div
                      style={{
                        marginTop: 8,
                        padding: '6px 10px',
                        background: '#fef3c7',
                        border: '1px solid #fde68a',
                        borderRadius: 6,
                        fontSize: 11,
                        color: '#92400e',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <AlertTriangle size={13} />
                      Exceeds {job.tons_included} included tons by {(Number(weights[job.id] ?? job.tons_actual ?? 0) - job.tons_included).toFixed(2)} tons. Please attach scale ticket above for automated overage billing.
                    </div>
                  )}
                  <small style={{ color: '#7a8e74', fontSize: 10, marginTop: 4, display: 'block' }}>
                    {job.tons_actual !== null
                      ? `Weight is locked to prevent accidental changes. Tap 'Edit' to update.`
                      : `Enter weight recorded from landfill scale.`}
                  </small>
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
