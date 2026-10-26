import Link from 'next/link';
import Image from 'next/image';
import { ClickableImage } from '@/components/ui/clickable-image';
import {
  ArrowRight,
  Layers,
  MapPin,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { MarketingNav } from '@/components/marketing-nav';
import { SemanticBreadcrumb } from '@/components/semantic-breadcrumb';
import { Footer } from '@/components/footer';

export const metadata = {
  title: 'Roll-Off Dispatch Software — Visual Drag & Drop Board | RollOS',
  description:
    'Manage roll-off containers, drivers, swaps, and pickups with an intuitive drag-and-drop dispatch board. Track container locations, eliminate whiteboards, and prevent double-booking.',
  alternates: {
    canonical: 'https://rolloffdumpstersoftware.com/features/dispatch-board',
  },
};

export default function DispatchBoardFeaturePage() {
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'RollOS Roll-Off Dispatch Board Software',
    description:
      'Visual drag-and-drop dispatch scheduling and container inventory tracking software designed for roll-off dumpster fleets.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    url: 'https://rolloffdumpstersoftware.com/features/dispatch-board',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  const containerStatuses = [
    {
      name: 'Delivered / On Site',
      color: 'bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd]',
      desc: 'Container actively deployed on a customer driveway or commercial job site.',
    },
    {
      name: 'Scheduled Delivery',
      color: 'bg-[#fef3c7] text-[#b45309] border-[#fde68a]',
      desc: 'Booked job assigned to driver manifest for upcoming drop-off.',
    },
    {
      name: 'Swapped / Live Dump',
      color: 'bg-[#f3e8ff] text-[#7e22ce] border-[#e9d5ff]',
      desc: 'Full can pulled and fresh empty can dropped at the same address in 1 turn.',
    },
    {
      name: 'Final Pickup',
      color: 'bg-[#ffedd5] text-[#c2410c] border-[#fed7aa]',
      desc: 'Scheduled haul to transfer station or landfill with final scale ticket.',
    },
    {
      name: 'In Yard (Available)',
      color: 'bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]',
      desc: 'Empty container inspected and ready for immediate deployment.',
    },
  ];

  return (
    <main className="marketing">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <MarketingNav currentPath="/features" />

      {/* Semantic Breadcrumbs */}
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-4">
        <SemanticBreadcrumb
          items={[
            { name: 'Home', item: '/' },
            { name: 'Features', item: '/features' },
            { name: 'Dispatch Board', item: '/features/dispatch-board' },
          ]}
        />
      </div>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 py-6">
        <div className="eyebrow" style={{ color: '#82956d', marginBottom: 12 }}>
          PILLAR 02 · ROLL-OFF DISPATCH BOARD & FLEET CONTROL
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#20302a] leading-tight mb-4">
          Roll-off dispatch software that replaces the dry-erase whiteboard.
        </h1>
        <p className="text-lg text-[#556658] leading-relaxed mb-8 max-w-3xl">
          Tired of text message chains, lost post-it notes, and wondering which driver has can #14? RollOS gives you a clean visual dispatch board where you can see every container, reorder driver stops with drag-and-drop ease, and dispatch runs in seconds.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center gap-4 mb-10">
          <Link href="/signup" className="btn btn-orange text-sm py-3 px-6 font-bold">
            Start Free Demo <ArrowRight size={15} />
          </Link>
          <Link href="/pricing" className="btn btn-secondary text-sm py-3 px-6 font-semibold">
            View Transparent Pricing
          </Link>
        </div>

        {/* Main Board Screenshot */}
        <div className="bg-white p-3 md:p-5 rounded-3xl border border-[#dde4d4] shadow-md mb-12">
          <div className="rounded-2xl overflow-hidden border border-[#e5ebd9]">
            <ClickableImage
              src="/images/screenshots/roll-off-dumpster-dispatch-board-software.png"
              alt="RollOS visual roll-off dumpster dispatch board software interface"
              width={1440}
              height={900}
              priority
              className="w-full h-auto object-cover"
              badge="Visual Dispatch Board"
              caption="Visual drag-and-drop dispatch board: live container assignments, driver columns, and real-time status indicators."
            />
          </div>
          <div className="p-3 text-center text-xs text-[#6e8071]">
            Visual drag-and-drop dispatch board: live container assignments, driver columns, and real-time status indicators. (Click to inspect full resolution)
          </div>
        </div>
      </section>

      {/* Container Statuses Section */}
      <section className="max-w-5xl mx-auto px-6 py-10 border-t border-[#e2e8da]">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="eyebrow text-xs font-bold text-[#577242] uppercase tracking-wider mb-2">
            INSTANT FLEET VISIBILITY
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1f2d26]">
            Know Exactly Where Every Can Is in Real Time
          </h2>
          <p className="text-xs md:text-sm text-[#556658] mt-2">
            Every roll-off container is tracked by size, serial number, and live status so your team never loses equipment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {containerStatuses.map((st) => (
            <div
              key={st.name}
              className="p-4 bg-white border border-[#dde4d4] rounded-2xl shadow-sm space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold border ${st.color} mb-2`}>
                  {st.name}
                </span>
                <p className="text-xs text-[#556658] leading-relaxed">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Drag-and-Drop & Calendar Feature Split */}
      <section className="max-w-5xl mx-auto px-6 py-12 border-t border-[#e2e8da]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
          <div className="space-y-4">
            <div className="eyebrow text-xs font-bold text-[#577242] uppercase tracking-wider">
              DRAG-AND-DROP SCHEDULING
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1f2d26]">
              Reorder stops and assign drivers in 2 clicks.
            </h2>
            <p className="text-xs md:text-sm text-[#556658] leading-relaxed">
              When a customer calls demanding an urgent morning drop-off or an unexpected landfill delay backs up your day, simply drag the job card to resequence stops or shift it to another driver. Your driver’s phone link updates instantly with zero phone tag.
            </p>
            <div className="space-y-2.5 text-xs text-[#415346] pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#22c55e]" />
                <span>Move drops, pickups, and swaps between driver columns</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#22c55e]" />
                <span>Automatic route re-ordering so drivers run optimal paths</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#22c55e]" />
                <span>Handles last-minute customer schedule change requests</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-[#d8e2cf] shadow-md">
            <ClickableImage
              src="/images/screenshots/roll-off-container-delivery-pickup-calendar.png"
              alt="Roll-off container delivery and pickup calendar dispatch view"
              width={1200}
              height={750}
              className="w-full h-auto object-cover"
              badge="Delivery & Pickup Calendar"
              caption="Roll-off container delivery and pickup calendar dispatch view: drag stops and resequence driver routes."
            />
          </div>
        </div>

        {/* 3 Fleet Command Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm space-y-3">
            <span className="p-2.5 rounded-xl bg-[#eef3e6] text-[#2d4034] inline-block">
              <RefreshCw size={22} />
            </span>
            <h3 className="text-lg font-bold text-[#1f2d26]">1-Click Container Swaps</h3>
            <p className="text-xs text-[#556658] leading-relaxed">
              Construction contractors frequently fill a 30-yard dumpster and need an immediate replacement. RollOS handles &quot;Drop Empty & Pull Full&quot; swap jobs in a single ticket, linking the new bin serial number and routing the full can to the dump.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm space-y-3">
            <span className="p-2.5 rounded-xl bg-[#eef3e6] text-[#2d4034] inline-block">
              <Layers size={22} />
            </span>
            <h3 className="text-lg font-bold text-[#1f2d26]">Prevent Double-Booking</h3>
            <p className="text-xs text-[#556658] leading-relaxed">
              Never promise a 20-yard dumpster to a homeowner only to realize all 8 of your 20-yard bins are already out on jobs. RollOS syncs your online booking widget with your physical inventory so you never over-commit.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm space-y-3">
            <span className="p-2.5 rounded-xl bg-[#eef3e6] text-[#2d4034] inline-block">
              <MapPin size={22} />
            </span>
            <h3 className="text-lg font-bold text-[#1f2d26]">Placement GPS & Gate Codes</h3>
            <p className="text-xs text-[#556658] leading-relaxed">
              Store specific driver placement notes directly on each job: &quot;Place on right side of driveway against garage, watch for low telephone wire, gate code #4192.&quot; Drivers see notes before dropping the hoist.
            </p>
          </div>
        </div>
      </section>

      {/* Connected Pillars / Internal Linking */}
      <section className="max-w-5xl mx-auto px-6 py-12 border-t border-[#e2e8da]">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h3 className="text-xl font-bold text-[#1f2d26]">Where Does The Order Go Next?</h3>
          <p className="text-xs text-[#556658]">
            RollOS links dispatch directly to customer checkout, driver mobile routes, and landfill billing. Part of our unified <Link href="/" className="font-semibold text-[#1f2d26] underline hover:text-[#ea580c]">dumpster rental software</Link> platform:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/features/online-booking"
            className="p-6 bg-white border border-[#dde4d4] rounded-2xl hover:border-[#ea580c] transition-colors block group shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-bold text-[#ea580c] mb-1">PILLAR 01</div>
              <h4 className="text-base font-bold text-[#1f2d26] mb-2 group-hover:text-[#ea580c] transition-colors">
                24/7 Online Booking Widget
              </h4>
              <p className="text-xs text-[#556658] leading-relaxed mb-4">
                Online orders land automatically on your visual dispatch schedule ready for driver assignment.
              </p>
            </div>
            <div className="text-xs font-bold text-[#ea580c] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Explore dumpster rental online booking system</span>
              <ArrowRight size={13} />
            </div>
          </Link>

          <Link
            href="/features/driver-routes"
            className="p-6 bg-white border border-[#dde4d4] rounded-2xl hover:border-[#ea580c] transition-colors block group shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-bold text-[#ea580c] mb-1">PILLAR 03</div>
              <h4 className="text-base font-bold text-[#1f2d26] mb-2 group-hover:text-[#ea580c] transition-colors">
                1-Tap Driver SMS Routes
              </h4>
              <p className="text-xs text-[#556658] leading-relaxed mb-4">
                Text your daily manifest to drivers without requiring any app store downloads.
              </p>
            </div>
            <div className="text-xs font-bold text-[#ea580c] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Explore dumpster driver routing software</span>
              <ArrowRight size={13} />
            </div>
          </Link>

          <Link
            href="/features/tonnage-billing"
            className="p-6 bg-white border border-[#dde4d4] rounded-2xl hover:border-[#ea580c] transition-colors block group shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-bold text-[#ea580c] mb-1">PILLAR 04</div>
              <h4 className="text-base font-bold text-[#1f2d26] mb-2 group-hover:text-[#ea580c] transition-colors">
                Scale Tickets &amp; Tonnage Invoicing
              </h4>
              <p className="text-xs text-[#556658] leading-relaxed mb-4">
                Calculate overages and charge customer credit cards as soon as the container is dumped.
              </p>
            </div>
            <div className="text-xs font-bold text-[#ea580c] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Explore dumpster tonnage billing software</span>
              <ArrowRight size={13} />
            </div>
          </Link>
        </div>

        {/* Reciprocal link to Mother Ship & Equipment Guide */}
        <div className="mt-8 p-4 bg-[#f8faf7] border border-[#d8e2cf] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#556658]">
          <span>
            Part of RollOS suite. Comparing rigs? Read our{' '}
            <Link href="/blog/roll-off-truck-vs-dump-trailer" className="font-bold text-[#ea580c] hover:underline">
              roll-off truck vs dump trailer equipment guide
            </Link>
            .
          </span>
          <div className="flex items-center gap-4">
            <Link href="/" className="font-bold text-[#1f2d26] hover:text-[#ea580c] underline">
              Return to RollOS Dumpster Rental Software Homepage →
            </Link>
            <Link href="/features" className="font-bold text-[#ea580c] hover:underline">
              All Features Hub →
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Conversion Banner */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="p-8 bg-[#eef3e6] border border-[#d2dec3] rounded-2xl text-center">
          <div className="eyebrow text-xs font-bold text-[#577242] uppercase tracking-wider mb-2">
            TAKE CONTROL OF YOUR FLEET TODAY
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-[#1f2d26] mb-3">
            Stop losing dumpsters and wasting hours on whiteboard scheduling
          </h3>
          <p className="text-sm text-[#556658] max-w-xl mx-auto mb-6 leading-relaxed">
            Get started with RollOS in under 3 minutes. Test the visual dispatch board with your trucks and cans for free.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup" className="btn btn-orange">
              Start Free Demo <ArrowRight size={14} />
            </Link>
            <Link href="/pricing" className="btn btn-secondary">
              View Pricing ($0, $29, $99/mo)
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
