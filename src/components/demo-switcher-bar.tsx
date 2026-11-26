'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  Compass,
  FileCheck,
  LayoutDashboard,
  LogOut,
  RotateCcw,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { api } from '@/lib/client';

export type DemoSurface = 'hub' | 'dashboard' | 'booking' | 'driver' | 'contractor' | 'agreement';

interface DemoSwitcherBarProps {
  active: DemoSurface;
  slug?: string;
  hasRealSession?: boolean;
  onReset?: () => void | Promise<void>;
}

export function DemoSwitcherBar({
  active,
  slug = 'greenline',
  hasRealSession = false,
  onReset,
}: DemoSwitcherBarProps) {
  const [busy, setBusy] = useState<'reset' | 'exit' | null>(null);

  const safeSlug = slug || 'greenline';

  const items: {
    id: Exclude<DemoSurface, 'hub'>;
    label: string;
    shortLabel: string;
    href: string;
    icon: typeof LayoutDashboard;
  }[] = [
    {
      id: 'dashboard',
      label: '1. Dispatch & CRM',
      shortLabel: 'Dispatch',
      href: '/dashboard?demo=1',
      icon: LayoutDashboard,
    },
    {
      id: 'booking',
      label: '2. Customer Booking',
      shortLabel: 'Booking',
      href: `/book/${safeSlug}`,
      icon: ShoppingBag,
    },
    {
      id: 'driver',
      label: '3. Driver SMS Route',
      shortLabel: 'Driver SMS',
      href: '/demo/driver',
      icon: Truck,
    },
    {
      id: 'contractor',
      label: '4. Contractor Portal',
      shortLabel: 'Contractor',
      href: `/contractor/${safeSlug}?account=Liam+Anderson`,
      icon: Building2,
    },
    {
      id: 'agreement',
      label: '5. Signed Waiver',
      shortLabel: 'Waiver',
      href: '/agreement/job-6',
      icon: FileCheck,
    },
  ];

  const handleReset = async () => {
    if (busy) return;
    setBusy('reset');
    try {
      await api('/api/demo', {
        method: 'POST',
        body: JSON.stringify({ action: 'reset' }),
      });
      if (onReset) {
        await onReset();
      } else {
        window.location.reload();
      }
    } catch {
      window.location.reload();
    } finally {
      setBusy(null);
    }
  };

  const handleExitDemo = async () => {
    if (busy) return;
    setBusy('exit');
    try {
      await api('/api/demo', {
        method: 'POST',
        body: JSON.stringify({ action: 'exit' }),
      });
    } catch {}
    window.location.href = '/dashboard?demo=0';
  };

  return (
    <aside
      role="region"
      aria-label="Interactive software demo switcher"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 110,
        background: 'rgba(20, 32, 24, 0.98)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(196, 212, 197, 0.2)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.18)',
        color: '#f3f6f0',
        padding: '7px 12px',
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          flexWrap: 'wrap',
        }}
      >
        {/* Left: Sandbox status + All Views Hub link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <Link
            href="/demo"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              textDecoration: 'none',
              color: '#f3f6f0',
              background: active === 'hub' ? 'rgba(98, 143, 52, 0.28)' : 'rgba(255, 255, 255, 0.07)',
              border:
                active === 'hub'
                  ? '1px solid rgba(145, 201, 88, 0.55)'
                  : '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 999,
              padding: '4px 10px',
              fontSize: 11.5,
              fontWeight: 800,
              letterSpacing: '0.01em',
            }}
            title="Open Full Demo Tour Hub"
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#84cc16',
                boxShadow: '0 0 0 2px rgba(132, 204, 22, 0.3)',
                display: 'inline-block',
              }}
            />
            <Compass size={12} />
            <span>Demo Tour</span>
          </Link>
          <span
            className="hidden xl:inline"
            style={{ fontSize: 11.5, color: '#9fb3a2', fontWeight: 600 }}
          >
            Private sandbox · Switch role:
          </span>
        </div>

        {/* Center: 5-View Switcher Strip */}
        <nav
          aria-label="Demo views"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            overflowX: 'auto',
            maxWidth: '100%',
            paddingBottom: 1,
            scrollbarWidth: 'none',
          }}
        >
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            const useAnchor = item.id === 'driver';
            const pillStyle: React.CSSProperties = {
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 10px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: isActive ? 800 : 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'background 0.15s ease, color 0.15s ease',
              background: isActive ? '#f3f6f0' : 'rgba(255, 255, 255, 0.06)',
              color: isActive ? '#142018' : '#d6e2d7',
              border: isActive
                ? '1px solid #ffffff'
                : '1px solid rgba(255, 255, 255, 0.1)',
            };

            if (useAnchor) {
              return (
                <a key={item.id} href={item.href} style={pillStyle}>
                  <Icon size={13} />
                  <span className="hidden md:inline">{item.label}</span>
                  <span className="md:hidden">{item.shortLabel}</span>
                </a>
              );
            }

            return (
              <Link key={item.id} href={item.href} style={pillStyle}>
                <Icon size={13} />
                <span className="hidden md:inline">{item.label}</span>
                <span className="md:hidden">{item.shortLabel}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Reset + Exit Demo (if signed in) + Start Free */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <button
            type="button"
            onClick={handleReset}
            disabled={busy !== null}
            title="Reset demo back to fresh sample data"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '5px 9px',
              borderRadius: 8,
              fontSize: 11.5,
              fontWeight: 700,
              color: '#cfe0d0',
              background: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              cursor: busy ? 'wait' : 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <RotateCcw size={12} />
            <span className="hidden sm:inline">{busy === 'reset' ? 'Resetting…' : 'Reset'}</span>
          </button>

          {hasRealSession && (
            <button
              type="button"
              onClick={handleExitDemo}
              disabled={busy !== null}
              title="Exit demo sandbox and return to your live RollOS account"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '5px 10px',
                borderRadius: 8,
                fontSize: 11.5,
                fontWeight: 800,
                color: '#fef08a',
                background: 'rgba(234, 179, 8, 0.16)',
                border: '1px solid rgba(250, 204, 21, 0.4)',
                cursor: busy ? 'wait' : 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <LogOut size={12} />
              <span>My Account</span>
            </button>
          )}

          <Link
            href="/signup"
            style={{
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: 12.5,
              padding: '6px 12px',
              borderRadius: 8,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              boxShadow: '0 2px 8px rgba(234, 88, 12, 0.38)',
            }}
          >
            <span className="hidden sm:inline">Start Free ($0/mo)</span>
            <span className="sm:hidden">Start Free</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </aside>
  );
}
