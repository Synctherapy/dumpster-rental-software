import Link from 'next/link';
import { ArrowRight, DollarSign, Layers, Zap } from 'lucide-react';
import { MarketingNav } from '@/components/marketing-nav';
import { SavingsCalculator } from '@/components/savings-calculator';
import { SemanticBreadcrumb } from '@/components/semantic-breadcrumb';
import { Footer } from '@/components/footer';

export const metadata = {
  title: 'Dumpster Rental Software Savings Calculator — Compare Costs & ROI',
  description:
    'Calculate how much money you save switching from Docket, ServiceCore, or DRS to RollOS. Compare monthly subscription costs, hidden fees, and bookings captured while you sleep.',
  alternates: {
    canonical: 'https://rolloffdumpstersoftware.com/tools/savings-calculator',
  },
};

export default function SavingsCalculatorPage() {
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'RollOS Dumpster Rental Software ROI & Cost Calculator',
    description:
      'Interactive cost comparison tool for roll-off dumpster haulers to calculate annual software savings against Docket, ServiceCore, and DRS.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    url: 'https://rolloffdumpstersoftware.com/tools/savings-calculator',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <main className="marketing">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <MarketingNav currentPath="/tools" />

      <div className="max-w-5xl mx-auto px-6 py-12">
        <SemanticBreadcrumb
          items={[
            { name: 'Home', item: '/' },
            { name: 'Free Tools', item: '/tools' },
            { name: 'Dumpster Software Savings Calculator', item: '/tools/savings-calculator' },
          ]}
        />

        <div className="eyebrow" style={{ color: '#82956d', marginBottom: 12 }}>
          FREE OPERATIONAL HAULER TOOL · SOFTWARE SAVINGS & ROI
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#20302a] mb-4">
          Dumpster Rental Software Savings & ROI Calculator
        </h1>
        <p className="text-lg text-[#556658] leading-relaxed mb-10 max-w-3xl">
          See exactly how much profit you keep every month by replacing expensive legacy software subscriptions
          or manual pen-and-paper phone tag with RollOS.
        </p>

        {/* Interactive Calculator */}
        <SavingsCalculator showTitle={false} />

        {/* Breakdown of Hidden Competitor Fees */}
        <div className="mt-16 space-y-8">
          <h2 className="text-2xl font-bold text-[#1f2d26]">
            Where Does Your Money Go With Legacy Dumpster Software?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#fee2e2] text-[#dc2626] flex items-center justify-center font-bold mb-4">
                <DollarSign size={20} />
              </div>
              <h3 className="text-base font-bold text-[#1f2d26] mb-2">1. High Base Subscriptions</h3>
              <p className="text-xs text-[#556658] leading-relaxed">
                Platforms like Docket and ServiceCore charge $250 to $350+ every month regardless of whether you haul 5 dumpsters or 50. That’s $3,000–$4,200/year out of your pocket before fuel and landfill fees.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center font-bold mb-4">
                <Layers size={20} />
              </div>
              <h3 className="text-base font-bold text-[#1f2d26] mb-2">2. Mandatory Setup Fees</h3>
              <p className="text-xs text-[#556658] leading-relaxed">
                Legacy vendors often tack on mandatory onboarding fees ranging from $500 to $1,500 just to set up your account and schedule training calls. RollOS is self-serve in 3 minutes with $0 setup fees.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#e0e7ff] text-[#4f46e5] flex items-center justify-center font-bold mb-4">
                <Zap size={20} />
              </div>
              <h3 className="text-base font-bold text-[#1f2d26] mb-2">3. Missed Phone Call Revenue</h3>
              <p className="text-xs text-[#556658] leading-relaxed">
                If you use pen and paper or rely on phone calls while operating heavy machinery, missed calls cost you an estimated $1,350 to $2,250 every week. Customers call the next hauler on Google if you don’t answer.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison deep link section */}
        <div className="mt-12 p-6 bg-white border border-[#dde4d4] rounded-2xl">
          <h3 className="text-lg font-bold text-[#1f2d26] mb-2">
            Want detailed, side-by-side feature and pricing breakdowns?
          </h3>
          <p className="text-xs text-[#556658] mb-4">
            Compare RollOS directly against specific platforms in our transparent comparison guides:
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/vs/docket"
              className="text-xs font-semibold px-3 py-2 bg-[#f4f7f2] hover:bg-[#e6eee1] text-[#2d4034] rounded-lg border border-[#d6dfce] transition-colors"
            >
              RollOS vs Docket →
            </Link>
            <Link
              href="/vs/servicecore"
              className="text-xs font-semibold px-3 py-2 bg-[#f4f7f2] hover:bg-[#e6eee1] text-[#2d4034] rounded-lg border border-[#d6dfce] transition-colors"
            >
              RollOS vs ServiceCore →
            </Link>
            <Link
              href="/vs/dumpster-rental-systems"
              className="text-xs font-semibold px-3 py-2 bg-[#f4f7f2] hover:bg-[#e6eee1] text-[#2d4034] rounded-lg border border-[#d6dfce] transition-colors"
            >
              RollOS vs DRS →
            </Link>
            <Link
              href="/vs"
              className="text-xs font-semibold px-3 py-2 bg-[#f4f7f2] hover:bg-[#e6eee1] text-[#2d4034] rounded-lg border border-[#d6dfce] transition-colors"
            >
              All Competitor Comparisons →
            </Link>
          </div>
        </div>

        {/* Reverse Silo Link to Home & Features */}
        <div className="p-8 bg-[#eef3e6] border border-[#d2dec3] rounded-2xl text-center my-12">
          <div className="eyebrow text-xs font-bold text-[#577242] uppercase tracking-wider mb-2">
            START KEEPING 100% OF YOUR REVENUE
          </div>
          <h3 className="text-xl md:text-2xl font-extrabold text-[#1f2d26] mb-3">
            Ready to test RollOS alongside your current dispatch system?
          </h3>
          <p className="text-sm text-[#556658] max-w-xl mx-auto mb-6 leading-relaxed">
            Try the modern all-in-one{' '}
            <Link href="/" className="font-bold underline decoration-[#ea580c] text-[#1f2d26] hover:text-[#ea580c]">
              roll off dumpster software
            </Link>{' '}
            with live dispatch board and customer booking widget free. No sales calls, no contracts, and no credit card required.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/" className="btn btn-secondary">
              roll off dumpster software
            </Link>
            <Link href="/pricing" className="btn btn-secondary">
              View Transparent Pricing
            </Link>
            <Link href="/signup" className="btn btn-orange">
              Start Free Demo <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
