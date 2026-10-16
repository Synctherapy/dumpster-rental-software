'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Building2,
  ArrowRight,
  Info,
  Lock,
  Sparkles,
  HelpCircle,
  Clock,
  Calendar,
  Wallet,
} from 'lucide-react';
import { Dumpster } from '@/components/brand';

interface DumpsterOption {
  yards: number;
  rentalPrice: number;
  periodDays: number;
  includedTons: number;
  popular?: boolean;
}

const DUMPSTER_OPTIONS: DumpsterOption[] = [
  { yards: 10, rentalPrice: 325, periodDays: 7, includedTons: 1.5 },
  { yards: 20, rentalPrice: 425, periodDays: 7, includedTons: 2.0, popular: true },
  { yards: 30, rentalPrice: 525, periodDays: 7, includedTons: 3.0 },
  { yards: 40, rentalPrice: 625, periodDays: 7, includedTons: 4.0 },
];

export function CheckoutReceiptPreview() {
  const [selectedYards, setSelectedYards] = useState<number>(20);
  const [viewMode, setViewMode] = useState<'customer' | 'hauler'>('customer');

  const currentOption =
    DUMPSTER_OPTIONS.find((opt) => opt.yards === selectedYards) || DUMPSTER_OPTIONS[1];

  const reservationFee = 12.0;
  const totalPaid = currentOption.rentalPrice + reservationFee;
  const haulerPayout = currentOption.rentalPrice;

  return (
    <div
      className="receipt-preview-wrapper"
      style={{
        maxWidth: 960,
        margin: '0 auto',
        padding: '24px 16px',
        fontFamily: 'inherit',
      }}
    >
      {/* Header & Sub-headline */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#eef4ea',
            color: '#1f2d26',
            padding: '5px 14px',
            borderRadius: 999,
            fontSize: 12.5,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 10,
            border: '1px solid #dde4d4',
          }}
        >
          <Sparkles size={14} color="#ea580c" />
          The $12 Reservation Fee Solved
        </div>
        <h2
          style={{
            fontSize: 'clamp(24px, 3.5vw, 34px)',
            fontWeight: 800,
            color: '#1f2d26',
            lineHeight: 1.25,
            letterSpacing: '-0.02em',
          }}
        >
          How Your Customers Pay You <span style={{ color: '#ea580c' }}>100% of Your Price</span>
        </h2>
        <p
          style={{
            fontSize: 15,
            color: '#556658',
            maxWidth: 640,
            margin: '10px auto 0',
            lineHeight: 1.6,
          }}
        >
          RollOS is free ($0/month) for haulers because homeowners happily pay a tiny $12 reservation fee
          to lock in delivery dates online instead of waiting on voicemail.
        </p>
      </div>

      {/* Control Bar: Size selector & View Toggle */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 20,
          background: '#ffffff',
          border: '1px solid #dde4d4',
          borderRadius: 12,
          padding: '10px 14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1f2d26' }}>
            Simulate Container:
          </span>
          {DUMPSTER_OPTIONS.map((opt) => (
            <button
              key={opt.yards}
              type="button"
              onClick={() => setSelectedYards(opt.yards)}
              style={{
                border: selectedYards === opt.yards ? '2px solid #ea580c' : '1px solid #dde4d4',
                background: selectedYards === opt.yards ? '#fff7ed' : '#f7f8fa',
                color: selectedYards === opt.yards ? '#ea580c' : '#1f2d26',
                fontWeight: 700,
                fontSize: 13,
                padding: '6px 12px',
                borderRadius: 8,
                transition: 'all 0.15s ease',
              }}
            >
              {opt.yards} Yard (${opt.rentalPrice})
              {opt.popular && (
                <span
                  style={{
                    marginLeft: 4,
                    fontSize: 10,
                    background: '#ea580c',
                    color: '#fff',
                    padding: '1px 5px',
                    borderRadius: 4,
                  }}
                >
                  Most Popular
                </span>
              )}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div
          style={{
            display: 'inline-flex',
            background: '#f4f7f2',
            padding: 3,
            borderRadius: 8,
            border: '1px solid #dde4d4',
          }}
        >
          <button
            type="button"
            onClick={() => setViewMode('customer')}
            style={{
              padding: '6px 12px',
              fontSize: 12.5,
              fontWeight: 700,
              borderRadius: 6,
              border: 'none',
              background: viewMode === 'customer' ? '#ffffff' : 'transparent',
              color: viewMode === 'customer' ? '#1f2d26' : '#556658',
              boxShadow: viewMode === 'customer' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Customer Receipt
          </button>
          <button
            type="button"
            onClick={() => setViewMode('hauler')}
            style={{
              padding: '6px 12px',
              fontSize: 12.5,
              fontWeight: 700,
              borderRadius: 6,
              border: 'none',
              background: viewMode === 'hauler' ? '#ffffff' : 'transparent',
              color: viewMode === 'hauler' ? '#ea580c' : '#556658',
              boxShadow: viewMode === 'hauler' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Your Bank Deposit View
          </button>
        </div>
      </div>

      {/* Main Grid: Receipt Card on Left, Trust & Breakdown on Right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 20,
          alignItems: 'start',
        }}
      >
        {/* Visual Receipt Card (Perforated Paper Style) */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #dde4d4',
            boxShadow: '0 8px 30px rgba(31, 45, 38, 0.08)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Top receipt accent strip */}
          <div
            style={{
              height: 6,
              background:
                viewMode === 'customer'
                  ? 'linear-gradient(90deg, #1f2d26, #2d4338)'
                  : 'linear-gradient(90deg, #ea580c, #f97316)',
            }}
          />

          <div style={{ padding: '24px 24px 20px' }}>
            {/* Receipt Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 16,
              }}
            >
              <div>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: '#628f34',
                    background: '#eef4ea',
                    padding: '3px 8px',
                    borderRadius: 4,
                  }}
                >
                  <CheckCircle2 size={12} />
                  {viewMode === 'customer' ? 'Official Itemized Order Receipt' : 'Live Stripe Payout'}
                </span>
                <h3
                  style={{
                    fontSize: 19,
                    fontWeight: 800,
                    color: '#1f2d26',
                    marginTop: 6,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Greenline Disposal LLC
                </h3>
                <p style={{ fontSize: 12.5, color: '#728373', marginTop: 2 }}>
                  Direct Online Booking · Order #ROL-84920
                </p>
              </div>

              <div
                style={{
                  textAlign: 'right',
                  color: '#728373',
                  fontSize: 11.5,
                  lineHeight: 1.4,
                }}
              >
                <div>Date: Today, 8:42 PM</div>
                <div style={{ fontWeight: 600, color: '#1f2d26' }}>Paid via Apple Pay</div>
              </div>
            </div>

            {/* Container summary pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: '#f7f8fa',
                border: '1px solid #dde4d4',
                padding: '12px 14px',
                borderRadius: 10,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 38,
                  color: '#1f2d26',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Dumpster size={currentOption.yards} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1f2d26' }}>
                  {currentOption.yards}-Yard Roll-Off Dumpster
                </div>
                <div style={{ fontSize: 12, color: '#687864', display: 'flex', gap: 10 }}>
                  <span>✓ {currentOption.periodDays} Days Included</span>
                  <span>✓ {currentOption.includedTons} Tons Allowance</span>
                </div>
              </div>
            </div>

            {/* Itemized Line Items */}
            <div style={{ borderTop: '1px dashed #dde4d4', paddingTop: 16 }}>
              {/* Line 1: Rental Price */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  fontSize: 14,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#1f2d26' }}>
                    {currentOption.yards}-Yard Roll-Off Dumpster Rental
                  </div>
                  <div style={{ fontSize: 12, color: '#728373' }}>
                    7-Day Rental Period · {currentOption.includedTons} Tons Disposal Allowance
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#1f2d26' }}>
                  ${currentOption.rentalPrice.toFixed(2)}
                </div>
              </div>

              {/* Line 2: Guaranteed Reservation Fee */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  margin: '4px 0',
                  background: '#fbfcf9',
                  borderRadius: 6,
                  paddingLeft: 8,
                  paddingRight: 8,
                  border: '1px solid #e2ebd8',
                  fontSize: 14,
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: '#1f2d26',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    Guaranteed Delivery Date Reservation Fee
                    <span
                      style={{
                        background: '#d6ef7c',
                        color: '#1f2d26',
                        fontSize: 10,
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: 99,
                      }}
                    >
                      CUSTOMER PAYS
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#556658' }}>
                    Locks in selected drop-off window & 24/7 SMS driver updates
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#1f2d26' }}>
                  ${reservationFee.toFixed(2)}
                </div>
              </div>

              {/* Dotted divider */}
              <div
                style={{
                  borderBottom: '2px dashed #dde4d4',
                  margin: '14px 0',
                }}
              />

              {/* Total Paid by Homeowner */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: 14,
                }}
              >
                <div>
                  <span style={{ fontSize: 13, textTransform: 'uppercase', fontWeight: 700, color: '#556658' }}>
                    Total Paid by Homeowner
                  </span>
                  <div style={{ fontSize: 11.5, color: '#728373' }}>Collected upfront via Stripe Checkout</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      fontSize: 26,
                      fontWeight: 800,
                      color: '#1f2d26',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    ${totalPaid.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Direct Hauler Bank Payout Highlight Box */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #1f2d26, #15201b)',
                  color: '#ffffff',
                  padding: '16px 18px',
                  borderRadius: 12,
                  marginTop: 10,
                  boxShadow: '0 4px 14px rgba(31, 45, 38, 0.25)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 6,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <Wallet size={18} color="#d6ef7c" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#d6ef7c' }}>
                      DIRECT HAULER BANK PAYOUT
                    </span>
                  </div>
                  <span
                    style={{
                      background: '#ea580c',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 99,
                    }}
                  >
                    100% REVENUE
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#ffffff' }}>
                      ${haulerPayout.toFixed(2)}
                    </div>
                    <div style={{ fontSize: 12, color: '#c4d7c0' }}>
                      Sent directly to your bank account via Stripe
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        fontSize: 11,
                        color: '#99ac91',
                        border: '1px solid rgba(255,255,255,0.15)',
                        padding: '4px 8px',
                        borderRadius: 6,
                        background: 'rgba(255,255,255,0.05)',
                      }}
                    >
                      Your fee to RollOS: <strong style={{ color: '#fff' }}>$0.00</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Barcode Mockup */}
            <div
              style={{
                marginTop: 20,
                paddingTop: 14,
                borderTop: '1px solid #dde4d4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 11,
                color: '#82898c',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Lock size={12} color="#628f34" />
                <span>256-bit Encrypted Stripe Connect</span>
              </div>
              <div style={{ fontFamily: 'monospace', letterSpacing: 2 }}>
                |||| | |||||| | ||||| | ||
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Trust & Objection Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Badge 1: Homeowner Guarantee */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #dde4d4',
              borderRadius: 14,
              padding: '18px 20px',
              display: 'flex',
              gap: 14,
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: '#eef4ea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#2d6a36',
              }}
            >
              <CheckCircle2 size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: '#1f2d26', marginBottom: 4 }}>
                Homeowners get guaranteed delivery lock-in instead of voicemail
              </h4>
              <p style={{ fontSize: 13, color: '#556658', lineHeight: 1.5 }}>
                When someone orders a $400+ dumpster, they are planning a roof tear-off, move, or demolition.
                Paying $12 to guarantee the container arrives on Friday morning is routine—just like an
                Airbnb or airline reservation.
              </p>
            </div>
          </div>

          {/* Badge 2: 100% Payout */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #dde4d4',
              borderRadius: 14,
              padding: '18px 20px',
              display: 'flex',
              gap: 14,
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: '#fff7ed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#ea580c',
              }}
            >
              <CreditCard size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: '#1f2d26', marginBottom: 4 }}>
                100% of rental revenue goes straight to your Stripe account
              </h4>
              <p style={{ fontSize: 13, color: '#556658', lineHeight: 1.5 }}>
                RollOS connects to your own Stripe account. The full rental fee (${currentOption.rentalPrice}.00)
                and disposal overages deposit straight into your business bank. RollOS never holds your cash.
              </p>
            </div>
          </div>

          {/* Badge 3: Zero Monthly Bills */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #dde4d4',
              borderRadius: 14,
              padding: '18px 20px',
              display: 'flex',
              gap: 14,
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: '#eef4ea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#1f2d26',
              }}
            >
              <Building2 size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: '#1f2d26', marginBottom: 4 }}>
                Zero monthly software bills for you ($0/mo)
              </h4>
              <p style={{ fontSize: 13, color: '#556658', lineHeight: 1.5 }}>
                Legacy software (Docket, ServiceCore) charges you $300 to $1,500/month whether you book 2
                cans or 200 cans. With RollOS Free, the customer pays the software cost, keeping your overhead at zero.
              </p>
            </div>
          </div>

          {/* Objection Explainer (Open by Default) */}
          <div
            style={{
              background: '#f8faf7',
              border: '1px solid #dde4d4',
              borderRadius: 12,
              padding: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 14,
                fontWeight: 700,
                color: '#1f2d26',
                marginBottom: 10,
              }}
            >
              <HelpCircle size={17} color="#ea580c" />
              <span>Will your customers complain about a $12 reservation fee?</span>
            </div>
            <div
              style={{
                fontSize: 13,
                color: '#475569',
                lineHeight: 1.6,
              }}
            >
              <p style={{ margin: '0 0 10px' }}>
                <strong>Think about consumer booking psychology:</strong> When a homeowner or contractor orders a <strong>$450 roll-off container</strong> online at 9:30 PM, they want immediate certainty that their delivery is scheduled. A standard <strong>$12 delivery lock fee</strong> (less than 3%) is completely routine—just like an Airbnb, hotel, or flight reservation fee.
              </p>
              <p style={{ margin: '0 0 10px' }}>
                They gladly pay it for instant online confirmation, instead of waiting until 8:00 AM tomorrow morning to play phone tag with three different haulers while getting ready for work.
              </p>
              <p style={{ margin: 0, color: '#166534', fontWeight: 600 }}>
                ✓ Want to absorb the fee? You can toggle &quot;Absorb Fee&quot; in your RollOS settings or fold it into your base container price anytime. You stay in 100% control of your business.
              </p>
            </div>
          </div>

          {/* CTA Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              padding: '14px 18px',
              background: '#fff7ed',
              border: '1px solid #fed7aa',
              borderRadius: 12,
              marginTop: 4,
            }}
          >
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#9a3412' }}>
                Ready to try the 24/7 booking engine?
              </div>
              <div style={{ fontSize: 12, color: '#c2410c' }}>
                Setup takes under 3 minutes · No credit card required
              </div>
            </div>
            <Link
              href="/signup"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: '#ea580c',
                color: '#ffffff',
                padding: '9px 16px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                whiteSpace: 'nowrap',
                transition: 'background 0.15s ease',
              }}
            >
              Start Free <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
