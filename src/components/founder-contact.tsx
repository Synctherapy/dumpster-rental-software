'use client';

import React, { useState } from 'react';
import { Check, Mail, MessageSquare, ShieldCheck, UserCheck } from 'lucide-react';

const DEFAULT_WHATSAPP_MSG = encodeURIComponent(
  'Hi, I saw RollOS dumpster software and have a quick question / would like a walkthrough.'
);

// Anti-scraper runtime assembly (no static phone/email strings or base64 in HTML/JS)
function getFounderDirectPhone(): string {
  if (typeof window === 'undefined') return '';
  const segs = ['1', '250', '812', '8698'];
  return segs.join('');
}

function getFounderDirectEmail(): string {
  if (typeof window === 'undefined') return '';
  const parts = ['support', '@', 'rolloffdumpstersoftware', '.', 'com'];
  return parts.join('');
}

export function WhatsAppButton({
  className = '',
  label = 'Chat with Founder on WhatsApp',
  sublabel = 'Direct response · No sales pressure',
}: {
  className?: string;
  label?: string;
  sublabel?: string;
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const phone = getFounderDirectPhone();
    if (!phone) return;
    const url = `https://wa.me/${phone}?text=${DEFAULT_WHATSAPP_MSG}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-3 px-5 py-3 rounded-xl font-bold transition-all shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] text-left cursor-pointer ${className}`}
      style={{
        backgroundColor: '#25D366',
        color: '#ffffff',
        border: '1px solid #20ba5a',
      }}
      aria-label="Chat with the founder on WhatsApp"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="shrink-0"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      <div>
        <div className="text-sm font-extrabold tracking-tight leading-tight">{label}</div>
        {sublabel && (
          <div className="text-xs text-white/90 font-medium leading-tight mt-0.5">{sublabel}</div>
        )}
      </div>
    </button>
  );
}

export function SupportEmailButton({
  className = '',
  label = 'Email Founder Directly',
}: {
  className?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const email = getFounderDirectEmail();
    if (!email) return;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
    window.location.href = `mailto:${email}?subject=Question%20about%20RollOS%20Dumpster%20Software`;
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-2.5 px-4 py-3 rounded-xl font-bold transition-all border border-[#c4d4c7] bg-white text-[#1f2d26] hover:bg-[#f4f7f2] hover:border-[#a9c2af] text-sm shadow-sm cursor-pointer ${className}`}
      aria-label="Email the founder at support@rolloffdumpstersoftware.com"
    >
      {copied ? (
        <Check size={18} className="text-[#2e7d32]" />
      ) : (
        <Mail size={18} className="text-[#ea580c]" />
      )}
      <span>{copied ? 'Email Copied to Clipboard!' : label}</span>
    </button>
  );
}

export function FounderNoteSection() {
  return (
    <section className="px-6 py-14 max-w-[1040px] mx-auto" id="founder-note">
      <div className="bg-white border-2 border-[#dde4d4] rounded-3xl p-7 md:p-10 shadow-sm relative overflow-hidden">
        {/* Subtle background badge */}
        <div
          style={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(98, 143, 52, 0.08) 0%, rgba(98, 143, 52, 0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Left Column: Mission & Core Message */}
          <div className="flex-1">
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: '#f4f7f1',
                color: '#476326',
                padding: '4px 12px',
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 14,
                border: '1px solid #dde4d4',
              }}
            >
              <UserCheck size={13} color="#628f34" />
              DIRECT TALK · BUILT FOR 1–5 TRUCK INDEPENDENT HAULERS
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1f2d26] mb-4 tracking-tight leading-snug">
              Why should dumpster software cost $300–$500 every single month?
            </h2>

            <div className="space-y-4 text-sm md:text-[15px] text-[#475569] leading-relaxed">
              <p>
                If you run 1 to 5 roll-off trucks, you know how legacy dumpster software operates. They force you into a 45-minute sales demo, make you sign a 12-month contract, and charge you $300 to $500 every month—even during the winter when construction slows down.
              </p>
              <p>
                <strong>We believe independent haulers deserve better.</strong> That’s why RollOS offers a $0/month free plan to capture new online bookings while you sleep. Your customer pays a standard $12 reservation lock fee at online checkout (just like an Airbnb or flight), and you keep 100% of your rental money, extra day fees, and tonnage overages.
              </p>
              <p>
                When you&apos;re ready to run repeat contractors who call or text and pay offline (Cash, Check, Zelle, or Net-30 invoice), our <strong>Starter Plan ($29/mo)</strong> unlocks unlimited manual dispatch with $0 platform fees, VIP contractor custom pricing, and 2-way Google Calendar sync. One single contractor pull covers the software for the entire month.
              </p>
            </div>

            {/* Key Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-6 pt-4 border-t border-[#edf1ea]">
              <div className="flex items-start gap-2.5">
                <ShieldCheck size={18} className="text-[#628f34] shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm text-[#2a382c] font-medium">
                  <strong>You own 100% of your data:</strong> Export customer lists &amp; booking history to CSV anytime.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck size={18} className="text-[#628f34] shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm text-[#2a382c] font-medium">
                  <strong>Starter is just $29/mo:</strong> Unlimited $0-fee manual phone dispatch &amp; contractor accounts.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck size={18} className="text-[#628f34] shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm text-[#2a382c] font-medium">
                  <strong>Direct Stripe Connect payouts:</strong> Automatic 2-day bank deposits, 30-min instant payouts, 0 credit checks.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck size={18} className="text-[#628f34] shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm text-[#2a382c] font-medium">
                  <strong>Zero lock-in:</strong> No annual contracts. Start free or cancel anytime with 1 click.
                </span>
              </div>
            </div>

            {/* Direct Walkthrough Offer & Contact Actions */}
            <div className="bg-[#f7f9f5] border border-[#dde4d4] rounded-2xl p-5 mt-6">
              <h4 className="text-sm font-bold text-[#1f2d26] mb-1.5 flex items-center gap-2">
                <MessageSquare size={16} className="text-[#ea580c]" />
                Want a free, personal 1-on-1 walkthrough of the system?
              </h4>
              <p className="text-xs md:text-sm text-[#556658] leading-relaxed mb-4">
                No high-pressure sales reps and no automated Calendly runaround. Message me directly on WhatsApp or email me with your container sizes and yard questions. I will personally walk you through how the dispatch board and customer booking flow work for your specific fleet.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <WhatsAppButton label="Message on WhatsApp" sublabel="Quick question or personal walkthrough" />
                <SupportEmailButton label="Email support@rolloffdumpstersoftware.com" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
