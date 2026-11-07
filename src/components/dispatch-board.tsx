'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Columns3,
  List,
  MapPin,
  Search,
  UserRound,
  Truck,
  ArrowUpRight,
  Activity,
  CircleCheck,
  Box,
  Phone,
} from 'lucide-react';
import { Button } from './ui/button';
import { initials } from '@/lib/client';
import {
  dateLabel,
  money,
  statuses,
  statusLabels,
  today,
  addDays,
  isOverduePickup,
  overduePickupDays,
  hasEarlyPickupRequest,
  parseStopOrder,
  parseDropSpot,
  type Job,
  type JobStatus,
  type Workspace,
} from '@/lib/types';
export const statusColors: Record<JobStatus, string> = {
  quoted: '#bd9853',
  booked: '#82a6c8',
  dispatched: '#b599cb',
  delivered: '#90ad65',
  picked_up: '#d6ab6b',
  completed: '#8d999c',
  cancelled: '#c18982',
};
export function DispatchBoard({
  data,
  openJob,
  onMove,
  initialView = 'board',
  onQuickOrder,
  onSubscribeCalendar,
}: {
  data: Workspace;
  openJob: (j: Job) => void;
  onMove: (id: string, status: JobStatus) => void;
  initialView?: string;
  onQuickOrder?: () => void;
  onSubscribeCalendar?: () => void;
}) {
  const [view, setView] = useState(initialView);
  const [search, setSearch] = useState('');
  const [driver, setDriver] = useState('');
  const [zipFilter, setZipFilter] = useState('');
  const [range, setRange] = useState('all');
  const [week, setWeek] = useState(today());
  const uniqueZips = Array.from(new Set(data.jobs.map((j) => j.zip).filter(Boolean))).sort();
  const overdueJobs = data.jobs.filter((j) => isOverduePickup(j));
  const earlyPickupJobs = data.jobs.filter((j) => hasEarlyPickupRequest(j));
  const attentionJobs = data.jobs.filter((j) => isOverduePickup(j) || hasEarlyPickupRequest(j));
  const filtered = data.jobs.filter(
    (j) =>
      `${j.customer_name} ${j.delivery_address} ${j.id} ${j.notes} ${j.zip}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (!driver || j.driver_id === driver) &&
      (!zipFilter || j.zip === zipFilter) &&
      (range !== 'today' || j.delivery_date === today() || j.pickup_date === today()) &&
      (range !== 'week' || (j.delivery_date >= today() && j.delivery_date <= addDays(today(), 7))) &&
      (range !== 'attention' || isOverduePickup(j) || hasEarlyPickupRequest(j)),
  );
  const active = filtered.filter((j) => statuses.includes(j.status));
  const available = data.containers.filter((c) => c.status === 'yard').length;
  const onsite = data.containers.filter((c) => c.status === 'on_site').length;
  const maintenance = data.containers.filter((c) => c.status === 'maintenance').length;
  return (
    <>
      <section className="board-panel">
        <div className="board-toolbar">
          <div className="view-tabs">
            {[
              { id: 'board', label: 'Board view', icon: Columns3 },
              { id: 'calendar', label: 'Calendar', icon: CalendarDays },
              { id: 'list', label: 'List', icon: List },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`view-tab ${view === tab.id ? 'active' : ''}`}
                onClick={() => setView(tab.id)}
              >
                <tab.icon size={13} />
                {tab.label}
              </button>
            ))}
          </div>
          <div className="board-tools">
            <div className="search">
              <Search size={13} />
              <input
                placeholder="Search jobs…"
                aria-label="Search jobs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              value={driver}
              aria-label="Filter by driver"
              onChange={(e) => setDriver(e.target.value)}
            >
              <option value="">All drivers</option>
              {data.users
                .filter((u) => u.role === 'driver')
                .map((u) => (
                  <option value={u.id} key={u.id}>
                    {u.name}
                  </option>
                ))}
            </select>
            <select
              value={zipFilter}
              aria-label="Filter by ZIP zone"
              onChange={(e) => setZipFilter(e.target.value)}
            >
              <option value="">All ZIP zones</option>
              {uniqueZips.map((z) => (
                <option value={z} key={z}>
                  ZIP {z}
                </option>
              ))}
            </select>
            <select
              value={range}
              aria-label="Date range"
              onChange={(e) => setRange(e.target.value)}
            >
              <option value="all">All dates</option>
              <option value="today">Today</option>
              <option value="week">Next 7 days</option>
              <option value="attention">Overdue / Early Pickup</option>
            </select>
            {onSubscribeCalendar && view === 'calendar' && (
              <Button onClick={onSubscribeCalendar}>
                <CalendarDays size={13} />
                Subscribe (iCal)
              </Button>
            )}
            {onQuickOrder && (
              <Button variant="primary" onClick={onQuickOrder}>
                <Phone size={13} />
                + Phone Order
              </Button>
            )}
          </div>
        </div>
        {attentionJobs.length > 0 && (
          <div
            role="region"
            aria-label="Fleet Velocity and Sleeping Can Radar"
            style={{
              margin: '0 16px 12px',
              padding: '10px 14px',
              borderRadius: 8,
              background: overdueJobs.length > 0 ? '#fffbeb' : '#ecfdf5',
              border: overdueJobs.length > 0 ? '1px solid #fde68a' : '1px solid #a7f3d0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: overdueJobs.length > 0 ? '#92400e' : '#065f46',
                  letterSpacing: '0.01em',
                }}
              >
                📡 Fleet Velocity & Sleeping Can Radar:
              </span>
              {overdueJobs.length > 0 && (
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    background: '#fef2f2',
                    color: '#b91c1c',
                    border: '1px solid #fecaca',
                    padding: '2px 8px',
                    borderRadius: 999,
                  }}
                >
                  ⏰ {overdueJobs.length} overdue for pickup
                </span>
              )}
              {earlyPickupJobs.length > 0 && (
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    background: '#d1fae5',
                    color: '#065f46',
                    border: '1px solid #6ee7b7',
                    padding: '2px 8px',
                    borderRadius: 999,
                  }}
                >
                  ⚡ {earlyPickupJobs.length} early pickup requested
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                type="button"
                onClick={() => setRange(range === 'attention' ? 'all' : 'attention')}
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  padding: '5px 10px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  background: range === 'attention' ? '#1e293b' : '#ffffff',
                  color: range === 'attention' ? '#ffffff' : '#1e293b',
                  cursor: 'pointer',
                }}
              >
                {range === 'attention' ? 'Show all jobs' : 'Filter to radar cans'}
              </button>
              <button
                type="button"
                onClick={() => openJob(attentionJobs[0])}
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  padding: '5px 10px',
                  borderRadius: 6,
                  border: 'none',
                  background: '#166534',
                  color: '#ffffff',
                  cursor: 'pointer',
                }}
              >
                Inspect first →
              </button>
            </div>
          </div>
        )}
        {view === 'board' && (
          <div className="kanban">
            {statuses.map((status) => (
              <section
                key={status}
                className="kanban-column"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData('text/plain');
                  if (id) onMove(id, status);
                }}
                aria-label={`${statusLabels[status]} jobs`}
              >
                <div className="column-head">
                  <span className="dot" style={{ color: statusColors[status] }} />
                  {statusLabels[status]}
                  <span className="badge">{active.filter((j) => j.status === status).length}</span>
                  <button
                    aria-label={`About ${statusLabels[status]} jobs`}
                    onClick={() => {
                      const j = active.find((j) => j.status === status);
                      if (j) openJob(j);
                    }}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
                {active
                  .filter((j) => j.status === status)
                  .sort((a, b) => {
                    const sa = parseStopOrder(a);
                    const sb = parseStopOrder(b);
                    if (sa !== null && sb !== null) return sa - sb;
                    if (sa !== null) return -1;
                    if (sb !== null) return 1;
                    return 0;
                  })
                  .map((job, index) => {
                    const stopOrder = parseStopOrder(job);
                    const dropSpot = parseDropSpot(job);
                    const overdue = isOverduePickup(job);
                    const earlyPickup = hasEarlyPickupRequest(job);
                    return (
                      <button
                        className="job-card"
                        key={job.id}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData('text/plain', job.id)}
                        onClick={() => openJob(job)}
                        aria-label={`Open ${job.customer_name} job`}
                      >
                        <div className="job-card-top">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <span className={`size-tag s${job.size_yards}`}>{job.size_yards} yd</span>
                            {stopOrder !== null && (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 3,
                                  fontSize: 10,
                                  fontWeight: 800,
                                  background: '#14532d',
                                  color: '#ffffff',
                                  padding: '2px 6px',
                                  borderRadius: 4,
                                  letterSpacing: '0.02em',
                                }}
                              >
                                📍 Stop #{stopOrder}
                              </span>
                            )}
                            {overdue && (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 3,
                                  fontSize: 10,
                                  fontWeight: 800,
                                  background: '#fef2f2',
                                  color: '#b91c1c',
                                  border: '1px solid #fecaca',
                                  padding: '2px 6px',
                                  borderRadius: 4,
                                  letterSpacing: '0.02em',
                                }}
                              >
                                ⏰ OVERDUE (+{overduePickupDays(job)}d)
                              </span>
                            )}
                            {earlyPickup && (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 3,
                                  fontSize: 10,
                                  fontWeight: 800,
                                  background: '#d1fae5',
                                  color: '#065f46',
                                  border: '1px solid #6ee7b7',
                                  padding: '2px 6px',
                                  borderRadius: 4,
                                  letterSpacing: '0.02em',
                                }}
                              >
                                ⚡ EARLY PICKUP READY
                              </span>
                            )}
                            {job.is_swap && (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 3,
                                  fontSize: 10,
                                  fontWeight: 700,
                                  background: '#ecfdf5',
                                  color: '#065f46',
                                  border: '1px solid #a7f3d0',
                                  padding: '2px 6px',
                                  borderRadius: 4,
                                  letterSpacing: '0.02em',
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
                                  fontSize: 10,
                                  fontWeight: 700,
                                  background: '#eff6ff',
                                  color: '#1d4ed8',
                                  border: '1px solid #bfdbfe',
                                  padding: '2px 6px',
                                  borderRadius: 4,
                                  letterSpacing: '0.02em',
                                }}
                              >
                                🏗️ VIP NET-30
                              </span>
                            )}
                          </div>
                          <span className="job-ref">
                            #
                            {job.id.startsWith('job-')
                              ? `10${job.id.split('-')[1].padStart(2, '0')}`
                              : job.id.slice(0, 5).toUpperCase()}
                          </span>
                        </div>
                        <h4>{job.customer_name}</h4>
                        <div className="job-address" style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                          <MapPin size={10} />
                          <span>{job.delivery_address.replace(', Austin, TX', '')}</span>
                          {job.zip && (
                            <span
                              style={{
                                fontSize: 9.5,
                                fontWeight: 700,
                                background: '#f1f5f9',
                                color: '#475569',
                                border: '1px solid #e2e8f0',
                                padding: '1px 5px',
                                borderRadius: 4,
                              }}
                            >
                              {job.zip}
                            </span>
                          )}
                        </div>
                        {dropSpot && (
                          <div
                            style={{
                              fontSize: 10.5,
                              fontWeight: 600,
                              color: '#3f6212',
                              background: '#f7fee7',
                              border: '1px solid #d9f99d',
                              padding: '2px 6px',
                              borderRadius: 4,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              marginTop: 4,
                            }}
                          >
                            🎯 {dropSpot}
                          </div>
                        )}
                        <div className="job-date">
                          <CalendarDays size={10} />
                          {dateLabel(
                            status === 'picked_up' || status === 'completed'
                              ? job.pickup_date
                              : job.delivery_date,
                          )}
                          <span style={{ color: '#b2b8bb' }}>·</span>
                          {status === 'picked_up' || status === 'completed' ? 'Pickup' : 'Delivery'}
                        </div>
                        {job.notes && <span className="job-tag">{job.notes}</span>}
                        {job.driver_notes && (
                          <span
                            className="job-tag"
                            style={{
                              background: '#fef3c7',
                              color: '#92400e',
                              border: '1px solid #fde68a',
                              fontWeight: 600,
                            }}
                            title={`Driver Note: ${job.driver_notes}`}
                          >
                            ⚠️ Driver: {job.driver_notes.length > 25 ? `${job.driver_notes.slice(0, 25)}…` : job.driver_notes}
                          </span>
                        )}
                        <div className="job-card-bottom">
                          <strong>{money(job.price_cents)}</strong>
                          {job.driver_id ? (
                            <span
                              className={`avatar ${index % 2 ? 'blue' : ''}`}
                              title={data.users.find((u) => u.id === job.driver_id)?.name}
                            >
                              {initials(
                                data.users.find((u) => u.id === job.driver_id)?.name ?? 'Driver',
                              )}
                            </span>
                          ) : (
                            <span className="unassigned">
                              <UserRound size={9} />
                              Unassigned
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                {!active.some((j) => j.status === status) && (
                  <div className="column-empty">No jobs here. Room to roll.</div>
                )}
              </section>
            ))}
          </div>
        )}
        {view === 'list' && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Size</th>
                  <th>Delivery / pickup</th>
                  <th>Driver</th>
                  <th>Status</th>
                  <th>Rental</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((j) => {
                  const stopOrder = parseStopOrder(j);
                  const dropSpot = parseDropSpot(j);
                  const overdue = isOverduePickup(j);
                  const earlyPickup = hasEarlyPickupRequest(j);
                  return (
                    <tr key={j.id}>
                      <td>
                        {j.customer_name}
                        <small style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <span>{j.delivery_address}</span>
                          {j.zip && (
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                background: '#f1f5f9',
                                color: '#475569',
                                border: '1px solid #e2e8f0',
                                padding: '1px 5px',
                                borderRadius: 4,
                              }}
                            >
                              {j.zip}
                            </span>
                          )}
                          {dropSpot && (
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 600,
                                color: '#3f6212',
                                background: '#f7fee7',
                                border: '1px solid #d9f99d',
                                padding: '1px 5px',
                                borderRadius: 4,
                              }}
                            >
                              🎯 {dropSpot}
                            </span>
                          )}
                        </small>
                      </td>
                      <td>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <span className={`size-tag s${j.size_yards}`}>{j.size_yards} yd</span>
                          {stopOrder !== null && (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 3,
                                fontSize: 10,
                                fontWeight: 800,
                                background: '#14532d',
                                color: '#ffffff',
                                padding: '2px 6px',
                                borderRadius: 4,
                              }}
                            >
                              📍 Stop #{stopOrder}
                            </span>
                          )}
                          {overdue && (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 3,
                                fontSize: 10,
                                fontWeight: 800,
                                background: '#fef2f2',
                                color: '#b91c1c',
                                border: '1px solid #fecaca',
                                padding: '2px 6px',
                                borderRadius: 4,
                              }}
                            >
                              ⏰ OVERDUE (+{overduePickupDays(j)}d)
                            </span>
                          )}
                          {earlyPickup && (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 3,
                                fontSize: 10,
                                fontWeight: 800,
                                background: '#d1fae5',
                                color: '#065f46',
                                border: '1px solid #6ee7b7',
                                padding: '2px 6px',
                                borderRadius: 4,
                              }}
                            >
                              ⚡ EARLY PICKUP READY
                            </span>
                          )}
                          {j.is_swap && (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 3,
                                fontSize: 10,
                                fontWeight: 700,
                                background: '#ecfdf5',
                                color: '#065f46',
                                border: '1px solid #a7f3d0',
                                padding: '2px 6px',
                                borderRadius: 4,
                                letterSpacing: '0.02em',
                              }}
                            >
                              🔄 SWAP
                            </span>
                          )}
                          {(j.is_commercial ||
                            j.payment_type === 'net_30' ||
                            j.notes?.includes('VIP CONTRACTOR') ||
                            j.notes?.includes('VIP Contractor')) && (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 3,
                                fontSize: 10,
                                fontWeight: 700,
                                background: '#eff6ff',
                                color: '#1d4ed8',
                                border: '1px solid #bfdbfe',
                                padding: '2px 6px',
                                borderRadius: 4,
                                letterSpacing: '0.02em',
                              }}
                            >
                              🏗️ VIP NET-30
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        {dateLabel(j.delivery_date)} — {dateLabel(j.pickup_date)}
                      </td>
                      <td>{data.users.find((u) => u.id === j.driver_id)?.name ?? 'Unassigned'}</td>
                      <td>
                        <span className="pill" style={{ color: statusColors[j.status] }}>
                          <span className="dot" />
                          {statusLabels[j.status]}
                        </span>
                      </td>
                      <td>{money(j.price_cents)}</td>
                      <td>
                        <Button variant="ghost" onClick={() => openJob(j)}>
                          Details <ArrowUpRight size={12} />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!filtered.length && (
              <div className="empty">
                <Search size={25} />
                <p>No jobs match your search.</p>
              </div>
            )}
          </div>
        )}
        {view === 'calendar' && (
          <>
            <div className="calendar-head">
              <h3>
                {dateLabel(week)} – {dateLabel(addDays(week, 6))}
              </h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button
                  className="btn-icon"
                  aria-label="Previous week"
                  onClick={() => setWeek(addDays(week, -7))}
                >
                  <ChevronLeft size={14} />
                </Button>
                <Button onClick={() => setWeek(today())}>Today</Button>
                <Button
                  className="btn-icon"
                  aria-label="Next week"
                  onClick={() => setWeek(addDays(week, 7))}
                >
                  <ChevronRight size={14} />
                </Button>
              </div>
            </div>
            <div className="calendar-grid">
              {Array.from({ length: 7 }, (_, i) => addDays(week, i)).map((date) => (
                <div key={date} className={`calendar-day ${date === today() ? 'is-today' : ''}`}>
                  <div className="calendar-date">
                    {new Date(date + 'T12:00:00Z').toLocaleDateString('en-US', {
                      weekday: 'short',
                      timeZone: 'UTC',
                    })}
                    <strong>{date.slice(-2)}</strong>
                  </div>
                  {filtered
                    .filter(
                      (j) =>
                        j.status !== 'cancelled' &&
                        (j.delivery_date === date || j.pickup_date === date),
                    )
                    .map((j) => (
                      <button
                        className={`calendar-event ${j.pickup_date === date ? 'pickup' : ''}`}
                        key={j.id}
                        onClick={() => openJob(j)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
                          <b>{j.customer_name}</b>
                          {j.is_swap && (
                            <span
                              style={{
                                fontSize: 9,
                                fontWeight: 700,
                                background: '#ecfdf5',
                                color: '#065f46',
                                border: '1px solid #a7f3d0',
                                padding: '1px 4px',
                                borderRadius: 3,
                              }}
                            >
                              🔄 SWAP
                            </span>
                          )}
                        </div>
                        <span>
                          {j.size_yards} yd · {j.pickup_date === date ? 'Pickup' : 'Delivery'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 3 }}>
                          <small style={{ margin: 0 }}>
                            {data.users.find((u) => u.id === j.driver_id)?.name ?? 'Unassigned'}
                          </small>
                          {j.driver_id && (
                            <span
                              style={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                background: '#3b523f',
                                color: 'white',
                                fontSize: 9,
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                              title={data.users.find((u) => u.id === j.driver_id)?.name}
                            >
                              {initials(data.users.find((u) => u.id === j.driver_id)?.name ?? 'D')}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                </div>
              ))}
            </div>
          </>
        )}
        <div className="board-footer">
          <span>{filtered.length} jobs in your workspace</span>
          <span>
            {view === 'board'
              ? 'Drag jobs to update status · Click a card for details'
              : 'Your next delivery is a click away'}
          </span>
        </div>
      </section>
      <div className="bottom-grid">
        <section className="panel">
          <div className="panel-heading">
            <h3 className="small-title">
              <Activity size={15} />
              Recent activity
            </h3>
            <Link className="btn btn-ghost" href="/bookings">
              All jobs <ArrowUpRight size={11} />
            </Link>
          </div>
          {data.jobs.slice(0, 3).map((j) => (
            <button
              key={j.id}
              className="activity-row"
              style={{
                width: '100%',
                textAlign: 'left',
                background: 'none',
                borderTop: 0,
                borderLeft: 0,
                borderRight: 0,
              }}
              onClick={() => openJob(j)}
            >
              <div className="activity-icon">
                {j.status === 'booked' ? <CalendarDays size={15} /> : <CircleCheck size={15} />}
              </div>
              <div>
                <strong>
                  {j.customer_name}{' '}
                  <span style={{ color: '#96a194' }}>· {statusLabels[j.status].toLowerCase()}</span>
                </strong>
                <p>
                  {j.size_yards} yard dumpster · {j.delivery_address.replace(', Austin, TX', '')}
                </p>
              </div>
              <time>{dateLabel(j.delivery_date)}</time>
            </button>
          ))}
          {!data.jobs.length && <div className="empty">Your first booking will appear here.</div>}
        </section>
        <section className="panel">
          <div className="panel-heading">
            <h3 className="small-title">
              <Box size={15} />
              Fleet at a glance
            </h3>
            <Link href="/inventory" className="btn btn-ghost">
              View fleet <ArrowUpRight size={11} />
            </Link>
          </div>
          <div className="fleet-summary">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 10,
                color: '#89958b',
              }}
            >
              <span>Container availability</span>
              <b style={{ color: '#667852', fontWeight: 500 }}>{data.containers.length} total</b>
            </div>
            <div className="fleet-bar">
              {[
                { n: available, c: '#adc478' },
                { n: onsite, c: '#a8bac7' },
                { n: maintenance, c: '#e0c193' },
              ]
                .filter((x) => x.n)
                .map((x) => (
                  <div key={x.c} style={{ flex: x.n, background: x.c }} />
                ))}
            </div>
            <div className="fleet-legend">
              {[
                { title: 'Available', n: available, c: '#adc478' },
                { title: 'On site', n: onsite, c: '#a8bac7' },
                { title: 'Maintenance', n: maintenance, c: '#e0c193' },
              ].map((x) => (
                <div key={x.title}>
                  <p>
                    <span className="dot" style={{ color: x.c }} />
                    {x.title}
                  </p>
                  <strong>{x.n}</strong>
                </div>
              ))}
            </div>
            <div className="fleet-note">
              <Truck size={12} />
              {available} containers ready for their next project.
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
