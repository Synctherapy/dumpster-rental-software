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
  const [range, setRange] = useState('all');
  const [week, setWeek] = useState(today());
  const filtered = data.jobs.filter(
    (j) =>
      `${j.customer_name} ${j.delivery_address} ${j.id} ${j.notes}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (!driver || j.driver_id === driver) &&
      (range !== 'today' || j.delivery_date === today() || j.pickup_date === today()) &&
      (range !== 'week' || (j.delivery_date >= today() && j.delivery_date <= addDays(today(), 7))),
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
              value={range}
              aria-label="Date range"
              onChange={(e) => setRange(e.target.value)}
            >
              <option value="all">All dates</option>
              <option value="today">Today</option>
              <option value="week">Next 7 days</option>
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
                  .map((job, index) => (
                    <button
                      className="job-card"
                      key={job.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('text/plain', job.id)}
                      onClick={() => openJob(job)}
                      aria-label={`Open ${job.customer_name} job`}
                    >
                      <div className="job-card-top">
                        <span className={`size-tag s${job.size_yards}`}>{job.size_yards} yd</span>
                        <span className="job-ref">
                          #
                          {job.id.startsWith('job-')
                            ? `10${job.id.split('-')[1].padStart(2, '0')}`
                            : job.id.slice(0, 5).toUpperCase()}
                        </span>
                      </div>
                      <h4>{job.customer_name}</h4>
                      <div className="job-address">
                        <MapPin size={10} />
                        {job.delivery_address.replace(', Austin, TX', '')}
                      </div>
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
                  ))}
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
                {filtered.map((j) => (
                  <tr key={j.id}>
                    <td>
                      {j.customer_name}
                      <small>{j.delivery_address}</small>
                    </td>
                    <td>
                      <span className={`size-tag s${j.size_yards}`}>{j.size_yards} yd</span>
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
                ))}
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
                        <b>{j.customer_name}</b>
                        <span>
                          {j.size_yards} yd · {j.pickup_date === date ? 'Pickup' : 'Delivery'}
                        </span>
                        <small>
                          {data.users.find((u) => u.id === j.driver_id)?.name ?? 'Unassigned'}
                        </small>
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
