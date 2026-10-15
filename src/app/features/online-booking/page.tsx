import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  CreditCard,
  MapPin,
  Calendar,
  ShieldCheck,
  Code,
  CheckCircle2,
} from 'lucide-react';
import { MarketingNav } from '@/components/marketing-nav';
import { SemanticBreadcrumb } from '@/components/semantic-breadcrumb';
import { Footer } from '@/components/footer';

export const metadata = {
  title: 'Dumpster Rental Online Booking System — 24/7 Web Widget | RollOS',
  description:
    'Capture dumpster bookings 24/7 on your website with RollOS. Real-time ZIP code verification, Stripe Connect credit card payments, inventory check, and digital waivers.',
  alternates: {
    canonical: 'https://rolloffdumpstersoftware.com/features/online-booking',
  },
};

export default function OnlineBookingFeaturePage() {
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'RollOS Dumpster Rental Online Booking System',
    description:
      'Embeddable 24/7 self-service dumpster booking widget and hosted checkout platform for roll-off waste haulers with Stripe Connect payment integration.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    url: 'https://rolloffdumpstersoftware.com/features/online-booking',
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

      <MarketingNav currentPath="/features" />

      {/* Semantic Breadcrumbs */}
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-4">
        <SemanticBreadcrumb
          items={[
            { name: 'Home', item: '/' },
            { name: 'Features', item: '/features' },
            { name: 'Online Booking', item: '/features/online-booking' },
          ]}
        />
      </div>

      {/* Hero / Above The Fold */}
      <section className="max-w-5xl mx-auto px-6 py-6">
        <div className="eyebrow" style={{ color: '#82956d', marginBottom: 12 }}>
          PILLAR 01 · 24/7 DUMPSTER BOOKING ENGINE
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#20302a] leading-tight mb-4">
          Dumpster rental online booking system that sells bins while you drive.
        </h1>
        <p className="text-lg text-[#556658] leading-relaxed mb-8 max-w-3xl">
          More than 40% of residential and commercial dumpster rentals are researched after 7 PM. If your website only has a phone number or a generic contact form, homeowners click away to the next hauler on Google. RollOS turns your website into a 24/7 automated order desk.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center gap-4 mb-10">
          <Link href="/signup" className="btn btn-orange text-sm py-3 px-6 font-bold">
            Start Free Demo <ArrowRight size={15} />
          </Link>
          <Link href="/book/greenline" className="btn btn-secondary text-sm py-3 px-6 font-semibold">
            Test Live Checkout Demo
          </Link>
        </div>

        {/* Hero Screenshot */}
        <div className="bg-white p-3 md:p-5 rounded-3xl border border-[#dde4d4] shadow-md mb-12">
          <div className="rounded-2xl overflow-hidden border border-[#e5ebd9]">
            <Image
              src="/images/screenshots/dumpster-rental-online-booking-system.png"
              alt="RollOS dumpster rental online booking system checkout interface"
              width={1440}
              height={900}
              priority
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="p-3 text-center text-xs text-[#6e8071]">
            Actual live booking widget view: ZIP validation, container sizing, calendar date selection, and upfront card payment.
          </div>
        </div>
      </section>

      {/* Feature Pillars Grid */}
      <section className="max-w-5xl mx-auto px-6 py-10 border-t border-[#e2e8da]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="eyebrow text-xs font-bold text-[#577242] uppercase tracking-wider mb-2">
            CONVERT VISITORS INTO CONFIRMED ORDERS
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1f2d26]">
            Engineered Specifically for Roll-Off Container Rentals
          </h2>
          <p className="text-xs md:text-sm text-[#556658] mt-2">
            Generic e-commerce tools like Shopify or WooCommerce cannot handle delivery zones, container inventory, rental day limits, and scale slip overages. RollOS was built from scratch for dumpster fleets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm space-y-3">
            <span className="p-2.5 rounded-xl bg-[#eef3e6] text-[#2d4034] inline-block">
              <MapPin size={22} />
            </span>
            <h3 className="text-lg font-bold text-[#1f2d26]">ZIP Code Service Boundaries</h3>
            <p className="text-xs text-[#556658] leading-relaxed">
              Customers enter their delivery address first. RollOS instantly verifies whether the ZIP is within your active delivery radius and can apply automatic distance surcharges for extended mileage zones.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm space-y-3">
            <span className="p-2.5 rounded-xl bg-[#eef3e6] text-[#2d4034] inline-block">
              <Calendar size={22} />
            </span>
            <h3 className="text-lg font-bold text-[#1f2d26]">Real-Time Fleet Availability</h3>
            <p className="text-xs text-[#556658] leading-relaxed">
              Never worry about double-booking. The widget knows how many 10, 20, 30, or 40-yard dumpsters are sitting in your yard versus out on jobs. If a size is fully booked for a date, the calendar blocks it automatically.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm space-y-3">
            <span className="p-2.5 rounded-xl bg-[#eef3e6] text-[#2d4034] inline-block">
              <CreditCard size={22} />
            </span>
            <h3 className="text-lg font-bold text-[#1f2d26]">Direct Stripe Connect Payouts</h3>
            <p className="text-xs text-[#556658] leading-relaxed">
              Connect your bank account in 60 seconds with Stripe. Customers pay upfront with Apple Pay, Google Pay, or credit card. 100% of the rental fee flows directly to your account.
            </p>
          </div>
        </div>
      </section>

      {/* Embed & Technical Setup Section */}
      <section className="max-w-5xl mx-auto px-6 py-12 border-t border-[#e2e8da]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <div className="eyebrow text-xs font-bold text-[#577242] uppercase tracking-wider">
              EASY WEBSITE INTEGRATION
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1f2d26]">
              Embed on any website in under 60 seconds.
            </h2>
            <p className="text-xs md:text-sm text-[#556658] leading-relaxed">
              You do not need to hire a developer or rebuild your existing website. RollOS gives you a dedicated direct booking link (perfect for Google Business Profile, Facebook, and Instagram) plus a 1-line copy-paste embed code.
            </p>

            <div className="space-y-3 text-xs text-[#415346]">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#22c55e] shrink-0" />
                <span><strong>WordPress & Elementor:</strong> Paste HTML snippet directly into any page block</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#22c55e] shrink-0" />
                <span><strong>Squarespace & Wix:</strong> Embed as an interactive widget or popup button</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#22c55e] shrink-0" />
                <span><strong>Google Business Profile:</strong> Add your booking URL to the &quot;Book Online&quot; button</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#22c55e] shrink-0" />
                <span><strong>Fully Mobile-Optimized:</strong> Seamless one-thumb checkout experience on iPhone & Android</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#16231c] text-[#e0ebd8] rounded-2xl border border-[#2b3d30] shadow-md space-y-4">
            <div className="flex items-center justify-between text-xs text-[#8da593] pb-2 border-b border-[#2b3d30]">
              <span className="flex items-center gap-2 font-mono">
                <Code size={14} className="text-[#ea580c]" /> embed-widget.html
              </span>
              <span>Simple HTML</span>
            </div>
            <pre className="text-xs font-mono overflow-x-auto text-[#bbf7d0] leading-relaxed">
{`<!-- 1-Line RollOS Booking Embed -->
<iframe
  src="https://rolloffdumpstersoftware.com/book/your-company"
  width="100%"
  height="780"
  frameborder="0"
  allow="payment"
  style="border-radius: 12px; border: 1px solid #dde4d4;"
></iframe>`}
            </pre>
            <p className="text-[11px] text-[#97ab9c]">
              Or simply link any button on your website directly to:
              <br />
              <code className="text-[#fed7aa]">https://rolloffdumpstersoftware.com/book/your-company</code>
            </p>
          </div>
        </div>
      </section>

      {/* Built-in Legal Protection Section */}
      <section className="max-w-5xl mx-auto px-6 py-12 border-t border-[#e2e8da]">
        <div className="p-8 bg-[#f7f9f4] border border-[#dce3d4] rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#166534] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck size={16} /> Automated Liability Protection
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-[#1f2d26]">
              Digital Damage Waivers & Terms of Service Signed at Checkout
            </h3>
            <p className="text-xs md:text-sm text-[#556658] max-w-xl">
              Every customer must review and accept your driveway liability waiver, prohibited hazardous waste terms, and overweight disposal authorization before completing payment.
            </p>
          </div>
          <Link
            href="/templates/dumpster-rental-contract"
            className="btn btn-secondary text-xs py-3 px-5 whitespace-nowrap shrink-0 font-bold"
          >
            View Free Contract Template →
          </Link>
        </div>
      </section>

      {/* Connected Pillars / Internal Linking */}
      <section className="max-w-5xl mx-auto px-6 py-12 border-t border-[#e2e8da]">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h3 className="text-xl font-bold text-[#1f2d26]">Where Does The Order Go Next?</h3>
          <p className="text-xs text-[#556658]">
            Once a customer books online, RollOS coordinates your dispatch and driver routes automatically. Part of our unified <Link href="/" className="font-semibold text-[#1f2d26] underline hover:text-[#ea580c]">dumpster rental software</Link> platform:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                The new online booking lands directly on your visual dispatch schedule ready for driver assignment.
              </p>
            </div>
            <div className="text-xs font-bold text-[#ea580c] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Explore roll-off dispatch software</span>
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
                Drivers receive the drop-off location on their phone with turn-by-turn navigation and zero app downloads.
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
                Automate overage math and charge the customer card on file when the bin gets dumped at the landfill.
              </p>
            </div>
            <div className="text-xs font-bold text-[#ea580c] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Explore dumpster tonnage billing software</span>
              <ArrowRight size={13} />
            </div>
          </Link>
        </div>

        {/* Reciprocal link to Mother Ship & Startup Guide */}
        <div className="mt-8 p-4 bg-[#f8faf7] border border-[#d8e2cf] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#556658]">
          <span>
            Part of RollOS suite. Starting a fleet? Read our{' '}
            <Link href="/blog/how-to-start-a-dumpster-rental-business" className="font-bold text-[#ea580c] hover:underline">
              starting a dumpster rental business guide
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
            FREE TO START · SET UP IN 3 MINUTES
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-[#1f2d26] mb-3">
            Start capturing online dumpster bookings tonight
          </h3>
          <p className="text-sm text-[#556658] max-w-xl mx-auto mb-6 leading-relaxed">
            Test the booking widget with your own container pricing and service area ZIP codes. No contract, no credit card required.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup" className="btn btn-orange">
              Create Your Free Account <ArrowRight size={14} />
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
