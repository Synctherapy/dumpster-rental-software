import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, ShieldCheck, DollarSign } from 'lucide-react';
import { Brand } from '@/components/brand';

export const metadata = {
  title: 'Dumpster Rental Software Pricing — Free, $29/mo & $149/mo Plans',
  description:
    'Transparent dumpster rental software pricing. Start free at $0/month to get bookings while you sleep, $29/mo Starter for cash/check & calendar sync, or $149/mo Growth.',
};

const plans = [
  {
    name: 'Free Plan',
    price: '$0',
    badge: 'Most Popular for Independent Haulers',
    note: 'Get dumpster bookings while you sleep. Everything you need to eliminate phone tag and run daily operations.',
    items: [
      '24/7 Website Booking Widget & direct link',
      'Visual Drag-and-Drop Dispatch Board',
      'Driver SMS Magic Links (0 app install required)',
      'Driveway delivery photo proof capture',
      'Attach scale ticket & manual tonnage overages',
      'Customer pays standard $12 booking fee at checkout',
      'Keep 100% of base rental rates and overages',
      'No annual contract · Cancel anytime',
    ],
    cta: 'Start Free in 3 Minutes',
    popular: true,
  },
  {
    name: 'Starter Plan',
    price: '$29',
    badge: 'Full Operational Command',
    note: 'For active haulers managing contractor accounts on terms and requiring two-way calendar synchronization.',
    items: [
      'Everything included on the Free Plan',
      'Log offline Cash & Check payments (for contractor accounts)',
      '2-Way Google Calendar & Apple iCal sync feed',
      'Option to disable customer reservation fee',
      'Export financial logs & dispatch records',
      'No annual contract · Cancel anytime',
    ],
    cta: 'Choose Starter ($29/mo)',
    popular: false,
  },
  {
    name: 'Growth Fleet',
    price: '$149',
    badge: 'Multi-Truck Scale',
    note: 'Built for larger, expanding operations running multiple trucks and high-volume container inventory.',
    items: [
      'Everything included on the Starter Plan',
      'Multi-truck fleet scheduling and priority support',
      'Option to disable customer reservation fee',
      'Scale across dozens of active containers',
      'No per-user or per-driver seat fees',
      'No annual contract · Cancel anytime',
    ],
    cta: 'Choose Growth ($149/mo)',
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <main className="marketing">
      <nav className="marketing-nav">
        <Brand />
        <div className="marketing-links">
          <Link href="/">Home</Link>
          <Link href="/uses/dumpster-booking-system">Online Booking</Link>
          <Link href="/uses/roll-off-dispatch-software">Dispatch Board</Link>
          <Link href="/calculator">Savings Calculator</Link>
          <Link href="/vs">Compare</Link>
          <Link href="/signup" className="btn btn-orange">
            Try Free Demo <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#687864] hover:text-[#ea580c] transition-colors"
        >
          <ArrowLeft size={14} /> Back to Roll Off Dumpster Software
        </Link>

        <div className="eyebrow" style={{ color: '#82956d', marginTop: 16, marginBottom: 8 }}>
          SIMPLE, TRANSPARENT HAULER PRICING
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#20302a] mb-4">
          Dumpster rental software pricing that puts money in your pocket.
        </h1>
        <p className="text-lg text-[#556658] leading-relaxed mb-10 max-w-3xl">
          Get client bookings while you sleep with our free online booking software. No more phone tag,
          no lost jobs while driving, and zero bloated software bills. Start 100% free with no credit card required.
        </p>

        {/* 3 Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`p-6 bg-white border rounded-2xl flex flex-col justify-between shadow-sm ${
                plan.popular ? 'border-[#ea580c] ring-2 ring-[#ea580c]/20 relative' : 'border-[#dde4d4]'
              }`}
            >
              <div>
                {plan.popular && (
                  <div className="inline-block px-2.5 py-1 rounded-full bg-[#ffedd5] text-[#c2410c] text-[11px] font-bold mb-3">
                    {plan.badge}
                  </div>
                )}
                {!plan.popular && (
                  <div className="text-xs font-bold text-[#8a9d73] mb-3">{plan.badge}</div>
                )}
                <div className="text-xl font-bold text-[#1f2d26]">{plan.name}</div>
                <div className="text-4xl font-extrabold text-[#20302a] my-3">
                  {plan.price}
                  <span className="text-sm font-normal text-[#687864]"> / month</span>
                </div>
                <p className="text-xs text-[#556658] leading-relaxed mb-5 min-h-[48px]">{plan.note}</p>
                <div className="border-t border-[#edf2e7] pt-4 mb-6">
                  <ul className="text-xs text-[#334155] space-y-2.5">
                    {plan.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check size={14} className="mt-0.5 text-[#ea580c] flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <Link
                  href="/signup"
                  className={`btn w-full ${plan.popular ? 'btn-orange' : 'btn-dark'}`}
                  style={{ width: '100%' }}
                >
                  {plan.cta} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Hormozi Cost Comparison Box */}
        <div className="mt-12 p-8 bg-white border border-[#dde4d4] rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="text-[#ea580c]" size={24} />
            <h2 className="text-xl font-bold text-[#1f2d26]">
              How RollOS Compares to Legacy Competitor Software Costs
            </h2>
          </div>
          <p className="text-sm text-[#556658] leading-relaxed mb-6">
            Legacy software companies charge independent haulers hundreds of dollars each month before you haul your first bin.
            Here is the real financial math:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-[#fef2f2] border border-[#fecaca] rounded-xl">
              <strong className="text-[#dc2626] text-sm block mb-1">Docket / ServiceCore</strong>
              <div className="text-2xl font-bold text-[#991b1b] my-1">$4,200+ / yr</div>
              <p className="text-[#7f1d1d] leading-relaxed">
                $350/mo base + $1,500 setup fees + mandatory sales calls. Hauler pays 100% of the cost out of margin.
              </p>
            </div>

            <div className="p-4 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl">
              <strong className="text-[#16a34a] text-sm block mb-1">RollOS Free Plan</strong>
              <div className="text-2xl font-bold text-[#166534] my-1">$0 / yr</div>
              <p className="text-[#14532d] leading-relaxed">
                Zero software bills. Customer pays a $12 booking fee at checkout. You keep 100% of your rental money ($4,200/yr saved).
              </p>
            </div>

            <div className="p-4 bg-[#f8faf6] border border-[#dce6d3] rounded-xl">
              <strong className="text-[#2e7d32] text-sm block mb-1">RollOS Starter Plan</strong>
              <div className="text-2xl font-bold text-[#1f2d26] my-1">$348 / yr</div>
              <p className="text-[#47603c] leading-relaxed">
                $29/mo flat. Includes offline cash/check logging and calendar sync. Over $3,850 in annual software savings.
              </p>
            </div>
          </div>
        </div>

        {/* Clear Truth & Transparency Box */}
        <div className="mt-8 p-6 bg-[#f3f6ee] border border-[#d8e2cf] rounded-2xl text-xs text-[#334155] leading-relaxed">
          <h3 className="text-sm font-bold text-[#1f2d26] mb-2 flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#ea580c]" />
            Honest Product Commitments
          </h3>
          <p>
            RollOS is designed for clean, high-speed operations. We do not require long-term contracts, setup fees, or proprietary hardware.
            Drivers never have to download an app from the App Store—they use secure, 1-tap SMS web links. Landfill scale ticket weights are entered
            directly against the job, and navigation opens in the driver’s preferred map app. Stripe credit card processing fees are standard and separate.
          </p>
        </div>

        {/* Reverse Silo CTA */}
        <div className="p-8 bg-[#eef3e6] border border-[#d2dec3] rounded-2xl text-center my-10">
          <div className="eyebrow text-xs font-bold text-[#577242] uppercase tracking-wider mb-2">
            READY TO ELIMINATE PHONE TAG?
          </div>
          <h3 className="text-xl md:text-2xl font-extrabold text-[#1f2d26] mb-3">
            Start taking dumpster rentals online in under 3 minutes.
          </h3>
          <p className="text-sm text-[#556658] max-w-xl mx-auto mb-6 leading-relaxed">
            Test the live dispatch board and customer booking widget free. No sales calls, no contracts, and no credit card required.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup" className="btn btn-orange">
              Start Free Demo <ArrowRight size={14} />
            </Link>
            <Link href="/" className="btn btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
