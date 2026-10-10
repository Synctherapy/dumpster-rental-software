'use client';

import React from 'react';
import Link from 'next/link';
import { Check, X, ArrowRight, Sparkles } from 'lucide-react';

interface FeatureItem {
  name: string;
  free: string | boolean;
  starter: string | boolean;
  growth: string | boolean;
  bold?: boolean;
  highlight?: boolean;
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
          starter: 'Option to disable or absorb',
          growth: 'Option to disable or absorb',
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
          name: 'Drag-and-Drop Dispatch Kanban Board',
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
          name: 'Offline Cash & Check Order Recording',
          free: false,
          starter: true,
          growth: true,
        },
        {
          name: '2-Way Google Calendar & Apple iCal Sync Feed',
          free: false,
          starter: true,
          growth: true,
        },
        {
          name: 'Multi-Truck Fleet Scheduling & Team Management',
          free: 'Single Fleet View',
          starter: 'Multi-Truck Filter',
          growth: 'Dedicated Multi-Fleet Dispatch',
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
      category: 'Contract & Commitments',
      features: [
        {
          name: 'Monthly Software Price',
          free: '$0 / month',
          starter: '$29 / month',
          growth: '$149 / month',
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
      ],
    },
  ];

  const renderVal = (val: boolean | string, bold?: boolean, highlight?: boolean) => {
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
          highlight ? 'text-[#166534] font-bold bg-[#f0fdf4] px-2 py-0.5 rounded' : ''
        }`}
      >
        {val}
      </span>
    );
  };

  return (
    <div className="w-full my-8">
      {/* Plan Header Cards on Desktop */}
      <div className="overflow-x-auto rounded-2xl border border-[#dde4d4] bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#dde4d4] bg-[#f8faf6]">
              <th className="p-4 md:p-6 text-sm md:text-base font-bold text-[#1f2d26] w-[34%]">
                Plan Overview
              </th>
              <th className="p-4 md:p-6 text-center w-[22%] bg-white border-x border-[#dde4d4] relative">
                <div className="text-xs font-bold uppercase tracking-wider text-[#ea580c] mb-1">
                  Most Popular
                </div>
                <div className="text-lg md:text-xl font-extrabold text-[#1f2d26]">Free Plan</div>
                <div className="text-2xl md:text-3xl font-black text-[#1f2d26] my-1">
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
              <th className="p-4 md:p-6 text-center w-[22%] border-r border-[#dde4d4]">
                <div className="text-xs font-bold uppercase tracking-wider text-[#64748b] mb-1">
                  Contractors
                </div>
                <div className="text-lg md:text-xl font-extrabold text-[#1f2d26]">Starter Plan</div>
                <div className="text-2xl md:text-3xl font-black text-[#1f2d26] my-1">
                  $29<span className="text-xs font-normal text-[#64748b]">/mo</span>
                </div>
                <p className="text-[11px] text-[#64748b] mb-3">Cash/check & calendar sync</p>
                <Link
                  href="/signup"
                  className="btn btn-dark text-xs py-2 w-full justify-center"
                >
                  Choose Starter
                </Link>
              </th>
              <th className="p-4 md:p-6 text-center w-[22%]">
                <div className="text-xs font-bold uppercase tracking-wider text-[#64748b] mb-1">
                  Fleets
                </div>
                <div className="text-lg md:text-xl font-extrabold text-[#1f2d26]">Growth Fleet</div>
                <div className="text-2xl md:text-3xl font-black text-[#1f2d26] my-1">
                  $149<span className="text-xs font-normal text-[#64748b]">/mo</span>
                </div>
                <p className="text-[11px] text-[#64748b] mb-3">Multi-truck operations</p>
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
                    className="px-4 md:px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#4a6344]"
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
                    <td className="px-4 md:px-6 py-3.5 text-xs md:text-sm font-semibold text-[#2d3a31]">
                      {feat.name}
                    </td>
                    <td className="px-3 md:px-4 py-3.5 text-center border-x border-[#edf2e7] bg-[#fefefe]">
                      {renderVal(feat.free, feat.bold, feat.highlight)}
                    </td>
                    <td className="px-3 md:px-4 py-3.5 text-center border-r border-[#edf2e7]">
                      {renderVal(feat.starter, feat.bold)}
                    </td>
                    <td className="px-3 md:px-4 py-3.5 text-center">
                      {renderVal(feat.growth, feat.bold)}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
