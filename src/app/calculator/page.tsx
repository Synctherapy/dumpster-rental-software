import Link from 'next/link';
import { ArrowLeft, ArrowRight, DollarSign, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Brand } from '@/components/brand';
import { SavingsCalculator } from '@/components/savings-calculator';

export const metadata = {
  title: 'Dumpster Rental Software Savings Calculator — Compare Costs & ROI',
  description:
    'Calculate how much money you save switching from Docket, ServiceCore, or DRS to RollOS. Compare monthly subscription costs, hidden fees, and bookings captured while you sleep.',
};

export default function CalculatorPage() {
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'RollOS Dumpster Rental Software ROI & Cost Calculator',
    description:
      'Interactive cost comparison tool for roll-off dumpster haulers to calculate annual software savings against Docket, ServiceCore, and DRS.',
    applicationCategory: 'BusinessApplication',
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

      <nav className="marketing-nav">
        <Brand />
        <div className="marketing-links">
          <Link href="/">Home</Link>
          <Link href="/uses/dumpster-booking-system">Online Booking</Link>
          <Link href="/uses/roll-off-dispatch-software">Dispatch Board</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/vs/docket">RollOS vs Docket</Link>
          <Link href="/signup" className="btn btn-orange">
            Start Free Demo <ArrowRight size={14} />
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
          FREE OPERATIONAL HAULER TOOL · SAVINGS & ROI
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
              <h3 className="text-base font-bold text-[#1f2d26] mb-2">1. High Base Subscriptions</h3>
              <p className="text-xs text-[#556658] leading-relaxed">
                Platforms like Docket and ServiceCore charge $250 to $350+ every month regardless of whether you haul 5 dumpsters or 50. That’s $3,000–$4,200/year out of your pocket before fuel and disposal.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm">
              <h3 className="text-base font-bold text-[#1f2d26] mb-2">2. Mandatory Setup Fees</h3>
              <p className="text-xs text-[#556658] leading-relaxed">
                Legacy vendors often tack on mandatory onboarding fees ranging from $500 to $1,500 just to set up your account and schedule training calls. RollOS is self-serve in 3 minutes with $0 setup fees.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm">
              <h3 className="text-base font-bold text-[#1f2d26] mb-2">3. Missed Phone Call Revenue</h3>
              <p className="text-xs text-[#556658] leading-relaxed">
                If you use pen and paper or rely on phone calls while operating heavy machinery, missed calls cost you an estimated $1,350 to $2,250 every week. Customers call the next hauler on Google if you don’t answer.
              </p>
            </div>
          </div>
        </div>

        {/* Reverse Silo Link to Home */}
        <div className="p-8 bg-[#eef3e6] border border-[#d2dec3] rounded-2xl text-center my-12">
          <div className="eyebrow text-xs font-bold text-[#577242] uppercase tracking-wider mb-2">
            START KEEPING 100% OF YOUR REVENUE
          </div>
          <h3 className="text-xl md:text-2xl font-extrabold text-[#1f2d26] mb-3">
            Ready to test RollOS alongside your current dispatch system?
          </h3>
          <p className="text-sm text-[#556658] max-w-xl mx-auto mb-6 leading-relaxed">
            Try the live dispatch board and customer booking widget free. No sales calls, no contracts, and no credit card required.
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
