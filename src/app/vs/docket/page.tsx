import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, X, Shield, DollarSign, Smartphone, Zap, Truck, Star } from 'lucide-react';
import { Brand } from '@/components/brand';
import { SavingsCalculator } from '@/components/savings-calculator';

export const metadata = {
  title: 'RollOS vs Docket Dumpster Software (2026 In-Depth Review) — Pricing & Features',
  description:
    'Comprehensive comparison of RollOS vs Docket dumpster software. Compare hidden pricing vs $0/mo Free / $29 Starter, driver SMS links vs App Store apps, and online booking.',
};

export default function DocketComparisonPage() {
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'RollOS vs Docket Dumpster Rental Software Review & Comparison',
    description:
      'In-depth operational and financial comparison between RollOS and Docket for roll off dumpster rental haulers.',
    url: 'https://rolloffdumpstersoftware.com/vs/docket',
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
          <Link href="/templates/dumpster-rental-contract">Free Contract</Link>
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
          RollOS vs. Docket: Which roll off dumpster software is right for your hauling business?
        </h1>

        <p className="text-lg text-[#556658] leading-relaxed mb-8 max-w-3xl">
          Choosing between <strong>RollOS</strong> and <strong>Docket</strong> comes down to operational velocity and cost.
          Docket is an enterprise platform (part of ServiceCore) that requires scheduling sales demos, paying high recurring monthly subscriptions (~$299+/mo), and forcing drivers to download mobile apps from the App Store.
          RollOS is a high-speed, booking-first tool where setup takes 3 minutes, drivers use instant SMS links, and you keep 100% of your rental money.
        </p>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="p-6 bg-white border-2 border-[#ea580c] rounded-2xl shadow-sm relative">
            <div className="inline-block px-3 py-1 rounded-full bg-[#ffedd5] text-[#c2410c] text-xs font-bold mb-3">
              MODERN HAULER STACK
            </div>
            <h3 className="text-xl font-bold text-[#1f2d26] mb-2">RollOS</h3>
            <p className="text-sm text-[#556658] mb-4 leading-relaxed">
              Built specifically for independent roll-off haulers (1–15 trucks). Start free at $0/month, Starter at $29/month, or Growth at $149/month. Free plan includes 24/7 online booking and SMS driver links (customer pays a $12 reservation fee at checkout). You keep 100% of your rental revenue.
            </p>
            <ul className="space-y-2.5 text-sm text-[#334155]">
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#ea580c] flex-shrink-0" /> Free Plan ($0/mo) · Starter ($29/mo)
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#ea580c] flex-shrink-0" /> You keep 100% of dumpster rental fees
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#ea580c] flex-shrink-0" /> Driver SMS magic links (zero app store install)
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#ea580c] flex-shrink-0" /> 3-minute self-serve onboarding, zero sales calls
              </li>
            </ul>
          </div>

          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm">
            <div className="inline-block px-3 py-1 rounded-full bg-[#f1f5f9] text-[#475569] text-xs font-bold mb-3">
              LEGACY ENTERPRISE
            </div>
            <h3 className="text-xl font-bold text-[#1f2d26] mb-2">Docket</h3>
            <p className="text-sm text-[#556658] mb-4 leading-relaxed">
              An established waste management platform (now owned by ServiceCore). Geared toward larger fleets managing municipal trash routes and multi-division operations. Does not publish public pricing, requiring mandatory sales demos and long onboarding.
            </p>
            <ul className="space-y-2.5 text-sm text-[#64748b]">
              <li className="flex items-center gap-2">
                <X size={16} className="text-[#dc2626] flex-shrink-0" /> Estimated $250 – $350+ monthly base fee
              </li>
              <li className="flex items-center gap-2">
                <X size={16} className="text-[#dc2626] flex-shrink-0" /> Hauler absorbs 100% of software overhead
              </li>
              <li className="flex items-center gap-2">
                <X size={16} className="text-[#dc2626] flex-shrink-0" /> Mandatory App Store / Play Store driver downloads
              </li>
              <li className="flex items-center gap-2">
                <X size={16} className="text-[#dc2626] flex-shrink-0" /> Higher payment processing rates (~3.0% + 30¢)
              </li>
            </ul>
          </div>
        </div>

        {/* Interactive Savings Calculator Embedded */}
        <div className="my-12">
          <SavingsCalculator showTitle={true} />
        </div>

        {/* Comprehensive Head-to-Head Feature Matrix */}
        <div className="my-12">
          <h2 className="text-2xl font-bold text-[#1f2d26] mb-4">
            Feature & Pricing Breakdown: RollOS vs. Docket
          </h2>
          <div className="overflow-x-auto rounded-xl border border-[#dde4d4]">
            <table className="compare-table">
              <thead>
                <tr>
                  <th style={{ width: '35%' }}>Feature / Capability</th>
                  <th className="highlight-col text-[#1d2527]" style={{ width: '35%' }}>
                    RollOS
                  </th>
                  <th style={{ width: '30%' }}>Docket Software</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-semibold">Monthly Software Cost</td>
                  <td className="highlight-col text-[#2e7d32] font-bold">
                    $0 (Free) · $29 (Starter) · $149 (Growth)
                  </td>
                  <td className="text-[#b54848] font-semibold">~$299+ / mo (Quote-based)</td>
                </tr>
                <tr>
                  <td className="font-semibold">Setup & Onboarding Fees</td>
                  <td className="highlight-col text-[#2e7d32] font-bold">$0 (Self-serve)</td>
                  <td className="text-[#b54848]">$500 – $1,500 typical</td>
                </tr>
                <tr>
                  <td className="font-semibold">Hauler Rental Commission</td>
                  <td className="highlight-col text-[#2e7d32] font-bold">
                    0% (Keep 100% of rental price)
                  </td>
                  <td>0% (Fixed subscription)</td>
                </tr>
                <tr>
                  <td className="font-semibold">Customer Online Booking Engine</td>
                  <td className="highlight-col font-semibold">
                    Included (60s embeddable widget)
                  </td>
                  <td>DocketShop (Requires custom quote)</td>
                </tr>
                <tr>
                  <td className="font-semibold">Driver Mobile Access</td>
                  <td className="highlight-col font-semibold">
                    SMS magic link (0 app install required)
                  </td>
                  <td>Mandatory native mobile app download</td>
                </tr>
                <tr>
                  <td className="font-semibold">Driveway Photo Proof</td>
                  <td className="highlight-col font-semibold">
                    Instant photo capture attached to job
                  </td>
                  <td>Available inside mobile app</td>
                </tr>
                <tr>
                  <td className="font-semibold">Scale Landfill Ticket Support</td>
                  <td className="highlight-col font-semibold">
                    1-click photo upload & overage invoice
                  </td>
                  <td>Disposal module</td>
                </tr>
                <tr>
                  <td className="font-semibold">Setup Time</td>
                  <td className="highlight-col text-[#2e7d32] font-bold">
                    Under 3 minutes self-serve
                  </td>
                  <td>2–3 weeks with sales demo</td>
                </tr>
                <tr>
                  <td className="font-semibold">Contract Lock-In / Commitment</td>
                  <td className="highlight-col text-[#2e7d32] font-bold">
                    Zero lock-in. Cancel anytime.
                  </td>
                  <td>Annual commitments typical</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Deep Dive 1: Cost Math Comparison */}
        <div className="p-8 bg-white border border-[#dde4d4] rounded-2xl shadow-sm mb-10">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="text-[#ea580c]" size={24} />
            <h3 className="text-xl font-bold text-[#1f2d26]">
              The Real Cost Math: How RollOS Saves Haulers $3,500+ Every Year
            </h3>
          </div>
          <p className="text-sm text-[#475569] leading-relaxed mb-4">
            Consider an independent hauler running 2 roll-off trucks renting 30 dumpsters per month at an average rate of $450 per rental:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#f8faf6] rounded-xl text-xs mb-4">
            <div className="p-4 bg-white border border-[#e2ebd8] rounded-lg">
              <strong className="text-[#b54848] text-sm block mb-1">With Docket:</strong>
              <p className="text-[#64748b] leading-relaxed">
                Monthly subscription: ~$299/mo<br />
                Setup fee: $1,500<br />
                Annual software bill: <strong>$4,500 to $5,000/yr</strong><br />
                Money taken directly out of your operating margin.
              </p>
            </div>
            <div className="p-4 bg-white border border-[#cbe1b8] rounded-lg">
              <strong className="text-[#2e7d32] text-sm block mb-1">With RollOS Free / Starter:</strong>
              <p className="text-[#47603c] leading-relaxed">
                Monthly subscription: $0/mo (Free) or $29/mo (Starter)<br />
                Homeowner pays: $12 reservation fee at checkout<br />
                Hauler keeps: <strong>100% of the $450 rental ($13,500/mo)</strong><br />
                Annual software savings: <strong>$3,500 to $4,500+ back in your pocket</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Deep Dive 2: Driver App Friction */}
        <div className="p-8 bg-white border border-[#dde4d4] rounded-2xl shadow-sm mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Smartphone className="text-[#ea580c]" size={24} />
            <h3 className="text-xl font-bold text-[#1f2d26]">
              Driver Experience: Why SMS Magic Links Beat Native App Installs
            </h3>
          </div>
          <p className="text-sm text-[#475569] leading-relaxed mb-4">
            Every roll-off business owner knows the friction of getting drivers to install and use mobile apps:
          </p>
          <ul className="space-y-3 text-sm text-[#475569] mb-4">
            <li className="flex items-start gap-2">
              <X size={18} className="text-[#dc2626] flex-shrink-0 mt-0.5" />
              <span><strong>App Store Friction:</strong> Drivers have personal phones with forgotten Apple/Google passwords, full storage, or outdated operating systems that crash native apps.</span>
            </li>
            <li className="flex items-start gap-2">
              <X size={18} className="text-[#dc2626] flex-shrink-0 mt-0.5" />
              <span><strong>Relief Driver Headaches:</strong> When you hire a weekend relief driver or subcontractor, onboarding them to Docket requires app downloads, account creation, and passwords.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={18} className="text-[#ea580c] flex-shrink-0 mt-0.5" />
              <span><strong>The RollOS Advantage:</strong> RollOS sends a simple encrypted SMS web link. Drivers tap the text message. It opens in Safari or Chrome instantly. One tap launches GPS directions, snaps delivery photos, and records scale weights. Zero installation, zero logins, zero excuses.</span>
            </li>
          </ul>
        </div>

        {/* When to Choose Docket vs RollOS */}
        <div className="p-8 bg-[#1f2621] text-white rounded-2xl mb-12">
          <h2 className="text-2xl font-bold mb-4">The Verdict: When to Choose RollOS vs Docket</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[#cbd5cc] leading-relaxed">
            <div>
              <strong className="text-white text-base block mb-2">Choose Docket if:</strong>
              <ul className="space-y-2 list-disc pl-4">
                <li>You manage large municipal commercial trash contracts alongside roll-off cans.</li>
                <li>You need AI route optimization (IronRouteAI) across 20+ municipal collection trucks.</li>
                <li>You don’t mind paying $300+/month and undergoing scheduled onboarding calls.</li>
              </ul>
            </div>
            <div>
              <strong className="text-[#ea580c] text-base block mb-2">Choose RollOS if:</strong>
              <ul className="space-y-2 list-disc pl-4 text-white">
                <li>You are an independent roll-off hauler running 1–15 trucks.</li>
                <li>You want to get dumpster bookings and revenue while you sleep with a 24/7 website widget.</li>
                <li>You want to keep 100% of your rental money and stop paying bloated software bills.</li>
                <li>You want drivers to use fast SMS links with zero app downloads or login headaches.</li>
                <li>You want to be up and running today in 3 minutes without a sales demo.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reverse Silo Link to Home */}
        <div className="p-8 bg-[#eef3e6] border border-[#d2dec3] rounded-2xl text-center my-8">
          <div className="eyebrow text-xs font-bold text-[#577242] uppercase tracking-wider mb-2">
            EXPERIENCE THE ROLLOS DIFFERENCE
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
