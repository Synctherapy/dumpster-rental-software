'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowDownToLine,
  ArrowUpRight,
  Bell,
  Box,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  CreditCard,
  DollarSign,
  Globe,
  LayoutDashboard,
  Leaf,
  Loader2,
  LogOut,
  Menu,
  MessageSquare,
  Pencil,
  Phone,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
  X,
} from 'lucide-react';
import { Brand } from './brand';
import { Button } from './ui/button';
import { Modal } from './ui/dialog';
import { DispatchBoard } from './dispatch-board';
import { JobDrawer } from './job-drawer';
import { Settings } from './settings';
import { BulkContainerModal } from './bulk-container-modal';
import { CalendarSubscribeModal } from './calendar-subscribe-modal';
import { QuickOrderModal } from './quick-order-modal';
import { api, initials } from '@/lib/client';
import { money, dateLabel, today, type Workspace, type JobStatus } from '@/lib/types';
const navigation = [
  { id: 'dashboard', href: '/dashboard', title: 'Dispatch board', icon: LayoutDashboard },
  { id: 'bookings', href: '/bookings', title: 'Bookings', icon: CalendarDays },
  { id: 'calendar', href: '/calendar', title: 'Calendar', icon: CalendarDays },
  { id: 'inventory', href: '/inventory', title: 'Containers', icon: Box },
  { id: 'drivers', href: '/drivers', title: 'Drivers', icon: Users },
  { id: 'payments', href: '/payments', title: 'Payments', icon: CreditCard },
];
const descriptions: Record<string, string> = {
  dashboard: 'A clear view of every job. Keep your day moving.',
  bookings: 'Every booking, from first click to final pickup.',
  calendar: 'Plan the week. Make room for what’s next.',
  inventory: 'Your containers, accounted for and ready to roll.',
  drivers: 'Good people. Great work. One connected crew.',
  payments: 'Every transaction. Every fee. Nothing hidden.',
  settings: 'Build a business that runs the way you do.',
};
type Notify = (message: string, error?: boolean) => void;
export function WorkspaceApp({ page = 'dashboard' }: { page?: string }) {
  const [data, setData] = useState<Workspace | null>(null);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; error: boolean } | null>(null);
  const [mobile, setMobile] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [resource, setResource] = useState<'container' | 'driver' | null>(null);
  const [bulkContainerModal, setBulkContainerModal] = useState(false);
  const [calendarModal, setCalendarModal] = useState(false);
  const [quickOrderModal, setQuickOrderModal] = useState(false);
  const [help, setHelp] = useState(false);
  const notify: Notify = useCallback((message, error = false) => setToast({ message, error }), []);
  const reload = useCallback(async () => {
    const d = await api<Workspace>('/api/workspace');
    setData(d);
  }, []);
  useEffect(() => {
    api<Workspace>('/api/workspace')
      .then(setData)
      .catch((e) => setError(e.message));
    const interval = setInterval(() => reload().catch(() => {}), 30000);
    return () => clearInterval(interval);
  }, [reload]);
  useEffect(() => {
    if (toast) {
      const timeout = setTimeout(() => setToast(null), 6000);
      return () => clearTimeout(timeout);
    }
  }, [toast]);
  if (!data)
    return (
      <div className="loading">
        {error ? (
          <>
            <h2>Let’s finish setting up.</h2>
            <p>{error}</p>
            <Link href="/login" className="btn">
              Go to login
            </Link>
          </>
        ) : (
          <>
            <Loader2 className="spin" size={26} />
            <p>Getting your workspace ready…</p>
          </>
        )}
      </div>
    );
  const title =
    page === 'settings'
      ? 'Business settings'
      : (navigation.find((n) => n.id === page)?.title ?? 'Dispatch board');
  const owner = data.users.find((u) => u.role === 'owner');
  const job = data.jobs.find((j) => j.id === selected);
  const move = async (id: string, status: JobStatus) => {
    const j = data.jobs.find((j) => j.id === id);
    if (!j || j.status === status) return;
    if (status === 'dispatched' || status === 'delivered' || status === 'completed') {
      setSelected(id);
      notify(
        status === 'dispatched'
          ? 'Assign a driver and container to dispatch.'
          : status === 'delivered'
            ? 'Upload delivery proof to mark this job delivered.'
            : 'Review tonnage and close the invoice in job details.',
      );
      return;
    }
    try {
      await api(`/api/jobs/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
      await reload();
      notify('Job moved. Your board is up to date.');
    } catch (e) {
      notify((e as Error).message, true);
    }
  };
  return (
    <div className="shell">
      {mobile && (
        <button
          className="overlay"
          style={{ zIndex: 25 }}
          onClick={() => setMobile(false)}
          aria-label="Close navigation"
        />
      )}
      <aside className={`sidebar ${mobile ? 'open' : ''}`}>
        <Brand href="/dashboard" />
        <Link href="/settings" className="org-switch">
          <div className="org-logo">
            <Leaf size={17} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <strong>{data.organization.name}</strong>
            <p>Your workspace</p>
          </div>
          <ChevronDown size={13} />
        </Link>
        <div className="nav-label">WORKSPACE</div>
        <nav className="nav-links" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`nav-link ${page === item.id ? 'active' : ''}`}
              onClick={() => setMobile(false)}
            >
              <item.icon size={16} />
              {item.title}
              {item.id === 'dashboard' && (
                <span className="count">
                  {
                    data.jobs.filter(
                      (j) => !['cancelled', 'completed', 'quoted'].includes(j.status),
                    ).length
                  }
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <Link href="/settings" className={`nav-link ${page === 'settings' ? 'active' : ''}`}>
            <Settings2 size={16} />
            Settings
          </Link>
          <button
            className="nav-link"
            style={{
              width: '100%',
              border: 0,
              background: 'none',
              color: 'inherit',
              textAlign: 'left',
            }}
            onClick={() => setHelp(true)}
          >
            <CircleHelp size={16} />
            Help & getting started
          </button>
          <div className="booking-callout">
            <Globe size={19} className="icon" />
            <h4>Your next job starts online.</h4>
            <p>Your booking page is always open. Share it and let the bookings come to you.</p>
            <Link href={`/book/${data.organization.slug}`} target="_blank">
              View booking page <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="user-profile">
            <span className="avatar">{initials(owner?.name ?? 'Owner')}</span>
            <div style={{ flex: 1 }}>
              <strong>{owner?.name ?? 'Your account'}</strong>
              <p>Business owner</p>
            </div>
            <button
              aria-label="Log out"
              style={{ background: 'none', border: 0, color: '#93a58e' }}
              onClick={async () => {
                await api('/api/auth', {
                  method: 'POST',
                  body: JSON.stringify({ action: 'logout' }),
                });
                window.location.href = '/login';
              }}
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <div className="breadcrumbs">
            <Button
              className="mobile-menu btn-icon"
              variant="ghost"
              onClick={() => setMobile(true)}
              aria-label="Open navigation"
            >
              <Menu size={19} />
            </Button>
            <span>Workspace</span>
            <ChevronRight size={11} />
            <strong>{title}</strong>
          </div>
          <div className="top-actions">
            <span className="mode-label">{data.demo ? 'Demo workspace' : 'Stripe test mode'}</span>
            <Button
              variant="ghost"
              className="btn-icon"
              aria-label="Notifications"
              onClick={() => setNotifications(!notifications)}
            >
              <Bell size={16} />
            </Button>
            <span className="avatar top-avatar">{initials(owner?.name ?? 'Owner')}</span>
          </div>
          {notifications && (
            <section className="notification-feed">
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <h3>Notifications</h3>
                <button
                  aria-label="Close notifications"
                  className="btn btn-ghost btn-icon"
                  onClick={() => setNotifications(false)}
                >
                  <X size={13} />
                </button>
              </div>
              {data.notifications_log.length ? (
                data.notifications_log.slice(0, 5).map((n) => (
                  <div key={n.id} style={{ padding: '11px 0', borderTop: '1px solid var(--line)' }}>
                    <p>{n.template.replaceAll('_', ' ')}</p>
                    <small className="muted">
                      {n.channel.toUpperCase()} · {n.status} ·{' '}
                      {new Date(n.sent_at).toLocaleTimeString()}
                    </small>
                  </div>
                ))
              ) : (
                <p className="muted">
                  Service updates will appear here as jobs move through your board.
                </p>
              )}
            </section>
          )}
        </header>
        <main className="content">
          <div className="page-heading">
            <div>
              <h1>{title}</h1>
              <p>{descriptions[page]}</p>
            </div>
            <div className="heading-actions">
              {['dashboard', 'bookings', 'calendar'].includes(page) ? (
                <>
                  {page === 'calendar' && (
                    <Button onClick={() => setCalendarModal(true)}>
                      <CalendarDays size={13} />
                      Subscribe (iCal)
                    </Button>
                  )}
                  <Button asChild>
                    <Link href={`/book/${data.organization.slug}`} target="_blank">
                      <Globe size={13} />
                      Booking page <ArrowUpRight size={12} />
                    </Link>
                  </Button>
                  <Button variant="primary" onClick={() => setQuickOrderModal(true)}>
                    <Phone size={14} />
                    + Phone order
                  </Button>
                </>
              ) : page === 'inventory' ? (
                <>
                  <Button onClick={() => setBulkContainerModal(true)}>
                    <Sparkles size={13} />
                    Bulk fleet / CSV
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => setResource('container')}
                  >
                    <Plus size={14} />
                    Add container
                  </Button>
                </>
              ) : page === 'drivers' ? (
                <Button
                  variant="primary"
                  onClick={() => setResource('driver')}
                >
                  <Plus size={14} />
                  Add driver
                </Button>
              ) : page === 'payments' ? (
                <Button onClick={() => exportPayments(data)}>
                  <ArrowDownToLine size={13} />
                  Export transactions
                </Button>
              ) : (
                <Button asChild>
                  <Link href={`/book/${data.organization.slug}`} target="_blank">
                    <Globe size={13} />
                    Preview booking page
                  </Link>
                </Button>
              )}
            </div>
          </div>
          {['dashboard', 'bookings', 'calendar'].includes(page) && (
            <>
              <OverviewStats data={data} />
              <DispatchBoard
                key={page}
                data={data}
                openJob={(j) => setSelected(j.id)}
                onMove={(id, status) => void move(id, status)}
                initialView={
                  page === 'calendar' ? 'calendar' : page === 'bookings' ? 'list' : 'board'
                }
                onQuickOrder={() => setQuickOrderModal(true)}
                onSubscribeCalendar={() => setCalendarModal(true)}
              />
            </>
          )}
          {page === 'inventory' && (
            <Inventory
              data={data}
              reload={reload}
              notify={notify}
              openJob={(id) => setSelected(id)}
              onBulkAdd={() => setBulkContainerModal(true)}
            />
          )}
          {page === 'drivers' && <Drivers data={data} reload={reload} notify={notify} />}
          {page === 'payments' && <Payments data={data} openJob={(id) => setSelected(id)} />}
          {page === 'settings' && <Settings data={data} reload={reload} notify={notify} />}
          <footer className="content-footer">
            <span>
              <span className="dot" style={{ color: '#9db775', marginRight: 5 }} />
              {data.demo
                ? 'Local demo · Changes are saved on this machine'
                : 'Connected workspace · Updates every 30 seconds'}
            </span>
            <span>
              Less admin. More open road. <span style={{ color: '#98aa83' }}>rollos</span>
            </span>
          </footer>
        </main>
      </div>
      {job && (
        <JobDrawer
          key={job.id}
          job={job}
          data={data}
          onClose={() => setSelected(null)}
          onUpdate={reload}
          notify={notify}
        />
      )}
      <ResourceDialog
        key={resource}
        kind={resource}
        close={() => setResource(null)}
        reload={reload}
        notify={notify}
      />
      <BulkContainerModal
        open={bulkContainerModal}
        onClose={() => setBulkContainerModal(false)}
        data={data}
        reload={reload}
        notify={notify}
      />
      <CalendarSubscribeModal
        open={calendarModal}
        onClose={() => setCalendarModal(false)}
        data={data}
        notify={notify}
      />
      <QuickOrderModal
        open={quickOrderModal}
        onClose={() => setQuickOrderModal(false)}
        data={data}
        reload={reload}
        notify={notify}
        onCreated={(j) => setSelected(j.id)}
      />
      <Modal
        open={help}
        onOpenChange={setHelp}
        title="Let’s get you rolling."
        description="Your workspace in a few simple steps."
      >
        <div className="form-stack">
          {[
            'Set your prices and service ZIP codes in Settings.',
            'Add your available containers and drivers.',
            'Share your booking page to create a rental.',
            'Open a booked job, assign a driver and container, then dispatch.',
            'Give your driver their route link. Upload a delivery photo, mark delivered, then picked up.',
            'Record actual tonnage and close the final invoice.',
          ].map((t, i) => (
            <p key={t} style={{ fontSize: 12, lineHeight: 1.7, color: '#7f8e75' }}>
              <b style={{ color: '#6b834a', marginRight: 6 }}>{i + 1}.</b>
              {t}
            </p>
          ))}
          <div className="booking-notice">
            Demo mode does not send SMS or process real payments. Setup details are in the
            repository README.
          </div>
        </div>
      </Modal>
      {toast && (
        <div
          role={toast.error ? 'alert' : 'status'}
          className={`toast ${toast.error ? 'error' : ''}`}
        >
          {toast.error ? <CircleHelp size={16} /> : <CheckCircle2 size={16} />}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} aria-label="Dismiss notification">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
function OverviewStats({ data }: { data: Workspace }) {
  const active = data.jobs.filter(
    (j) => !['cancelled', 'completed', 'quoted'].includes(j.status),
  ).length;
  const deliveries = data.jobs.filter(
    (j) => j.delivery_date === today() && ['booked', 'dispatched'].includes(j.status),
  ).length;
  const available = data.containers.filter((c) => c.status === 'yard').length;
  const gross = data.payments
    .filter((p) => ['demo', 'succeeded'].includes(p.status))
    .reduce((n, p) => n + p.amount_cents - p.refunded_cents, 0);
  const items = [
    {
      title: 'Active jobs',
      value: String(active),
      icon: CalendarDays,
      foot: (
        <>
          <b>{data.jobs.filter((j) => j.status === 'booked').length} booked</b> and ready to
          schedule
        </>
      ),
    },
    {
      title: 'Deliveries today',
      value: String(deliveries),
      icon: Truck,
      foot: <>Let’s keep the day moving</>,
    },
    {
      title: 'Containers available',
      value: String(available).padStart(2, '0'),
      icon: Box,
      foot: (
        <>
          <b>
            {data.containers.length ? Math.round((available / data.containers.length) * 100) : 0}%
            available
          </b>{' '}
          of {data.containers.length} total
        </>
      ),
    },
    {
      title: data.demo ? 'Demo payment volume' : 'Payment volume',
      value: money(gross),
      icon: DollarSign,
      foot: (
        <>
          Across {data.payments.filter((p) => ['demo', 'succeeded'].includes(p.status)).length}{' '}
          {data.demo ? 'simulated transactions' : 'transactions'}
        </>
      ),
    },
  ];
  return (
    <section className="stats">
      {items.map((s) => (
        <div className="stat" key={s.title}>
          <div className="stat-label">
            {s.title}
            <span className="stat-icon">
              <s.icon size={15} />
            </span>
          </div>
          <div className="stat-number">{s.value}</div>
          <div className="stat-foot">{s.foot}</div>
        </div>
      ))}
    </section>
  );
}
function Inventory({
  data,
  reload,
  notify,
  openJob,
  onBulkAdd,
}: {
  data: Workspace;
  reload: () => Promise<void>;
  notify: Notify;
  openJob: (id: string) => void;
  onBulkAdd?: () => void;
}) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const rows = data.containers.filter(
    (c) =>
      c.label.toLowerCase().includes(search.toLowerCase()) &&
      (filter === 'all' || c.status === filter),
  );
  const colors = { yard: '#7f9d57', on_site: '#81a1bb', maintenance: '#bda16c' };
  return (
    <>
      <div className="stats">
        {[
          { label: 'Total containers', value: data.containers.length },
          {
            label: 'Ready to dispatch',
            value: data.containers.filter((c) => c.status === 'yard').length,
          },
          { label: 'On site', value: data.containers.filter((c) => c.status === 'on_site').length },
          {
            label: 'In maintenance',
            value: data.containers.filter((c) => c.status === 'maintenance').length,
          },
        ].map((s) => (
          <div key={s.label} className="stat">
            <div className="stat-label">
              {s.label}
              <Box size={15} />
            </div>
            <div className="stat-number">{s.value}</div>
            <div className="stat-foot">Keep your fleet in the loop.</div>
          </div>
        ))}
      </div>
      <section className="panel">
        <div className="table-top">
          <h3>Your fleet</h3>
          <div className="board-tools">
            {onBulkAdd && (
              <Button onClick={onBulkAdd}>
                <Sparkles size={13} />
                Bulk fleet / CSV
              </Button>
            )}
            <div className="search">
              <Search size={13} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find a container…"
                aria-label="Find a container"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Container status"
            >
              <option value="all">All statuses</option>
              <option value="yard">Available</option>
              <option value="on_site">On site</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Container</th>
                <th>Size</th>
                <th>Availability</th>
                <th>Current job</th>
                <th>Manage</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>
                    <Box
                      size={13}
                      style={{ display: 'inline', marginRight: 9, color: '#93a181' }}
                    />
                    {c.label}
                  </td>
                  <td>
                    <span className={`size-tag s${c.size_yards}`}>{c.size_yards} yd</span>
                  </td>
                  <td>
                    <span className="pill" style={{ color: colors[c.status] }}>
                      <span className="dot" />
                      {c.status === 'yard'
                        ? 'Available'
                        : c.status === 'on_site'
                          ? 'On site'
                          : 'Maintenance'}
                    </span>
                  </td>
                  <td>
                    {c.current_job_id ? (
                      <Button variant="ghost" onClick={() => openJob(c.current_job_id!)}>
                        {data.jobs.find((j) => j.id === c.current_job_id)?.customer_name}
                        <ArrowUpRight size={11} />
                      </Button>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td>
                    {c.status !== 'on_site' ? (
                      <Button
                        variant="ghost"
                        onClick={async () => {
                          try {
                            await api('/api/resources', {
                              method: 'PATCH',
                              body: JSON.stringify({
                                id: c.id,
                                status: c.status === 'yard' ? 'maintenance' : 'yard',
                              }),
                            });
                            await reload();
                            notify('Container availability updated.');
                          } catch (e) {
                            notify((e as Error).message, true);
                          }
                        }}
                      >
                        {c.status === 'yard' ? 'Mark maintenance' : 'Return to yard'}
                      </Button>
                    ) : (
                      <span className="muted" style={{ fontSize: 11 }}>
                        Assigned to active job
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && (
            <div className="empty">
              <Box size={30} />
              <p>No containers to show. Add one to start your fleet.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
function Drivers({ data, reload, notify }: { data: Workspace; reload: () => Promise<void>; notify: Notify }) {
  const [editingDriver, setEditingDriver] = useState<{ id: string; name: string; phone: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  return (
    <>
      <div className="driver-grid">
        {data.users
          .filter((u) => u.role === 'driver')
          .map((u, i) => {
            const jobs = data.jobs.filter((j) => j.driver_id === u.id);
            return (
              <section className="panel driver-card" key={u.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <span className={`avatar ${i % 3 === 1 ? 'blue' : i % 3 === 2 ? 'lilac' : ''}`} style={{ marginBottom: 0 }}>
                    {initials(u.name)}
                  </span>
                  <Button
                    variant="ghost"
                    style={{ fontSize: 11, padding: '4px 8px', height: 'auto', gap: 4 }}
                    onClick={() => {
                      setError('');
                      setEditingDriver({ id: u.id, name: u.name, phone: u.phone || '' });
                    }}
                  >
                    <Pencil size={11} /> Edit details
                  </Button>
                </div>
                <h3>{u.name}</h3>
                <p className="muted" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Phone size={12} style={{ color: u.phone ? '#6e8f49' : '#b0b8a6' }} />
                  {u.phone || 'No phone set · Click edit to add'}
                </p>
                <div className="driver-stats">
                  <div>
                    <strong>
                      {jobs.filter((j) => ['dispatched', 'delivered'].includes(j.status)).length}
                    </strong>
                    <span>Active jobs</span>
                  </div>
                  <div>
                    <strong>{jobs.filter((j) => j.delivery_date === today()).length}</strong>
                    <span>Deliveries today</span>
                  </div>
                  <div>
                    <strong>{jobs.filter((j) => j.status === 'completed').length}</strong>
                    <span>Completed</span>
                  </div>
                </div>
                <Button
                  variant="primary"
                  onClick={async () => {
                    try {
                      const result = await api<{ url: string }>('/api/driver-link', {
                        method: 'POST',
                        body: JSON.stringify({ driver_id: u.id }),
                      });
                      window.open(result.url, '_blank', 'noopener,noreferrer');
                    } catch (e) {
                      notify((e as Error).message, true);
                    }
                  }}
                >
                  <Truck size={13} />
                  Open driver route <ArrowUpRight size={12} />
                </Button>
                <Button
                  variant="ghost"
                  style={{ marginTop: 8 }}
                  onClick={async () => {
                    try {
                      const result = await api<{ url: string }>('/api/driver-link', {
                        method: 'POST',
                        body: JSON.stringify({ driver_id: u.id }),
                      });
                      await navigator.clipboard.writeText(window.location.origin + result.url);
                      notify('Driver link copied. Valid for 30 days.');
                    } catch (e) {
                      notify((e as Error).message, true);
                    }
                  }}
                >
                  Copy secure route link
                </Button>
                <Button
                  variant="ghost"
                  onClick={async () => {
                    if (!u.phone) {
                      notify('Please add a phone number for this driver first.', true);
                      setEditingDriver({ id: u.id, name: u.name, phone: '' });
                      return;
                    }
                    try {
                      const result = await api<{ status: string; demo: boolean }>(
                        '/api/invite-driver',
                        { method: 'POST', body: JSON.stringify({ driver_id: u.id }) },
                      );
                      notify(
                        result.demo
                          ? 'Demo invitation logged. No SMS sent.'
                          : 'Driver invitation status: ' + result.status,
                      );
                    } catch (e) {
                      notify((e as Error).message, true);
                    }
                  }}
                >
                  <MessageSquare size={12} />
                  Send SMS route link
                </Button>
              </section>
            );
          })}
        {!data.users.some((u) => u.role === 'driver') && (
          <div className="panel empty">
            <Users size={30} />
            <p>Add your first driver to get your crew connected.</p>
          </div>
        )}
      </div>

      {editingDriver && (
        <Modal
          open={!!editingDriver}
          onOpenChange={(o) => !o && setEditingDriver(null)}
          title={`Edit ${editingDriver.name}`}
          description="Update driver phone number for SMS dispatch and name details."
        >
          <form
            className="form-stack"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              setError('');
              const formData = new FormData(e.currentTarget);
              const name = String(formData.get('name') ?? '').trim();
              const phone = String(formData.get('phone') ?? '').trim();
              try {
                await api('/api/resources', {
                  method: 'PATCH',
                  body: JSON.stringify({
                    kind: 'driver',
                    id: editingDriver.id,
                    name,
                    phone,
                  }),
                });
                await reload();
                notify('Driver details updated successfully.');
                setEditingDriver(null);
              } catch (err) {
                setError((err as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            <label className="field">
              Driver Name
              <input
                name="name"
                defaultValue={editingDriver.name}
                required
                minLength={2}
                placeholder="First and last name"
              />
            </label>
            <label className="field">
              Phone Number
              <input
                name="phone"
                type="tel"
                defaultValue={editingDriver.phone}
                required
                placeholder="(512) 555-1234 or +15125551234"
              />
              <small>Accepts (512) 555-1234 or international +15125551234. Route SMS will be sent here.</small>
            </label>
            {error && (
              <div className="error-box" role="alert">
                {error}
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
              <Button type="button" variant="ghost" onClick={() => setEditingDriver(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={busy}>
                {busy ? <Loader2 size={14} className="spin" /> : 'Save Driver'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
function Payments({ data, openJob }: { data: Workspace; openJob: (id: string) => void }) {
  const rows = data.payments;
  const settled = rows.filter((p) => ['succeeded', 'demo'].includes(p.status));
  const gross = settled.reduce((n, p) => n + p.amount_cents - p.refunded_cents, 0);
  const fees = settled.reduce((n, p) => n + p.application_fee_cents, 0);
  return (
    <>
      <div className="stats">
        {[
          {
            label: data.demo ? 'Simulated gross volume' : 'Gross collected',
            value: money(gross),
            note: 'Deposits and final balances',
          },
          { label: 'Platform fee · 1%', value: money(fees), note: 'Computed on each transaction' },
          {
            label: 'After platform fee',
            value: money(gross - fees),
            note: 'Before Stripe processing fees',
          },
          {
            label: 'Reconciliation',
            value: data.demo
              ? 'Demo only'
              : `${rows.filter((p) => p.stripe_payment_intent_id).length}/${rows.length}`,
            note: data.demo
              ? 'No Stripe objects for demo payments'
              : 'Payments linked to Stripe objects',
          },
        ].map((s) => (
          <div className="stat" key={s.label}>
            <div className="stat-label">
              {s.label}
              <CreditCard size={15} />
            </div>
            <div className="stat-number">{s.value}</div>
            <div className="stat-foot">{s.note}</div>
          </div>
        ))}
      </div>
      <div className="booking-notice" style={{ marginBottom: 20 }}>
        <ShieldCheck size={14} />
        {data.demo
          ? 'These are simulated payments. No money has moved.'
          : 'Stripe processing fees and actual bank payouts must be confirmed in your Stripe dashboard. This view shows the recorded rental ledger.'}
      </div>
      <section className="panel">
        <div className="panel-heading">
          <h3>Transaction ledger</h3>
          <span className="pill">{rows.length} transactions</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Customer / reference</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Platform fee</th>
                <th>Status</th>
                <th>Stripe reference</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const j = data.jobs.find((j) => j.id === p.job_id);
                return (
                  <tr key={p.id}>
                    <td>
                      {j?.customer_name ?? 'Customer'}
                      <small>{p.idempotency_key}</small>
                    </td>
                    <td>{dateLabel(p.created_at.slice(0, 10))}</td>
                    <td>
                      {money(p.amount_cents)}
                      {p.refunded_cents > 0 && <small>{money(p.refunded_cents)} refunded</small>}
                    </td>
                    <td>{money(p.application_fee_cents)}</td>
                    <td>
                      <span
                        className="pill"
                        style={{ color: p.status === 'failed' ? '#b96861' : '#889d62' }}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: 10, color: '#94a089' }}>
                        {p.stripe_payment_intent_id ?? 'Demo · no Stripe object'}
                      </span>
                    </td>
                    <td>
                      <Button variant="ghost" onClick={() => openJob(p.job_id)}>
                        View job <ArrowUpRight size={12} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!rows.length && (
            <div className="empty">
              <CreditCard size={28} />
              <p>Your first payment will appear here.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
function exportPayments(data: Workspace) {
  const clean = (value: unknown) => {
    let s = String(value ?? '');
    if (/^[=+@-]/.test(s)) s = "'" + s;
    return '"' + s.replaceAll('"', '""') + '"';
  };
  const csv = [
    [
      'Payment ID',
      'Job ID',
      'Stripe intent',
      'Amount cents',
      'Platform fee cents',
      'Refunded cents',
      'Status',
      'Idempotency key',
      'Created at',
    ],
    ...data.payments.map((p) => [
      p.id,
      p.job_id,
      p.stripe_payment_intent_id,
      p.amount_cents,
      p.application_fee_cents,
      p.refunded_cents,
      p.status,
      p.idempotency_key,
      p.created_at,
    ]),
  ]
    .map((r) => r.map(clean).join(','))
    .join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'rollos-transactions.csv';
  a.click();
  URL.revokeObjectURL(url);
}
function ResourceDialog({
  kind,
  close,
  reload,
  notify,
}: {
  kind: 'container' | 'driver' | null;
  close: () => void;
  reload: () => Promise<void>;
  notify: Notify;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  return (
    <Modal
      open={!!kind}
      onOpenChange={(o) => !o && close()}
      title={`Add ${kind === 'container' ? 'a container' : 'a driver'}`}
      description={
        kind === 'container'
          ? 'Give your container a number and pick its size.'
          : 'Add a driver to your crew. They can work from a secure mobile link.'
      }
    >
      <form
        className="form-stack"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError('');
          const fields = new FormData(e.currentTarget);
          try {
            await api('/api/resources', {
              method: 'POST',
              body: JSON.stringify(
                kind === 'container'
                  ? { kind, label: fields.get('label'), size_yards: Number(fields.get('size')) }
                  : { kind, name: fields.get('name'), phone: fields.get('phone') },
              ),
            });
            await reload();
            notify(`${kind === 'container' ? 'Container' : 'Driver'} added to your workspace.`);
            close();
          } catch (e) {
            setError((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        {kind === 'container' ? (
          <>
            <label className="field">
              Container number
              <input name="label" required placeholder="e.g. GL-019" maxLength={30} />
            </label>
            <label className="field">
              Container size
              <select name="size" defaultValue="20">
                {[10, 20, 30, 40].map((s) => (
                  <option key={s} value={s}>
                    {s} yard
                  </option>
                ))}
              </select>
            </label>
          </>
        ) : (
          <>
            <label className="field">
              Driver name
              <input name="name" required minLength={2} placeholder="First and last name" />
            </label>
            <label className="field">
              Phone number
              <input
                name="phone"
                type="tel"
                required
                pattern="\+[1-9][0-9]{7,14}"
                placeholder="+15125551234"
              />
              <small>International format. Dispatch messages are sent here.</small>
            </label>
          </>
        )}
        {error && (
          <div className="error-box" role="alert">
            {error}
          </div>
        )}
        <Button variant="primary" type="submit" disabled={busy}>
          {busy ? <Loader2 size={14} className="spin" /> : <Plus size={14} />}Add {kind}
        </Button>
      </form>
    </Modal>
  );
}
