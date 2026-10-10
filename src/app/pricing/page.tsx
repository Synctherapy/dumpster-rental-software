import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Brand } from '@/components/brand';

export const metadata = {
  title: 'Dumpster Rental Software Pricing',
  description:
    'RollOS pricing: free at $0/month, Starter at $29/month, Growth at $149/month. The free plan includes an $11.95 customer reservation fee. Stripe fees are separate.',
};

const plans = [
  {
    name: 'Free',
    price: '$0',
    note: 'Start here.',
    items: [
      'Booking link and website embed',
      'Dispatch board',
      'Driver links, no app install',
      'Delivery photo proof',
      'Manual tonnage on the invoice',
      '$11.95 customer reservation fee on online bookings',
    ],
  },
  {
    name: 'Starter',
    price: '$29',
    note: 'Turn the customer fee off.',
    items: [
      'Everything on Free',
      'Customer reservation fee can be disabled',
      'Cash and check payment log',
      'Calendar export and iCal sync',
    ],
  },
  {
    name: 'Growth',
    price: '$149',
    note: 'Same tools, priced for a larger fleet.',
    items: [
      'Everything on Starter',
      'Customer reservation fee can be disabled',
      'No annual contract',
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="marketing">
      <nav className="marketing-nav">
        <Brand />
        <div className="marketing-links">
          <Link href="/">Home</Link>
          <Link href="/signup" className="btn btn-orange">
            Start free <ArrowRight size={14} />
          </Link>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-[#687864]">
          <ArrowLeft size={14} /> Back to dumpster rental software
        </Link>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#20302a] mt-4 mb-4">
          RollOS pricing: $0, $29, or $149 a month
        </h1>
        <p className="text-lg text-[#556658] leading-relaxed mb-8">
          Start on the free plan. Online bookings on that plan add an $11.95 customer reservation
          fee, shown at checkout. Starter and Growth can turn that fee off. Stripe’s card-processing
          fees are separate on every plan. There is no annual contract.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div key={plan.name} className="p-5 bg-white border border-[#dde4d4] rounded-xl">
              <div className="text-xs font-bold text-[#8a9d73]">{plan.name}</div>
              <div className="text-3xl font-extrabold text-[#20302a] my-2">
                {plan.price}
                <span className="text-sm font-normal text-[#687864]"> / month</span>
              </div>
              <p className="text-sm text-[#556658] mb-3">{plan.note}</p>
              <ul className="text-sm text-[#334155] space-y-1">
                {plan.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check size={14} className="mt-1 text-[#ea580c]" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 p-5 bg-[#f3f6ee] border border-[#d8e2cf] rounded-xl text-sm text-[#334155] leading-relaxed">
          <h2 className="text-lg font-bold text-[#1f2d26] mb-2">What is not included</h2>
          <p>
            RollOS does not currently include scale-ticket OCR, live driver GPS, route optimization,
            missed-call text-back, or a custom booking domain. Weight is entered from the landfill
            ticket. Maps open from the driver link. Those limits are the same on every plan.
          </p>
        </div>
        <Link href="/signup" className="btn btn-orange mt-8 inline-flex">
          Start free <ArrowRight size={14} />
        </Link>
      </div>
    </main>
  );
}
