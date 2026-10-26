import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import { MarketingNav } from '@/components/marketing-nav';
import { SemanticBreadcrumb } from '@/components/semantic-breadcrumb';
import { SavingsCalculator } from '@/components/savings-calculator';
import { Footer } from '@/components/footer';

export const metadata = {
  title: 'Dumpster Rental Software Comparisons (2026 Reviews) — RollOS vs Competitors',
  description:
    'Compare RollOS against Docket, ServiceCore, and Dumpster Rental Systems (DRS). Transparent pricing from $0/month, driver SMS links, and 24/7 online booking.',
  alternates: {
    canonical: 'https://rolloffdumpstersoftware.com/vs',
  },
};

export default function CompareHubPage() {
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Roll-Off Dumpster Rental Software Competitor Comparisons (2026)',
    description:
      'Detailed side-by-side feature and pricing comparisons between RollOS and legacy waste platforms including Docket, ServiceCore, and Dumpster Rental Systems.',
    url: 'https://rolloffdumpstersoftware.com/vs',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'RollOS vs Docket Dumpster Software',
          url: 'https://rolloffdumpstersoftware.com/vs/docket',
          description:
            'Compare RollOS vs Docket: Pricing ($0/mo vs $299+/mo), driver app requirements, onboarding fees, and credit card processing fees.',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'RollOS vs iCans Dumpster Software',
          url: 'https://rolloffdumpstersoftware.com/vs/icans',
          description:
            'Compare RollOS vs iCans: Pricing ($0/mo vs $99-$159/mo), SMS restrictions, payment gateway lock-in, and 1-tap driver SMS links.',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'RollOS vs Bin Boss Software',
          url: 'https://rolloffdumpstersoftware.com/vs/bin-boss',
          description:
            'Compare RollOS vs Bin Boss: Pricing ($0-$29/mo vs $99/mo + $40 site add-on), driver app store downloads vs SMS magic links, and scale overages.',
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'RollOS vs CurbWaste',
          url: 'https://rolloffdumpstersoftware.com/vs/curbwaste',
          description:
            'Compare RollOS vs CurbWaste: Enterprise quote-gated fees ($1,000-$3,000+ setup) vs transparent $0-$99/mo plans and 3-minute self-serve start.',
        },
        {
          '@type': 'ListItem',
          position: 5,
          name: 'RollOS vs Trash Flow Software',
          url: 'https://rolloffdumpstersoftware.com/vs/trash-flow',
          description:
            'Compare RollOS vs Trash Flow: Modern cloud SaaS vs legacy on-premise Windows desktop server licensing ($900-$4,150+ setup and per-seat fees).',
        },
        {
          '@type': 'ListItem',
          position: 6,
          name: 'RollOS vs Dumpster Rental Systems (DRS)',
          url: 'https://rolloffdumpstersoftware.com/vs/dumpster-rental-systems',
          description:
            'Compare RollOS vs DRS: Container fleet limits (unlimited vs 20 can cap on Standard), monthly fees ($0-$29 vs $195.95-$279.95), and modern UI.',
        },
        {
          '@type': 'ListItem',
          position: 7,
          name: 'RollOS vs ServiceCore',
          url: 'https://rolloffdumpstersoftware.com/vs/servicecore',
          description:
            'Compare RollOS vs ServiceCore: Liquid waste/septic focus vs dedicated roll-off dumpster workflows and per-truck pricing.',
        },
      ],
    },
  };

  const comparisons = [
    {
      name: 'Docket Software',
      slug: '/vs/docket',
      badge: 'Enterprise Alternative',
      summary:
        'Docket charges ~$299+/mo with mandatory sales demos, ~3.0% processing rates, and requires drivers to download native App Store apps. RollOS starts free at $0/mo with instant SMS web links.',
      savings: 'Save $3,500 – $5,000 / year',
      price: '$299+/month',
      setupFee: '$500 – $1,500 mandatory',
      driverApp: 'App Store / Play Store download',
      fleetCap: 'Tiered pricing by fleet size',
    },
    {
      name: 'iCans Dumpster Software',
      slug: '/vs/icans',
      badge: 'High Search Competition',
      summary:
        'iCans charges $99 to $159/mo and locks SMS text messaging behind their $159/mo tier alongside Tiger Payment Solutions lock-in. RollOS offers $0/mo Free and $29/mo Starter with SMS links included.',
      savings: 'Save $1,200 – $1,900 / year',
      price: '$99 – $159/month',
      setupFee: '$0',
      driverApp: 'App Store download required',
      fleetCap: 'Flat monthly tiers',
    },
    {
      name: 'Bin Boss Software',
      slug: '/vs/bin-boss',
      badge: 'High Advertiser Bid ($47/click)',
      summary:
        'Bin Boss charges $99/mo flat plus $40/mo for a website, requiring drivers to download native mobile apps. RollOS provides free booking widgets, driver SMS links, and automated scale overage billing.',
      savings: 'Save $1,200 – $1,600 / year',
      price: '$99/month (+ $40/mo website)',
      setupFee: '$0',
      driverApp: 'App Store / Play Store download',
      fleetCap: 'Unlimited users',
    },
    {
      name: 'CurbWaste',
      slug: '/vs/curbwaste',
      badge: 'Enterprise Waste ERP',
      summary:
        'CurbWaste charges custom quote-based pricing (~$300–$600+/mo) with $1,000–$3,000+ onboarding and driver minimums. RollOS offers transparent $0–$99/mo plans and 3-minute self-serve start.',
      savings: 'Save $4,000 – $7,000 / year',
      price: 'Custom Quote (~$300+/mo)',
      setupFee: '$1,000 – $3,000+ mandatory',
      driverApp: 'App Store download required',
      fleetCap: 'Enforces driver/truck minimums',
    },
    {
      name: 'Trash Flow (Ivy Computer)',
      slug: '/vs/trash-flow',
      badge: 'Legacy Desktop Server Software',
      summary:
        'Trash Flow requires $900–$4,150+ in upfront modular software licenses, per-seat user fees, and on-premise Windows servers. RollOS is 100% cloud SaaS starting at $0/month with zero server hardware.',
      savings: 'Save $4,000+ in setup & licensing',
      price: '$900 – $4,150+ license (+12%/yr)',
      setupFee: 'Hardware & setup costs',
      driverApp: 'Printed sheets / add-ons',
      fleetCap: 'Per-seat user licensing',
    },
    {
      name: 'Dumpster Rental Systems (DRS)',
      slug: '/vs/dumpster-rental-systems',
      badge: 'Popular for Small Fleets',
      summary:
        'DRS charges $195.95 to $279.95/month and caps your fleet size (only 20 cans on Standard). RollOS provides unlimited containers with zero fleet caps on our $0/mo Free and $29/mo Starter plans.',
      savings: 'Save $2,300 – $3,300 / year',
      price: '$195.95 – $279.95/month',
      setupFee: '$0 – $500',
      driverApp: 'Web app with logins',
      fleetCap: 'Strict 20 container limit on Standard',
    },
    {
      name: 'ServiceCore',
      slug: '/vs/servicecore',
      badge: 'Liquid Waste & Septic ERP',
      summary:
        'ServiceCore charges on a per-truck basis ($350–$700+/mo) and is built primarily for portable toilets and septic pumpers. RollOS is 100% focused on roll-off haulers with flat, transparent pricing.',
      savings: 'Save $4,000 – $8,000 / year',
      price: '$350 – $700+/month',
      setupFee: '$1,000+ onboarding',
      driverApp: 'Native mobile app',
      fleetCap: 'Billed per-truck / per-user',
    },
  ];

  return (
    <main className="marketing">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <MarketingNav currentPath="/vs" />

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-12 pb-8">
        <SemanticBreadcrumb
          items={[
            { name: 'Home', item: '/' },
            { name: 'Comparisons', item: '/vs' },
          ]}
        />
        <div className="eyebrow" style={{ color: '#82956d', marginBottom: 12 }}>
          COMPETITIVE BENCHMARKS & REVIEWS · 2026 EDITION
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#20302a] leading-tight mb-4">
          RollOS vs. Traditional Dumpster Rental Software
        </h1>
        <p className="text-lg text-[#556658] leading-relaxed mb-8 max-w-3xl">
          See how RollOS compares to legacy waste management software on pricing, driver workflows, and customer online booking. Stop paying hundreds of dollars each month before you haul your first bin.
        </p>

        {/* Immediate Savings Highlight Box */}
        <div className="p-6 md:p-8 bg-gradient-to-r from-[#192b21] to-[#243d2f] text-white rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#4ade80] uppercase">
              <Zap size={14} /> Transparent Pricing
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              RollOS starts at $0/month. No sales calls, no contracts.
            </h2>
            <p className="text-xs md:text-sm text-[#cbd5cc] max-w-xl">
              Most vendors hide their pricing behind 45-minute mandatory Zoom demos and lock you into 12-month contracts. We believe in letting operators test the software in 3 minutes with zero commitment.
            </p>
          </div>
          <Link
            href="/signup"
            className="btn btn-orange shrink-0 whitespace-nowrap text-sm py-3 px-6 font-bold"
          >
            Start Free Demo <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Competitor Cards Grid */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {comparisons.map((c) => (
            <div
              key={c.name}
              className="p-6 bg-white border border-[#dde4d4] rounded-2xl flex flex-col justify-between shadow-sm hover:border-[#ea580c] transition-all hover:shadow-md"
            >
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#ea580c] mb-2">
                  {c.badge}
                </div>
                <h2 className="text-xl font-bold text-[#1f2d26] mb-3">RollOS vs. {c.name}</h2>
                <p className="text-xs text-[#556658] leading-relaxed mb-4">{c.summary}</p>
                <div className="p-2.5 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg text-xs font-bold text-[#166534] mb-4">
                  {c.savings}
                </div>

                <div className="space-y-2 border-t border-[#f0f4ea] pt-3 mb-6 text-xs text-[#415346]">
                  <div className="flex justify-between">
                    <span className="text-[#6d7f72]">Monthly Cost:</span>
                    <span className="font-semibold">{c.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6d7f72]">Setup / Onboarding:</span>
                    <span className="font-semibold">{c.setupFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6d7f72]">Driver Setup:</span>
                    <span className="font-semibold">{c.driverApp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6d7f72]">Fleet Limitations:</span>
                    <span className="font-semibold">{c.fleetCap}</span>
                  </div>
                </div>
              </div>

              <Link
                href={c.slug}
                className="btn btn-dark w-full text-xs py-2.5 justify-center font-bold"
              >
                Read Full In-Depth Review <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Comparison Matrix Table */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-[#1f2d26] mb-4">
          Head-to-Head Feature Comparison
        </h2>
        <p className="text-xs md:text-sm text-[#556658] mb-6">
          See how key operational capabilities compare across RollOS, Docket, DRS, and ServiceCore.
        </p>

        <div className="overflow-x-auto border border-[#dde4d4] rounded-2xl bg-white shadow-sm mb-12">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-[#f7f9f4] border-b border-[#dde4d4] text-[#1f2d26]">
                <th className="p-4 font-bold">Feature / Capability</th>
                <th className="p-4 font-bold text-[#ea580c] bg-[#fff7ed]">RollOS</th>
                <th className="p-4 font-semibold text-[#556658]">Docket</th>
                <th className="p-4 font-semibold text-[#556658]">DRS</th>
                <th className="p-4 font-semibold text-[#556658]">ServiceCore</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dde4d4] text-[#415346]">
              <tr>
                <td className="p-4 font-semibold">Base Subscription</td>
                <td className="p-4 font-bold text-[#166534] bg-[#fff7ed]">$0 / Free (or $29/mo)</td>
                <td className="p-4">$299+/mo</td>
                <td className="p-4">$195.95 – $279.95/mo</td>
                <td className="p-4">$350 – $700+/mo</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Onboarding / Setup Fees</td>
                <td className="p-4 font-bold text-[#166534] bg-[#fff7ed]">$0 Self-Serve</td>
                <td className="p-4">$500 – $1,500</td>
                <td className="p-4">$0 – $500</td>
                <td className="p-4">$1,000+</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Driver Mobile Experience</td>
                <td className="p-4 font-bold text-[#166534] bg-[#fff7ed]">1-Tap SMS Link (0 app installs)</td>
                <td className="p-4">App Store download</td>
                <td className="p-4">Mobile web login</td>
                <td className="p-4">App Store download</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">24/7 Website Booking Widget</td>
                <td className="p-4 font-bold text-[#166534] bg-[#fff7ed]">Included (Embed in 60s)</td>
                <td className="p-4">Add-on module</td>
                <td className="p-4">Included</td>
                <td className="p-4">Limited / Enterprise</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Scale Ticket Overage Invoicing</td>
                <td className="p-4 font-bold text-[#166534] bg-[#fff7ed]">Automatic Photo & 1-Click Card Charge</td>
                <td className="p-4">Manual entry</td>
                <td className="p-4">Manual entry</td>
                <td className="p-4">Manual entry</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Container Fleet Limit</td>
                <td className="p-4 font-bold text-[#166534] bg-[#fff7ed]">Unlimited on all plans</td>
                <td className="p-4">Tiered</td>
                <td className="p-4">Capped at 20 on Standard</td>
                <td className="p-4">Per-truck pricing</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Contract Lock-in</td>
                <td className="p-4 font-bold text-[#166534] bg-[#fff7ed]">Month-to-month, cancel anytime</td>
                <td className="p-4">Often 12 months</td>
                <td className="p-4">Month-to-month</td>
                <td className="p-4">12 months standard</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Embedded Savings Calculator Preview */}
      <section className="max-w-5xl mx-auto px-6 py-8 border-t border-[#dde4d4]">
        <div className="mb-8">
          <div className="eyebrow" style={{ color: '#82956d', marginBottom: 8 }}>
            CALCULATE YOUR SPECIFIC FLEET ROI
          </div>
          <h2 className="text-2xl font-bold text-[#1f2d26] mb-2">
            How Much Will Your Business Save With RollOS?
          </h2>
          <p className="text-sm text-[#556658]">
            Input your active roll-off containers to see an immediate breakdown of software subscription savings and recovered revenue.
          </p>
        </div>

        <SavingsCalculator showTitle={false} />

        <div className="mt-6 text-center">
          <Link
            href="/tools/savings-calculator"
            className="text-xs font-bold text-[#ea580c] hover:underline inline-flex items-center gap-1"
          >
            <span>Open Dedicated Full-Screen Savings Calculator</span> <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* Reverse Silo Links to Features, Tools & Templates */}
      <section className="max-w-5xl mx-auto px-6 py-8 border-t border-[#e2e8da]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm">
            <h3 className="text-base font-bold text-[#1f2d26] mb-2">Core Features</h3>
            <p className="text-xs text-[#556658] mb-4">Explore our booking widget, dispatch board, and driver routing.</p>
            <Link href="/features" className="text-xs font-bold text-[#ea580c] flex items-center gap-1 hover:underline">
              <span>View All 4 Pillars</span> <ArrowRight size={13} />
            </Link>
          </div>

          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm">
            <h3 className="text-base font-bold text-[#1f2d26] mb-2">Free Calculators</h3>
            <p className="text-xs text-[#556658] mb-4">Calculate landfill tonnage overages or software cost comparisons.</p>
            <Link href="/tools" className="text-xs font-bold text-[#ea580c] flex items-center gap-1 hover:underline">
              <span>View Free Tools Hub</span> <ArrowRight size={13} />
            </Link>
          </div>

          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm">
            <h3 className="text-base font-bold text-[#1f2d26] mb-2">Free Legal Templates</h3>
            <p className="text-xs text-[#556658] mb-4">Download rental contract agreements and commercial invoices.</p>
            <Link href="/templates" className="text-xs font-bold text-[#ea580c] flex items-center gap-1 hover:underline">
              <span>View Templates Hub</span> <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="p-8 bg-[#eef3e6] border border-[#d2dec3] rounded-2xl text-center">
          <div className="eyebrow text-xs font-bold text-[#577242] uppercase tracking-wider mb-2">
            RISK-FREE SETUP
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-[#1f2d26] mb-3">
            Stop paying hundreds every month before hauling your first dumpster
          </h3>
          <p className="text-sm text-[#556658] max-w-xl mx-auto mb-6 leading-relaxed">
            Test RollOS with zero sales pressure. Self-serve signup in 3 minutes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup" className="btn btn-orange">
              Start Free Demo <ArrowRight size={14} />
            </Link>
            <Link href="/pricing" className="btn btn-secondary">
              See All Pricing Plans
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
