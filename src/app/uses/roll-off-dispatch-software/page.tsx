import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Brand } from '@/components/brand';

export const metadata = {
  title: 'Roll-Off Dispatch Board',
  description:
    'Dispatch deliveries, swaps, and pickups for a roll-off fleet. Assign a container and a driver, then send a phone link for navigation and a delivery photo.',
};

export default function DispatchSoftwarePage() {
  return (
    <main className="marketing">
      <nav className="marketing-nav">
        <Brand />
        <div className="marketing-links">
          <Link href="/">Home</Link>
          <Link href="/uses/dumpster-booking-system">Online Booking</Link>
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
          ROLL OFF DUMPSTER SOFTWARE · DISPATCH BOARD
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#20302a] mb-6">
          Visual dispatch software built for roll off dumpster operations
        </h1>

        <p className="text-lg text-[#556658] leading-relaxed mb-8">
          Stop managing thousands of dollars in dumpster rentals on whiteboards and text threads. Our <strong>roll off dispatch software</strong> organizes every delivery, container swap, and pickup into a clean, drag-and-drop kanban board designed specifically for roll off containers.
        </p>

        <div className="panel p-6 bg-white border border-[#dde4d4] rounded-xl mb-10 shadow-sm">
          <h2 className="text-xl font-bold text-[#1f2d26] mb-3">Sample dispatch board</h2>
          <p className="text-sm text-[#687864] mb-4">
            See active dumpster jobs across Booked, Dispatched, On-Site, and Picked Up with real-time driver status.
          </p>
          <div className="rounded-lg overflow-hidden border border-[#e5ebd9]">
            <Image
              src="/images/screenshots/roll-off-dumpster-dispatch-board-software.png"
              alt="Visual roll off dumpster dispatch software board"
              width={1440}
              height={900}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
          <div className="p-5 bg-white border border-[#dde4d4] rounded-xl">
            <h3 className="text-base font-bold text-[#1f2d26] mb-2">Driver SMS Route Links</h3>
            <p className="text-xs text-[#556658] leading-relaxed">
              Drivers don’t need to download an app from the App Store. Send them a secure SMS magic link with address navigation and camera drop photo uploads.
            </p>
          </div>
          <div className="p-5 bg-white border border-[#dde4d4] rounded-xl">
            <h3 className="text-base font-bold text-[#1f2d26] mb-2">Included on the free plan</h3>
            <p className="text-xs text-[#556658] leading-relaxed">
              The dispatch board is on the $0 plan. Online bookings on that plan include an $11.95 customer reservation fee. There is no route-optimization engine and no live driver GPS.
            </p>
          </div>
        </div>

        {/* Kyle Roof Reverse Silo Link to Home */}
        <div className="p-6 bg-[#f3f6ee] border border-[#d8e2cf] rounded-xl text-center my-10">
          <h3 className="text-lg font-bold text-[#1f2d26] mb-2">
            Need complete roll off fleet and booking control?
          </h3>
          <p className="text-xs text-[#556658] max-w-xl mx-auto mb-4">
            Connect your dispatch board to customer self-service booking, container tracking, and scale tonnage billing.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-sm text-[#ea580c] hover:underline">
            Return to the all-in-one roll off dumpster software platform <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </main>
  );
}
