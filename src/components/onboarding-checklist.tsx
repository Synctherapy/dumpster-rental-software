'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Rocket,
  AlertTriangle,
  X,
} from 'lucide-react';
import { Button } from './ui/button';
import type { Workspace } from '@/lib/types';

interface OnboardingChecklistProps {
  data: Workspace;
  onOpenWizard: (step?: 1 | 2 | 3) => void;
  onAddContainers?: () => void;
  notify: (message: string, error?: boolean) => void;
}

export function OnboardingChecklist({
  data,
  onOpenWizard,
  onAddContainers,
  notify,
}: OnboardingChecklistProps) {
  const storageKey = `checklist_state_${data.organization.id}`;

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? Boolean(JSON.parse(stored).collapsed) : false;
    } catch {
      return false;
    }
  });

  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? Boolean(JSON.parse(stored).dismissed) : false;
    } catch {
      return false;
    }
  });

  const [testedBooking, setTestedBooking] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? Boolean(JSON.parse(stored).testedBooking) : false;
    } catch {
      return false;
    }
  });

  const [sharedLink, setSharedLink] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? Boolean(JSON.parse(stored).sharedLink) : false;
    } catch {
      return false;
    }
  });

  const updateState = (updates: Partial<{ dismissed: boolean; testedBooking: boolean; sharedLink: boolean; collapsed: boolean }>) => {
    try {
      const current = {
        dismissed,
        testedBooking,
        sharedLink,
        collapsed,
        ...updates,
      };
      localStorage.setItem(storageKey, JSON.stringify(current));
    } catch {}
  };

  const hasPricingAndZips =
    data.pricing_rules.length > 0 &&
    (data.pricing_rules[0]?.service_zips?.length ?? 0) > 0;

  const hasStripe = Boolean(data.organization.stripe_connect_account_id);

  const items = [
    {
      id: 'account',
      title: 'Create account & workspace',
      desc: 'Account active and operational',
      done: true,
      highlight: false,
      action: null,
      actionLabel: '',
    },
    {
      id: 'settings',
      title: 'Set service ZIP codes & pricing',
      desc: hasPricingAndZips
        ? `${data.pricing_rules.length} dumpster sizes active across ${data.pricing_rules[0].service_zips.length} ZIP codes`
        : 'Confirm the areas you service and your starting dumpster rental rates',
      done: hasPricingAndZips,
      highlight: false,
      action: () => onOpenWizard(1),
      actionLabel: hasPricingAndZips ? 'Edit' : 'Configure',
    },
    {
      id: 'fleet',
      title: 'Add your dumpster fleet',
      desc: data.containers.length > 0
        ? `${data.containers.length} container${data.containers.length === 1 ? '' : 's'} registered in fleet (${data.containers.filter((c) => c.status === 'yard').length} in yard ready to rent)`
        : '⚠️ Required: 0 containers added. You must add dumpsters or sizes will display as "Fully Booked" on your public booking page!',
      done: data.containers.length > 0,
      highlight: data.containers.length === 0,
      action: () => {
        if (onAddContainers) {
          onAddContainers();
        } else {
          window.location.href = '/inventory';
        }
      },
      actionLabel: data.containers.length > 0 ? 'Fleet' : 'Add Fleet',
    },
    {
      id: 'test_drive',
      title: 'Test your live booking page',
      desc: 'See exactly what homeowners see when they quote & book online',
      done: testedBooking,
      highlight: false,
      action: () => {
        setTestedBooking(true);
        updateState({ testedBooking: true });
        window.open(`/book/${data.organization.slug}`, '_blank');
        notify('Opened live booking page. Test placing a quote!');
      },
      actionLabel: 'Test Now',
    },
    {
      id: 'social',
      title: 'Put booking URL on Facebook, Instagram, or Google',
      desc: 'Get your link in front of local homeowners and contractors',
      done: sharedLink,
      highlight: false,
      action: () => {
        setSharedLink(true);
        updateState({ sharedLink: true });
        onOpenWizard(3);
      },
      actionLabel: 'Launchpad',
    },
    {
      id: 'stripe',
      title: 'Connect Stripe for card deposits',
      desc: hasStripe ? 'Connected and receiving direct payouts' : 'Accept credit cards automatically with 100% upfront deposits',
      done: hasStripe,
      highlight: false,
      action: () => {
        window.location.href = '/settings';
      },
      actionLabel: hasStripe ? 'Settings' : 'Connect',
    },
  ];

  const completedCount = items.filter((i) => i.done).length;
  const totalCount = items.length;
  const percent = Math.round((completedCount / totalCount) * 100);

  if (dismissed && percent === 100) return null;

  return (
    <section
      className="panel"
      style={{
        marginBottom: '20px',
        padding: '18px 22px',
        borderRadius: '12px',
        border: '1px solid #dce4d6',
        background: percent === 100 ? '#f0fdf4' : '#ffffff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: percent === 100 ? '#dcfce7' : '#ecfccb',
              color: percent === 100 ? '#15803d' : '#4d7c0f',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            {percent === 100 ? <Sparkles size={18} /> : <Rocket size={18} />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                {percent === 100
                  ? '🎉 All Set! Your Online Booking Engine is Live'
                  : 'First-Client Launchpad: Get your first dumpster booked'}
              </h3>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: percent === 100 ? '#22c55e' : '#65a30d',
                  color: '#ffffff',
                }}
              >
                {completedCount} of {totalCount} done ({percent}%)
              </span>
            </div>
            <p style={{ fontSize: '12.5px', color: '#64748b', margin: '3px 0 0 0' }}>
              {percent === 100
                ? 'Your booking store is configured. Share your link frequently to turn local traffic into rentals.'
                : 'Complete these quick steps to get bookings coming straight to your dispatch board.'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Button
            variant="ghost"
            className="btn-icon"
            onClick={() => {
              const next = !collapsed;
              setCollapsed(next);
              updateState({ collapsed: next });
            }}
            aria-label={collapsed ? 'Expand checklist' : 'Collapse checklist'}
          >
            {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </Button>

          {percent === 100 && (
            <Button
              variant="ghost"
              className="btn-icon"
              onClick={() => {
                setDismissed(true);
                updateState({ dismissed: true });
              }}
              aria-label="Dismiss checklist"
            >
              <X size={15} />
            </Button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          height: '6px',
          width: '100%',
          background: '#f1f5f9',
          borderRadius: '3px',
          margin: '14px 0 10px 0',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percent}%`,
            background: percent === 100 ? '#22c55e' : 'linear-gradient(90deg, #65a30d 0%, #16a34a 100%)',
            transition: 'width 0.4s ease',
          }}
        />
      </div>

      {/* Checklist items */}
      {!collapsed && (
        <div style={{ display: 'grid', gap: '8px', marginTop: '12px' }}>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '8px',
                background: item.highlight
                  ? '#fffbeb'
                  : item.done
                  ? 'rgba(240, 253, 244, 0.6)'
                  : '#f8fafc',
                border: '1px solid',
                borderColor: item.highlight ? '#f59e0b' : item.done ? '#bbf7d0' : '#e2e8f0',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                {item.done ? (
                  <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0 }} />
                ) : item.highlight ? (
                  <AlertTriangle size={18} style={{ color: '#d97706', flexShrink: 0 }} />
                ) : (
                  <Circle size={18} style={{ color: '#94a3b8', flexShrink: 0 }} />
                )}
                <div>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: item.highlight ? '#92400e' : item.done ? '#14532d' : '#1e293b',
                    }}
                  >
                    {item.title}
                  </div>
                  <div style={{ fontSize: '11.5px', color: item.highlight ? '#b45309' : '#64748b' }}>
                    {item.desc}
                  </div>
                </div>
              </div>

              {item.action && (
                <Button
                  onClick={item.action}
                  style={{
                    fontSize: '11.5px',
                    padding: '5px 12px',
                    minHeight: '28px',
                    fontWeight: 600,
                    background: item.done ? '#ffffff' : item.highlight ? '#d97706' : '#166534',
                    color: item.done ? '#334155' : '#ffffff',
                    border: item.done ? '1px solid #cbd5e1' : 'none',
                  }}
                >
                  {item.actionLabel}
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
