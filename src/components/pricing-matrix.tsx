'use client';

import React from 'react';
import Link from 'next/link';
import { Check, X, ArrowRight } from 'lucide-react';

interface FeatureItem {
  name: string;
  free: string | boolean;
  starter: string | boolean;
  growth: string | boolean;
  bold?: boolean;
  highlight?: boolean;
  growthHighlight?: boolean;
}

interface FeatureSection {
  category: string;
  features: FeatureItem[];
}

export function PricingMatrix() {
  const rows: FeatureSection[] = [
    {
      category: '24/7 Online Booking & Payments',
      features: [
        {
          name: 'Embeddable Website Booking Widget',
          free: 'Included (WordPress, Wix, Squarespace)',
          starter: 'Included',
          growth: 'Included',
        },
        {
          name: 'Direct Shareable Booking Link',
          free: 'Included (Google Profile & Social)',
          starter: 'Included',
          growth: 'Included',
        },
        {
          name: 'Instant Delivery ZIP Code Verification',
          free: true,
          starter: true,
          growth: true,
        },
        {
          name: 'Custom Dumpster Sizes (10, 15, 20, 30, 40 & custom)',
          free: true,
          starter: true,
          growth: true,
        },
        {
          name: 'Hauler Rental Share',
          free: '100% (You keep full price)',
          starter: '100% (You keep full price)',
          growth: '100% (You keep full price)',
          highlight: true,
        },
        {
          name: 'Customer Online Reservation Fee',
          free: '$12 paid by customer',
          starter: '$12 paid by customer',
          growth: '$12 paid by customer',
        },
        {
          name: 'Direct Stripe Connect Bank Payouts',
          free: true,
          starter: true,
          growth: true,
        },
      ],
    },
    {
      category: 'Visual Dispatch & Driver Workflows',
      features: [
        {
          name: 'Visual Drag-and-Drop Dispatch Whiteboard',
          free: true,
          starter: true,
          growth: true,
        },
        {
          name: 'Driver SMS Magic Links (Zero App Store Install)',
          free: true,
          starter: true,
          growth: true,
          highlight: true,
        },
        {
          name: '1-Tap Google & Apple Maps Navigation for Drivers',
          free: true,
          starter: true,
          growth: true,
        },
        {
          name: 'Driveway Proof-of-Delivery Photo Capture',
          free: true,
          starter: true,
          growth: true,
        },
        {
          name: 'Attach Landfill Scale Ticket & Overage Billing',
          free: true,
          starter: true,
          growth: true,
        },
      ],
    },
    {
      category: 'Contractor & Fleet Operations',
      features: [
        {
          name: 'Contractor Accounts Add-On (Custom VIP Rates for Repeat Roofers & Builders)',
          free: false,
          starter: 'Unlimited',
          growth: 'Unlimited',
          highlight: true,
        },
        {
          name: 'Offline Payments ($0 Platform Fee on Cash, Check, Zelle & Net-30 Invoices)',
          free: false,
          starter: '100% Free ($0 fee)',
          growth: '100% Free ($0 fee)',
          highlight: true,
        },
        {
          name: '2-Way Google Calendar & Apple iCal Sync Feed',
          free: false,
          starter: true,
          growth: true,
        },
        {
          name: 'Financial & Exportable Operations Logs',
          free: false,
          starter: true,
          growth: true,
        },
      ],
    },
    {
      category: 'Growth & Contractor Automation ($99/mo Exclusive)',
      features: [
        {
          name: 'Missed-Call SMS Auto-Textback (Instant Twilio text with booking link when driving)',
          free: false,
          starter: false,
          growth: 'Included (Saves 2–3 lost rentals/mo)',
          bold: true,
          growthHighlight: true,
        },
        {
          name: 'VIP Contractor Net-30 Portal (1-click swap requests & monthly Net-30 billing for roofers)',
          free: false,
          starter: false,
          growth: 'Included (Growth Exclusive)',
          bold: true,
          growthHighlight: true,
        },
        {
          name: 'Multi-Truck Fleet Scheduling & Team Dispatch Management',
          free: 'Single Fleet View',
          starter: 'Multi-Truck Filter',
          growth: 'Dedicated Multi-Fleet Dispatch',
          growthHighlight: true,
        },
        {
          name: 'Zero Reservation Fee Option (Absorb or Pass $12 Fee)',
          free: false,
          starter: false,
          growth: 'Included (Absorb or Pass)',
        },
      ],
    },
    {
      category: 'Contract & Commitments',
      features: [
        {
          name: 'Monthly Software Price',
          free: '$0 / month',
          starter: '$29 / month',
          growth: '$99 / month',
          bold: true,
        },
        {
          name: 'Setup & Onboarding Fees',
          free: '$0 (Self-serve in 3 mins)',
          starter: '$0',
          growth: '$0',
        },
        {
          name: 'Annual Contract Lock-In',
          free: 'None (Cancel anytime)',
          starter: 'None (Cancel anytime)',
          growth: 'None (Cancel anytime)',
        },
        {
          name: 'Seasonal Hauler Off-Season Freeze ($10/mo Winter Yard Hold)',
          free: 'Always $0/mo',
          starter: '$10/mo Winter Yard Hold',
          growth: '$10/mo Winter Yard Hold',
          highlight: true,
        },
      ],
    },
  ];

  const renderVal = (
    val: boolean | string,
    bold?: boolean,
    highlight?: boolean,
    growthHighlight?: boolean
  ) => {
    if (typeof val === 'boolean') {
      return val ? (
        <Check size={18} className="text-[#16a34a] mx-auto font-bold" />
      ) : (
        <X size={18} className="text-[#cbd5e1] mx-auto" />
      );
    }
    return (
      <span
        className={`text-xs md:text-sm ${bold ? 'font-bold text-[#1f2d26]' : 'text-[#334155]'} ${
          growthHighlight
            ? 'text-[#065f46] font-bold bg-[#ecfdf5] border border-[#a7f3d0] px-2 py-0.5 rounded shadow-xs inline-block'
            : highlight
            ? 'text-[#166534] font-bold bg-[#f0fdf4] px-2 py-0.5 rounded'
            : ''
        }`}
      >
        {val}
      </span>
    );
  };

  const [mobilePlan, setMobilePlan] = React.useState<'free' | 'starter' | 'growth'>('free');

  return (
    <div className="w-full my-8">
      {/* 1. Desktop & Tablet View (Never Scrolls Horizontally) */}
      <div className="hidden md:block rounded-2xl border border-[#dde4d4] bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse table-fixed">
          <colgroup>
            <col style={{ width: '40%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '20%' }} />
          </colgroup>
          <thead>
            <tr className="border-b border-[#dde4d4] bg-[#f8faf6]">
              <th className="p-5 text-base font-bold text-[#1f2d26]">
                Plan Overview
              </th>
              <th className="p-5 text-center bg-white border-x border-[#dde4d4] relative">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#ea580c] mb-1">
                  Most Popular
                </div>
                <div className="text-lg font-extrabold text-[#1f2d26]">Free Plan</div>
                <div className="text-2xl font-black text-[#1f2d26] my-1">
                  $0<span className="text-xs font-normal text-[#64748b]">/mo</span>
                </div>
                <p className="text-[11px] text-[#64748b] mb-3">Get bookings while you sleep</p>
                <Link
                  href="/signup"
                  className="btn btn-orange text-xs py-2 w-full justify-center shadow-sm"
                >
                  Start Free in 3 Mins
                </Link>
              </th>
              <th className="p-5 text-center border-r border-[#dde4d4]">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#ea580c] mb-1">
                  14-Day Free Trial
                </div>
                <div className="text-lg font-extrabold text-[#1f2d26]">Starter Plan</div>
                <div className="text-2xl font-black text-[#1f2d26] my-1">
                  $29<span className="text-xs font-normal text-[#64748b]">/mo</span>
                </div>
                <p className="text-[11px] text-[#64748b] mb-3">Everything in Free, plus Contractor Accounts & $0 Offline Payments</p>
                <Link
                  href="/signup"
                  className="btn btn-dark text-xs py-2 w-full justify-center"
                >
                  Start 14-Day Trial
                </Link>
              </th>
              <th className="p-5 text-center bg-[#fcfdfa] border-l border-[#dde4d4]">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#059669] mb-1">
                  High-Growth Automation
                </div>
                <div className="text-lg font-extrabold text-[#1f2d26]">Growth Fleet</div>
                <div className="text-2xl font-black text-[#1f2d26] my-1">
                  $99<span className="text-xs font-normal text-[#64748b]">/mo</span>
                </div>
                <p className="text-[11px] text-[#475569] mb-3">Missed-call SMS textback, VIP Net-30 roofer portal &amp; fleet routing</p>
                <Link
                  href="/signup"
                  className="btn btn-secondary text-xs py-2 w-full justify-center"
                >
                  Choose Growth
                </Link>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((section) => (
              <React.Fragment key={section.category}>
                <tr className="bg-[#f1f5ee] border-y border-[#dde4d4]">
                  <td
                    colSpan={4}
                    className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#4a6344]"
                  >
                    {section.category}
                  </td>
                </tr>
                {section.features.map((feat, idx) => (
                  <tr
                    key={feat.name}
                    className={`border-b border-[#edf2e7] hover:bg-[#fafcf9] transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfdfb]'
                    }`}
                  >
                    <td className="px-5 py-3 text-xs md:text-sm font-semibold text-[#2d3a31]">
                      {feat.name}
                    </td>
                    <td className="px-3 py-3 text-center border-x border-[#edf2e7] bg-[#fefefe]">
                      {renderVal(feat.free, feat.bold, feat.highlight)}
                    </td>
                    <td className="px-3 py-3 text-center border-r border-[#edf2e7]">
                      {renderVal(feat.starter, feat.bold)}
                    </td>
                    <td className="px-3 py-3 text-center bg-[#fdfefe]">
                      {renderVal(feat.growth, feat.bold, feat.highlight, feat.growthHighlight)}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* 2. Mobile Smartphone View (Segmented Tab - Zero Horizontal Scroll) */}
      <div className="block md:hidden rounded-2xl border border-[#dde4d4] bg-white shadow-sm overflow-hidden p-4">
        {/* Plan Switcher Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#f1f5ee] rounded-xl mb-4">
          <button
            type="button"
            onClick={() => setMobilePlan('free')}
            className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all ${
              mobilePlan === 'free'
                ? 'bg-[#ea580c] text-white shadow-sm'
                : 'text-[#475569]'
            }`}
          >
            Free ($0)
          </button>
          <button
            type="button"
            onClick={() => setMobilePlan('starter')}
            className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all ${
              mobilePlan === 'starter'
                ? 'bg-[#1f2d26] text-white shadow-sm'
                : 'text-[#475569]'
            }`}
          >
            Starter ($29)
          </button>
          <button
            type="button"
            onClick={() => setMobilePlan('growth')}
            className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all ${
              mobilePlan === 'growth'
                ? 'bg-[#1f2d26] text-white shadow-sm'
                : 'text-[#475569]'
            }`}
          >
            Growth ($99)
          </button>
        </div>

        {/* Selected Plan Header Card */}
        <div className="p-4 rounded-xl border border-[#dde4d4] bg-[#f8faf6] text-center mb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-[#ea580c] mb-1">
            {mobilePlan === 'free'
              ? 'Most Popular · Free Plan'
              : mobilePlan === 'starter'
              ? 'Contractors · Starter Plan'
              : 'High Growth · Growth Fleet Plan'}
          </div>
          <div className="text-3xl font-black text-[#1f2d26]">
            {mobilePlan === 'free' ? '$0' : mobilePlan === 'starter' ? '$29' : '$99'}
            <span className="text-xs font-normal text-[#64748b]">/month</span>
          </div>
          <p className="text-xs text-[#64748b] my-2">
            {mobilePlan === 'free'
              ? 'Get bookings and revenue while you sleep'
              : mobilePlan === 'starter'
              ? 'Cash/check logging & two-way calendar sync'
              : 'Missed-call SMS textback, VIP Contractor Net-30 portal & multi-truck dispatch'}
          </p>
          <Link
            href="/signup"
            className={`btn w-full justify-center text-xs py-2.5 mt-2 ${
              mobilePlan === 'free' ? 'btn-orange' : 'btn-dark'
            }`}
          >
            {mobilePlan === 'free'
              ? 'Start Free in 3 Mins'
              : mobilePlan === 'starter'
              ? 'Choose Starter ($29/mo)'
              : 'Choose Growth ($99/mo)'}
          </Link>
        </div>

        {/* Mobile 2-Column Clean Table (Zero Horizontal Scroll) */}
        <table className="w-full text-left border-collapse table-auto">
          <colgroup>
            <col style={{ width: '56%' }} />
            <col style={{ width: '44%' }} />
          </colgroup>
          <tbody>
            {rows.map((section) => (
              <React.Fragment key={section.category}>
                <tr className="bg-[#f1f5ee] border-y border-[#dde4d4]">
                  <td
                    colSpan={2}
                    className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#4a6344]"
                  >
                    {section.category}
                  </td>
                </tr>
                {section.features.map((feat, idx) => {
                  const val =
                    mobilePlan === 'free'
                      ? feat.free
                      : mobilePlan === 'starter'
                      ? feat.starter
                      : feat.growth;
                  return (
                    <tr
                      key={feat.name}
                      className={`border-b border-[#edf2e7] ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfdfb]'
                      }`}
                    >
                      <td className="px-3 py-2.5 text-xs font-semibold text-[#2d3a31] break-words">
                        {feat.name}
                      </td>
                      <td className="px-2 py-2.5 text-center text-xs break-words">
                        {renderVal(
                          val,
                          feat.bold,
                          feat.highlight,
                          mobilePlan === 'growth' ? feat.growthHighlight : false
                        )}
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
