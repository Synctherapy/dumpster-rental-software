'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, CheckCircle2, ShieldCheck, X, Sparkles } from 'lucide-react';

export function MobileStickyCTA() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  // Check session dismissal on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.sessionStorage.getItem('rollos_sticky_dismissed') === '1') {
      setIsDismissed(true);
    }
  }, []);

  // Suppress completely on internal application routes, booking widgets, driver routes, auth pages
  const isAppRoute =
    !pathname ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/bookings') ||
    pathname.startsWith('/calendar') ||
    pathname.startsWith('/inventory') ||
    pathname.startsWith('/drivers') ||
    pathname.startsWith('/payments') ||
    pathname.startsWith('/reports') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/driver') ||
    pathname.startsWith('/book') ||
    pathname.startsWith('/embed') ||
    pathname.startsWith('/agreement') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/auth');

  useEffect(() => {
    if (isAppRoute) return;

    const handleScroll = () => {
      // Show sticky CTA once scrolled beyond 260px
      if (window.scrollY > 260) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isAppRoute]);

  if (isAppRoute || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('rollos_sticky_dismissed', '1');
    }
  };

  return (
    <aside
      aria-label="Quick sign-up and demo"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.28s ease',
        transform: isVisible ? 'translateY(0)' : 'translateY(115%)',
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid #dce4d6',
        boxShadow: '0 -6px 24px -2px rgba(22, 38, 29, 0.12)',
        paddingTop: 8,
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 10px)',
        paddingLeft: '14px',
        paddingRight: '14px',
      }}
      aria-hidden={!isVisible}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Mobile View (<768px): 1 Sleek, High-Converting Thumb-Friendly Row (Zero Viewport Bloat) */}
        <div className="flex md:hidden items-center justify-between gap-3">
          <div className="flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-1.5 leading-none">
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#628f34',
                  boxShadow: '0 0 0 2px rgba(98, 143, 52, 0.2)',
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
              <strong style={{ fontSize: 13.5, fontWeight: 900, color: '#1a2920', whiteSpace: 'nowrap' }}>
                Free Plan · $0/mo
              </strong>
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#556957',
                marginTop: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ color: '#628f34' }}>✓ Keep 100%</span>
              <span style={{ color: '#9cb09f' }}>·</span>
              <span>No card needed</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <Link
              href="/signup"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                padding: '9px 16px',
                fontSize: 13,
                fontWeight: 800,
                color: '#ffffff',
                background: '#ea580c',
                border: 'none',
                borderRadius: 10,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                boxShadow: '0 3px 10px rgba(234, 88, 12, 0.35)',
                minHeight: 40,
              }}
            >
              <span>Start Free</span>
              <ArrowRight size={13} />
            </Link>

            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss quick bar"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#839686',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: 4,
              }}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Desktop & Tablet View (>=768px): Full Conversion Dock */}
        <div className="hidden md:flex flex-col gap-1.5">
          {/* Top Micro-Trust Strip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 11.5,
              fontWeight: 700,
              color: '#495d4d',
              borderBottom: '1px solid #edf2e8',
              paddingBottom: 4,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#1f2d26' }}>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#628f34',
                    boxShadow: '0 0 0 2px rgba(98, 143, 52, 0.2)',
                    display: 'inline-block',
                  }}
                />
                <strong>Free Plan · $0/mo</strong>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={13} color="#628f34" />
                0% Commission · Keep 100% Revenue
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <ShieldCheck size={13} color="#628f34" />
                No Credit Card Required
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Sparkles size={12} color="#ea580c" />
                Live in 3 Minutes
              </span>
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss quick bar"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#839686',
                cursor: 'pointer',
                padding: '2px 4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Desktop Action Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              minHeight: 44,
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#1a2920' }}>
                Start taking online dumpster orders today
              </div>
              <div style={{ fontSize: 12, color: '#556957', fontWeight: 600, marginTop: 1 }}>
                Works with or without a website · 24/7 self-serve customer checkout
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Link
                href="/book/greenline"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '9px 14px',
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#1f2d26',
                  background: '#f3f6f0',
                  border: '1px solid #dce4d6',
                  borderRadius: 9,
                  textDecoration: 'none',
                  minHeight: 40,
                }}
              >
                Test Demo
              </Link>

              <Link
                href="/signup"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '9px 18px',
                  fontSize: 13.5,
                  fontWeight: 800,
                  color: '#ffffff',
                  background: '#ea580c',
                  border: 'none',
                  borderRadius: 9,
                  textDecoration: 'none',
                  boxShadow: '0 3px 12px rgba(234, 88, 12, 0.38)',
                  minHeight: 40,
                }}
              >
                <span>Start Free</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export const MobileStickyCta = MobileStickyCTA;
export const StickyConversionBar = MobileStickyCTA;
