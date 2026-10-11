import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Globe,
  Truck,
  Smartphone,
  Scale,
  CheckCircle2,
  Zap,
  Clock,
  DollarSign,
} from 'lucide-react';
import { MarketingNav } from '@/components/marketing-nav';
import { Footer } from '@/components/footer';

export const metadata = {
  title: 'Roll-Off Dumpster Software Features — Complete Suite | RollOS',
  description:
    'Explore the 4 core pillars of RollOS: 24/7 online booking, visual drag-and-drop dispatch board, 1-tap SMS driver routes with zero app downloads, and scale ticket tonnage invoicing.',
  alternates: {
    canonical: 'https://rolloffdumpstersoftware.com/features',
  },
};

export default function FeaturesHubPage() {
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'RollOS Dumpster Rental Software Suite',
    description:
      'All-in-one operations, online booking, dispatching, driver mobile routing, and tonnage billing platform built exclusively for independent roll-off dumpster haulers.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any (Web Browser)',
    url: 'https://rolloffdumpstersoftware.com/features',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      '24/7 Online Booking Widget with Stripe Connect',
      'Drag-and-Drop Roll-Off Dispatch Board',
      '1-Tap Driver SMS Routes (Zero App Store Downloads)',
      'Scale Ticket Photo Upload & Automated Tonnage Invoicing',
    ],
  };

  const pillars = [
    {
      title: '24/7 Online Booking Widget',
      slug: '/features/online-booking',
      pillarNumber: 'Pillar 01',
      icon: Globe,
      badge: 'Capture After-Hours Revenue',
      image: '/images/screenshots/dumpster-rental-online-booking-system.png',
      headline: 'Book dumpsters and collect upfront card payments while you sleep',
      description:
        'Over 40% of homeowners and contractors search for dumpsters in the evening when your phone is turned off. RollOS embeds seamlessly on your existing website or social page, validates delivery ZIP codes, checks container inventory, collects upfront deposits, and binds your rental agreement automatically.',
      highlights: [
        'Embed on any website (WordPress, Squarespace, Wix, Webflow) in 60 seconds',
        'Direct Stripe Connect payments—money goes directly into your bank account',
        'Automatic ZIP code delivery zone rate calculation & travel surcharges',
        'Digital terms of service & property damage waiver acceptance at checkout',
      ],
      linkText: 'Explore Online Booking Engine',
    },
    {
      title: 'Drag-and-Drop Dispatch Board',
      slug: '/features/dispatch-board',
      pillarNumber: 'Pillar 02',
      icon: Truck,
      badge: 'Visual Fleet Command',
      image: '/images/screenshots/roll-off-dumpster-dispatch-board-software.png',
      headline: 'Eliminate whiteboard chaos and know where every can is in real time',
      description:
        'Replace messy dry-erase boards and scattered spreadsheets with a fast, intuitive dispatch calendar. Drag orders into driver schedules, view container statuses (Delivered, In Transit, In Yard, Swapped, Overdue for Pickup), and prevent double-booking with live inventory tracking.',
      highlights: [
        'Color-coded container status tags (Delivered, Scheduled, In Yard, Swapped)',
        'Fast drag-and-drop job rescheduling across days and drivers',
        'Visual calendar view showing upcoming drop-offs, swaps, and final pickups',
        'Container serial number and GPS drop-location tracking',
      ],
      linkText: 'Explore Dispatch Board',
    },
    {
      title: '1-Tap Driver SMS Routes',
      slug: '/features/driver-routes',
      pillarNumber: 'Pillar 03',
      icon: Smartphone,
      badge: 'Zero App Installs Required',
      image: '/images/screenshots/mobile-driver-sms-delivery-proof-app.png',
      headline: 'Send daily manifests to drivers via text message—no app store downloads',
      description:
        'Drivers hate downloading bulky enterprise apps from the App Store and remembering complicated passwords. RollOS texts your driver a secure 1-tap mobile web link each morning. They open turn-by-turn navigation in Google or Apple Maps, view gate codes, upload delivery photo proof, and mark jobs done in seconds.',
      highlights: [
        'Works instantly on any iPhone or Android phone browser—zero app installs',
        '1-tap turn-by-turn directions launched in Google Maps, Apple Maps, or Waze',
        'Photo proof of placement capture to prevent false driveway damage claims',
        'Driver scale ticket snapshot upload directly from the transfer station',
      ],
      linkText: 'Explore Driver SMS Routing',
    },
    {
      title: 'Scale Tickets & Tonnage Invoicing',
      slug: '/features/tonnage-billing',
      pillarNumber: 'Pillar 04',
      icon: Scale,
      badge: 'Zero Manual Overage Math',
      image: '/images/screenshots/dumpster-fleet-inventory-management-software.png',
      headline: 'Automatically calculate disposal overages and charge the card on file',
      description:
        'Stop eating landfill disposal overweight charges. When your driver uploads a photo of the transfer station scale slip, RollOS automatically calculates net weight minus your included allowance, computes the exact overage fee, attaches the scale ticket photo to the digital invoice, and charges the customer’s card on file.',
      highlights: [
        'Automatic tare and gross weight subtraction to determine net tons',
        'Attaches certified scale ticket photos directly to customer invoices',
        '1-click customer credit card charging via Stripe Connect—no awkward phone calls',
        'Itemized line items for extended rental days and hazardous waste penalties',
      ],
      linkText: 'Explore Tonnage Billing',
    },
  ];

  return (
    <main className="marketing">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <MarketingNav currentPath="/features" />

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-12 pb-8">
        <div className="eyebrow" style={{ color: '#82956d', marginBottom: 12 }}>
          ROLLOS SOFTWARE PLATFORM · 4 CORE OPERATIONAL PILLARS
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#20302a] leading-tight mb-4">
          The all-in-one roll-off software built for haulers who hate software.
        </h1>
        <p className="text-lg text-[#556658] leading-relaxed mb-8 max-w-3xl">
          Most waste software is clunky, overpriced, and built for massive municipal garbage haulers. RollOS is built from the ground up for independent 1 to 20 truck roll-off operations: fast to set up, dirt simple for drivers, and focused strictly on booking dumpsters, dispatching routes, and getting you paid.
        </p>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-white border border-[#dde4d4] rounded-2xl shadow-sm mb-12">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-[#eef3e6] text-[#2d4034]">
              <Clock size={18} />
            </span>
            <div>
              <div className="text-xs font-bold text-[#1f2d26]">3-Minute Setup</div>
              <div className="text-[11px] text-[#556658]">Zero sales demos needed</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-[#eef3e6] text-[#2d4034]">
              <Smartphone size={18} />
            </span>
            <div>
              <div className="text-xs font-bold text-[#1f2d26]">0 App Installs</div>
              <div className="text-[11px] text-[#556658]">Instant SMS driver links</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-[#eef3e6] text-[#2d4034]">
              <DollarSign size={18} />
            </span>
            <div>
              <div className="text-xs font-bold text-[#1f2d26]">100% Payouts</div>
              <div className="text-[11px] text-[#556658]">Direct Stripe Connect</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-[#eef3e6] text-[#2d4034]">
              <Zap size={18} />
            </span>
            <div>
              <div className="text-xs font-bold text-[#1f2d26]">Free Plan Available</div>
              <div className="text-[11px] text-[#556658]">$0/mo to get started</div>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Pillars Deep Dives */}
      <section className="max-w-5xl mx-auto px-6 py-6 space-y-16">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          const isEven = idx % 2 === 1;
          return (
            <div
              key={pillar.slug}
              id={pillar.slug.replace('/features/', '')}
              className={`p-8 md:p-10 bg-white border border-[#dde4d4] rounded-3xl shadow-sm flex flex-col ${
                isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'
              } items-center gap-10 hover:border-[#ea580c] transition-all`}
            >
              {/* Text Side */}
              <div className="flex-1 space-y-5">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-[#eef3e6] text-[#2d4034]">
                    <Icon size={18} />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#ea580c] bg-[#fff7ed] px-3 py-1 rounded-full border border-[#fed7aa]">
                    {pillar.pillarNumber}
                  </span>
                  <span className="text-xs font-semibold text-[#687864]">{pillar.badge}</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1f2d26] leading-snug">
                  {pillar.title}
                </h2>

                <p className="text-sm font-semibold text-[#3b4e41]">{pillar.headline}</p>

                <p className="text-xs md:text-sm text-[#556658] leading-relaxed">
                  {pillar.description}
                </p>

                <div className="space-y-2.5 pt-2">
                  {pillar.highlights.map((item) => (
                    <div key={item} className="flex items-start gap-2.5 text-xs text-[#3a4c3f]">
                      <CheckCircle2 size={15} className="text-[#22c55e] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Link
                    href={pillar.slug}
                    className="btn btn-dark text-xs py-3 px-5 font-bold inline-flex items-center gap-2 hover:bg-[#ea580c] hover:border-[#ea580c] transition-colors"
                  >
                    <span>{pillar.linkText}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Image / Visual Side */}
              <div className="flex-1 w-full">
                <Link href={pillar.slug} className="block group">
                  <div className="rounded-2xl overflow-hidden border border-[#d8e2cf] shadow-md group-hover:shadow-lg transition-all group-hover:border-[#ea580c]">
                    <Image
                      src={pillar.image}
                      alt={`${pillar.title} roll-off software interface preview`}
                      width={1200}
                      height={750}
                      className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </section>

      {/* Complete Workflow Infographic / Steps */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-[#e2e8da] mt-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="eyebrow text-xs font-bold text-[#577242] uppercase tracking-wider mb-2">
            HOW IT WORKS · THE END-TO-END WORKFLOW
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1f2d26]">
            From Customer Order to Scale Ticket Payment in 4 Steps
          </h2>
          <p className="text-xs md:text-sm text-[#556658] mt-2">
            See how RollOS automates the entire lifecycle of a roll-off dumpster job.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl relative shadow-sm">
            <div className="text-3xl font-black text-[#d3ded0] mb-2">01</div>
            <h3 className="text-base font-bold text-[#1f2d26] mb-2">Customer Self-Books</h3>
            <p className="text-xs text-[#556658] leading-relaxed">
              Customer chooses 10, 20, 30, or 40-yd can, selects drop-off date, signs waiver, and pays credit card deposit online.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl relative shadow-sm">
            <div className="text-3xl font-black text-[#d3ded0] mb-2">02</div>
            <h3 className="text-base font-bold text-[#1f2d26] mb-2">1-Click Dispatch</h3>
            <p className="text-xs text-[#556658] leading-relaxed">
              Order lands instantly on your visual board. Drag it to a truck driver’s morning manifest with zero manual re-typing.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl relative shadow-sm">
            <div className="text-3xl font-black text-[#d3ded0] mb-2">03</div>
            <h3 className="text-base font-bold text-[#1f2d26] mb-2">Driver SMS Route</h3>
            <p className="text-xs text-[#556658] leading-relaxed">
              Driver opens text message link. Taps address for GPS navigation, captures photo proof of placement, and marks delivered.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl relative shadow-sm">
            <div className="text-3xl font-black text-[#d3ded0] mb-2">04</div>
            <h3 className="text-base font-bold text-[#1f2d26] mb-2">Scale Slip Invoiced</h3>
            <p className="text-xs text-[#556658] leading-relaxed">
              Driver snaps photo of landfill scale slip at the dump. RollOS calculates overage and automatically bills customer card.
            </p>
          </div>
        </div>
      </section>

      {/* Cross-Silo Hub Navigation */}
      <section className="max-w-5xl mx-auto px-6 py-8 border-t border-[#e2e8da]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#f7f9f4] border border-[#dce3d4] rounded-2xl">
            <h3 className="text-base font-bold text-[#1f2d26] mb-2">Free Calculators</h3>
            <p className="text-xs text-[#556658] mb-4">Run the math on disposal overages or competitor software costs.</p>
            <Link href="/tools" className="text-xs font-bold text-[#ea580c] flex items-center gap-1 hover:underline">
              <span>Explore Hauler Tools Hub</span> <ArrowRight size={13} />
            </Link>
          </div>

          <div className="p-6 bg-[#f7f9f4] border border-[#dce3d4] rounded-2xl">
            <h3 className="text-base font-bold text-[#1f2d26] mb-2">Free Legal Templates</h3>
            <p className="text-xs text-[#556658] mb-4">Download rental contract agreements and commercial invoices.</p>
            <Link href="/templates" className="text-xs font-bold text-[#ea580c] flex items-center gap-1 hover:underline">
              <span>Explore Templates Hub</span> <ArrowRight size={13} />
            </Link>
          </div>

          <div className="p-6 bg-[#f7f9f4] border border-[#dce3d4] rounded-2xl">
            <h3 className="text-base font-bold text-[#1f2d26] mb-2">Software Comparisons</h3>
            <p className="text-xs text-[#556658] mb-4">Compare RollOS vs Docket, ServiceCore, and DRS side-by-side.</p>
            <Link href="/compare" className="text-xs font-bold text-[#ea580c] flex items-center gap-1 hover:underline">
              <span>Explore Comparison Hub</span> <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Conversion Banner */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="p-8 bg-[#eef3e6] border border-[#d2dec3] rounded-2xl text-center">
          <div className="eyebrow text-xs font-bold text-[#577242] uppercase tracking-wider mb-2">
            FREE TO START · UPGRADE AS YOU GROW
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-[#1f2d26] mb-3">
            Ready to test all 4 pillars in your dumpster business?
          </h3>
          <p className="text-sm text-[#556658] max-w-xl mx-auto mb-6 leading-relaxed">
            Create your account in under 3 minutes. Test the online booking widget and dispatch board with your actual cans—no credit card required.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup" className="btn btn-orange">
              Start Free Demo Now <ArrowRight size={14} />
            </Link>
            <Link href="/pricing" className="btn btn-secondary">
              View Pricing ($0, $29, $149/mo)
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
