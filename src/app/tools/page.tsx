import Link from 'next/link';
import { ArrowRight, DollarSign, Scale, ArrowUpRight, CheckCircle2, Zap } from 'lucide-react';
import { MarketingNav } from '@/components/marketing-nav';
import { SemanticBreadcrumb } from '@/components/semantic-breadcrumb';
import { Footer } from '@/components/footer';

export const metadata = {
  title: 'Free Roll-Off Dumpster Business Tools & Calculators | RollOS',
  description:
    'Free operational calculators and profitability tools for roll-off dumpster haulers. Calculate landfill tonnage overages, estimate software ROI, and protect your margins.',
  alternates: {
    canonical: 'https://rolloffdumpstersoftware.com/tools',
  },
};

export default function ToolsHubPage() {
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Free Roll-Off Dumpster Business Tools & Calculators',
    description:
      'Authority hub of free operational calculators for independent roll-off dumpster rental operators. Calculate landfill scale ticket overages and software ROI.',
    url: 'https://rolloffdumpstersoftware.com/tools',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Dumpster Tonnage & Disposal Overage Calculator',
          url: 'https://rolloffdumpstersoftware.com/tools/tonnage-calculator',
          description:
            'Instantly calculate landfill disposal overages from included weight allowances, actual scale ticket net weight, and per-ton overage rates.',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Dumpster Rental Software Savings & ROI Calculator',
          url: 'https://rolloffdumpstersoftware.com/tools/savings-calculator',
          description:
            'Calculate annual savings and ROI switching from expensive legacy platforms like Docket, ServiceCore, or DRS to RollOS.',
        },
      ],
    },
  };

  const tools = [
    {
      title: 'Tonnage & Overage Calculator',
      slug: '/tools/tonnage-calculator',
      icon: Scale,
      badge: 'Operational / Landfill Billing',
      headline: 'Stop eating landfill overweight fees on customer dumpsters',
      description:
        'Enter included tonnage, landfill scale ticket net weight, and your per-ton overage rate. Get exact dollar amounts to add to customer invoices before you leave the transfer station.',
      features: [
        'Calculates fractional tons accurately (e.g. 3.42 tons vs 2.0 ton allowance)',
        'Applies your specific per-ton disposal markup',
        'Generates itemized overage charges for transparent billing',
      ],
      ctaText: 'Open Tonnage Calculator',
    },
    {
      title: 'Software Savings & ROI Calculator',
      slug: '/tools/savings-calculator',
      icon: DollarSign,
      badge: 'Profitability & Overhead',
      headline: 'Calculate how much legacy software subscriptions cost your fleet',
      description:
        'Compare your actual monthly spend against Docket ($299+/mo), ServiceCore ($350+/mo), or DRS ($195–$279/mo). See how much profit you pocket with RollOS free-to-start pricing.',
      features: [
        'Side-by-side annual cost comparison across 3 top platforms',
        'Includes hidden onboarding fees and credit card processing markups',
        'Models recovered revenue from 24/7 after-hours customer self-booking',
      ],
      ctaText: 'Open Savings Calculator',
    },
  ];

  return (
    <main className="marketing">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <MarketingNav currentPath="/tools" />

      {/* Hero / Above The Fold */}
      <section className="max-w-5xl mx-auto px-6 pt-12 pb-8">
        <SemanticBreadcrumb
          items={[
            { name: 'Home', item: '/' },
            { name: 'Free Tools', item: '/tools' },
          ]}
        />
        <div className="eyebrow" style={{ color: '#82956d', marginBottom: 12 }}>
          FREE ROLL-OFF HAULER TOOLS & CALCULATORS · TOPICAL AUTHORITY HUB
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#20302a] leading-tight mb-4">
          Free operational tools that solve the daily math for dumpster haulers.
        </h1>
        <p className="text-lg text-[#556658] leading-relaxed mb-8 max-w-3xl">
          Independent waste haulers run tight margins. Whether you are calculating landfill scale ticket overages at the transfer station or figuring out how much software subscriptions eat your profits, these free tools eliminate guesswork in seconds.
        </p>

        {/* Immediate CTA Box */}
        <div className="p-6 md:p-8 bg-gradient-to-r from-[#1b2b22] to-[#253d2f] text-white rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#4ade80] uppercase">
              <Zap size={14} /> Zero Manual Data Entry
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Automate this math with RollOS — Free to start
            </h2>
            <p className="text-xs md:text-sm text-[#cbd5cc] max-w-xl">
              Tired of running numbers on your phone calculator while driving a truck? RollOS calculates tonnage overages automatically on dispatch scale ticket photos and charges customer credit cards on file.
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

      {/* Featured Free Tools Grid */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-[#1f2d26]">Available Free Calculators</h2>
            <p className="text-sm text-[#556658]">100% free web-based utilities. No email required, no software install.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.slug}
                className="bg-white border border-[#dde4d4] rounded-2xl p-7 flex flex-col justify-between shadow-sm hover:border-[#ea580c] transition-all hover:shadow-md group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-2.5 rounded-xl bg-[#eef3e6] text-[#2d4034] group-hover:bg-[#ea580c] group-hover:text-white transition-colors">
                      <Icon size={24} />
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#ea580c] bg-[#fff7ed] px-3 py-1 rounded-full border border-[#fed7aa]">
                      {t.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-[#1f2d26] mb-2">
                    <Link href={t.slug} className="hover:text-[#ea580c] transition-colors">
                      {t.title}
                    </Link>
                  </h3>
                  <div className="text-sm font-semibold text-[#3b4e41] mb-3">{t.headline}</div>
                  <p className="text-xs text-[#556658] leading-relaxed mb-6">{t.description}</p>

                  <ul className="space-y-2 mb-6 border-t border-[#f0f4ea] pt-4">
                    {t.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-xs text-[#415346]">
                        <CheckCircle2 size={14} className="text-[#22c55e] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={t.slug}
                  className="btn btn-dark w-full text-xs py-3 justify-center font-bold group-hover:bg-[#ea580c] group-hover:border-[#ea580c] transition-colors inline-flex items-center gap-2"
                >
                  {t.ctaText} <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Educational Silo Content: Why Math Breaks Roll-Off Operations */}
      <section className="max-w-5xl mx-auto px-6 py-12 border-t border-[#e2e8da]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1f2d26]">
              Why Manual Math & Spreadsheets Cost Roll-Off Haulers Thousands Every Month
            </h2>
            <div className="text-sm text-[#4d5e53] space-y-4 leading-relaxed">
              <p>
                In the roll-off dumpster industry, revenue leakage almost never comes from major catastrophic mistakes. It comes from small, daily math oversights: forgetting to bill a 0.8-ton overweight fee, failing to track an extra rental day on a job site, or letting a customer dispute a charge because you lacked scale ticket photo documentation.
              </p>
              <p>
                When an operator dumps 6 to 10 cans a day, transfer station tickets pile up on the truck dashboard. If the driver does not immediately reconcile the scale gross weight against the customer’s contract allowance, that overage is often absorbed by the hauler. At $85/ton overage rate, missing just two overages a week costs your business over <strong>$8,800 per year</strong> in lost net profit.
              </p>
              <p>
                These free tools give you quick benchmarks on your phone browser. When you are ready to automate the entire process, RollOS connects your online bookings, dispatch board, scale ticket photos, and Stripe invoicing into a single, seamless pipeline.
              </p>
            </div>

            <div className="p-6 bg-[#f7f9f4] border border-[#dce3d4] rounded-xl space-y-3">
              <h4 className="text-sm font-bold text-[#1f2d26]">How RollOS Replaces Manual Calculation:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#415346]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
                  <span>Automatic tare & gross weight subtraction</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
                  <span>Driver snaps photo of scale ticket via SMS link</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
                  <span>Scale ticket PDF attached directly to invoice</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
                  <span>1-click card charge on file with zero phone tag</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Cross-Silo Sidebar */}
          <div className="space-y-6">
            <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm">
              <h3 className="text-base font-bold text-[#1f2d26] mb-3">Free Legal Templates</h3>
              <p className="text-xs text-[#556658] mb-4">
                Need lawyer-reviewed rental agreements or professional commercial invoices?
              </p>
              <ul className="space-y-2.5 text-xs font-semibold">
                <li>
                  <Link
                    href="/templates/dumpster-rental-contract"
                    className="text-[#2d4034] hover:text-[#ea580c] flex items-center justify-between transition-colors"
                  >
                    <span>Rental Contract Template</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/templates/dumpster-invoice"
                    className="text-[#2d4034] hover:text-[#ea580c] flex items-center justify-between transition-colors"
                  >
                    <span>Dumpster Invoice Template</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/templates"
                    className="text-[#ea580c] hover:underline flex items-center gap-1 mt-2"
                  >
                    <span>View all templates →</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm">
              <h3 className="text-base font-bold text-[#1f2d26] mb-3">Software Features</h3>
              <p className="text-xs text-[#556658] mb-4">
                Explore the complete RollOS operational suite designed for independent roll-off fleets.
              </p>
              <ul className="space-y-2.5 text-xs font-semibold">
                <li>
                  <Link
                    href="/features/online-booking"
                    className="text-[#2d4034] hover:text-[#ea580c] flex items-center justify-between transition-colors"
                  >
                    <span>24/7 Online Booking Widget</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/features/dispatch-board"
                    className="text-[#2d4034] hover:text-[#ea580c] flex items-center justify-between transition-colors"
                  >
                    <span>Drag & Drop Dispatch Board</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/features/driver-routes"
                    className="text-[#2d4034] hover:text-[#ea580c] flex items-center justify-between transition-colors"
                  >
                    <span>1-Tap Driver SMS Routes</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/features/tonnage-billing"
                    className="text-[#2d4034] hover:text-[#ea580c] flex items-center justify-between transition-colors"
                  >
                    <span>Scale Tickets & Tonnage Invoicing</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Conversion Banner */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="p-8 bg-[#eef3e6] border border-[#d2dec3] rounded-2xl text-center">
          <div className="eyebrow text-xs font-bold text-[#577242] uppercase tracking-wider mb-2">
            FREE TO START · NO CREDIT CARD REQUIRED
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-[#1f2d26] mb-3">
            Automate your operational math with RollOS today
          </h3>
          <p className="text-sm text-[#556658] max-w-xl mx-auto mb-6 leading-relaxed">
            Stop losing hours every week to manual paperwork, phone tags, and invoice calculations. Set up your fleet in 3 minutes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/" className="btn btn-secondary">
              roll off dumpster software
            </Link>
            <Link href="/pricing" className="btn btn-secondary">
              View Transparent Pricing
            </Link>
            <Link href="/signup" className="btn btn-orange">
              Automate This Math with RollOS — Free to start <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
