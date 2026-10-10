import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, X, Shield, DollarSign, Smartphone, Truck } from 'lucide-react';
import { Brand } from '@/components/brand';
import { SavingsCalculator } from '@/components/savings-calculator';

export const metadata = {
  title: 'RollOS vs ServiceCore (2026 Comparison) — Dumpster Software Review',
  description:
    'Compare RollOS vs ServiceCore for dumpster rentals. Why pay per-truck fees for bloated septic software? RollOS offers dedicated roll-off tools from $0/month.',
};

export default function ServiceCoreComparisonPage() {
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'RollOS vs ServiceCore Dumpster Software Comparison',
    description:
      'In-depth comparison between RollOS and ServiceCore for roll off dumpster rental businesses.',
    url: 'https://rolloffdumpstersoftware.com/vs/servicecore',
  };

  return (
    <main className="marketing">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <nav className="marketing-nav">
        <Brand />
        <div className="marketing-links">
          <Link href="/">Home</Link>
          <Link href="/uses/dumpster-booking-system">Online Booking</Link>
          <Link href="/uses/roll-off-dispatch-software">Dispatch Board</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/calculator">Savings Calculator</Link>
          <Link href="/signup" className="btn btn-orange">
            Try Free Demo <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#687864] hover:text-[#ea580c] transition-colors"
          >
            <ArrowLeft size={14} /> Back to Roll Off Dumpster Software
          </Link>
        </div>

        <div className="eyebrow" style={{ color: '#82956d', marginBottom: 12 }}>
          IN-DEPTH SOFTWARE REVIEW & COMPARISON · 2026 EDITION
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#20302a] leading-tight mb-6">
          RollOS vs. ServiceCore: Which software is right for your dumpster hauling fleet?
        </h1>

        <p className="text-lg text-[#556658] leading-relaxed mb-8 max-w-3xl">
          ServiceCore is a multi-industry platform built primarily for portable restroom (porta-potty) sanitation and septic pumping companies,
          with roll-off dumpsters as an added module. Because of this, ServiceCore charges on a <strong>per-truck pricing model</strong> that can cost
          <strong>$350 to $700+ every month</strong> as you add trucks.
          RollOS is 100% focused on roll-off dumpster rentals—giving you 24/7 online booking, visual dispatching, and SMS driver links without bloated septic menus or per-truck penalties.
        </p>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="p-6 bg-white border-2 border-[#ea580c] rounded-2xl shadow-sm relative">
            <div className="inline-block px-3 py-1 rounded-full bg-[#ffedd5] text-[#c2410c] text-xs font-bold mb-3">
              100% ROLL-OFF FOCUSED
            </div>
            <h3 className="text-xl font-bold text-[#1f2d26] mb-2">RollOS</h3>
            <p className="text-sm text-[#556658] mb-4 leading-relaxed">
              Designed exclusively for roll-off dumpster businesses. Simple, clean, and fast. No per-truck fee penalties.
              Free at $0/month, Starter at $29/month. Setup takes 3 minutes self-serve without scheduling sales demos.
            </p>
            <ul className="space-y-2.5 text-sm text-[#334155]">
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#ea580c] flex-shrink-0" /> Free Plan ($0/mo) · Starter ($29/mo)
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#ea580c] flex-shrink-0" /> No per-truck software fees
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#ea580c] flex-shrink-0" /> 100% dumpster-specific workflow & scale tickets
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#ea580c] flex-shrink-0" /> Instant SMS links (no driver app downloads)
              </li>
            </ul>
          </div>

          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm">
            <div className="inline-block px-3 py-1 rounded-full bg-[#f1f5f9] text-[#475569] text-xs font-bold mb-3">
              PORTA-POTTY & SEPTIC ERP
            </div>
            <h3 className="text-xl font-bold text-[#1f2d26] mb-2">ServiceCore</h3>
            <p className="text-sm text-[#556658] mb-4 leading-relaxed">
              An enterprise ERP designed for liquid waste, septic pumpers, and portable toilet rental companies. Subscription pricing scales on a per-truck basis with custom quotes, mandatory onboarding calls, and complex multi-service menus.
            </p>
            <ul className="space-y-2.5 text-sm text-[#64748b]">
              <li className="flex items-center gap-2">
                <X size={16} className="text-[#dc2626] flex-shrink-0" /> Per-truck pricing scales costs rapidly ($300–$700+/mo)
              </li>
              <li className="flex items-center gap-2">
                <X size={16} className="text-[#dc2626] flex-shrink-0" /> Unnecessary features (septic logs, porta-potty cleaning)
              </li>
              <li className="flex items-center gap-2">
                <X size={16} className="text-[#dc2626] flex-shrink-0" /> Quote-based pricing requiring sales calls
              </li>
              <li className="flex items-center gap-2">
                <X size={16} className="text-[#dc2626] flex-shrink-0" /> Steep learning curve for office staff and drivers
              </li>
            </ul>
          </div>
        </div>

        {/* Embedded Calculator */}
        <div className="my-12">
          <SavingsCalculator showTitle={true} />
        </div>

        {/* Feature Comparison Table */}
        <div className="my-12">
          <h2 className="text-2xl font-bold text-[#1f2d26] mb-4">
            Feature Breakdown: RollOS vs. ServiceCore
          </h2>
          <div className="overflow-x-auto rounded-xl border border-[#dde4d4]">
            <table className="compare-table">
              <thead>
                <tr>
                  <th style={{ width: '35%' }}>Feature / Capability</th>
                  <th className="highlight-col text-[#1d2527]" style={{ width: '35%' }}>
                    RollOS
                  </th>
                  <th style={{ width: '30%' }}>ServiceCore</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-semibold">Pricing Model</td>
                  <td className="highlight-col text-[#2e7d32] font-bold">
                    $0 Free · $29 Starter (Flat rate)
                  </td>
                  <td className="text-[#b54848] font-semibold">Per-Truck Pricing ($350–$700+/mo)</td>
                </tr>
                <tr>
                  <td className="font-semibold">Setup & Onboarding Fees</td>
                  <td className="highlight-col text-[#2e7d32] font-bold">$0 (Self-serve)</td>
                  <td className="text-[#b54848]">$1,000 – $2,000 typical</td>
                </tr>
                <tr>
                  <td className="font-semibold">Primary Industry Focus</td>
                  <td className="highlight-col text-[#2e7d32] font-bold">
                    100% Roll-Off Dumpsters
                  </td>
                  <td>Porta-Potties, Septic, & Roll-Off</td>
                </tr>
                <tr>
                  <td className="font-semibold">Driver Mobile Access</td>
                  <td className="highlight-col font-semibold">
                    SMS magic link (0 app install required)
                  </td>
                  <td>ServiceCore mobile app</td>
                </tr>
                <tr>
                  <td className="font-semibold">Setup Time</td>
                  <td className="highlight-col text-[#2e7d32] font-bold">
                    3 minutes self-serve
                  </td>
                  <td>Several weeks of training calls</td>
                </tr>
                <tr>
                  <td className="font-semibold">Customer Online Booking Engine</td>
                  <td className="highlight-col font-semibold">
                    Included (60s self-checkout widget)
                  </td>
                  <td>Available as separate portal module</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Reverse Silo Link to Home */}
        <div className="p-8 bg-[#eef3e6] border border-[#d2dec3] rounded-2xl text-center my-8">
          <div className="eyebrow text-xs font-bold text-[#577242] uppercase tracking-wider mb-2">
            NO PER-TRUCK FEES · 100% DUMPSTER FOCUS
          </div>
          <h3 className="text-xl md:text-2xl font-extrabold text-[#1f2d26] mb-3">
            Ready to test RollOS alongside your current dispatch system?
          </h3>
          <p className="text-sm text-[#556658] max-w-xl mx-auto mb-6 leading-relaxed">
            Test the live dispatch board, driver SMS links, and 24/7 online booking engine today. No credit card required.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/" className="btn btn-orange">
              Explore Roll Off Dumpster Software <ArrowRight size={14} />
            </Link>
            <Link href="/signup" className="btn btn-secondary">
              Start Free Demo
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
