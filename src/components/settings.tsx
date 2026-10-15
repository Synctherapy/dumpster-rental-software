'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  ExternalLink,
  FileCheck,
  FileText,
  Filter,
  Globe,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  PhoneCall,
  PhoneForwarded,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trash2,
  Truck,
  UserRound,
} from 'lucide-react';
import { Button } from './ui/button';
import { api } from '@/lib/client';
import type { Workspace, PricingRule, Notification } from '@/lib/types';
import { METRO_CITIES, findCityData, generateCleanSlug, resolveCityZips } from '@/lib/city-zips';

function formatPhone(phone?: string | null): string {
  if (!phone) return '(512) 842-9102';
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 10) {
    return `(${clean.slice(0, 3)}) ${clean.slice(3, 6)}-${clean.slice(6)}`;
  }
  if (clean.length === 11 && clean.startsWith('1')) {
    return `(${clean.slice(1, 4)}) ${clean.slice(4, 7)}-${clean.slice(7)}`;
  }
  return phone;
}

function formatTimestamp(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

function formatRelativeTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    const diffMs = Date.now() - d.getTime();
    if (diffMs < 0) return 'Just now';
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

function getTemplateInfo(template: string): { label: string; bg: string; color: string; border: string } {
  const norm = template.toLowerCase();
  if (norm.includes('booking')) {
    return { label: 'Booking Confirmation', bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' };
  }
  if (norm.includes('driver') || norm.includes('route')) {
    return { label: 'Driver Route', bg: '#f0f9ff', color: '#0369a1', border: '#bae6fd' };
  }
  if (norm.includes('inbound') || norm.includes('reply') || norm.includes('customer_note')) {
    return { label: 'Inbound Customer Note', bg: '#faf5ff', color: '#7e22ce', border: '#e9d5ff' };
  }
  if (norm.includes('waiver') || norm.includes('agreement') || norm.includes('sign')) {
    return { label: 'Waiver Signed', bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' };
  }
  if (norm.includes('reminder')) {
    return { label: 'Delivery Reminder', bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' };
  }
  if (norm.includes('review')) {
    return { label: 'Google Review Request', bg: '#fefce8', color: '#a16207', border: '#fef08a' };
  }
  const pretty = template
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return { label: pretty, bg: '#f8fafc', color: '#475569', border: '#e2e8f0' };
}

function getStatusBadge(status: string): { label: string; bg: string; color: string; border: string } {
  const s = status.toLowerCase();
  if (s === 'delivered' || s === 'demo') {
    return { label: 'Delivered', bg: '#dcfce7', color: '#15803d', border: '#86efac' };
  }
  if (s === 'sent') {
    return { label: 'Sent', bg: '#e0f2fe', color: '#0369a1', border: '#7dd3fc' };
  }
  if (s === 'processing' || s === 'queued' || s === 'sending') {
    return { label: 'Processing', bg: '#fef3c7', color: '#b45309', border: '#fde68a' };
  }
  if (s === 'received' || s === 'inbound') {
    return { label: 'Received', bg: '#f3e8ff', color: '#7e22ce', border: '#d8b4fe' };
  }
  if (s === 'failed' || s === 'undelivered') {
    return { label: 'Failed', bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5' };
  }
  return {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    bg: '#f1f5f9',
    color: '#475569',
    border: '#cbd5e1',
  };
}

function DedicatedLineCard({
  phone,
  forwardCell,
  onCopy,
  onViewLedger,
  variant = 'sidebar',
}: {
  phone?: string | null;
  forwardCell?: string | null;
  onCopy: () => void;
  onViewLedger?: () => void;
  variant?: 'hero' | 'sidebar';
}) {
  const formattedNumber = formatPhone(phone);
  const formattedCell = formatPhone(forwardCell);

  if (variant === 'hero') {
    return (
      <section
        className="panel"
        style={{
          border: '1px solid #86efac',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 55%, #f8fafc 100%)',
          boxShadow: '0 2px 8px -2px rgba(22, 101, 52, 0.08)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #dcfce7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '10px',
                background: '#dcfce7',
                border: '1px solid #bbf7d0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#166534',
              }}
            >
              <PhoneCall size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
                  Dedicated Dispatch &amp; SMS Line
                </h3>
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                Official local two-way phone number for automated customer texts, driver dispatches, and incoming calls.
              </p>
            </div>
          </div>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '20px',
              background: '#dcfce7',
              color: '#166534',
              fontSize: '12.5px',
              fontWeight: 700,
              border: '1px solid #86efac',
              boxShadow: '0 1px 2px rgba(22, 101, 52, 0.08)',
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#16a34a',
                boxShadow: '0 0 0 3px #bbf7d0',
              }}
            />
            Active · Inbound texts &amp; calls forward to your cell
          </span>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {/* Phone Number Display Box */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '11px',
                    color: '#64748b',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'block',
                  }}
                >
                  Dedicated Local Number
                </span>
                <div
                  style={{
                    fontSize: '26px',
                    fontWeight: 800,
                    color: '#0f172a',
                    letterSpacing: '-0.02em',
                    marginTop: '2px',
                  }}
                >
                  {formattedNumber}
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={onCopy}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                }}
              >
                <Copy size={13} />
                Copy Number
              </Button>
            </div>

            {/* Forwarding Status Box */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '8px',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#16a34a',
                  flexShrink: 0,
                }}
              >
                <PhoneForwarded size={18} />
              </div>
              <div>
                <span
                  style={{
                    fontSize: '11px',
                    color: '#64748b',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'block',
                  }}
                >
                  Call &amp; SMS Forwarding
                </span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                  {formattedCell || 'Cell Phone Configured'}
                </span>
                <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: '#16a34a', fontWeight: 600 }}>
                  Immediate cell forward active
                </p>
              </div>
            </div>
          </div>

          {/* Explanation paragraph */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '14px 18px',
            }}
          >
            <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>
              All customer booking confirmations, driver magic links, and waiver alerts are sent from this dedicated local line. Inbound customer replies and phone calls forward directly to your cell phone.
            </p>
          </div>

          {/* 45-day inactivity rule badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              borderRadius: '8px',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#1e40af',
              fontSize: '13px',
              lineHeight: 1.5,
            }}
          >
            <ShieldCheck size={18} style={{ color: '#2563eb', flexShrink: 0 }} />
            <span>
              <strong>Active Line Protection · Automatically stays active with at least 1 booking every 45 days.</strong>
            </span>
          </div>
        </div>
      </section>
    );
  }

  // Sidebar variant
  return (
    <section
      className="panel"
      style={{
        border: '1px solid #86efac',
        background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
        borderRadius: '10px',
        overflow: 'hidden',
      }}
    >
      <div
        className="panel-heading"
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid #dcfce7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PhoneCall size={16} style={{ color: '#166534' }} />
          <h3 style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
            Dedicated Dispatch &amp; SMS Line
          </h3>
        </div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11px',
            padding: '3px 8px',
            borderRadius: '12px',
            background: '#dcfce7',
            color: '#166534',
            fontWeight: 700,
            border: '1px solid #86efac',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#16a34a',
            }}
          />
          Active
        </span>
      </div>

      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Active Local Number Display */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '10px 14px',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '10.5px',
                color: '#64748b',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                display: 'block',
              }}
            >
              Active Local Line
            </span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              {formattedNumber}
            </span>
          </div>
          <button
            type="button"
            onClick={onCopy}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 10px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              fontSize: '11.5px',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
            }}
          >
            <Copy size={12} />
            Copy
          </button>
        </div>

        {/* Green badge: "Active · Inbound texts & calls forward to your cell" */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#dcfce7',
            border: '1px solid #86efac',
            color: '#166534',
            padding: '6px 10px',
            borderRadius: '6px',
            fontSize: '11.5px',
            fontWeight: 600,
            lineHeight: 1.4,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#16a34a',
              flexShrink: 0,
            }}
          />
          <span>Active · Inbound texts &amp; calls forward to your cell</span>
        </div>

        {/* Explanation: "All customer booking confirmations, driver magic links, and waiver alerts are sent from this dedicated local line. Inbound customer replies and phone calls forward directly to your cell phone." */}
        <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.55 }}>
          All customer booking confirmations, driver magic links, and waiver alerts are sent from this dedicated local line. Inbound customer replies and phone calls forward directly to your cell phone.
        </p>

        {/* 45-day inactivity rule badge: "Active Line Protection · Automatically stays active with at least 1 booking every 45 days." */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '7px',
            padding: '8px 10px',
            borderRadius: '6px',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#1e40af',
            fontSize: '11.5px',
            lineHeight: 1.45,
          }}
        >
          <ShieldCheck size={14} style={{ color: '#2563eb', flexShrink: 0, marginTop: '2px' }} />
          <span>
            <strong>Active Line Protection · Automatically stays active with at least 1 booking every 45 days.</strong>
          </span>
        </div>

        {onViewLedger && (
          <Button
            type="button"
            variant="default"
            style={{
              width: '100%',
              fontSize: '12px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              color: '#0f172a',
              fontWeight: 600,
            }}
            onClick={onViewLedger}
          >
            <MessageSquare size={13} />
            View SMS Activity Ledger
            <ArrowRight size={12} />
          </Button>
        )}
      </div>
    </section>
  );
}

function NotificationActivityLedger({
  notifications = [],
  search,
  onSearchChange,
  channelFilter,
  onChannelFilterChange,
  statusFilter,
  onStatusFilterChange,
  notify,
}: {
  notifications?: Notification[];
  search: string;
  onSearchChange: (val: string) => void;
  channelFilter: 'all' | 'sms' | 'email';
  onChannelFilterChange: (val: 'all' | 'sms' | 'email') => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  notify: (msg: string, err?: boolean) => void;
}) {
  const filtered = notifications.filter((n) => {
    if (channelFilter !== 'all' && n.channel !== channelFilter) return false;
    if (statusFilter !== 'all') {
      const s = n.status.toLowerCase();
      if (statusFilter === 'delivered' && s !== 'delivered' && s !== 'demo') return false;
      if (statusFilter === 'sent' && s !== 'sent') return false;
      if (statusFilter === 'processing' && !['processing', 'queued', 'sending'].includes(s)) return false;
      if (statusFilter === 'received' && !['received', 'inbound'].includes(s)) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const tmpl = getTemplateInfo(n.template);
      const matchesTo = n.to?.toLowerCase().includes(q);
      const matchesTmpl = n.template?.toLowerCase().includes(q) || tmpl.label.toLowerCase().includes(q);
      const matchesStatus = n.status?.toLowerCase().includes(q);
      return matchesTo || matchesTmpl || matchesStatus;
    }
    return true;
  });

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime(),
  );

  const smsCount = notifications.filter((n) => n.channel === 'sms').length;
  const emailCount = notifications.filter((n) => n.channel === 'email').length;

  return (
    <section
      className="panel"
      style={{
        background: '#ffffff',
        border: '1px solid var(--border, #e2e8f0)',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}
    >
      <div
        className="panel-heading"
        style={{
          padding: '18px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} style={{ color: '#166534' }} />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
              SMS &amp; Notification Activity Ledger
            </h3>
            <span
              style={{
                fontSize: '11px',
                background: '#f1f5f9',
                color: '#475569',
                padding: '2px 8px',
                borderRadius: '12px',
                fontWeight: 700,
              }}
            >
              {sorted.length} shown
            </span>
          </div>
          <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: '#64748b' }}>
            Live record of automated customer texts, driver dispatch route links, and digital waiver signatures.
          </p>
        </div>

        {/* Quick summary metrics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '11.5px',
              padding: '4px 10px',
              background: '#f0fdf4',
              color: '#166534',
              border: '1px solid #bbf7d0',
              borderRadius: '6px',
              fontWeight: 600,
            }}
          >
            {smsCount} SMS sent
          </span>
          {emailCount > 0 && (
            <span
              style={{
                fontSize: '11.5px',
                padding: '4px 10px',
                background: '#eff6ff',
                color: '#1d4ed8',
                border: '1px solid #bfdbfe',
                borderRadius: '6px',
                fontWeight: 600,
              }}
            >
              {emailCount} Email
            </span>
          )}
          <span
            style={{
              fontSize: '11.5px',
              padding: '4px 10px',
              background: '#faf5ff',
              color: '#7e22ce',
              border: '1px solid #e9d5ff',
              borderRadius: '6px',
              fontWeight: 600,
            }}
          >
            100% Deliverability
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          padding: '14px 24px',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by phone number, template, or status..."
            style={{
              width: '100%',
              paddingLeft: '32px',
              height: '34px',
              fontSize: '12.5px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Channel Filters */}
          <div style={{ display: 'flex', background: '#e2e8f0', borderRadius: '6px', padding: '2px' }}>
            {(['all', 'sms', 'email'] as const).map((ch) => (
              <button
                key={ch}
                type="button"
                onClick={() => onChannelFilterChange(ch)}
                style={{
                  padding: '4px 10px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  background: channelFilter === ch ? '#ffffff' : 'transparent',
                  color: channelFilter === ch ? '#0f172a' : '#64748b',
                  boxShadow: channelFilter === ch ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  textTransform: 'uppercase',
                }}
              >
                {ch === 'all' ? 'All Channels' : ch}
              </button>
            ))}
          </div>

          {/* Status Filters */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {[
              { id: 'all', label: 'All Statuses' },
              { id: 'delivered', label: 'Delivered' },
              { id: 'sent', label: 'Sent' },
              { id: 'processing', label: 'Processing' },
              { id: 'received', label: 'Received' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => onStatusFilterChange(st.id)}
                style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  borderRadius: '4px',
                  border: statusFilter === st.id ? '1px solid #166534' : '1px solid #cbd5e1',
                  background: statusFilter === st.id ? '#dcfce7' : '#ffffff',
                  color: statusFilter === st.id ? '#166534' : '#475569',
                  cursor: 'pointer',
                }}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table of recent texts */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <th style={{ padding: '10px 20px', fontWeight: 700 }}>Timestamp / Date</th>
              <th style={{ padding: '10px 16px', fontWeight: 700 }}>Recipient / Phone Number</th>
              <th style={{ padding: '10px 16px', fontWeight: 700 }}>Template / Type</th>
              <th style={{ padding: '10px 16px', fontWeight: 700 }}>Channel</th>
              <th style={{ padding: '10px 20px', fontWeight: 700, textAlign: 'right' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length > 0 ? (
              sorted.map((item) => {
                const tmpl = getTemplateInfo(item.template);
                const stBadge = getStatusBadge(item.status);
                const isPhone = !item.to.includes('@');
                return (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      transition: 'background 0.1s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#fbfcfd')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Timestamp / Date */}
                    <td style={{ padding: '12px 20px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>
                        {formatTimestamp(item.sent_at)}
                      </div>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                        {formatRelativeTime(item.sent_at)}
                      </span>
                    </td>

                    {/* Recipient / Phone Number */}
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>
                          {isPhone ? formatPhone(item.to) : item.to}
                        </span>
                        <button
                          type="button"
                          onClick={async () => {
                            await navigator.clipboard.writeText(item.to);
                            notify(`Copied ${item.to}`);
                          }}
                          title="Copy recipient"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            padding: '2px',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#334155')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                        >
                          <Copy size={11} />
                        </button>
                      </div>
                    </td>

                    {/* Template / Type */}
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '3px 9px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          background: tmpl.bg,
                          color: tmpl.color,
                          border: `1px solid ${tmpl.border}`,
                        }}
                      >
                        {tmpl.label}
                      </span>
                    </td>

                    {/* Channel */}
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 700,
                          background: item.channel === 'sms' ? '#f0fdf4' : '#eff6ff',
                          color: item.channel === 'sms' ? '#166534' : '#1d4ed8',
                          border: item.channel === 'sms' ? '1px solid #bbf7d0' : '1px solid #bfdbfe',
                        }}
                      >
                        {item.channel === 'sms' ? <Smartphone size={11} /> : <Mail size={11} />}
                        {item.channel.toUpperCase()}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '12px 20px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '3px 9px',
                          borderRadius: '12px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          background: stBadge.bg,
                          color: stBadge.color,
                          border: `1px solid ${stBadge.border}`,
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: stBadge.color,
                          }}
                        />
                        {stBadge.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} style={{ padding: '40px 20px', textAlign: 'center' }}>
                  <div style={{ maxWidth: 360, margin: '0 auto', color: '#64748b' }}>
                    <MessageSquare size={32} style={{ color: '#cbd5e1', margin: '0 auto 8px' }} />
                    <strong style={{ display: 'block', fontSize: '13px', color: '#334155', marginBottom: '4px' }}>
                      No notifications match your filter
                    </strong>
                    <span style={{ fontSize: '12px' }}>
                      Try clearing the search query or changing your channel and status filters.
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function Settings({
  data,
  reload,
  notify,
}: {
  data: Workspace;
  reload: () => Promise<void>;
  notify: (message: string, error?: boolean) => void;
}) {
  const [name, setName] = useState(data.organization.name);
  const [slug, setSlug] = useState(data.organization.slug);
  const [phone, setPhone] = useState(data.organization.phone);
  const [currency, setCurrency] = useState(
    data.organization.currency || data.organization.pricing_config?.currency || 'usd',
  );
  const [googleReviewUrl, setGoogleReviewUrl] = useState(
    data.organization.google_review_url || data.organization.pricing_config?.google_review_url || '',
  );
  const [minNoticeHours, setMinNoticeHours] = useState<number>(
    data.organization.min_notice_hours ?? data.organization.pricing_config?.min_notice_hours ?? 24,
  );
  const [prohibitedItems, setProhibitedItems] = useState<string[]>(
    data.organization.prohibited_items ??
      data.organization.pricing_config?.prohibited_items ?? [
        'Tires & automotive batteries',
        'Wet paint, oils & hazardous chemicals',
        'Refrigerators, AC units & Freon appliances',
        'Mattresses & box springs',
        'Asbestos & medical waste',
      ],
  );
  const [newProhibitedItem, setNewProhibitedItem] = useState('');
  const existingSurcharges =
    data.organization.landfill_surcharges ??
    data.organization.pricing_config?.landfill_surcharges ?? {};
  const [tireFee, setTireFee] = useState<number>(
    existingSurcharges.tire_cents !== undefined ? existingSurcharges.tire_cents / 100 : 25,
  );
  const [mattressFee, setMattressFee] = useState<number>(
    existingSurcharges.mattress_cents !== undefined ? existingSurcharges.mattress_cents / 100 : 50,
  );
  const [freonFee, setFreonFee] = useState<number>(
    existingSurcharges.freon_cents !== undefined ? existingSurcharges.freon_cents / 100 : 75,
  );
  const [propaneFee, setPropaneFee] = useState<number>(
    existingSurcharges.propane_cents !== undefined ? existingSurcharges.propane_cents / 100 : 35,
  );
  const [operatingDays, setOperatingDays] = useState<number[]>(
    data.organization.operating_days ??
      data.organization.pricing_config?.operating_days ?? [1, 2, 3, 4, 5, 6], // default Mon-Sat
  );
  const [taxRatePercent, setTaxRatePercent] = useState<number>(
    data.organization.tax_rate_percent ?? data.organization.pricing_config?.tax_rate_percent ?? 0,
  );
  const [rules, setRules] = useState(data.pricing_rules);
  const [showAddSizeModal, setShowAddSizeModal] = useState(false);
  const [newSizeYards, setNewSizeYards] = useState(15);
  const [newBasePrice, setNewBasePrice] = useState(375);
  const [newDays, setNewDays] = useState(7);
  const [newExtraDay, setNewExtraDay] = useState(20);
  const [newTons, setNewTons] = useState(2);
  const [newOverageTon, setNewOverageTon] = useState(85);
  const [zips, setZips] = useState(data.pricing_rules[0]?.service_zips.join(', ') ?? '');
  const [cityQuery, setCityQuery] = useState('');
  const [cityFeedback, setCityFeedback] = useState<string | null>(null);

  const handleCitySelect = async (cityName: string) => {
    setCityQuery(cityName);
    const trimmed = cityName.trim();
    if (!trimmed) {
      setCityFeedback(null);
      return;
    }

    const metro = findCityData(trimmed);
    if (metro) {
      setZips(metro.zips.join(', '));
      setCityFeedback(`✓ Auto-populated ${metro.zips.length} ZIP codes for ${metro.city}, ${metro.state}`);
      notify(`Loaded ${metro.zips.length} ZIP codes for ${metro.city}!`);
      return;
    }

    if (trimmed.length >= 2) {
      setCityFeedback('Searching postal directory...');
      const resolved = await resolveCityZips(trimmed);
      if (resolved && resolved.zips.length) {
        setZips(resolved.zips.join(', '));
        setCityFeedback(`✓ Found ${resolved.zips.length} ZIP codes for ${resolved.city}${resolved.state ? `, ${resolved.state}` : ''}`);
        notify(`Loaded ${resolved.zips.length} ZIP codes for ${resolved.city}!`);
      } else {
        setCityFeedback('Custom service area. Type your delivery ZIPs below.');
      }
    } else {
      setCityFeedback(null);
    }
  };

  const [newZipInput, setNewZipInput] = useState('');
  const [showRawZipText, setShowRawZipText] = useState(false);

  const zipList = zips.split(/[\s,]+/).filter(Boolean);

  const handleRemoveZip = (zipToRemove: string) => {
    const next = zipList.filter((z) => z !== zipToRemove);
    setZips(next.join(', '));
    notify(`Removed ${zipToRemove}`);
  };

  const handleClearAllZips = () => {
    setZips('');
    notify('Cleared all service ZIP codes.');
  };

  const handleAddZip = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = newZipInput.trim().toUpperCase();
    if (!clean) return;
    if (zipList.includes(clean)) {
      notify(`${clean} is already in your service list.`, true);
      return;
    }
    const next = [...zipList, clean];
    setZips(next.join(', '));
    setNewZipInput('');
    notify(`Added ${clean}`);
  };
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [settingsTab, setSettingsTab] = useState<'general' | 'notifications'>('general');
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState<'all' | 'sms' | 'email'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const edit = (size: number, field: keyof PricingRule, value: number) =>
    setRules(rules.map((r) => (r.size_yards === size ? { ...r, [field]: value } : r)));

  const removeSize = (size: number) => {
    if (rules.length <= 1) {
      notify('You must keep at least 1 dumpster size in your pricing rules.', true);
      return;
    }
    setRules(rules.filter((r) => r.size_yards !== size));
    notify(`Removed ${size} yard dumpster.`);
  };

  const addCustomSize = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSizeYards < 1 || newSizeYards > 100) {
      notify('Size must be between 1 and 100 yards.', true);
      return;
    }
    if (rules.some((r) => r.size_yards === newSizeYards)) {
      notify(`A ${newSizeYards} yard dumpster already exists. Remove or edit the existing size.`, true);
      return;
    }
    if (rules.length >= 12) {
      notify('You can configure up to 12 custom dumpster sizes.', true);
      return;
    }
    const newRule: PricingRule = {
      id: `rule-${newSizeYards}`,
      org_id: data.organization.id,
      size_yards: newSizeYards,
      base_price_cents: Math.round(newBasePrice * 100),
      included_days: newDays,
      extra_day_cents: Math.round(newExtraDay * 100),
      included_tons: newTons,
      overage_per_ton_cents: Math.round(newOverageTon * 100),
      service_zips: rules[0]?.service_zips ?? [],
    };
    setRules([...rules, newRule].sort((a, b) => a.size_yards - b.size_yards));
    setShowAddSizeModal(false);
    notify(`Added ${newSizeYards} yard dumpster to pricing.`);
  };
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/api/settings', {
        method: 'POST',
        body: JSON.stringify({
          name,
          slug,
          phone,
          currency,
          deposit_percent: 100,
          customer_fee_enabled: true,
          google_review_url: googleReviewUrl,
          min_notice_hours: minNoticeHours,
          prohibited_items: prohibitedItems,
          operating_days: operatingDays,
          tax_rate_percent: taxRatePercent,
          landfill_surcharges: {
            tire_cents: Math.round(Number(tireFee) * 100),
            mattress_cents: Math.round(Number(mattressFee) * 100),
            freon_cents: Math.round(Number(freonFee) * 100),
            propane_cents: Math.round(Number(propaneFee) * 100),
          },
          pricing_rules: rules.map(
            ({
              size_yards,
              base_price_cents,
              included_days,
              extra_day_cents,
              included_tons,
              overage_per_ton_cents,
            }) => ({
              size_yards,
              base_price_cents,
              included_days,
              extra_day_cents,
              included_tons,
              overage_per_ton_cents,
              service_zips: zips.split(/[\s,]+/).filter(Boolean),
            }),
          ),
        }),
      });
      await reload();
      notify('Business settings and pricing saved.');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const copy = async (embed = false) => {
    try {
      const url = `${window.location.origin}/${embed ? 'embed' : 'book'}/${data.organization.slug}`;
      await navigator.clipboard.writeText(
        embed
          ? `<iframe src="${url}" title="Book a dumpster" width="100%" height="1000" style="border:0;border-radius:12px"></iframe>`
          : url,
      );
      notify(embed ? 'Embed snippet copied.' : 'Booking link copied.');
    } catch {
      notify('Clipboard is unavailable. Copy the link from the box below.', true);
    }
  };
  const copyCalendar = async () => {
    try {
      const token =
        data.organization.calendar_token ||
        (data.organization.pricing_config as { calendar_token?: string })?.calendar_token ||
        '';
      const url = `${window.location.origin}/api/calendar?token=${token}`;
      await navigator.clipboard.writeText(url);
      notify('Calendar feed URL copied to clipboard.');
    } catch {
      notify('Clipboard is unavailable.', true);
    }
  };
  const connect = async () => {
    setBusy(true);
    try {
      const { url } = await api<{ url: string }>('/api/connect', { method: 'POST', body: '{}' });
      window.location.assign(url);
    } catch (e) {
      notify((e as Error).message, true);
      setBusy(false);
    }
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Settings Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          background: '#ffffff',
          padding: '8px 12px',
          borderRadius: '10px',
          border: '1px solid var(--border, #e2e8f0)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={() => setSettingsTab('general')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              border: settingsTab === 'general' ? '1px solid #166534' : '1px solid transparent',
              background: settingsTab === 'general' ? '#166534' : 'transparent',
              color: settingsTab === 'general' ? '#ffffff' : '#64748b',
              transition: 'all 0.15s ease',
            }}
          >
            <Building2 size={15} />
            Business Settings &amp; Pricing
          </button>
          <button
            type="button"
            onClick={() => setSettingsTab('notifications')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              border: settingsTab === 'notifications' ? '1px solid #166534' : '1px solid transparent',
              background: settingsTab === 'notifications' ? '#166534' : 'transparent',
              color: settingsTab === 'notifications' ? '#ffffff' : '#64748b',
              transition: 'all 0.15s ease',
            }}
          >
            <PhoneCall size={15} />
            Dedicated SMS Line &amp; Activity Ledger
            <span
              style={{
                marginLeft: '4px',
                fontSize: '11px',
                padding: '2px 7px',
                borderRadius: '10px',
                fontWeight: 700,
                background: settingsTab === 'notifications' ? 'rgba(255,255,255,0.25)' : '#dcfce7',
                color: settingsTab === 'notifications' ? '#ffffff' : '#166534',
              }}
            >
              {data.notifications_log?.length ?? 0}
            </span>
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '4px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: '#166534',
              background: '#f0fdf4',
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid #bbf7d0',
              fontWeight: 600,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a' }} />
            Line: {formatPhone(data.organization.twilio_phone_number)}
          </span>
        </div>
      </div>

      {settingsTab === 'general' ? (
        <div className="settings-grid">
      <form onSubmit={save}>
        <section className="panel">
          <div className="panel-heading">
            <h3>Your business, your way.</h3>
            <span className="pill">Business settings</span>
          </div>
          <div className="settings-body">
            <div className="form-row">
              <label className="field">
                Business name
                <input
                  required
                  minLength={2}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="field">
                Business phone
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </label>
            </div>
            <div className="form-row">
              <label className="field">
                Booking URL slug
                <input
                  required
                  pattern="[a-z0-9]+(-[a-z0-9]+)*"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                  <small>/book/{slug}</small>
                  <button
                    type="button"
                    onClick={() => {
                      const clean = generateCleanSlug(name || 'dumpster-rentals');
                      setSlug(clean);
                      notify('Slug updated to clean business name.');
                    }}
                    style={{
                      background: '#f1f5f9',
                      border: 'none',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      color: '#0f172a',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Clean business name
                  </button>
                  {cityQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        const clean = generateCleanSlug(name || 'dumpster-rentals', cityQuery);
                        setSlug(clean);
                        notify(`Slug updated to include ${cityQuery.split(',')[0]}.`);
                      }}
                      style={{
                        background: '#e0f2fe',
                        border: 'none',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        color: '#0369a1',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      + Add {cityQuery.split(',')[0]} suffix
                    </button>
                  )}
                </div>
              </label>
              <label className="field">
                Collected at booking
                <input type="number" value={100} readOnly />
                <small>The full base rental is collected. Extra days and tonnage are billed after pickup.</small>
              </label>
            </div>
            <div className="form-row">
              <label className="field">
                Google Business Review Link
                <input
                  type="url"
                  value={googleReviewUrl}
                  onChange={(e) => setGoogleReviewUrl(e.target.value)}
                  placeholder="https://g.page/r/your-business/review"
                />
                <small>
                  Automatically texted to customers upon container pickup to boost your 5-star ratings.
                </small>
              </label>
              <label className="field">
                Minimum Online Booking Advance Notice
                <select
                  value={minNoticeHours}
                  onChange={(e) => setMinNoticeHours(Number(e.target.value))}
                >
                  <option value={12}>12 hours</option>
                  <option value={24}>24 hours (Recommended · 1 business day)</option>
                  <option value={48}>48 hours (2 business days)</option>
                  <option value={72}>72 hours (3 business days)</option>
                </select>
                <small>
                  Prevents customers from booking bins overnight with zero warning. Emergency requests must call.
                </small>
              </label>
              <label className="field">
                Billing Currency
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="usd">USD ($) · United States Dollar</option>
                  <option value="cad">CAD ($) · Canadian Dollar</option>
                </select>
                <small>
                  Sets your customer checkout currency and Stripe Connect payout denomination.
                </small>
              </label>
              <label className="field">
                Sales Tax Rate (%)
                <input
                  type="number"
                  min="0"
                  max="30"
                  step="0.01"
                  value={taxRatePercent}
                  onChange={(e) => setTaxRatePercent(Number(e.target.value))}
                  placeholder="e.g. 8.25"
                />
                <small>
                  Calculated automatically on base rentals and addons. Set 0 if prices include tax.
                </small>
              </label>
            </div>
            <div className="form-row">
              <div className="field">
                <span style={{ fontWeight: 600, fontSize: '13px' }}>Allowed Delivery Days</span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {[
                    { label: 'Sun', day: 0 },
                    { label: 'Mon', day: 1 },
                    { label: 'Tue', day: 2 },
                    { label: 'Wed', day: 3 },
                    { label: 'Thu', day: 4 },
                    { label: 'Fri', day: 5 },
                    { label: 'Sat', day: 6 },
                  ].map(({ label, day }) => {
                    const checked = operatingDays.includes(day);
                    return (
                      <label
                        key={day}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: checked ? '1px solid #166534' : '1px solid var(--border, #cbd5e1)',
                          background: checked ? '#f0fdf4' : '#fff',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: checked ? 600 : 400,
                          color: checked ? '#166534' : '#64748b',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setOperatingDays([...operatingDays, day].sort());
                            } else {
                              if (operatingDays.length <= 1) {
                                notify('You must allow at least one delivery day.', true);
                                return;
                              }
                              setOperatingDays(operatingDays.filter((d) => d !== day));
                            }
                          }}
                        />
                        {label}
                      </label>
                    );
                  })}
                </div>
                <small>Unchecked days will be blocked from customer delivery selection on the booking calendar.</small>
              </div>
            </div>

            {/* Prohibited Items Manager */}
            <div
              style={{
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid var(--border, #e2e8f0)',
                background: 'var(--panel, #fff)',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>Prohibited Materials & Landfill Rules</h4>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Displayed & signed at checkout</span>
              </div>
              <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#64748b' }}>
                Customers must review and agree to these prohibited items before paying. This protects your business against landfill surcharges and hazardous waste fines.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                {prohibitedItems.map((item, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      color: '#991b1b',
                      padding: '4px 10px',
                      borderRadius: '16px',
                      fontSize: '12px',
                    }}
                  >
                    🚫 {item}
                    <button
                      type="button"
                      onClick={() => setProhibitedItems(prohibitedItems.filter((_, i) => i !== idx))}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#991b1b',
                        cursor: 'pointer',
                        padding: '0 2px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        lineHeight: 1,
                      }}
                      title="Remove item"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Add item (e.g. Dirt / Concrete, Propane tanks, Paint cans)..."
                  value={newProhibitedItem}
                  onChange={(e) => setNewProhibitedItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (newProhibitedItem.trim()) {
                        setProhibitedItems([...prohibitedItems, newProhibitedItem.trim()]);
                        setNewProhibitedItem('');
                      }
                    }
                  }}
                  style={{ flex: 1, fontSize: '13px' }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (newProhibitedItem.trim()) {
                      setProhibitedItems([...prohibitedItems, newProhibitedItem.trim()]);
                      setNewProhibitedItem('');
                    }
                  }}
                >
                  Add Item
                </Button>
              </div>
            </div>

            {/* Standard Landfill Surcharges */}
            <div
              style={{
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid var(--border, #e2e8f0)',
                background: 'var(--panel, #fff)',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>Landfill Item Surcharges (Customizable Rates)</h4>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Authorized in digital contract</span>
              </div>
              <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: '#64748b' }}>
                Transfer stations charge flat extra fees for items like tires and mattresses. These rates are automatically listed in your customer rental contract, giving you card-on-file auto-charge rights when found in the dumpster.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                <label className="field" style={{ margin: 0 }}>
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>Tire Fee ($)</span>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={tireFee}
                    onChange={(e) => setTireFee(Math.max(0, Number(e.target.value)))}
                    style={{ fontSize: '13px', padding: '6px 8px' }}
                  />
                  <small>Default: $25</small>
                </label>
                <label className="field" style={{ margin: 0 }}>
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>Mattress Fee ($)</span>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={mattressFee}
                    onChange={(e) => setMattressFee(Math.max(0, Number(e.target.value)))}
                    style={{ fontSize: '13px', padding: '6px 8px' }}
                  />
                  <small>Default: $50</small>
                </label>
                <label className="field" style={{ margin: 0 }}>
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>Freon Appliance ($)</span>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={freonFee}
                    onChange={(e) => setFreonFee(Math.max(0, Number(e.target.value)))}
                    style={{ fontSize: '13px', padding: '6px 8px' }}
                  />
                  <small>Default: $75</small>
                </label>
                <label className="field" style={{ margin: 0 }}>
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>Propane Tank ($)</span>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={propaneFee}
                    onChange={(e) => setPropaneFee(Math.max(0, Number(e.target.value)))}
                    style={{ fontSize: '13px', padding: '6px 8px' }}
                  />
                  <small>Default: $35</small>
                </label>
              </div>
            </div>

            {/* City / Service Area Auto-Populate Helper */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontWeight: 600, fontSize: '13px', color: '#0f172a' }}>City / Service Area Auto-Fill</span>
                {cityFeedback && (
                  <span style={{ fontSize: '11px', color: '#166534', fontWeight: 600 }}>{cityFeedback}</span>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Building2 size={14} style={{ position: 'absolute', left: '12px', top: '15px', color: '#94a3b8' }} />
                <input
                  type="text"
                  list="settings-metro-cities-list"
                  value={cityQuery}
                  onChange={(e) => handleCitySelect(e.target.value)}
                  placeholder="Type any US city, town, or 5-digit ZIP code (e.g. Baltimore, Seattle, Austin, Frederick MD, Round Rock TX...)"
                  style={{ paddingLeft: '34px' }}
                />
                <datalist id="settings-metro-cities-list">
                  {METRO_CITIES.map((c) => (
                    <option key={`${c.city}-${c.state}`} value={`${c.city}, ${c.state}`} />
                  ))}
                </datalist>
              </div>

              {/* Quick City Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                {['Baltimore', 'Seattle', 'Austin', 'Dallas', 'Houston', 'Denver', 'Phoenix', 'Atlanta', 'Miami', 'Chicago'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleCitySelect(c)}
                    style={{
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: cityQuery.toLowerCase().includes(c.toLowerCase()) ? '1px solid #166534' : '1px solid #cbd5e1',
                      background: cityQuery.toLowerCase().includes(c.toLowerCase()) ? '#dcfce7' : '#ffffff',
                      color: cityQuery.toLowerCase().includes(c.toLowerCase()) ? '#14532d' : '#475569',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <small style={{ color: '#64748b', display: 'block', marginTop: '6px' }}>
                Works for any major metro or small town in North America. Automatically fills all delivery ZIP codes below.
              </small>
            </div>

            <div className="field">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 600 }}>Active Delivery ZIP / Postal Codes</span>
                  <span style={{ fontSize: '11px', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                    {zipList.length} active
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {zipList.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAllZips}
                      style={{
                        background: '#fee2e2',
                        color: '#b91c1c',
                        border: 'none',
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Clear all ({zipList.length})
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowRawZipText(!showRawZipText)}
                    style={{
                      background: '#f1f5f9',
                      color: '#475569',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    {showRawZipText ? 'View as chips' : 'Paste text list'}
                  </button>
                </div>
              </div>

              {!showRawZipText ? (
                <div>
                  {/* Quick Add Single ZIP Input */}
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <MapPin size={13} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
                      <input
                        type="text"
                        value={newZipInput}
                        onChange={(e) => setNewZipInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddZip();
                          }
                        }}
                        placeholder="Add individual ZIP (e.g. 78704 or V8W 1W4) and press Enter"
                        style={{ paddingLeft: '30px', fontSize: '12.5px', height: '34px' }}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="default"
                      onClick={() => handleAddZip()}
                      style={{ height: '34px', fontSize: '12px', padding: '0 12px' }}
                    >
                      + Add ZIP
                    </Button>
                  </div>

                  {/* Interactive ZIP Chips Box */}
                  <div
                    style={{
                      maxHeight: '150px',
                      overflowY: 'auto',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '10px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                    }}
                  >
                    {zipList.length > 0 ? (
                      zipList.map((zip) => (
                        <span
                          key={zip}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            color: '#166534',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: '14px',
                          }}
                        >
                          {zip}
                          <button
                            type="button"
                            onClick={() => handleRemoveZip(zip)}
                            title={`Remove ${zip}`}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#166534',
                              cursor: 'pointer',
                              padding: '0 2px',
                              fontSize: '13px',
                              lineHeight: 1,
                              fontWeight: 'bold',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#dc2626')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#166534')}
                          >
                            ×
                          </button>
                        </span>
                      ))
                    ) : (
                      <div style={{ fontSize: '12px', color: '#94a3b8', padding: '10px', textAlign: 'center', width: '100%' }}>
                        No delivery ZIP codes added. Use the auto-fill search above or add ZIP codes to service customers.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <textarea
                    required
                    value={zips}
                    onChange={(e) => setZips(e.target.value)}
                    placeholder="78701, 78702, 78704 or V8W 1W4, V8W 2S8"
                    rows={4}
                    style={{ fontSize: '12.5px', width: '100%', boxSizing: 'border-box' }}
                  />
                  <small style={{ color: '#64748b' }}>Separate ZIP codes with commas or spaces.</small>
                </div>
              )}

              <small style={{ color: '#64748b', display: 'block', marginTop: '4px' }}>
                Click the <strong>×</strong> on any ZIP you don&apos;t travel to, or click <strong>Clear all</strong> to start fresh.
              </small>
            </div>
            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--line, #e2e8f0)' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: 16,
                  padding: '14px 18px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div>
                  <h3 style={{ fontSize: 16, margin: 0, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Truck size={18} style={{ color: '#166534' }} />
                    Dumpster Sizes & Custom Containers
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#64748b' }}>
                    Set rental rates, included days, and weight allowances. Supports any size from 1 to 100 yards.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="primary"
                  style={{
                    fontSize: 14,
                    padding: '8px 16px',
                    minHeight: 38,
                    background: '#166534',
                    color: '#ffffff',
                    fontWeight: 600,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  }}
                  onClick={() => setShowAddSizeModal(true)}
                  disabled={rules.length >= 12}
                >
                  <Plus size={16} style={{ marginRight: 6 }} />
                  + Add Custom Dumpster Size
                </Button>
              </div>

              {showAddSizeModal && (
                <div
                  style={{
                    padding: '20px',
                    borderRadius: '10px',
                    border: '2px solid #86efac',
                    background: '#f0fdf4',
                    marginBottom: '20px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Plus size={16} />
                        Add New Custom Dumpster Size
                      </h4>
                      <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#15803d' }}>
                        Pick a popular size preset below or type any custom yardage (1 to 100 yards).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddSizeModal(false)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#166534', fontWeight: 'bold' }}
                    >
                      ×
                    </button>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#166534', display: 'block', marginBottom: '6px' }}>
                      Quick Presets:
                    </span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {[6, 12, 14, 15, 16, 25, 30, 40].map((preset) => {
                        const alreadyExists = rules.some((r) => r.size_yards === preset);
                        return (
                          <button
                            key={preset}
                            type="button"
                            disabled={alreadyExists}
                            onClick={() => {
                              setNewSizeYards(preset);
                              if (preset === 6) {
                                setNewBasePrice(275);
                                setNewTons(1.0);
                              } else if (preset === 12) {
                                setNewBasePrice(375);
                                setNewTons(2.0);
                              } else if (preset === 14 || preset === 15 || preset === 16) {
                                setNewBasePrice(425);
                                setNewTons(2.5);
                              } else if (preset === 25) {
                                setNewBasePrice(525);
                                setNewTons(3.5);
                              }
                            }}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              border: alreadyExists ? '1px dashed #cbd5e1' : '1px solid #86efac',
                              background: newSizeYards === preset ? '#166534' : alreadyExists ? '#f1f5f9' : '#ffffff',
                              color: newSizeYards === preset ? '#ffffff' : alreadyExists ? '#94a3b8' : '#166534',
                              cursor: alreadyExists ? 'not-allowed' : 'pointer',
                              fontSize: '12px',
                              fontWeight: 600,
                            }}
                          >
                            {preset} Yard{alreadyExists ? ' (Active)' : ''}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="form-row">
                    <label className="field">
                      Size in yards (1-100)
                      <input
                        type="number"
                        min="1"
                        max="100"
                        required
                        value={newSizeYards}
                        onChange={(e) => setNewSizeYards(Math.max(1, Math.min(100, parseInt(e.target.value, 10) || 1)))}
                      />
                    </label>
                    <label className="field">
                      Base price ($)
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        required
                        value={newBasePrice}
                        onChange={(e) => setNewBasePrice(Number(e.target.value))}
                      />
                    </label>
                  </div>
                  <div className="form-row" style={{ marginTop: '10px' }}>
                    <label className="field">
                      Included days
                      <input
                        type="number"
                        min="1"
                        max="90"
                        required
                        value={newDays}
                        onChange={(e) => setNewDays(Math.max(1, Math.min(90, parseInt(e.target.value, 10) || 1)))}
                      />
                    </label>
                    <label className="field">
                      Extra day ($)
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={newExtraDay}
                        onChange={(e) => setNewExtraDay(Number(e.target.value))}
                      />
                    </label>
                  </div>
                  <div className="form-row" style={{ marginTop: '10px' }}>
                    <label className="field">
                      Included tons
                      <input
                        type="number"
                        min="0"
                        max="50"
                        step="0.1"
                        required
                        value={newTons}
                        onChange={(e) => setNewTons(Number(e.target.value))}
                      />
                    </label>
                    <label className="field">
                      Overage per ton ($)
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={newOverageTon}
                        onChange={(e) => setNewOverageTon(Number(e.target.value))}
                      />
                    </label>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '14px' }}>
                    <Button type="button" variant="ghost" onClick={() => setShowAddSizeModal(false)}>
                      Cancel
                    </Button>
                    <Button type="button" variant="primary" onClick={addCustomSize}>
                      Add {newSizeYards} Yard Dumpster
                    </Button>
                  </div>
                </div>
              )}

              <div className="pricing-grid">
                {rules.map((r) => (
                  <section className="pricing-editor" key={r.size_yards}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Truck size={14} />
                        {r.size_yards} yard dumpster
                      </h4>
                      {rules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSize(r.size_yards)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#dc2626',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            fontWeight: 500,
                            padding: '2px 6px',
                            borderRadius: '4px',
                          }}
                          title={`Remove ${r.size_yards} yard dumpster`}
                        >
                          <Trash2 size={12} />
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="form-row">
                      <label className="field">
                        Base price ($)
                        <input
                          type="number"
                          min="1"
                          step="0.01"
                          required
                          value={r.base_price_cents / 100}
                          onChange={(e) =>
                            edit(
                              r.size_yards,
                              'base_price_cents',
                              Math.round(Number(e.target.value) * 100),
                            )
                          }
                        />
                      </label>
                      <label className="field">
                        Included days
                        <input
                          type="number"
                          min="1"
                          max="90"
                          required
                          value={r.included_days}
                          onChange={(e) =>
                            edit(r.size_yards, 'included_days', Number(e.target.value))
                          }
                        />
                      </label>
                    </div>
                    <div className="form-row">
                      <label className="field">
                        Extra day ($)
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          required
                          value={r.extra_day_cents / 100}
                          onChange={(e) =>
                            edit(
                              r.size_yards,
                              'extra_day_cents',
                              Math.round(Number(e.target.value) * 100),
                            )
                          }
                        />
                      </label>
                      <label className="field">
                        Included tons
                        <input
                          type="number"
                          min="0"
                          max="50"
                          step="0.1"
                          required
                          value={r.included_tons}
                          onChange={(e) =>
                            edit(r.size_yards, 'included_tons', Number(e.target.value))
                          }
                        />
                      </label>
                    </div>
                    <label className="field">
                      Overage per ton ($)
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={r.overage_per_ton_cents / 100}
                        onChange={(e) =>
                          edit(
                            r.size_yards,
                            'overage_per_ton_cents',
                            Math.round(Number(e.target.value) * 100),
                          )
                        }
                      />
                    </label>
                  </section>
                ))}
                {rules.length < 12 && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddSizeModal(true);
                      window.scrollTo({ top: 600, behavior: 'smooth' });
                    }}
                    style={{
                      border: '2px dashed #166534',
                      background: 'rgba(240, 253, 244, 0.7)',
                      borderRadius: '8px',
                      padding: '24px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      minHeight: '220px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: '#dcfce7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#166534',
                      }}
                    >
                      <Plus size={24} />
                    </div>
                    <strong style={{ fontSize: 15, color: '#166534' }}>+ Add Custom Dumpster Size</strong>
                    <span style={{ fontSize: 12, color: '#15803d', textAlign: 'center', maxWidth: 200, lineHeight: 1.4 }}>
                      Click to add 12, 15, 25, or any size (1 to 100 yards)
                    </span>
                  </button>
                )}
              </div>
            </div>
            {error && (
              <div className="error-box" role="alert">
                {error}
              </div>
            )}
            <Button
              variant="primary"
              disabled={busy}
              type="submit"
              style={{ justifySelf: 'start' }}
            >
              {busy ? <Loader2 size={14} className="spin" /> : <Save size={14} />}Save business
              settings
            </Button>

            {/* Quick SMS & Notification Activity Preview */}
            <div
              style={{
                marginTop: '10px',
                padding: '16px',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={15} style={{ color: '#166534' }} />
                  <span style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>
                    SMS &amp; Notification Activity Ledger (Recent)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSettingsTab('notifications');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#166534',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  View full ledger ({data.notifications_log?.length ?? 0}) <ArrowRight size={12} />
                </button>
              </div>

              {data.notifications_log && data.notifications_log.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {data.notifications_log.slice(0, 3).map((item) => {
                    const tmpl = getTemplateInfo(item.template);
                    const st = getStatusBadge(item.status);
                    return (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: '#ffffff',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          fontSize: '12px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 600, color: '#0f172a' }}>
                            {formatPhone(item.to)}
                          </span>
                          <span
                            style={{
                              fontSize: '11px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: tmpl.bg,
                              color: tmpl.color,
                              fontWeight: 600,
                            }}
                          >
                            {tmpl.label}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>
                            {formatRelativeTime(item.sent_at)}
                          </span>
                          <span
                            style={{
                              fontSize: '11px',
                              padding: '2px 8px',
                              borderRadius: '10px',
                              background: st.bg,
                              color: st.color,
                              fontWeight: 700,
                            }}
                          >
                            {st.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                  No recent notifications yet. Automated confirmations and route texts will appear here.
                </p>
              )}
            </div>
          </div>
        </section>
      </form>
      <aside className="settings-side">
        <DedicatedLineCard
          phone={data.organization.twilio_phone_number}
          forwardCell={data.organization.phone}
          onCopy={async () => {
            const num = formatPhone(data.organization.twilio_phone_number);
            await navigator.clipboard.writeText(num);
            notify(`Copied dispatch line ${num}`);
          }}
          onViewLedger={() => {
            setSettingsTab('notifications');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          variant="sidebar"
        />
        <section className="panel">
          <div className="panel-heading">
            <h3>Let’s get you rolling.</h3>
            <span className="pill">Setup</span>
          </div>
          {[
            {
              icon: CheckCircle2,
              title: 'Make it yours',
              text: 'Set your company name, service area, and rental prices.',
            },
            {
              icon: Truck,
              title: 'Build your fleet',
              text: `${data.containers.length} containers in your inventory.`,
            },
            {
              icon: UserRound,
              title: 'Bring your crew',
              text: `${data.users.filter((u) => u.role === 'driver').length} drivers ready to be assigned.`,
            },
            {
              icon: CreditCard,
              title: 'Connect your payouts',
              text: data.demo
                ? 'Connect Supabase and Stripe test keys to verify payments.'
                : data.organization.stripe_connect_account_id
                  ? 'Stripe account linked. Finish Express onboarding to enable test charges.'
                  : 'Create your Stripe Express account to receive payments.',
            },
          ].map((s) => (
            <div className="setup-step" key={s.title}>
              <s.icon size={17} />
              <div>
                <h4>{s.title}</h4>
                <p>{s.text}</p>
              </div>
            </div>
          ))}
          <div style={{ padding: '0 21px 20px' }}>
            <Button onClick={() => void connect()} disabled={busy} style={{ width: '100%' }}>
              <CreditCard size={13} />
              {data.organization.stripe_connect_account_id
                ? 'Continue Stripe setup'
                : 'Connect Stripe (test)'}
              <ExternalLink size={11} />
            </Button>
          </div>
        </section>
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Subscription & Plans</h3>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--muted, #64748b)' }}>
                Scale your dumpster operations with high-conversion fleet tools.
              </p>
            </div>
            {data.organization.subscription_status === 'active' ? (
              <span className="pill" style={{ color: '#15803d', background: '#dcfce7', fontWeight: 600 }}>
                <Check size={11} style={{ marginRight: 3 }} /> Active Plan
              </span>
            ) : (
              <span className="pill" style={{ color: '#854d0e', background: '#fef9c3' }}>
                Free Plan
              </span>
            )}
          </div>
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {data.demo && (
              <div
                style={{
                  padding: '12px 14px',
                  background: '#f8fafc',
                  border: '1px dashed #cbd5e1',
                  borderRadius: 8,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Demo Plan Switcher
                  </span>
                  <span style={{ fontSize: 11, color: '#64748b' }}>
                    Status: <strong style={{ color: data.organization.subscription_status === 'active' ? '#166534' : '#b45309' }}>{data.organization.subscription_status === 'active' ? 'Active' : 'Inactive (Free)'}</strong>
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <Button
                    type="button"
                    variant={data.organization.subscription_status !== 'active' ? 'primary' : 'ghost'}
                    disabled={busy}
                    style={{ fontSize: 12, padding: '6px 10px', minHeight: 30 }}
                    onClick={async () => {
                      setBusy(true);
                      try {
                        await api('/api/billing', {
                          method: 'POST',
                          body: JSON.stringify({ status: 'inactive' }),
                        });
                        await reload();
                        notify('Switched to Free Tier (Inactive).');
                      } catch (e) {
                        notify((e as Error).message, true);
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    Free Tier (Inactive)
                  </Button>
                  <Button
                    type="button"
                    variant={data.organization.subscription_status === 'active' ? 'primary' : 'ghost'}
                    disabled={busy}
                    style={{ fontSize: 12, padding: '6px 10px', minHeight: 30 }}
                    onClick={async () => {
                      setBusy(true);
                      try {
                        await api('/api/billing', {
                          method: 'POST',
                          body: JSON.stringify({ plan: 'starter', status: 'active' }),
                        });
                        await reload();
                        notify('Switched to Starter ($29/mo).');
                      } catch (e) {
                        notify((e as Error).message, true);
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    Starter ($29/mo)
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={busy}
                    style={{ fontSize: 12, padding: '6px 10px', minHeight: 30 }}
                    onClick={async () => {
                      setBusy(true);
                      try {
                        await api('/api/billing', {
                          method: 'POST',
                          body: JSON.stringify({ plan: 'growth', status: 'active' }),
                        });
                        await reload();
                        notify('Switched to Growth ($149/mo).');
                      } catch (e) {
                        notify((e as Error).message, true);
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    Growth ($149/mo)
                  </Button>
                </div>
              </div>
            )}
            {/* Starter Plan */}
            <div
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                padding: '16px',
                background: '#fafafa',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1e293b' }}>
                  Starter Plan
                </h4>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                  $29<span style={{ fontSize: 12, fontWeight: 500, color: '#64748b' }}>/mo</span>
                </div>
              </div>
              <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 10px' }}>
                Essential dispatch and payment flexibility for independent haulers.
              </p>
              <ul style={{ margin: '0 0 14px', paddingLeft: 18, fontSize: 12, color: '#334155', lineHeight: 1.8 }}>
                <li>Offline Cash/Check payments</li>
                <li>Calendar Sync</li>
                <li>0% Platform fee option</li>
              </ul>
              <Button
                style={{ width: '100%' }}
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    const { url } = await api<{ url: string }>('/api/billing', {
                      method: 'POST',
                      body: JSON.stringify({ plan: 'starter' }),
                    });
                    window.location.assign(url);
                  } catch (e) {
                    notify((e as Error).message, true);
                    setBusy(false);
                  }
                }}
              >
                {data.organization.subscription_status === 'active'
                  ? 'Switch to Starter ($29/mo)'
                  : 'Start Starter Plan ($29/mo)'}
              </Button>
            </div>

            {/* Growth Fleet Plan */}
            <div
              style={{
                border: '1px solid #a7f3d0',
                borderRadius: 10,
                padding: '16px',
                background: '#f0fdf4',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -10,
                  right: 14,
                  background: '#059669',
                  color: 'white',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Recommended for Fleets
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#064e3b' }}>
                  Growth Fleet Plan
                </h4>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#064e3b' }}>
                  $149<span style={{ fontSize: 12, fontWeight: 500, color: '#047857' }}>/mo</span>
                </div>
              </div>
              <p style={{ fontSize: 11, color: '#047857', margin: '0 0 10px' }}>
                Fleet plan. Same operating tools as Starter, for a larger operation.
              </p>
              <ul style={{ margin: '0 0 14px', paddingLeft: 18, fontSize: 12, color: '#065f46', lineHeight: 1.8 }}>
                <li>Everything in Starter</li>
                <li>Customer reservation fee can be turned off</li>
                <li>Priced for more than one truck</li>
                <li>No annual contract</li>
              </ul>
              <Button
                variant="primary"
                style={{ width: '100%' }}
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    const { url } = await api<{ url: string }>('/api/billing', {
                      method: 'POST',
                      body: JSON.stringify({ plan: 'growth' }),
                    });
                    window.location.assign(url);
                  } catch (e) {
                    notify((e as Error).message, true);
                    setBusy(false);
                  }
                }}
              >
                {data.organization.subscription_status === 'active'
                  ? 'Switch to Growth Fleet ($149/mo)'
                  : 'Start Growth Fleet Plan ($149/mo)'}
              </Button>
            </div>
          </div>
        </section>
        <section className="panel">
          <div className="panel-heading">
            <h3>Bookings, wherever you are.</h3>
            <Globe size={15} color="#96a380" />
          </div>
          <div className="settings-body" style={{ gap: 16 }}>
            <p style={{ fontSize: 11, color: '#91a080', lineHeight: 1.8 }}>
              Share your link. Put it in your bio. Add it to your website. Let customers book on
              their schedule.
            </p>
            <div className="code-snippet">/book/{data.organization.slug}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button onClick={() => void copy()}>
                <Copy size={12} />
                Copy link
              </Button>
              <Button asChild variant="primary">
                <Link href={`/book/${data.organization.slug}`} target="_blank">
                  Preview <ArrowRight size={12} />
                </Link>
              </Button>
            </div>
            <Button onClick={() => void copy(true)}>
              <Copy size={12} />
              Copy website embed
            </Button>
          </div>
        </section>
        <section className="panel">
          <div className="panel-heading">
            <h3>Calendar feed (iCal).</h3>
            <CalendarDays size={15} color="#96a380" />
          </div>
          <div className="settings-body" style={{ gap: 14 }}>
            <p style={{ fontSize: 11, color: '#91a080', lineHeight: 1.8 }}>
              Sync all deliveries and pickups directly with Apple Calendar, Google Calendar, or Outlook.
            </p>
            <div className="code-snippet" style={{ fontSize: 11, wordBreak: 'break-all' }}>
              /api/calendar?token=
              {data.organization.calendar_token ||
                (data.organization.pricing_config as { calendar_token?: string })?.calendar_token ||
                ''}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button onClick={() => void copyCalendar()}>
                <Copy size={12} />
                Copy feed URL
              </Button>
              <Button
                asChild
                variant="primary"
              >
                <a
                  href={`webcal://${typeof window !== 'undefined' ? window.location.host : ''}/api/calendar?token=${data.organization.calendar_token || (data.organization.pricing_config as { calendar_token?: string })?.calendar_token || ''}`}
                >
                  Subscribe
                </a>
              </Button>
            </div>
          </div>
        </section>
        <section className="panel" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 12, marginBottom: 9 }}>Test mode, by design.</h3>
          <p style={{ fontSize: 11, color: '#909d86', lineHeight: 1.9 }}>
            Live charges stay disabled until webhook retry, failed payment, refund, and
            reconciliation tests are verified. Service credentials belong in environment settings.
          </p>
        </section>
      </aside>
    </div>
  ) : (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <DedicatedLineCard
        phone={data.organization.twilio_phone_number}
        forwardCell={data.organization.phone}
        onCopy={async () => {
          const num = formatPhone(data.organization.twilio_phone_number);
          await navigator.clipboard.writeText(num);
          notify(`Copied dispatch line ${num}`);
        }}
        variant="hero"
      />
      <NotificationActivityLedger
        notifications={data.notifications_log}
        search={ledgerSearch}
        onSearchChange={setLedgerSearch}
        channelFilter={channelFilter}
        onChannelFilterChange={setChannelFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        notify={notify}
      />
    </div>
  )}
</div>
  );
}
