'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  DollarSign,
  Download,
  ExternalLink,
  Home,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Truck,
  Users,
} from 'lucide-react';
import { Button } from './ui/button';
import { Modal } from './ui/dialog';
import { money, dateLabel, normalizePhone, type Job, type Workspace } from '@/lib/types';
import { initials } from '@/lib/client';

export interface CustomerProfile {
  id: string;
  name: string;
  company_name: string;
  phone: string;
  email: string;
  primary_address: string;
  zip: string;
  all_addresses: string[];
  is_commercial: boolean;
  total_spend_cents: number;
  total_orders: number;
  active_jobs: Job[];
  completed_jobs: Job[];
  all_jobs: Job[];
  last_order_date: string;
  first_order_date: string;
  notes: string;
}

export function CustomersView({
  data,
  openJob,
  onQuickOrderWithCustomer,
  notify,
}: {
  data: Workspace;
  openJob: (id: string) => void;
  onQuickOrderWithCustomer: (prefill: {
    name: string;
    phone: string;
    email: string;
    address: string;
    zip: string;
    isCommercial: boolean;
    notes?: string;
  }) => void;
  notify: (msg: string, error?: boolean) => void;
}) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'commercial' | 'residential' | 'active'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'spend' | 'orders' | 'name'>('recent');
  const [expandedCustomerId, setExpandedCustomerId] = useState<string | null>(null);
  const [copiedLinkFor, setCopiedLinkFor] = useState<string | null>(null);
  const [addCustomerModalOpen, setAddCustomerModalOpen] = useState(false);

  // Custom manual trade accounts added by the hauler
  const [customTradeAccounts, setCustomTradeAccounts] = useState<
    Array<{
      id: string;
      company_name: string;
      contact_name: string;
      phone: string;
      email: string;
      address: string;
      zip: string;
      is_commercial: boolean;
      notes: string;
      created_at: string;
    }>
  >(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`rollos_trade_accounts_${data.organization.slug}`);
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  // Modal state for adding a customer
  const [newCompany, setNewCompany] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newZip, setNewZip] = useState(data.pricing_rules[0]?.service_zips[0] || '78704');
  const [newIsCommercial, setNewIsCommercial] = useState(true);
  const [newNotes, setNewNotes] = useState('');

  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  // Aggregate all unique customers from jobs + manual trade accounts
  const customers = useMemo(() => {
    const map = new Map<string, CustomerProfile>();

    // Process all jobs in workspace
    for (const job of data.jobs) {
      const normalizedPhone = normalizePhone(job.customer_phone || '');
      const key = normalizedPhone || job.customer_name.trim().toLowerCase() || job.id;

      let profile = map.get(key);
      const isCommercialJob =
        Boolean(job.is_commercial) ||
        (job.notes || '').toLowerCase().includes('[vip') ||
        (job.signature?.name || '').toLowerCase().includes('net-30') ||
        (job.payment_type === 'net_30');

      let extractedCompany = '';
      if (job.notes && job.notes.includes('[VIP CONTRACTOR:')) {
        const match = job.notes.match(/\[VIP CONTRACTOR:\s*([^\]]+)\]/i);
        if (match?.[1]) extractedCompany = match[1].trim();
      }

      if (!profile) {
        profile = {
          id: key,
          name: job.customer_name || 'Customer',
          company_name: extractedCompany || (isCommercialJob ? job.customer_name : ''),
          phone: job.customer_phone || '',
          email: job.customer_email || '',
          primary_address: job.delivery_address || '',
          zip: job.zip || '',
          all_addresses: job.delivery_address ? [job.delivery_address] : [],
          is_commercial: isCommercialJob,
          total_spend_cents: 0,
          total_orders: 0,
          active_jobs: [],
          completed_jobs: [],
          all_jobs: [],
          last_order_date: job.delivery_date,
          first_order_date: job.delivery_date,
          notes: job.notes || '',
        };
        map.set(key, profile);
      }

      // Update addresses
      if (job.delivery_address && !profile.all_addresses.includes(job.delivery_address)) {
        profile.all_addresses.push(job.delivery_address);
      }

      // Update commercial status
      if (isCommercialJob) {
        profile.is_commercial = true;
        if (extractedCompany && !profile.company_name) {
          profile.company_name = extractedCompany;
        }
      }

      // Track financial totals
      if (job.status !== 'cancelled') {
        profile.total_spend_cents += job.price_cents || 0;
      }
      profile.total_orders += 1;
      profile.all_jobs.push(job);

      if (['dispatched', 'delivered', 'booked'].includes(job.status)) {
        profile.active_jobs.push(job);
      } else {
        profile.completed_jobs.push(job);
      }

      // Update date bounds
      if (job.delivery_date > profile.last_order_date) {
        profile.last_order_date = job.delivery_date;
        profile.primary_address = job.delivery_address;
        profile.zip = job.zip;
      }
      if (job.delivery_date < profile.first_order_date) {
        profile.first_order_date = job.delivery_date;
      }
    }

    // Merge in manual custom trade accounts
    for (const c of customTradeAccounts) {
      const normalizedPhone = normalizePhone(c.phone || '');
      const key = normalizedPhone || c.company_name.toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          id: key,
          name: c.contact_name || c.company_name,
          company_name: c.company_name,
          phone: c.phone,
          email: c.email,
          primary_address: c.address,
          zip: c.zip,
          all_addresses: c.address ? [c.address] : [],
          is_commercial: c.is_commercial,
          total_spend_cents: 0,
          total_orders: 0,
          active_jobs: [],
          completed_jobs: [],
          all_jobs: [],
          last_order_date: c.created_at ? c.created_at.split('T')[0] : 'New',
          first_order_date: c.created_at ? c.created_at.split('T')[0] : 'New',
          notes: c.notes,
        });
      }
    }

    // Sort jobs inside each profile newest first
    for (const p of map.values()) {
      p.all_jobs.sort((a, b) => b.delivery_date.localeCompare(a.delivery_date));
    }

    return Array.from(map.values());
  }, [data.jobs, customTradeAccounts]);

  // Overall KPI statistics
  const stats = useMemo(() => {
    const totalClients = customers.length;
    const commercialAccounts = customers.filter((c) => c.is_commercial).length;
    const activeCansOnSite = customers.reduce((sum, c) => sum + c.active_jobs.length, 0);
    const totalRevenueCents = customers.reduce((sum, c) => sum + c.total_spend_cents, 0);
    return {
      totalClients,
      commercialAccounts,
      activeCansOnSite,
      totalRevenueCents,
    };
  }, [customers]);

  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return customers
      .filter((c) => {
        // Tab filter
        if (filterType === 'commercial' && !c.is_commercial) return false;
        if (filterType === 'residential' && c.is_commercial) return false;
        if (filterType === 'active' && c.active_jobs.length === 0) return false;

        // Search query
        if (!q) return true;
        return (
          c.name.toLowerCase().includes(q) ||
          c.company_name.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.primary_address.toLowerCase().includes(q) ||
          c.all_addresses.some((a) => a.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (sortBy === 'recent') return b.last_order_date.localeCompare(a.last_order_date);
        if (sortBy === 'spend') return b.total_spend_cents - a.total_spend_cents;
        if (sortBy === 'orders') return b.total_orders - a.total_orders;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [customers, search, filterType, sortBy]);

  const copyContractorLink = async (profile: CustomerProfile) => {
    const account = profile.company_name || profile.name;
    const url = `${origin}/contractor/${data.organization.slug}?account=${encodeURIComponent(account)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLinkFor(profile.id);
      notify(`Copied VIP portal link for ${account}`);
      setTimeout(() => setCopiedLinkFor(null), 3000);
    } catch {
      notify('Failed to copy. Please copy manually.', true);
    }
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() && !newContact.trim()) {
      notify('Please enter a company name or contact person.', true);
      return;
    }

    const newProfile = {
      id: `manual_${Date.now()}`,
      company_name: newCompany.trim() || newContact.trim(),
      contact_name: newContact.trim() || newCompany.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim(),
      address: newAddress.trim(),
      zip: newZip.trim(),
      is_commercial: newIsCommercial,
      notes: newNotes.trim(),
      created_at: new Date().toISOString(),
    };

    const updated = [newProfile, ...customTradeAccounts];
    setCustomTradeAccounts(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`rollos_trade_accounts_${data.organization.slug}`, JSON.stringify(updated));
      } catch {}
    }

    notify(`Added ${newProfile.company_name} to your client directory.`);
    setAddCustomerModalOpen(false);
    // Reset form
    setNewCompany('');
    setNewContact('');
    setNewPhone('');
    setNewEmail('');
    setNewAddress('');
    setNewNotes('');
  };

  const exportCsv = () => {
    const headers = [
      'Customer Name',
      'Company / Trade Name',
      'Account Type',
      'Phone Number',
      'Email Address',
      'Primary Delivery Address',
      'ZIP',
      'Total Orders',
      'Total Spend ($)',
      'Active Dumpsters On Site',
      'Last Order Date',
    ];

    const rows = customers.map((c) => [
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.company_name.replace(/"/g, '""')}"`,
      c.is_commercial ? 'Commercial Net-30' : 'Residential Homeowner',
      `"${c.phone}"`,
      `"${c.email}"`,
      `"${c.primary_address.replace(/"/g, '""')}"`,
      `"${c.zip}"`,
      c.total_orders,
      (c.total_spend_cents / 100).toFixed(2),
      c.active_jobs.length,
      c.last_order_date,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `customers-${data.organization.slug}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify('Customer list exported to CSV.');
  };

  return (
    <>
      {/* Top Metric Cards */}
      <div className="stats">
        <div className="stat">
          <div className="stat-label">
            Total Clients
            <span className="stat-icon">
              <Users size={15} />
            </span>
          </div>
          <div className="stat-number">{stats.totalClients}</div>
          <div className="stat-foot">Homeowners &amp; trade accounts</div>
        </div>

        <div className="stat">
          <div className="stat-label">
            Commercial Trade Accounts
            <span className="stat-icon" style={{ background: '#ecfdf5', color: '#166534' }}>
              <ShieldCheck size={15} />
            </span>
          </div>
          <div className="stat-number">{stats.commercialAccounts}</div>
          <div className="stat-foot">Net-30 &amp; volume contractors</div>
        </div>

        <div className="stat">
          <div className="stat-label">
            Active Cans on Site
            <span className="stat-icon" style={{ background: '#fef3c7', color: '#92400e' }}>
              <Package size={15} />
            </span>
          </div>
          <div className="stat-number">{stats.activeCansOnSite}</div>
          <div className="stat-foot">Containers deployed right now</div>
        </div>

        <div className="stat">
          <div className="stat-label">
            Total Customer Lifetime Spend
            <span className="stat-icon" style={{ background: '#f0fdf4', color: '#15803d' }}>
              <DollarSign size={15} />
            </span>
          </div>
          <div className="stat-number">{money(stats.totalRevenueCents)}</div>
          <div className="stat-foot">Gross bookings across all clients</div>
        </div>
      </div>

      {/* Main Customers Panel */}
      <section className="panel" style={{ marginTop: 20 }}>
        {/* Panel Toolbar */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Search Box */}
          <div style={{ flex: '1 1 280px', position: 'relative' }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b',
              }}
            />
            <input
              type="text"
              placeholder="Search clients by name, company, phone, email, or jobsite..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 34px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                background: '#ffffff',
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: 12.5,
                background: '#ffffff',
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              <option value="recent">Sort: Most Recent Order</option>
              <option value="spend">Sort: Highest Spend ($)</option>
              <option value="orders">Sort: Most Dumpsters Rented</option>
              <option value="name">Sort: Name (A-Z)</option>
            </select>

            <Button onClick={exportCsv} style={{ fontSize: 12.5, padding: '8px 12px' }}>
              <Download size={13} />
              Export CSV
            </Button>

            <Button
              variant="primary"
              onClick={() => setAddCustomerModalOpen(true)}
              style={{
                background: '#166534',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: 12.5,
                padding: '8px 14px',
              }}
            >
              <Plus size={14} />+ Add Client / Trade Account
            </Button>
          </div>
        </div>

        {/* Filter Pills Bar */}
        <div
          style={{
            padding: '10px 20px',
            background: '#f8fafc',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
          }}
        >
          {[
            { id: 'all', label: `All Clients (${customers.length})` },
            {
              id: 'commercial',
              label: `🏢 Commercial Accounts (${customers.filter((c) => c.is_commercial).length})`,
            },
            {
              id: 'residential',
              label: `🏡 Homeowners (${customers.filter((c) => !c.is_commercial).length})`,
            },
            {
              id: 'active',
              label: `🟢 Active on Jobsite (${customers.filter((c) => c.active_jobs.length > 0).length})`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              style={{
                padding: '5px 12px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: filterType === tab.id ? 700 : 500,
                border: '1px solid',
                borderColor: filterType === tab.id ? '#166534' : '#e2e8f0',
                background: filterType === tab.id ? '#166534' : '#ffffff',
                color: filterType === tab.id ? '#ffffff' : '#475569',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Customers List */}
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filteredCustomers.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '50px 20px',
                color: '#64748b',
              }}
            >
              <Users size={36} style={{ margin: '0 auto 12px', color: '#94a3b8' }} />
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b', marginBottom: 4 }}>
                No clients found
              </h3>
              <p style={{ fontSize: 13, maxWidth: 420, margin: '0 auto 16px' }}>
                {search
                  ? `No clients matched "${search}". Try searching by phone, company, or jobsite address.`
                  : 'Your customer roster updates automatically when bookings and orders are placed.'}
              </p>
              <Button
                variant="primary"
                onClick={() => setAddCustomerModalOpen(true)}
                style={{ background: '#166534', color: '#fff' }}
              >
                <Plus size={14} />+ Add First Trade Account
              </Button>
            </div>
          ) : (
            filteredCustomers.map((customer) => {
              const isExpanded = expandedCustomerId === customer.id;
              const hasActiveCans = customer.active_jobs.length > 0;
              const portalLink = `${origin}/contractor/${data.organization.slug}?account=${encodeURIComponent(
                customer.company_name || customer.name,
              )}`;

              return (
                <div
                  key={customer.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--line)',
                    borderRadius: 10,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Card Header & Primary Info */}
                  <div
                    style={{
                      padding: '16px 18px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 14,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: hasActiveCans ? '#fafffc' : '#ffffff',
                    }}
                  >
                    {/* Left: Avatar & Identity */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 260 }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 9,
                          background: customer.is_commercial ? '#dcfce7' : '#f1f5f9',
                          color: customer.is_commercial ? '#166534' : '#475569',
                          display: 'grid',
                          placeItems: 'center',
                          fontWeight: 700,
                          fontSize: 14,
                          border: `1px solid ${customer.is_commercial ? '#bbf7d0' : '#e2e8f0'}`,
                          flexShrink: 0,
                        }}
                      >
                        {customer.is_commercial ? (
                          <Building2 size={20} />
                        ) : (
                          initials(customer.name)
                        )}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <h4 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#0f172a' }}>
                            {customer.name}
                          </h4>
                          {customer.company_name && customer.company_name !== customer.name && (
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: '#166534',
                                background: '#ecfdf5',
                                padding: '2px 8px',
                                borderRadius: 4,
                                border: '1px solid #bbf7d0',
                              }}
                            >
                              {customer.company_name}
                            </span>
                          )}

                          {customer.is_commercial ? (
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: '#166534',
                                background: '#f0fdf4',
                                border: '1px solid #86efac',
                                padding: '2px 6px',
                                borderRadius: 12,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 3,
                              }}
                            >
                              <ShieldCheck size={11} /> Commercial Net-30
                            </span>
                          ) : (
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 500,
                                color: '#64748b',
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                padding: '2px 6px',
                                borderRadius: 12,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 3,
                              }}
                            >
                              <Home size={11} /> Residential
                            </span>
                          )}

                          {hasActiveCans && (
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: '#065f46',
                                background: '#a7f3d0',
                                padding: '2px 7px',
                                borderRadius: 12,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                              }}
                            >
                              <span
                                style={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: '50%',
                                  background: '#059669',
                                  display: 'inline-block',
                                }}
                              />
                              {customer.active_jobs.length} Can{customer.active_jobs.length > 1 ? 's' : ''} on Site
                            </span>
                          )}
                        </div>

                        {/* Contact details */}
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 12,
                            marginTop: 6,
                            fontSize: 12.5,
                            color: '#475569',
                          }}
                        >
                          {customer.phone && (
                            <a
                              href={`tel:${customer.phone}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                color: '#0f172a',
                                fontWeight: 500,
                              }}
                            >
                              <Phone size={12} style={{ color: '#166534' }} />
                              {customer.phone}
                            </a>
                          )}
                          {customer.email && (
                            <a
                              href={`mailto:${customer.email}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                color: '#0f172a',
                                fontWeight: 500,
                              }}
                            >
                              <Mail size={12} style={{ color: '#166534' }} />
                              {customer.email}
                            </a>
                          )}
                          {customer.primary_address && (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                color: '#64748b',
                              }}
                            >
                              <MapPin size={12} />
                              {customer.primary_address} {customer.zip ? `(${customer.zip})` : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Middle: Key Metrics */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 18,
                        flexWrap: 'wrap',
                        borderLeft: '1px solid #f1f5f9',
                        paddingLeft: 16,
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Total Rentals</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                          {customer.total_orders} dumpster{customer.total_orders === 1 ? '' : 's'}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Total Spend</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#166534' }}>
                          {money(customer.total_spend_cents)}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Last Active</div>
                        <div style={{ fontSize: 12.5, fontWeight: 500, color: '#334155' }}>
                          {customer.last_order_date ? dateLabel(customer.last_order_date) : 'N/A'}
                        </div>
                      </div>
                    </div>

                    {/* Right: Quick Action Buttons */}
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <Button
                        variant="primary"
                        onClick={() =>
                          onQuickOrderWithCustomer({
                            name: customer.name,
                            phone: customer.phone,
                            email: customer.email,
                            address: customer.primary_address,
                            zip: customer.zip || '78704',
                            isCommercial: customer.is_commercial,
                            notes: customer.notes,
                          })
                        }
                        style={{
                          background: '#166534',
                          color: '#ffffff',
                          fontSize: 12,
                          padding: '7px 11px',
                          fontWeight: 600,
                        }}
                      >
                        <Plus size={13} />+ Phone Order
                      </Button>

                      {customer.all_jobs.length > 0 && (
                        <Button
                          onClick={() =>
                            setExpandedCustomerId(isExpanded ? null : customer.id)
                          }
                          style={{
                            fontSize: 12,
                            padding: '7px 11px',
                            background: isExpanded ? '#f1f5f9' : '#ffffff',
                          }}
                        >
                          <Clock size={13} />
                          History ({customer.all_jobs.length})
                          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Commercial VIP Portal Access Strip (For Commercial Accounts or Repeat Volume Clients) */}
                  {customer.is_commercial && (
                    <div
                      style={{
                        padding: '10px 18px',
                        background: '#f0fdf4',
                        borderTop: '1px solid #dcfce7',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 10,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: 12,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#166534' }}>
                        <ShieldCheck size={14} />
                        <span>
                          <strong>1-Tap VIP Swap Portal:</strong> Drops &amp; swaps bill directly to{' '}
                          <strong>{customer.company_name || customer.name}</strong> Net-30 statement.
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                        <a
                          href={`sms:${customer.phone}?body=${encodeURIComponent(
                            `Hi from ${data.organization.name}! Here is your direct VIP jobsite portal to request 1-tap swaps or schedule final haul-offs on your active dumpsters: ${portalLink}`,
                          )}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            background: '#ffffff',
                            color: '#166534',
                            border: '1px solid #bbf7d0',
                            padding: '4px 10px',
                            borderRadius: 6,
                            fontWeight: 600,
                            textDecoration: 'none',
                          }}
                        >
                          <MessageSquare size={12} />
                          Text VIP Link
                        </a>

                        <button
                          onClick={() => copyContractorLink(customer)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            background: '#ffffff',
                            color: '#166534',
                            border: '1px solid #bbf7d0',
                            padding: '4px 10px',
                            borderRadius: 6,
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {copiedLinkFor === customer.id ? (
                            <>
                              <Check size={12} style={{ color: '#16a34a' }} /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy size={12} /> Copy Link
                            </>
                          )}
                        </button>

                        <a
                          href={portalLink}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            color: '#166534',
                            fontWeight: 600,
                            textDecoration: 'underline',
                          }}
                        >
                          Preview Portal <ExternalLink size={11} />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Expandable Order History Table */}
                  {isExpanded && (
                    <div
                      style={{
                        padding: '14px 18px',
                        background: '#f8fafc',
                        borderTop: '1px solid #e2e8f0',
                      }}
                    >
                      <h5
                        style={{
                          fontSize: 12.5,
                          fontWeight: 700,
                          color: '#334155',
                          marginBottom: 10,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <Clock size={13} /> Rental History for {customer.name} ({customer.all_jobs.length} Orders)
                      </h5>

                      <div className="table-wrap" style={{ background: '#ffffff', borderRadius: 8 }}>
                        <table>
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Size</th>
                              <th>Address</th>
                              <th>Status</th>
                              <th>Price</th>
                              <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {customer.all_jobs.map((job) => (
                              <tr key={job.id}>
                                <td>
                                  <strong>{dateLabel(job.delivery_date)}</strong>
                                  <div style={{ fontSize: 11, color: '#64748b' }}>
                                    Pickup: {dateLabel(job.pickup_date)}
                                  </div>
                                </td>
                                <td>
                                  <span className={`size-tag s${job.size_yards}`}>
                                    {job.size_yards} yd
                                  </span>
                                </td>
                                <td>
                                  <div style={{ fontSize: 12.5, fontWeight: 500, color: '#1e293b' }}>
                                    {job.delivery_address}
                                  </div>
                                  {job.notes && (
                                    <div style={{ fontSize: 11, color: '#64748b' }}>{job.notes}</div>
                                  )}
                                </td>
                                <td>
                                  <span
                                    style={{
                                      fontSize: 11,
                                      fontWeight: 600,
                                      padding: '2px 8px',
                                      borderRadius: 12,
                                      background:
                                        job.status === 'delivered'
                                          ? '#dcfce7'
                                          : job.status === 'dispatched'
                                          ? '#fef3c7'
                                          : job.status === 'completed'
                                          ? '#f1f5f9'
                                          : '#f8fafc',
                                      color:
                                        job.status === 'delivered'
                                          ? '#166534'
                                          : job.status === 'dispatched'
                                          ? '#92400e'
                                          : job.status === 'completed'
                                          ? '#475569'
                                          : '#64748b',
                                      textTransform: 'capitalize',
                                    }}
                                  >
                                    {job.status.replace('_', ' ')}
                                  </span>
                                </td>
                                <td>
                                  <strong>{money(job.price_cents)}</strong>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                  <Button
                                    onClick={() => openJob(job.id)}
                                    style={{ fontSize: 11, padding: '4px 8px' }}
                                  >
                                    View Job <ArrowUpRight size={11} />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Add Client / Commercial Trade Account Modal */}
      <Modal
        open={addCustomerModalOpen}
        onOpenChange={setAddCustomerModalOpen}
        title="Add Client or Commercial Trade Account"
      >
        <form onSubmit={handleSaveCustomer} className="form-stack">
          <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 14px' }}>
            Register a commercial contractor or homeowner. Commercial accounts unlock 1-tap bin swaps and monthly Net-30 statements.
          </p>

          <label className="field">
            Account / Company Name
            <input
              type="text"
              placeholder="e.g. Miller Roofing or Apex Builders"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              required
            />
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label className="field">
              Contact Person / Lead Foreman
              <input
                type="text"
                placeholder="e.g. John Miller"
                value={newContact}
                onChange={(e) => setNewContact(e.target.value)}
              />
            </label>

            <label className="field">
              Phone Number
              <input
                type="tel"
                placeholder="(512) 555-0199"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                required
              />
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 12 }}>
            <label className="field">
              Email Address (for Invoices / Net-30)
              <input
                type="email"
                placeholder="ap@contractor.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </label>

            <label className="field">
              Account Type
              <select
                value={newIsCommercial ? 'commercial' : 'residential'}
                onChange={(e) => setNewIsCommercial(e.target.value === 'commercial')}
              >
                <option value="commercial">Commercial Net-30 Trade Account</option>
                <option value="residential">Residential Homeowner</option>
              </select>
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <label className="field">
              Default Jobsite / Yard Address
              <input
                type="text"
                placeholder="104 Industrial Pkwy"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              />
            </label>

            <label className="field">
              ZIP Code
              <input
                type="text"
                placeholder="78704"
                value={newZip}
                onChange={(e) => setNewZip(e.target.value)}
              />
            </label>
          </div>

          <label className="field">
            Special Instructions / Gate Codes / Notes
            <textarea
              placeholder="e.g. Gate code #4412. Always place protective wood boards under dumpster rollers."
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              rows={2}
            />
          </label>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 14 }}>
            <Button type="button" onClick={() => setAddCustomerModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              style={{ background: '#166534', color: '#fff', fontWeight: 600 }}
            >
              <Check size={14} /> Save to Customer Directory
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
