import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Brand } from '@/components/brand';

export const metadata = {
  title: 'Online Booking for Dumpster Rentals',
  description:
    'Add a dumpster booking link or embed to your existing website. ZIP check, dates, deposit, and the $11.95 free-plan reservation fee shown at checkout.',
};

export default function BookingSystemPage() {
  return (
    <main className="marketing">
      <nav className="marketing-nav">
        <Brand />
        <div className="marketing-links">
          <Link href="/">Home</Link>
          <Link href="/uses/roll-off-dispatch-software">Dispatch Board</Link>
          <Link href="/vs/docket">RollOS vs Docket</Link>
          <Link href="/signup" className="btn btn-orange">
            Start Free Demo <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-4">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-[#687864] hover:text-[#ea580c]">
            <ArrowLeft size={14} /> Back to Roll Off Dumpster Software
          </Link>
        </div>

        <div className="eyebrow" style={{ color: '#82956d', marginBottom: 12 }}>
          ROLL OFF DUMPSTER SOFTWARE · ONLINE BOOKING
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#20302a] mb-6">
          Online booking system for roll off dumpster rental haulers
        </h1>

        <p className="text-lg text-[#556658] leading-relaxed mb-8">
          Tired of answering calls while driving your roll off truck? An automated <strong>dumpster rental online booking system</strong> captures customer orders 24 hours a day, validates delivery ZIP codes, checks container inventory, and collects payments upfront so you never chase checks again.
        </p>

        <div className="panel p-6 bg-white border border-[#dde4d4] rounded-xl mb-10 shadow-sm">
          <h2 className="text-xl font-bold text-[#1f2d26] mb-3">Live Booking Interface</h2>
          <p className="text-sm text-[#687864] mb-4">
            See how customers book a 10, 20, 30, or 40-yard roll off bin in under 60 seconds with transparent pricing.
          </p>
          <div className="rounded-lg overflow-hidden border border-[#e5ebd9]">
            <Image
              src="/images/screenshots/dumpster-rental-online-booking-system.png"
              alt="Dumpster rental online booking system checkout interface"
              width={1440}
              height={900}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
          <div className="p-5 bg-white border border-[#dde4d4] rounded-xl">
            <h3 className="text-base font-bold text-[#1f2d26] mb-2">Embed on Any Website</h3>
            <p className="text-xs text-[#556658] leading-relaxed">
              Add our lightweight checkout widget to WordPress, Squarespace, Wix, or custom HTML in 5 minutes with a clean copy-paste embed code.
            </p>
          </div>
          <div className="p-5 bg-white border border-[#dde4d4] rounded-xl">
            <h3 className="text-base font-bold text-[#1f2d26] mb-2">Free plan, paid plans optional</h3>
            <p className="text-xs text-[#556658] leading-relaxed">
              Start at $0/month. Online bookings on the free plan add an $11.95 customer reservation fee. Starter ($29) and Growth ($149) can turn that fee off.
            </p>
          </div>
        </div>

        {/* Kyle Roof Reverse Silo Link to Home */}
        <div className="p-6 bg-[#f3f6ee] border border-[#d8e2cf] rounded-xl text-center my-10">
          <h3 className="text-lg font-bold text-[#1f2d26] mb-2">
            Looking for complete dumpster business management?
          </h3>
          <p className="text-xs text-[#556658] max-w-xl mx-auto mb-4">
            RollOS is dumpster rental software: booking, dispatch, driver links, and billing. Free to start.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-sm text-[#ea580c] hover:underline">
            Explore the complete roll off dumpster software platform <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </main>
  );
}
