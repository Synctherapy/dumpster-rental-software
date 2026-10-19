import Link from 'next/link';
import { ArrowRight, Check, X, DollarSign, Smartphone } from 'lucide-react';
import { MarketingNav } from '@/components/marketing-nav';
import { SemanticBreadcrumb } from '@/components/semantic-breadcrumb';
import { SavingsCalculator } from '@/components/savings-calculator';
import { Footer } from '@/components/footer';

export const metadata = {
  title: 'Bin Boss Software vs RollOS: 2026 Pricing & Alternatives Review',
  description:
    'Researching Bin Boss software? Compare Bin Boss pricing ($99/mo), core features, and top Bin Boss alternatives for 1 to 25+ truck roll-off fleets.',
  alternates: {
    canonical: 'https://rolloffdumpstersoftware.com/vs/bin-boss',
  },
};

export default function BinBossComparisonPage() {
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://rolloffdumpstersoftware.com/vs/bin-boss#webpage',
        url: 'https://rolloffdumpstersoftware.com/vs/bin-boss',
        name: 'Bin Boss Software vs RollOS: 2026 Roll-Off Comparison',
        description:
          'Comprehensive head-to-head operational analysis comparing Bin Boss software and RollOS for roll-off dumpster rental businesses.',
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://rolloffdumpstersoftware.com/vs/bin-boss#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What does Bin Boss software cost per month?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Bin Boss software charges a flat rate of $99 per month with no setup fees or contracts. An optional hosted website add-on costs an extra $40 per month.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does Bin Boss require long-term contracts or onboarding fees?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. Bin Boss operates on a month-to-month subscription with zero onboarding fees. Similarly, RollOS offers a $0/month Free tier and month-to-month agility with no long-term contracts.',
            },
          },
          {
            '@type': 'Question',
            name: 'What are the best Bin Boss alternatives for roll-off haulers?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'RollOS is the leading Bin Boss alternative for independent haulers running 1 to 25+ trucks. RollOS delivers automated scale ticket capture, instant customer credit card overage billing, driver SMS magic links with zero app store downloads, and a $0/mo Free tier.',
            },
          },
          {
            '@type': 'Question',
            name: 'How does Bin Boss manage container yard inventory?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Bin Boss provides drag-and-drop scheduling and tracks whether 10, 20, 30, or 40-yard containers are in the yard or on customer job sites. However, it lacks advanced multi-zone route density grouping and automated contractor Net-30 statements.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does Bin Boss automate landfill overage and tonnage invoicing?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Bin Boss supports recording disposal notes, but invoicing for overweight scale tickets requires manual calculation and manual card charges. RollOS automates this by allowing drivers to snap a scale ticket photo that instantly reconciles the weight threshold and bills the card on file.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can drivers access routes without installing app store software?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. Bin Boss requires drivers to download and install a native companion app from the App Store or Google Play. RollOS uses instant SMS magic links that open directly in mobile browsers with turn-by-turn navigation and zero app store logins.',
            },
          },
        ],
      },
    ],
  };

  return (
    <main className="marketing">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <MarketingNav currentPath="/vs" />

      <div className="max-w-5xl mx-auto px-6 py-12">
        <SemanticBreadcrumb
          items={[
            { name: 'Home', item: '/' },
            { name: 'Comparisons', item: '/vs' },
            { name: 'RollOS vs Bin Boss', item: '/vs/bin-boss' },
          ]}
        />

        <div className="eyebrow" style={{ color: '#82956d', marginBottom: 12 }}>
          IN-DEPTH SOFTWARE REVIEW & COMPARISON · 2026 EDITION
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#20302a] leading-tight mb-6">
          Bin Boss Software vs RollOS: 2026 Roll-Off Comparison
        </h1>

        <p className="text-lg text-[#556658] leading-relaxed mb-8 max-w-3xl">
          <strong>Bin Boss software</strong> provides a $99/month flat-rate dumpster tool, yet growing haulers managing 1 to 25+ trucks frequently switch to{' '}
          <Link
            href="/"
            className="text-[#1f2d26] font-semibold underline decoration-[#ea580c] underline-offset-2 hover:text-[#ea580c]"
          >
            RollOS
          </Link>{' '}
          for automated tonnage billing and zero-app driver dispatch. While Bin Boss was built by a roll-off operator (Pack Mule Dumpsters) for basic job scheduling, RollOS delivers a complete automated booking, dispatch, and scale ticket billing infrastructure without requiring drivers to install mobile apps.
        </p>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="p-6 bg-white border-2 border-[#ea580c] rounded-2xl shadow-sm relative">
            <div className="inline-block px-3 py-1 rounded-full bg-[#ffedd5] text-[#c2410c] text-xs font-bold mb-3">
              CLOUD AUTOMATION ARCHITECTURE
            </div>
            <h3 className="text-xl font-bold text-[#1f2d26] mb-2">RollOS</h3>
            <p className="text-sm text-[#556658] mb-4 leading-relaxed">
              Engineered specifically for 1 to 25+ truck roll-off haulers. Start on our $0/month Free plan ($12 customer reservation checkout fee, 0% hauler commission, 1-click absorb toggle), Starter ($29/mo), or Growth ($149/mo). Eliminates driver app friction with 1-tap SMS web links and automates scale ticket overage invoicing.
            </p>
            <ul className="space-y-2.5 text-sm text-[#334155]">
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#ea580c] flex-shrink-0" /> Free Plan ($0/mo) · Starter ($29/mo) · Growth ($149/mo)
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#ea580c] flex-shrink-0" /> Instant driver SMS magic links (zero App Store friction)
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#ea580c] flex-shrink-0" /> Automated scale ticket capture & instant overage billing
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#ea580c] flex-shrink-0" /> 24/7 online customer booking engine included
              </li>
            </ul>
          </div>

          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm">
            <div className="inline-block px-3 py-1 rounded-full bg-[#f1f5f9] text-[#475569] text-xs font-bold mb-3">
              OPERATOR-BUILT FLAT RATE
            </div>
            <h3 className="text-xl font-bold text-[#1f2d26] mb-2">Bin Boss (binboss.co)</h3>
            <p className="text-sm text-[#556658] mb-4 leading-relaxed">
              An accessible, $99/month flat-rate platform built by the founder of Pack Mule Dumpsters. Offers visual scheduling, basic yard tracking, and an embeddable website form, but lacks multi-zone route clustering and relies on native app store downloads.
            </p>
            <ul className="space-y-2.5 text-sm text-[#64748b]">
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#ea580c] flex-shrink-0" /> Flat $99/month pricing with no setup fee
              </li>
              <li className="flex items-center gap-2">
                <X size={16} className="text-[#dc2626] flex-shrink-0" /> Mandatory mobile app downloads for drivers
              </li>
              <li className="flex items-center gap-2">
                <X size={16} className="text-[#dc2626] flex-shrink-0" /> Manual scale overage calculations and card charging
              </li>
              <li className="flex items-center gap-2">
                <X size={16} className="text-[#dc2626] flex-shrink-0" /> Website integration costs an additional $40/month
              </li>
            </ul>
          </div>
        </div>

        {/* Interactive Savings Calculator */}
        <div className="my-12">
          <SavingsCalculator showTitle={true} />
        </div>

        {/* Kyle Roof Group B: H2 Section 1 */}
        <div className="my-12">
          <h2 className="text-2xl font-bold text-[#1f2d26] mb-4">
            Bin Boss Software Overview: Features, Usability & Hauler Feedback
          </h2>
          <p className="text-sm text-[#475569] leading-relaxed mb-6">
            For haulers researching <strong>bin boss software</strong>, the platform delivers clear advantages over manual pen-and-paper tracking. Designed specifically for smaller roll-off operations, it combines a color-coded calendar dispatch board with serialized container tracking for 10-yard, 15-yard, 20-yard, 30-yard, and 40-yard containers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-white border border-[#dde4d4] rounded-xl shadow-sm">
              <h4 className="font-bold text-[#1f2d26] text-sm mb-1">Color-Coded Dispatch Board</h4>
              <p className="text-xs text-[#556658] leading-relaxed">
                Simple calendar view showing scheduled deliveries, pickups, and swaps across your drivers and roll-off trucks.
              </p>
            </div>
            <div className="p-4 bg-white border border-[#dde4d4] rounded-xl shadow-sm">
              <h4 className="font-bold text-[#1f2d26] text-sm mb-1">Yard & Job Site Inventory</h4>
              <p className="text-xs text-[#556658] leading-relaxed">
                Shows which dumpster bins are currently placed at customer addresses versus staged in the yard ready for drop-off.
              </p>
            </div>
            <div className="p-4 bg-white border border-[#dde4d4] rounded-xl shadow-sm">
              <h4 className="font-bold text-[#1f2d26] text-sm mb-1">Online Booking Form</h4>
              <p className="text-xs text-[#556658] leading-relaxed">
                Captures customer rental requests online, with an optional $40/month managed website package for haulers without an existing site.
              </p>
            </div>
          </div>
        </div>

        {/* Kyle Roof Group B: H2 Section 2 & Feature Table */}
        <div className="my-12">
          <h2 className="text-2xl font-bold text-[#1f2d26] mb-4">
            Bin Boss Pricing vs RollOS: Total Cost of Ownership Compared
          </h2>
          <p className="text-sm text-[#475569] leading-relaxed mb-6">
            Understanding <strong>bin boss pricing</strong> against RollOS shows how different pricing architectures impact your annual margins as your fleet scales:
          </p>
          <div className="overflow-x-auto rounded-xl border border-[#dde4d4]">
            <table className="compare-table">
              <thead>
                <tr>
                  <th style={{ width: '35%' }}>Feature / Operational Capability</th>
                  <th className="highlight-col text-[#1d2527]" style={{ width: '35%' }}>
                    RollOS
                  </th>
                  <th style={{ width: '30%' }}>Bin Boss Software</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-semibold">Monthly Software Cost</td>
                  <td className="highlight-col text-[#2e7d32] font-bold">
                    $0 (Free) · $29 (Starter) · $149 (Growth)
                  </td>
                  <td className="font-semibold text-[#1f2d26]">$99 / month flat rate</td>
                </tr>
                <tr>
                  <td className="font-semibold">Setup & Onboarding Fees</td>
                  <td className="highlight-col text-[#2e7d32] font-bold">$0 (Instant 3-min setup)</td>
                  <td className="text-[#2e7d32] font-bold">$0</td>
                </tr>
                <tr>
                  <td className="font-semibold">Website Add-On Fee</td>
                  <td className="highlight-col text-[#2e7d32] font-bold">
                    $0 (Free embeddable booking widget)
                  </td>
                  <td className="text-[#b54848] font-semibold">+$40 / month ($480/yr)</td>
                </tr>
                <tr>
                  <td className="font-semibold">Driver Mobile Experience</td>
                  <td className="highlight-col font-semibold text-[#2e7d32]">
                    1-Tap SMS Magic Links (0 app install)
                  </td>
                  <td>Native App Store / Play Store app</td>
                </tr>
                <tr>
                  <td className="font-semibold">Landfill Scale Ticket Capture</td>
                  <td className="highlight-col font-semibold text-[#2e7d32]">
                    Instant photo capture + automated card overage bill
                  </td>
                  <td>Manual weight logging & manual card charges</td>
                </tr>
                <tr>
                  <td className="font-semibold">Driver Route Dispatch</td>
                  <td className="highlight-col font-semibold">
                    Live GPS navigation via Apple/Google Maps
                  </td>
                  <td>Turn-by-turn inside companion app</td>
                </tr>
                <tr>
                  <td className="font-semibold">Commercial Contractor Accounts</td>
                  <td className="highlight-col font-semibold">
                    Net-30 invoicing & contractor billing portal
                  </td>
                  <td>Basic customer contact records</td>
                </tr>
                <tr>
                  <td className="font-semibold">Contract Lock-In</td>
                  <td className="highlight-col text-[#2e7d32] font-bold">
                    Cancel anytime. 0 long-term lock-in.
                  </td>
                  <td>Month-to-month. Cancel anytime.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Kyle Roof Group B: H2 Section 3 */}
        <div className="p-8 bg-white border border-[#dde4d4] rounded-2xl shadow-sm mb-10">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="text-[#ea580c]" size={24} />
            <h2 className="text-xl font-bold text-[#1f2d26]">
              Top Bin Boss Alternatives for Growing Waste Operations
            </h2>
          </div>
          <p className="text-sm text-[#475569] leading-relaxed mb-4">
            When operators search for <strong>bin boss alternatives</strong>, they usually hit a ceiling where manual data entry cuts into dispatch efficiency. RollOS provides three distinct operational advantages:
          </p>
          <ul className="space-y-3 text-sm text-[#475569] mb-4">
            <li className="flex items-start gap-2">
              <Check size={18} className="text-[#ea580c] flex-shrink-0 mt-0.5" />
              <span><strong>Automated Tonnage Overage Collection:</strong> In Bin Boss, when a customer exceeds their included 2-ton or 3-ton limit, the dispatcher must manually retrieve the weight slip, calculate the excess weight ($85–$120/ton), and run the card. In RollOS, the driver snaps the scale ticket photo at the landfill, and the system automatically calculates the overage, emails the receipt, and charges the credit card on file.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={18} className="text-[#ea580c] flex-shrink-0 mt-0.5" />
              <span><strong>Zero Software Overhead for Starting Haulers:</strong> On the RollOS Free tier, haulers pay $0/month. The $12 checkout reservation fee is covered by the customer, and the hauler keeps 100% of the rental fee. Haulers can also absorb the $12 fee with a single click.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={18} className="text-[#ea580c] flex-shrink-0 mt-0.5" />
              <span><strong>Commercial Contractor Accounts:</strong> Unlike simple residential forms, RollOS supports commercial accounts with customizable rental agreements, driveway damage waivers, concrete washout rules, and Net-30 statements.</span>
            </li>
          </ul>
        </div>

        {/* Kyle Roof Group B: H2 Section 4 */}
        <div className="p-8 bg-white border border-[#dde4d4] rounded-2xl shadow-sm mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Smartphone className="text-[#ea580c]" size={24} />
            <h2 className="text-xl font-bold text-[#1f2d26]">
              Dispatch, Routing & Driver Workflows: Bin Boss vs RollOS
            </h2>
          </div>
          <p className="text-sm text-[#475569] leading-relaxed mb-4">
            The driver experience determines whether dispatch data stays updated in real time. Comparing driver workflows reveals why SMS links outperform native app downloads:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#f8faf6] rounded-xl text-xs mb-4">
            <div className="p-4 bg-white border border-[#e2ebd8] rounded-lg">
              <strong className="text-[#1f2d26] text-sm block mb-1">Bin Boss Native App:</strong>
              <p className="text-[#64748b] leading-relaxed">
                Drivers must download the app from Google Play or Apple App Store. Requires driver account creation, credential logins, and periodic app store updates. Relief and weekend drivers often lack the app on their personal phones.
              </p>
            </div>
            <div className="p-4 bg-white border border-[#cbe1b8] rounded-lg">
              <strong className="text-[#2e7d32] text-sm block mb-1">RollOS SMS Magic Link:</strong>
              <p className="text-[#47603c] leading-relaxed">
                Dispatch texts an encrypted web link directly to the driver&apos;s phone. Opens instantly in Safari or Chrome. One tap triggers Google Maps or Apple Maps directions, snaps drop-off photo proof, and attaches scale tickets. Zero downloads, zero logins.
              </p>
            </div>
          </div>
        </div>

        {/* When to Choose Verdict */}
        <div className="p-8 bg-[#1f2621] text-white rounded-2xl mb-12">
          <h2 className="text-2xl font-bold mb-4">The Verdict: When to Choose RollOS vs Bin Boss</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[#cbd5cc] leading-relaxed">
            <div>
              <strong className="text-white text-base block mb-2">Choose Bin Boss if:</strong>
              <ul className="space-y-2 list-disc pl-4">
                <li>You run 1–2 trucks and prefer an operator-built tool with a simple flat $99/mo price.</li>
                <li>You don&apos;t need automated scale ticket capture or automatic overweight card billing.</li>
                <li>Your drivers are comfortable downloading and updating native mobile apps.</li>
              </ul>
            </div>
            <div>
              <strong className="text-[#ea580c] text-base block mb-2">Choose RollOS if:</strong>
              <ul className="space-y-2 list-disc pl-4 text-white">
                <li>You manage 1 to 25+ roll-off trucks and want complete dispatch automation.</li>
                <li>You want to eliminate app store friction using instant 1-tap SMS driver magic links.</li>
                <li>You want automated landfill scale ticket photo capture with instant card-on-file overage billing.</li>
                <li>You want a free 24/7 online customer booking widget without paying a $40/mo website add-on.</li>
                <li>You want flexible plans ($0 Free, $29 Starter, or $149 Growth) to maximize your operating cash flow.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Kyle Roof Group C: 6 H3 FAQs */}
        <div className="p-8 bg-white border border-[#dde4d4] rounded-2xl shadow-sm mb-12">
          <h2 className="text-2xl font-bold text-[#1f2d26] mb-6">
            Frequently Asked Questions: Bin Boss Software
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#1f2d26] mb-2">
                What does Bin Boss software cost per month?
              </h3>
              <p className="text-sm text-[#556658] leading-relaxed">
                Bin Boss software charges a flat rate of $99 per month for unlimited users. An optional hosted website add-on costs $40 per month ($139/month total).
              </p>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1f2d26] mb-2">
                Does Bin Boss require long-term contracts or onboarding fees?
              </h3>
              <p className="text-sm text-[#556658] leading-relaxed">
                No. Bin Boss does not charge setup fees and operates on a month-to-month subscription. RollOS also features month-to-month flexibility with a $0/month Free tier and a 14-day free trial on the $29/mo Starter tier.
              </p>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1f2d26] mb-2">
                What are the best Bin Boss alternatives for roll-off haulers?
              </h3>
              <p className="text-sm text-[#556658] leading-relaxed">
                RollOS is the top-rated Bin Boss alternative for roll-off haulers running 1 to 25+ trucks. RollOS offers zero-install driver SMS magic links, automated scale overage billing, and embeddable online booking.
              </p>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1f2d26] mb-2">
                How does Bin Boss manage container yard inventory?
              </h3>
              <p className="text-sm text-[#556658] leading-relaxed">
                Bin Boss uses a visual calendar and inventory status board showing assigned dumpsters on customer job sites versus available roll-off bins in your staging yard.
              </p>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1f2d26] mb-2">
                Does Bin Boss automate landfill overage and tonnage invoicing?
              </h3>
              <p className="text-sm text-[#556658] leading-relaxed">
                No. Bin Boss allows haulers to record disposal notes, but dispatchers must calculate excess tonnage and execute card transactions manually. RollOS automates this with scale ticket photo uploads that calculate and bill overages instantly.
              </p>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1f2d26] mb-2">
                Can drivers access routes without installing app store software?
              </h3>
              <p className="text-sm text-[#556658] leading-relaxed">
                No. Bin Boss requires drivers to install an app from Google Play or the iOS App Store. RollOS eliminates this requirement by sending drivers an instant SMS web link that opens directly in mobile Safari or Chrome.
              </p>
            </div>
          </div>
        </div>

        {/* Kyle Roof Spoke-to-Spoke Comparison Silo */}
        <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl mb-8 shadow-sm">
          <h3 className="text-base font-bold text-[#1f2d26] mb-3">
            Compare Other Roll-Off Dumpster Rental Software Alternatives
          </h3>
          <p className="text-xs text-[#556658] mb-4 leading-relaxed">
            Evaluating multiple platforms? Explore our side-by-side operational reviews against other major waste and dumpster software providers:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <Link
              href="/vs/docket"
              className="p-3 rounded-xl border border-[#dde4d4] hover:border-[#ea580c] hover:bg-[#fff7ed] transition-all font-semibold text-[#1f2d26] flex items-center justify-between"
            >
              <span>RollOS vs. Docket</span>
              <ArrowRight size={13} className="text-[#ea580c] shrink-0" />
            </Link>
            <Link
              href="/vs/icans"
              className="p-3 rounded-xl border border-[#dde4d4] hover:border-[#ea580c] hover:bg-[#fff7ed] transition-all font-semibold text-[#1f2d26] flex items-center justify-between"
            >
              <span>RollOS vs. iCans</span>
              <ArrowRight size={13} className="text-[#ea580c] shrink-0" />
            </Link>
            <Link
              href="/vs/curbwaste"
              className="p-3 rounded-xl border border-[#dde4d4] hover:border-[#ea580c] hover:bg-[#fff7ed] transition-all font-semibold text-[#1f2d26] flex items-center justify-between"
            >
              <span>RollOS vs. CurbWaste</span>
              <ArrowRight size={13} className="text-[#ea580c] shrink-0" />
            </Link>
            <Link
              href="/vs/trash-flow"
              className="p-3 rounded-xl border border-[#dde4d4] hover:border-[#ea580c] hover:bg-[#fff7ed] transition-all font-semibold text-[#1f2d26] flex items-center justify-between"
            >
              <span>RollOS vs. Trash Flow</span>
              <ArrowRight size={13} className="text-[#ea580c] shrink-0" />
            </Link>
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
      <Footer />
    </main>
  );
}
