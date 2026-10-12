'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function MobileStickyCTA() {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA once scrolled beyond 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial position on mount
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className="md:hidden"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease',
        transform: isVisible ? 'translateY(0)' : 'translateY(110%)',
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid #dde4d4',
        boxShadow: '0 -4px 20px rgba(31, 45, 38, 0.12)',
        paddingTop: 10,
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)',
        paddingLeft: 14,
        paddingRight: 14,
      }}
      aria-hidden={!isVisible}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          maxWidth: 600,
          margin: '0 auto',
        }}
      >
        {/* Left Side: Pricing & Revenue Guarantee */}
        <div style={{ minWidth: 0, flex: '1 1 auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 13,
              fontWeight: 800,
              color: '#1f2d26',
              lineHeight: 1.2,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#628f34',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            <span style={{ whiteSpace: 'nowrap' }}>Free Plan · $0/mo</span>
          </div>
          <div
            style={{
              fontSize: 11,
              color: '#556658',
              fontWeight: 600,
              marginTop: 2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Keep 100% revenue
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            flexShrink: 0,
          }}
        >
          {/* Ghost button: Test Demo */}
          <Link
            href="/book/greenline"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 10px',
              fontSize: 12,
              fontWeight: 700,
              color: '#1f2d26',
              background: '#f4f7f2',
              border: '1px solid #dde4d4',
              borderRadius: 8,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              minHeight: 36,
            }}
          >
            Test Demo
          </Link>

          {/* Primary Orange button: Start Free */}
          <Link
            href="/signup"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              padding: '8px 14px',
              fontSize: 12.5,
              fontWeight: 800,
              color: '#ffffff',
              background: '#ea580c',
              border: 'none',
              borderRadius: 8,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(234, 88, 12, 0.35)',
              minHeight: 36,
            }}
          >
            <span>Start Free</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export const MobileStickyCta = MobileStickyCTA;
