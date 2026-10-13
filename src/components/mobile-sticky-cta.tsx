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
        background: 'rgba(255, 255, 255, 0.97)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid #dce4d6',
        boxShadow: '0 -8px 30px -4px rgba(22, 38, 29, 0.14)',
        paddingTop: 10,
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)',
        paddingLeft: '16px',
        paddingRight: '16px',
      }}
      aria-hidden={!isVisible}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {/* Top Micro-Trust Bar for Instant Risk-Reversal */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 11.5,
            fontWeight: 700,
            color: '#495d4d',
            borderBottom: '1px solid #edf2e8',
            paddingBottom: 5,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
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
            <span className="hidden sm:inline-flex" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <ShieldCheck size={13} color="#628f34" />
              No Credit Card Required
            </span>
            <span className="hidden md:inline-flex" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Sparkles size={12} color="#ea580c" />
              Live in 3 Minutes
            </span>
          </div>

          {/* Dismiss Button */}
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
              borderRadius: 4,
              transition: 'color 0.15s ease',
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Main Action Bar: Maximized Space & Thumb-Friendly Touch Targets */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            minHeight: 46,
          }}
        >
          {/* Left Text / Value Proposition */}
          <div style={{ minWidth: 0, flex: '1 1 auto' }}>
            <div
              style={{
                fontSize: 14.5,
                fontWeight: 800,
                color: '#1a2920',
                lineHeight: 1.25,
                letterSpacing: '-0.2px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Start taking online dumpster orders today
            </div>
            <div
              style={{
                fontSize: 12,
                color: '#556957',
                fontWeight: 600,
                marginTop: 2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Works with or without a website · 24/7 self-serve customer checkout
            </div>
          </div>

          {/* Right Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexShrink: 0,
            }}
          >
            {/* Secondary: Test Demo */}
            <Link
              href="/book/greenline"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 14px',
                fontSize: 13,
                fontWeight: 700,
                color: '#1f2d26',
                background: '#f3f6f0',
                border: '1px solid #dce4d6',
                borderRadius: 9,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                minHeight: 44,
                transition: 'background 0.15s ease',
              }}
            >
              Test Demo
            </Link>

            {/* Primary Orange: Start Free */}
            <Link
              href="/signup"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '10px 18px',
                fontSize: 13.5,
                fontWeight: 800,
                color: '#ffffff',
                background: '#ea580c',
                border: 'none',
                borderRadius: 9,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                boxShadow: '0 3px 12px rgba(234, 88, 12, 0.38)',
                minHeight: 44,
                transition: 'transform 0.12s ease, background 0.15s ease',
              }}
            >
              <span>Start Free</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

export const MobileStickyCta = MobileStickyCTA;
export const StickyConversionBar = MobileStickyCTA;
