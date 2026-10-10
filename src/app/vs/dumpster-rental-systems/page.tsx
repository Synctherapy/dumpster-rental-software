import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, X, Shield, DollarSign, Smartphone, Truck, Box } from 'lucide-react';
import { Brand } from '@/components/brand';
import { SavingsCalculator } from '@/components/savings-calculator';

export const metadata = {
  title: 'RollOS vs Dumpster Rental Systems (DRS Review 2026) — Pricing & Features',
  description:
    'Compare RollOS vs Dumpster Rental Systems (DRS). Why pay $195–$280/mo with 20-can limits? RollOS gives you unlimited cans, $0/mo free plan, and SMS driver links.',
};

export default function DRSComparisonPage() {
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'RollOS vs Dumpster Rental Systems (DRS) Comparison',
    description:
      'In-depth operational and financial review comparing RollOS to Dumpster Rental Systems (DRS) for roll-off haulers.',
    url: 'https://rolloffdumpstersoftware.com/vs/dumpster-rental-systems',
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
          RollOS vs. Dumpster Rental Systems (DRS): Which software is right for your hauling business?
        </h1>

        <p className="text-lg text-[#556658] leading-relaxed mb-8 max-w-3xl">
          Dumpster Rental Systems (DRS) is an established software platform in the waste industry. However, DRS charges
          <strong>$195.95 to $279.95 every month</strong> and artificially caps your fleet size (the $195 plan only allows up to 20 containers).
          RollOS provides modern 24/7 online booking, visual dispatching, and SMS driver routing with <strong>unlimited containers</strong> on our $0/month Free and $29/month Starter plans.
        </p>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="p-6 bg-white border-2 border-[#ea580c] rounded-2xl shadow-sm relative">
            <div className="inline-block px-3 py-1 rounded-full bg-[#ffedd5] text-[#c2410c] text-xs font-bold mb-3">
              MODERN & UNLIMITED
            </div>
            <h3 className="text-xl font-bold text-[#1f2d26] mb-2">RollOS</h3>
            <p className="text-sm text-[#556658] mb-4 leading-relaxed">
              Built for independent roll-off haulers who want fast bookings without container caps or monthly overhead.
              Free at $0/month, Starter at $29/month. You keep 100% of your rental money and can scale as many containers as you own.
            </p>
            <ul className="space-y-2.5 text-sm text-[#334155]">
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#ea580c] flex-shrink-0" /> Free Plan ($0/mo) · Starter ($29/mo)
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#ea580c] flex-shrink-0" /> Unlimited containers (no fleet caps)
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#ea580c] flex-shrink-0" /> 1-tap SMS driver links (no app install)
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#ea580c] flex-shrink-0" /> Setup in 3 minutes on any website
              </li>
            </ul>
          </div>

          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm">
            <div className="inline-block px-3 py-1 rounded-full bg-[#f1f5f9] text-[#475569] text-xs font-bold mb-3">
              TIER-CAPPED LEGACY
            </div>
            <h3 className="text-xl font-bold text-[#1f2d26] mb-2">Dumpster Rental Systems (DRS)</h3>
            <p className="text-sm text-[#556658] mb-4 leading-relaxed">
              A dedicated dumpster tool that charges based on container volume tiers. To get basic routing features, you must pay $195.95/mo, which is strictly capped at 20 dumpsters. Once you buy your 21st dumpster, your price jumps to $279.95/mo.
            </p>
            <ul className="space-y-2.5 text-sm text-[#64748b]">
              <li className="flex items-center gap-2">
                <X size={16} className="text-[#dc2626] flex-shrink-0" /> $195.95 to $279.95 monthly base fee
              </li>
              <li className="flex items-center gap-2">
                <X size={16} className="text-[#dc2626] flex-shrink-0" /> 20-can limit on Standard Plan ($195.95/mo)
              </li>
              <li className="flex items-center gap-2">
                <X size={16} className="text-[#dc2626] flex-shrink-0" /> Launch Plan ($79.95/mo) has no routing
              </li>
              <li className="flex items-center gap-2">
                <X size={16} className="text-[#dc2626] flex-shrink-0" /> Expensive web design add-on packages
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
            Feature Breakdown: RollOS vs. DRS
          </h2>
          <div className="overflow-x-auto rounded-xl border border-[#dde4d4]">
            <table className="compare-table">
              <thead>
                <tr>
                  <th style={{ width: '35%' }}>Feature / Capability</th>
                  <th className="highlight-col text-[#1d2527]" style={{ width: '35%' }}>
                    RollOS
                  </th>
                  <th style={{ width: '30%' }}>Dumpster Rental Systems (DRS)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-semibold">Monthly Software Cost</td>
                  <td className="highlight-col text-[#2e7d32] font-bold">
                    $0 Free · $29 Starter
                  </td>
                  <td className="text-[#b54848] font-semibold">$195.95 – $279.95 / month</td>
                </tr>
                <tr>
                  <td className="font-semibold">Container Fleet Limits</td>
                  <td className="highlight-col text-[#2e7d32] font-bold">
                    Unlimited (No container caps)
                  </td>
                  <td className="text-[#b54848]">Capped at 20 cans on Standard ($195/mo)</td>
                </tr>
                <tr>
                  <td className="font-semibold">Driver Mobile Access</td>
                  <td className="highlight-col font-semibold">
                    SMS magic link (0 app install required)
                  </td>
                  <td>Driver mobile app</td>
                </tr>
                <tr>
                  <td className="font-semibold">Customer Online Booking Engine</td>
                  <td className="highlight-col font-semibold">
                    Included (Embed on any existing site)
                  </td>
                  <td>Included (DRS storefront)</td>
                </tr>
                <tr>
                  <td className="font-semibold">Setup Time</td>
                  <td className="highlight-col text-[#2e7d32] font-bold">
                    3 minutes self-serve
                  </td>
                  <td>Requires onboarding setup</td>
                </tr>
                <tr>
                  <td className="font-semibold">Hauler Rental Share</td>
                  <td className="highlight-col text-[#2e7d32] font-bold">
                    100% (Keep full rental price)
                  </td>
                  <td>100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Deep Dive: The Container Cap Trap */}
        <div className="p-8 bg-white border border-[#dde4d4] rounded-2xl shadow-sm mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Box className="text-[#ea580c]" size={24} />
            <h3 className="text-xl font-bold text-[#1f2d26]">
              The Container Cap Trap: Why You Shouldn't Pay More When You Buy Bins
            </h3>
          </div>
          <p className="text-sm text-[#475569] leading-relaxed mb-4">
            When you invest thousands of dollars in new roll-off containers to grow your fleet, the last thing you should face is a software price hike.
            Under DRS's pricing model:
          </p>
          <div className="p-4 bg-[#f8faf6] rounded-xl text-xs space-y-2 mb-4 text-[#334155]">
            <p>• If you own 18 dumpsters, you pay <strong>$195.95/month ($2,351/year)</strong>.</p>
            <p>• The moment you buy 3 more containers to take on a new roofing contractor, you cross 20 cans and your software bill jumps to <strong>$279.95/month ($3,359/year)</strong>.</p>
            <p>• With RollOS, you have <strong>zero container caps</strong>. You can run 5, 25, or 50 cans on our Free ($0/mo) or Starter ($29/mo) plans without ever paying a container penalty.</p>
          </div>
        </div>

        {/* Reverse Silo Link to Home */}
        <div className="p-8 bg-[#eef3e6] border border-[#d2dec3] rounded-2xl text-center my-8">
          <div className="eyebrow text-xs font-bold text-[#577242] uppercase tracking-wider mb-2">
            NO FLEET CAPS · KEEP 100% OF REVENUE
          </div>
          <h3 className="text-xl md:text-2xl font-extrabold text-[#1f2d26] mb-3">
            Ready to test RollOS alongside your current software?
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
