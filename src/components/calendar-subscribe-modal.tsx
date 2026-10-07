'use client';
import { useState } from 'react';
import { CalendarDays, Check, Copy, ExternalLink, Smartphone } from 'lucide-react';
import { Modal } from './ui/dialog';
import { Button } from './ui/button';
import type { Workspace } from '@/lib/types';

export function CalendarSubscribeModal({
  open,
  onClose,
  data,
  notify,
}: {
  open: boolean;
  onClose: () => void;
  data: Workspace;
  notify: (msg: string, error?: boolean) => void;
}) {
  const [copied, setCopied] = useState(false);

  const token = data.organization.calendar_token || data.organization.id;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const host = typeof window !== 'undefined' ? window.location.host : '';

  const icsUrl = `${origin}/api/calendar?token=${token}`;
  const webcalUrl = `webcal://${host}/api/calendar?token=${token}`;
  const googleCalUrl = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcalUrl)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(icsUrl);
      setCopied(true);
      notify('Calendar feed URL copied to clipboard.');
      setTimeout(() => setCopied(false), 3000);
    } catch {
      notify('Clipboard unavailable. Please copy the URL below.', true);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={(o) => !o && onClose()}
      title="Subscribe to Dispatch Calendar"
      description="Sync all deliveries and pickups straight to your smartphone, Google Calendar, or Outlook."
    >
      <div className="form-stack">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            background: 'var(--panel-subtle, #f8fafc)',
            borderRadius: 8,
            border: '1px solid var(--border, #e2e8f0)',
          }}
        >
          <Smartphone size={24} style={{ color: '#2563eb' }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Real-Time Schedule Sync</div>
            <div style={{ fontSize: 12, color: 'var(--muted, #64748b)' }}>
              Deliveries and pickups appear as all-day events on your phone with customer address, phone number, and placement notes.
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
          <Button
            variant="primary"
            asChild
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <a href={webcalUrl}>
              <CalendarDays size={14} style={{ marginRight: 6 }} />
              Apple / iPhone Calendar
            </a>
          </Button>

          <Button
            asChild
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <a href={googleCalUrl} target="_blank" rel="noreferrer">
              <ExternalLink size={14} style={{ marginRight: 6 }} />
              Google Calendar (Web)
            </a>
          </Button>
        </div>

        <div style={{ marginTop: 12 }}>
          <label className="field">
            iCal Subscription URL
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                readOnly
                value={icsUrl}
                style={{ fontSize: 12, fontFamily: 'monospace' }}
              />
              <Button onClick={() => void handleCopy()} style={{ whiteSpace: 'nowrap' }}>
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? 'Copied' : 'Copy URL'}
              </Button>
            </div>
            <small>
              Paste this URL into any calendar app (Outlook, Thunderbird, Samsung Calendar) under &quot;Add Calendar from URL&quot;.
            </small>
          </label>
        </div>
      </div>
    </Modal>
  );
}
