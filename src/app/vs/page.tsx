import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, X, Shield, DollarSign, Smartphone, Truck, Star } from 'lucide-react';
import { Brand } from '@/components/brand';
import { SavingsCalculator } from '@/components/savings-calculator';

export const metadata = {
  title: 'Dumpster Rental Software Comparisons (2026 Reviews) — RollOS vs Competitors',
  description:
    'Compare RollOS against Docket, ServiceCore, and Dumpster Rental Systems (DRS). Transparent pricing from $0/month, driver SMS links, and 24/7 online booking.',
};

export default function ComparisonsHubPage() {
  const comparisons = [
    {
      name: 'Docket Software',
      slug: '/vs/docket',
      badge: 'Most Common Enterprise Alternative',
      summary:
        'Docket charges ~$299+/mo with mandatory sales demos, ~3.0% processing rates, and requires drivers to download native App Store apps. RollOS starts free at $0/mo with instant SMS web links.',
      savings: 'Save $3,500 – $5,000 / year',
    },
    {
      name: 'Dumpster Rental Systems (DRS)',
      slug: '/vs/dumpster-rental-systems',
      badge: 'Popular for Small Fleets',
      summary:
        'DRS charges $195.95 to $279.95/month and caps your fleet size (only 20 cans on Standard). RollOS provides unlimited containers with zero fleet caps on our $0/mo Free and $29/mo Starter plans.',
      savings: 'Save $2,300 – $3,300 / year',
    },
    {
      name: 'ServiceCore',
      slug: '/vs/servicecore',
      badge: 'Liquid Waste & Septic ERP',
      summary:
        'ServiceCore charges on a per-truck basis ($350–$700+/mo) and is built primarily for portable toilets and septic pumpers. RollOS is 100% focused on roll-off haulers with flat, transparent pricing.',
      savings: 'Save $4,000 – $8,000 / year',
    },
  ];

  return (
    <main className="marketing">
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
          COMPETITIVE BENCHMARKS & REVIEWS · 2026
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#20302a] leading-tight mb-4">
          RollOS vs. Traditional Dumpster Rental Software
        </h1>
        <p className="text-lg text-[#556658] leading-relaxed mb-10 max-w-3xl">
          See how RollOS compares to legacy waste management software on pricing, driver workflows, and customer online booking.
          Stop paying hundreds of dollars each month before you haul your first bin.
        </p>

        {/* Competitor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {comparisons.map((c) => (
            <div
              key={c.name}
              className="p-6 bg-white border border-[#dde4d4] rounded-2xl flex flex-col justify-between shadow-sm hover:border-[#ea580c] transition-colors"
            >
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#ea580c] mb-2">
                  {c.badge}
                </div>
                <h2 className="text-xl font-bold text-[#1f2d26] mb-3">RollOS vs. {c.name}</h2>
                <p className="text-xs text-[#556658] leading-relaxed mb-4">{c.summary}</p>
                <div className="p-2.5 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg text-xs font-bold text-[#166534] mb-6">
                  {c.savings}
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

        {/* Embedded Calculator */}
        <div className="my-12">
          <SavingsCalculator showTitle={true} />
        </div>

        {/* Reverse Silo Link to Home */}
        <div className="p-8 bg-[#eef3e6] border border-[#d2dec3] rounded-2xl text-center my-8">
          <div className="eyebrow text-xs font-bold text-[#577242] uppercase tracking-wider mb-2">
            ZERO MONTHLY BILLS · START TODAY
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
