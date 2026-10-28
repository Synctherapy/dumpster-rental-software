import Link from 'next/link';
import Image from 'next/image';
import { ClickableImage } from '@/components/ui/clickable-image';
import {
  ArrowRight,
  Smartphone,
  Navigation,
  Camera,
  CheckCircle2,
  ShieldCheck,
  Key,
} from 'lucide-react';
import { MarketingNav } from '@/components/marketing-nav';
import { SemanticBreadcrumb } from '@/components/semantic-breadcrumb';
import { Footer } from '@/components/footer';

export const metadata = {
  title: 'Dumpster Driver Routing Software — 1-Tap SMS Links (No App)',
  description:
    'Dispatch roll-off drivers via 1-tap SMS web links with zero app store downloads. Turn-by-turn navigation, delivery photo proof, gate codes, and scale ticket uploads.',
  alternates: {
    canonical: 'https://rolloffdumpstersoftware.com/features/driver-routes',
  },
};

export default function DriverRoutesFeaturePage() {
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'RollOS 1-Tap Driver SMS Routes Software',
    description:
      'Browser-based mobile driver routing and dispatch execution application for roll-off dumpster drivers requiring zero app downloads.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'iOS, Android (Mobile Web)',
    url: 'https://rolloffdumpstersoftware.com/features/driver-routes',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  const driverSteps = [
    {
      num: '01',
      title: 'Morning SMS Link',
      desc: 'Driver receives an automated text message each morning with their unique, secure route link. No login credentials or passwords required.',
    },
    {
      num: '02',
      title: '1-Tap GPS Navigation',
      desc: 'Tapping the customer address launches Google Maps, Apple Maps, or Waze immediately with the exact drop coordinates.',
    },
    {
      num: '03',
      title: 'Placement Notes & Gate Codes',
      desc: 'Driver sees customer delivery instructions, gate codes, overhead wire alerts, and exact driveway placement requests on screen.',
    },
    {
      num: '04',
      title: 'Photo Proof of Placement',
      desc: 'Driver snaps a photo of the landed container with their phone camera. Stored with timestamp to prevent driveway damage disputes.',
    },
    {
      num: '05',
      title: 'Scale Slip Upload at Landfill',
      desc: 'After dumping at the transfer station, driver snaps a photo of the scale slip to trigger automatic customer tonnage invoicing.',
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
            { name: 'Driver SMS Routes', item: '/features/driver-routes' },
          ]}
        />
      </div>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 py-6">
        <div className="eyebrow" style={{ color: '#82956d', marginBottom: 12 }}>
          PILLAR 03 · MOBILE DRIVER DISPATCH & SMS ROUTING
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#20302a] leading-tight mb-4">
          Dumpster driver routing software that doesn’t require an App Store download.
        </h1>
        <p className="text-lg text-[#556658] leading-relaxed mb-8 max-w-3xl">
          Drivers hate clunky enterprise software. They forget Apple ID passwords, refuse to download apps that track their location off the clock, and get frustrated by complex mobile menus. RollOS texts your driver a fast 1-tap mobile link that runs directly in their mobile browser on any smartphone.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center gap-4 mb-10">
          <Link href="/signup" className="btn btn-orange text-sm py-3 px-6 font-bold">
            Start Free Demo <ArrowRight size={15} />
          </Link>
          <Link href="/pricing" className="btn btn-secondary text-sm py-3 px-6 font-semibold">
            View Pricing Plans
          </Link>
        </div>

        {/* Driver App Screenshot */}
        <div className="bg-white p-3 md:p-5 rounded-3xl border border-[#dde4d4] shadow-md mb-12">
          <div className="rounded-2xl overflow-hidden border border-[#e5ebd9] max-w-2xl mx-auto">
            <ClickableImage
              src="/images/screenshots/mobile-driver-sms-delivery-proof-app.png"
              alt="RollOS mobile driver SMS delivery proof interface running on smartphone"
              width={1000}
              height={800}
              priority
              className="w-full h-auto object-cover"
              badge="Driver Mobile Web Interface"
              caption="Driver mobile web link: 1-tap directions, photo proof of delivery, and instant status updates without installing any app."
            />
          </div>
          <div className="p-3 text-center text-xs text-[#6e8071]">
            Driver mobile web link: 1-tap directions, photo proof of delivery, and instant status updates without installing any app. (Click to inspect full resolution)
          </div>
        </div>
      </section>

      {/* Why Drivers Love It vs Legacy Apps */}
      <section className="max-w-5xl mx-auto px-6 py-10 border-t border-[#e2e8da]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="eyebrow text-xs font-bold text-[#577242] uppercase tracking-wider mb-2">
            ZERO FRICTION ONBOARDING
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1f2d26]">
            Why Roll-Off Drivers Actually Use RollOS
          </h2>
          <p className="text-xs md:text-sm text-[#556658] mt-2">
            Most dispatch software fails because drivers simply refuse to use it. We eliminated every barrier to compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm space-y-3">
            <span className="p-2.5 rounded-xl bg-[#eef3e6] text-[#2d4034] inline-block">
              <Smartphone size={22} />
            </span>
            <h3 className="text-lg font-bold text-[#1f2d26]">0 App Downloads or Updates</h3>
            <p className="text-xs text-[#556658] leading-relaxed">
              No need to troubleshoot Apple ID passwords, Google Play updates, or device storage errors. The driver taps an SMS link and is instantly viewing their schedule for the day.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm space-y-3">
            <span className="p-2.5 rounded-xl bg-[#eef3e6] text-[#2d4034] inline-block">
              <Navigation size={22} />
            </span>
            <h3 className="text-lg font-bold text-[#1f2d26]">Turnkey Native Navigation</h3>
            <p className="text-xs text-[#556658] leading-relaxed">
              One tap opens directions in their favorite navigation app: Google Maps, Apple Maps, or Waze. No clunky proprietary in-app maps with outdated road data.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm space-y-3">
            <span className="p-2.5 rounded-xl bg-[#eef3e6] text-[#2d4034] inline-block">
              <Camera size={22} />
            </span>
            <h3 className="text-lg font-bold text-[#1f2d26]">Photo Proof Delivery Protection</h3>
            <p className="text-xs text-[#556658] leading-relaxed">
              Before dropping the hoist, driver snaps a photo showing driveway condition and wood blocking under rollers. Timestamped and permanently logged against the order.
            </p>
          </div>
        </div>
      </section>

      {/* Driver Manifest Workflow Steps */}
      <section className="max-w-5xl mx-auto px-6 py-12 border-t border-[#e2e8da]">
        <div className="mb-8">
          <div className="eyebrow text-xs font-bold text-[#577242] uppercase tracking-wider mb-2">
            DAILY OPERATIONAL CADENCE
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1f2d26]">
            The 5-Step Driver Manifest Flow
          </h2>
          <p className="text-xs md:text-sm text-[#556658]">
            Simple, repeatable, and built for heavy equipment operators with gloves on.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {driverSteps.map((step) => (
            <div
              key={step.num}
              className="p-5 bg-white border border-[#dde4d4] rounded-2xl shadow-sm space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="text-2xl font-black text-[#82956d] mb-2 block">{step.num}</span>
                <h3 className="text-sm font-bold text-[#1f2d26] mb-1">{step.title}</h3>
                <p className="text-xs text-[#556658] leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Proof of Delivery / Gate Code Features Split */}
      <section className="max-w-5xl mx-auto px-6 py-12 border-t border-[#e2e8da]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-white border border-[#dde4d4] rounded-2xl shadow-sm space-y-4">
            <span className="p-2.5 rounded-xl bg-[#fee2e2] text-[#dc2626] inline-block">
              <ShieldCheck size={22} />
            </span>
            <h3 className="text-xl font-bold text-[#1f2d26]">
              End Driveway Damage Disputes Forever
            </h3>
            <p className="text-xs md:text-sm text-[#556658] leading-relaxed">
              When a customer falsely claims your truck cracked their asphalt or left oil stains, pull up the driver’s high-resolution delivery photo. RollOS captures the state of the property before and after placement with exact GPS and time coordinates.
            </p>
            <div className="space-y-2 text-xs text-[#415346] pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#22c55e]" />
                <span>Photos automatically attached to customer order file</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#22c55e]" />
                <span>Instant visual proof in case of bank payment disputes</span>
              </div>
            </div>
          </div>

          <div className="p-8 bg-white border border-[#dde4d4] rounded-2xl shadow-sm space-y-4">
            <span className="p-2.5 rounded-xl bg-[#e0e7ff] text-[#4f46e5] inline-block">
              <Key size={22} />
            </span>
            <h3 className="text-xl font-bold text-[#1f2d26]">
              Gate Codes, Dogs & Special Instructions
            </h3>
            <p className="text-xs md:text-sm text-[#556658] leading-relaxed">
              Never get an angry call from a driver locked outside a commercial job site gate. Customer drop instructions captured during online booking appear in big, bold text on the driver’s stop screen: gate combos, dog warnings, and spotter instructions.
            </p>
            <div className="space-y-2 text-xs text-[#415346] pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#22c55e]" />
                <span>Automatic customer SMS notification when driver is en-route</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#22c55e]" />
                <span>Driver can click-to-call customer directly with 1 tap</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Connected Pillars / Internal Linking */}
      <section className="max-w-5xl mx-auto px-6 py-12 border-t border-[#e2e8da]">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h3 className="text-xl font-bold text-[#1f2d26]">Where Does The Order Go Next?</h3>
          <p className="text-xs text-[#556658]">
            Driver SMS routing works hand-in-hand with dispatch schedules and automated tonnage billing. Part of our unified <Link href="/" className="font-semibold text-[#1f2d26] underline hover:text-[#ea580c]">dumpster rental software</Link> platform:
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
                Customers book online with drop instructions that feed straight to driver manifests.
              </p>
            </div>
            <div className="text-xs font-bold text-[#ea580c] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Explore dumpster rental online booking system</span>
              <ArrowRight size={13} />
            </div>
          </Link>

          <Link
            href="/features/dispatch-board"
            className="p-6 bg-white border border-[#dde4d4] rounded-2xl hover:border-[#ea580c] transition-colors block group shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-bold text-[#ea580c] mb-1">PILLAR 02</div>
              <h4 className="text-base font-bold text-[#1f2d26] mb-2 group-hover:text-[#ea580c] transition-colors">
                Visual Roll-Off Dispatch Board
              </h4>
              <p className="text-xs text-[#556658] leading-relaxed mb-4">
                Assign stops and reorder routes on the dispatch board with instant driver phone sync.
              </p>
            </div>
            <div className="text-xs font-bold text-[#ea580c] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Explore roll-off dispatch software</span>
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
                Driver scale slip photos immediately trigger overage billing and card charges.
              </p>
            </div>
            <div className="text-xs font-bold text-[#ea580c] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Explore dumpster tonnage billing software</span>
              <ArrowRight size={13} />
            </div>
          </Link>
        </div>

        {/* Reciprocal link to Mother Ship & Contract Template */}
        <div className="mt-8 p-4 bg-[#f8faf7] border border-[#d8e2cf] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#556658]">
          <span>
            Part of RollOS suite. Need driveway damage protection? Get our free{' '}
            <Link href="/templates/dumpster-rental-contract" className="font-bold text-[#ea580c] hover:underline">
              dumpster rental contract template
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
            FREE TO START · INSTANT DRIVER LINKS
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-[#1f2d26] mb-3">
            Send your first driver link in under 3 minutes
          </h3>
          <p className="text-sm text-[#556658] max-w-xl mx-auto mb-6 leading-relaxed">
            Test the driver mobile experience on your own smartphone. No app store downloads, no contracts, no credit card required.
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
