import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  HelpCircle,
  MousePointer2,
  ShieldCheck,
  Truck,
  Sparkles,
  CreditCard,
  PhoneCall,
  MessageSquare,
  Building2,
  Scale,
} from 'lucide-react';
import { Dumpster } from '@/components/brand';
import { ScreenshotLightbox } from '@/components/screenshot-lightbox';
import { PricingMatrix } from '@/components/pricing-matrix';
import { SavingsCalculator } from '@/components/savings-calculator';
import { MarketingNav } from '@/components/marketing-nav';
import { Footer } from '@/components/footer';
import { SoftwareApplicationSchema, FAQPageSchema } from '@/components/schema-org';
import { WorkflowVisualizer } from '@/components/workflow-visualizer';
import { CheckoutReceiptPreview } from '@/components/checkout-receipt-preview';
import { FounderNoteSection } from '@/components/founder-contact';

export const metadata = {
  title: 'Dumpster Rental Software — Free Online Booking & Dispatch | RollOS',
  description:
    'Dumpster rental software that books jobs and collects payments while you sleep. Free 24/7 online booking widget, visual dispatch board, and SMS driver routes. $0/mo free plan.',
  alternates: {
    canonical: 'https://rolloffdumpstersoftware.com',
  },
};

export default function Home() {
  return (
    <main className="marketing">
      <SoftwareApplicationSchema />
      <FAQPageSchema
        faqs={[
          {
            question: 'How does the free plan work?',
            answer:
              'The Free Plan gives you our full 24/7 online booking widget, visual drag-and-drop dispatch board, driver SMS magic links, and delivery photo proof with $0 monthly software bills. Your customer pays a standard $12 online reservation fee at checkout to guarantee their container delivery. You keep 100% of your rental money.',
          },
          {
            question: 'What about phone or manual orders? Do I pay $12 for manual dispatch?',
            answer:
              'No. The $12 reservation fee strictly applies to self-service checkouts on your 24/7 online widget. When contractors or homeowners call or text you, upgrading to our Starter Plan ($29/mo with a 14-day free trial) unlocks unlimited manual phone dispatch with $0 platform fees forever, custom VIP contractor price tiers, and 2-way Google Calendar sync. Just one contractor haul per month pays for the entire software.',
          },
          {
            question: 'What if I don’t have a Stripe account or have never accepted cards online?',
            answer:
              'Setting up Stripe Connect takes under 3 minutes directly inside your RollOS dashboard. It has $0 monthly fees, no setup charges, and zero credit checks. When a customer pays online with a card, standard card processing (2.9% + 30¢) is deducted automatically by Stripe at the time of transaction—meaning no surprise bills at the end of the month. Your payouts deposit automatically into your bank on a free 2-day rolling schedule, with optional 30-minute instant payouts for fuel or landfill fees. RollOS never holds your funds.',
          },
          {
            question: 'How do I collect for overweight dumpsters and scale tickets?',
            answer:
              'When a customer books online, their credit card is securely saved on file via Stripe Connect. When your driver picks up the can and you get the landfill scale ticket, enter the actual tonnage into RollOS. Overages calculate automatically at your agreed rate ($75/ton, etc.) and can be charged to the card on file in 1 click.',
          },
          {
            question: 'Can I export my customer records and data if I ever leave?',
            answer:
              'Yes, 100%. You own all your customer records, phone numbers, addresses, and job history. You can export everything to CSV at any time with zero lock-in.',
          },
          {
            question: 'Can I absorb the $12 booking fee instead of charging my customer?',
            answer:
              'Yes. In your RollOS dashboard settings, you can choose to pass the $12 reservation fee to the customer at checkout or absorb it into your container rental price.',
          },
          {
            question: 'Will my customers complain about a $12 booking fee?',
            answer:
              'No. When a customer orders a $450 roll off container, a $12 reservation fee to guarantee their delivery date is completely routine—just like an Airbnb, hotel, or flight booking fee. They get instant online confirmation instead of playing phone tag, and you save thousands every year.',
          },
          {
            question: 'Do my drivers need to download an app from the App Store?',
            answer:
              'No. RollOS sends your driver an encrypted SMS link. Drivers open it directly in their mobile browser to view job addresses, click for turn-by-turn navigation, snap driveway drop photos, and submit scale tickets. Works on any phone with zero installation headaches.',
          },
          {
            question: 'Can I embed the booking widget on my existing website?',
            answer:
              'Yes. You can copy a one-line embed code into WordPress, Squarespace, Wix, or custom HTML. You can also share your direct booking link on Google Business Profile, Facebook, and Instagram.',
          },
          {
            question: 'What do the Starter ($29/mo) and Growth ($149/mo) plans include?',
            answer:
              'The Starter Plan ($29/mo with a 14-day free trial) unlocks offline cash/check logging and 2-way Google Calendar sync. The Growth Fleet Plan ($149/mo) adds high-value front-office automation: Missed-Call SMS Auto-Textback (instantly texts callers a 60-second booking link when you miss calls while driving, saving 2–3 lost rentals or $900–$1,500/mo) and the VIP Contractor Net-30 Portal (1-click swap requests and automated Net-30 monthly invoicing for roofers ordering 5–15 bins/month), plus multi-truck fleet dispatch.',
          },
          {
            question: 'How do I get paid for dumpster rentals?',
            answer:
              'RollOS connects directly to your own Stripe account. When a customer books online, rental payments and deposits flow straight into your bank account. RollOS never holds your money.',
          },
        ]}
      />
      {/* 1. Unified Navigation */}
      <MarketingNav />

      {/* 2. Edward Sturm ATF Engine & Hormozi Hook */}
      <section className="hero">
        <div>
          <div className="eyebrow">
            <span className="dot" /> Built for Independent Haulers · 24/7 Booking Engine
          </div>
          <h1>
            Dumpster rental software that books jobs and collects payments <em>while you sleep.</em>
          </h1>
          <p style={{ fontSize: 16.5, lineHeight: 1.65, color: '#4a5d4e' }}>
            Stop losing $450 jobs to voicemail. Over 40% of dumpster searches happen after 7 PM—if you don’t have online booking, homeowners hire the next hauler on Google. RollOS gives independent haulers free <strong>dumpster rental software</strong> with 24/7 online customer booking, visual drag-and-drop dispatching, and 1-tap SMS driver routes with zero app downloads.
          </p>
          <div className="hero-actions">
            <Link href="/signup" className="btn btn-orange">
              Start Free in 3 Minutes — No Credit Card <ArrowRight size={15} />
            </Link>
            <Link href="/dashboard" className="btn btn-dark">
              Open Live Dispatch Board
            </Link>
          </div>

          {/* Edward Sturm Above-The-Fold Trust Bar */}
          <div
            style={{
              marginTop: 18,
              padding: '10px 14px',
              background: '#f4f7f1',
              border: '1px solid #dde4d4',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
              fontSize: 12.5,
              fontWeight: 700,
              color: '#223326',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={16} color="#628f34" />
              <span>Stripe Connect Verified Partner</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={16} color="#628f34" />
              <span>0% Hauler Commission</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={16} color="#628f34" />
              <span>Zero Driver App Downloads</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={16} color="#628f34" />
              <span>3-Minute Setup</span>
            </div>
          </div>

          {/* $12 Booking Fee Objection-Killer Micro-Copy */}
          <div
            style={{
              marginTop: 12,
              padding: '10px 14px',
              background: '#ffffff',
              border: '1px dashed #c9dec2',
              borderRadius: 10,
              fontSize: 13,
              lineHeight: 1.55,
              color: '#556658',
            }}
          >
            <strong style={{ color: '#1f2d26' }}>How does the $0/mo free plan work?</strong> Just like Airbnb or DoorDash reservation fees, your customer pays a standard $12 delivery lock fee at checkout to guarantee their container. You pay $0/mo in software fees, 0% commission, and keep 100% of your rental money.
          </div>

          <div
            style={{
              marginTop: 14,
              fontSize: 14,
              color: '#475e44',
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              flexWrap: 'wrap',
              fontWeight: 500,
            }}
          >
            <span>✓ Capture orders 24/7 while you drive</span>
            <span>✓ Free plan ($0/mo) · Keep 100% of rental revenue</span>
            <span>✓ Works with or without a website (direct link or 1-line embed)</span>
            <span>✓ Zero driver app downloads (instant SMS links)</span>
          </div>
        </div>

        {/* Above-the-fold Interactive Preview & Real-Time Booking Engine */}
        <div className="hero-visual">
          <div className="hero-mini">
            <div className="eyebrow" style={{ color: '#82956d', marginBottom: 12 }}>
              LIVE CUSTOMER CHECKOUT DEMO
            </div>
            <h3>Lock in your roll off dumpster in 60 seconds.</h3>
            <p style={{ fontSize: 14, color: '#556658' }}>
              Select your container size. Pick delivery dates. Your booking is confirmed instantly.
            </p>
            <div className="hero-mini-sizes">
              {[10, 20, 30].map((size) => (
                <div key={size} className={size === 20 ? 'selected' : ''}>
                  <Dumpster size={size} />
                  {size} yard
                </div>
              ))}
            </div>
            <div className="hero-mini-total">
              <div>
                <span style={{ fontSize: 14, fontWeight: 700 }}>20 yard · 7 days included · 2 tons</span>
                <p style={{ fontSize: 12, color: '#687864', margin: '2px 0 0' }}>
                  Sample rental $425 · Customer reservation fee: $12 · Hauler keeps 100%
                </p>
              </div>
              <strong style={{ fontSize: 28 }}>$425</strong>
            </div>
            <Link href="/book/greenline" className="btn btn-orange" style={{ width: '100%' }}>
              Test Live Booking Flow <ArrowRight size={14} />
            </Link>
          </div>
          <div className="hero-floating">
            <CheckCircle2 size={28} color="#d6ef7c" />
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700 }}>Instant booking confirmed · 0% hauler commission</h4>
              <p style={{ fontSize: 12 }}>Your dumpster is dispatched and locked on your board.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 60-Second Real-Time Workflow Visualizer Product Tour */}
      <section className="px-6 py-12 max-w-[1240px] mx-auto" id="product-tour">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="eyebrow" style={{ color: '#82956d', marginBottom: 10 }}>
            60-SECOND PRODUCT TOUR
          </div>
          <h2 style={{ fontSize: 32, marginBottom: 12 }}>
            Watch how an online dumpster booking flows in real time
          </h2>
          <p style={{ color: '#4a5d4e', fontSize: 16 }}>
            From customer checkout to dispatch board to driver turn-by-turn navigation.
          </p>
        </div>

        {/* Interactive Step-by-Step Flow Demo */}
        <WorkflowVisualizer />
      </section>

      {/* 4. Real High-Resolution SEO Software Screenshots (Clickable Lightbox) */}
      <section className="px-6 py-12 max-w-[1240px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-4">
          <div className="eyebrow" style={{ color: '#82956d', marginBottom: 10 }}>
            FIELD-TESTED ROLL OFF DUMPSTER DISPATCH & BOOKING
          </div>
          <h2 style={{ fontSize: 32, marginBottom: 12 }}>
            See how roll off dumpster software runs your entire day.
          </h2>
          <p style={{ color: '#4a5d4e', fontSize: 16 }}>
            Click any screenshot to zoom in and inspect the real operational interface in full resolution.
          </p>
        </div>

        {/* Interactive Clickable Lightbox Component */}
        <ScreenshotLightbox />
      </section>

      {/* 5. Donald Miller 3-Step Success Plan */}
      <section className="px-6 py-12 max-w-[1040px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="eyebrow" style={{ color: '#82956d', marginBottom: 8 }}>
            SIMPLE 3-STEP PROCESS
          </div>
          <h2 style={{ fontSize: 32, marginBottom: 10 }}>
            How RollOS eliminates phone tag and fills your calendar
          </h2>
          <p style={{ color: '#4a5d4e', fontSize: 15 }}>
            You didn’t start a hauling business to spend all evening doing manual data entry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm relative">
            <div className="w-10 h-10 rounded-full bg-[#ffedd5] text-[#ea580c] font-black text-lg flex items-center justify-center mb-4">
              1
            </div>
            <h3 className="text-lg font-bold text-[#1f2d26] mb-2">
              Set Your Sizes & Rates (3 Minutes)
            </h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              Add standard 10, 15, 20, 30, or 40-yard dumpsters—<strong>or any custom container size</strong> (12-yd, 16-yd, concrete washouts)—with base prices, included days, tonnage allowances, and delivery ZIP codes.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm relative">
            <div className="w-10 h-10 rounded-full bg-[#ffedd5] text-[#ea580c] font-black text-lg flex items-center justify-center mb-4">
              2
            </div>
            <h3 className="text-lg font-bold text-[#1f2d26] mb-2">
              Embed Widget or Share Direct Link
            </h3>
            <p className="text-sm text-[#475569] leading-relaxed mb-2.5">
              <strong>No website?</strong> Put your custom link (<code className="text-xs bg-[#f4f7f2] px-1.5 py-0.5 rounded text-[#223326] font-semibold">rolloffdumpstersoftware.com/book/yourcompany</code>) directly on your Google Business Profile &amp; Facebook.
            </p>
            <p className="text-sm text-[#475569] leading-relaxed">
              <strong>Already have a website?</strong> Copy-paste one line of embed code into WordPress, Wix, Squarespace, or GoDaddy. Setup takes 3 minutes, customers pay upfront, and you keep 100% of your rental money.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm relative">
            <div className="w-10 h-10 rounded-full bg-[#ffedd5] text-[#ea580c] font-black text-lg flex items-center justify-center mb-4">
              3
            </div>
            <h3 className="text-lg font-bold text-[#1f2d26] mb-2">
              Wake Up to Paid Orders & 1-Tap Dispatch
            </h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              Homeowners reserve and pay upfront while you sleep. Drivers receive instant SMS magic links with turn-by-turn navigation and camera delivery proof. You keep 100% of your rental money.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Interactive ROI & Savings Calculator Section */}
      <section id="calculator" className="px-6 py-12 max-w-[1040px] mx-auto">
        <SavingsCalculator showTitle={true} />
      </section>

      {/* 6. Core Features Strip */}
      <section id="features" className="feature-strip !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-4 px-6 gap-6">
        {[
          {
            icon: Globe,
            title: '24/7 Online Booking Widget',
            keyword: 'dumpster rental online booking system',
            href: '/features/online-booking',
            text: 'Capture dumpster orders while you sleep. Give homeowners an intuitive 60-second checkout that checks ZIP codes and collects rental fees upfront.',
          },
          {
            icon: Truck,
            title: 'Visual Roll Off Dispatch Board',
            keyword: 'roll-off dispatch software',
            href: '/features/dispatch-board',
            text: 'Move jobs from booked to delivered to picked up with drag-and-drop simplicity. Assign drivers, record swap containers, and keep bins rolling.',
          },
          {
            icon: MousePointer2,
            title: 'Driver SMS Magic Links',
            keyword: 'dumpster driver routing software',
            href: '/features/driver-routes',
            text: 'Send your driver a secure one-click link. They open turn-by-turn navigation, snap driveway drop photos, and record scale landfill tickets on their phone.',
          },
          {
            icon: Scale,
            title: 'Scale Tickets & Tonnage Invoicing',
            keyword: 'dumpster tonnage billing software',
            href: '/features/tonnage-billing',
            text: 'Snap landfill weight slips to auto-calculate overage fees, attach slip photos, and charge customer cards on file without awkward phone calls.',
          },
        ].map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm hover:border-[#ea580c] hover:shadow-md transition-all group flex flex-col justify-between"
            title={f.keyword}
          >
            <div>
              <f.icon size={26} className="text-[#ea580c] mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-base font-bold text-[#1f2d26] mb-1 group-hover:text-[#ea580c] transition-colors">
                {f.title}
              </h3>
              <p style={{ fontSize: 13, lineHeight: 1.6 }} className="text-[#556658] mb-3">
                {f.text}
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-[#ea580c] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Explore {f.keyword}</span>
              <ArrowRight size={13} />
            </div>
          </Link>
        ))}
      </section>

      {/* 6.5. Growth Tier Automation Engine: Missed-Call SMS Auto-Textback & VIP Contractor Portal */}
      <section className="px-6 py-6 max-w-[1040px] mx-auto">
        <div className="p-6 md:p-8 bg-[#182820] text-white rounded-2xl border border-[#273d30] shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#223d2e] text-[#86efac] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-[#325b43] mb-3">
              <Sparkles size={14} />
              Growth Fleet ($149/mo) Automation
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
              Stop losing $450 jobs while driving &amp; lock in repeat roofers.
            </h3>
            <p className="text-xs md:text-sm text-[#cbd5e1] leading-relaxed">
              When a homeowner calls your cell while you&apos;re hauling or at the landfill, 75% hang up and call the next hauler on Google. Growth Fleet equips you with <strong>Twilio Missed-Call SMS Auto-Textback</strong> (recovering 2–3 lost rentals or $900–$1,500/mo) and a <strong>VIP Contractor Net-30 Portal</strong> with 1-click swap requests for roofers.
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto">
            <Link href="/pricing" className="btn btn-orange text-xs py-2.5 px-4 justify-center whitespace-nowrap">
              Explore Growth Tier ($149) <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Column & Checkbox Pricing Section */}
      <section id="pricing" className="px-6 py-12 max-w-[1040px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="eyebrow" style={{ color: '#8a9d73', marginBottom: 12 }}>
            TRANSPARENT PRICING · START 100% FREE
          </div>
          <h2 style={{ fontSize: 32, marginBottom: 12 }}>
            You keep 100% of your rental money.
          </h2>
          <p style={{ fontSize: 16, color: '#4a5d4e', lineHeight: 1.7 }}>
            Why pay Docket, DumpsterSoft, or Jobber hundreds of dollars every month before you haul your first bin?
            With RollOS, your customers pay a standard $12 online reservation fee at checkout to guarantee their delivery date.
            You keep 100% of your base rental rate, extra day charges, and weight overages.
          </p>
        </div>

        {/* Free Operator Resources & Benchmarks Section */}
        <div className="mb-14">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="eyebrow text-xs font-bold text-[#8a9d73] uppercase tracking-wider mb-2">
              FREE HAULER TOOLKIT &amp; BENCHMARKS
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#1f2d26]">
              Free Operator Resources &amp; Benchmarks
            </h3>
            <p className="text-xs md:text-sm text-[#556658] mt-2">
              Free calculators, legal contract templates, and transparent software comparisons to help you run a more profitable roll-off business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
            <Link
              href="/tools/tonnage-calculator"
              className="p-5 bg-white border border-[#dde4d4] rounded-2xl shadow-sm hover:border-[#ea580c] hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#ea580c] mb-1">Interactive Tool</div>
                <h4 className="text-base font-bold text-[#1f2d26] mb-2 group-hover:text-[#ea580c] transition-colors">
                  Tonnage Calculator
                </h4>
                <p className="text-xs text-[#556658] leading-relaxed">
                  Calculate cubic yard weights across dirt, concrete, shingles, and debris to set safe payload limits.
                </p>
              </div>
              <div className="pt-4 text-xs font-bold text-[#ea580c] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Use dumpster tonnage calculator</span>
                <ArrowRight size={13} />
              </div>
            </Link>

            <Link
              href="/tools/savings-calculator"
              className="p-5 bg-white border border-[#dde4d4] rounded-2xl shadow-sm hover:border-[#ea580c] hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#ea580c] mb-1">ROI Benchmark</div>
                <h4 className="text-base font-bold text-[#1f2d26] mb-2 group-hover:text-[#ea580c] transition-colors">
                  Software Savings Calculator
                </h4>
                <p className="text-xs text-[#556658] leading-relaxed">
                  See how much you save each month compared to paying $350+/mo recurring software bills.
                </p>
              </div>
              <div className="pt-4 text-xs font-bold text-[#ea580c] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Try dumpster rental software savings calculator</span>
                <ArrowRight size={13} />
              </div>
            </Link>

            <Link
              href="/templates/dumpster-rental-contract"
              className="p-5 bg-white border border-[#dde4d4] rounded-2xl shadow-sm hover:border-[#ea580c] hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#ea580c] mb-1">Legal Defense</div>
                <h4 className="text-base font-bold text-[#1f2d26] mb-2 group-hover:text-[#ea580c] transition-colors">
                  Rental Agreement Template
                </h4>
                <p className="text-xs text-[#556658] leading-relaxed">
                  Free attorney-drafted agreement with driveway damage waivers, overload clauses, and waste terms.
                </p>
              </div>
              <div className="pt-4 text-xs font-bold text-[#ea580c] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Download dumpster rental contract template</span>
                <ArrowRight size={13} />
              </div>
            </Link>

            <Link
              href="/templates/dumpster-invoice"
              className="p-5 bg-white border border-[#dde4d4] rounded-2xl shadow-sm hover:border-[#ea580c] hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#ea580c] mb-1">Billing Template</div>
                <h4 className="text-base font-bold text-[#1f2d26] mb-2 group-hover:text-[#ea580c] transition-colors">
                  Commercial Invoice Template
                </h4>
                <p className="text-xs text-[#556658] leading-relaxed">
                  Professional itemized invoice outline with scale ticket breakdowns, extra day fees, and contractor terms.
                </p>
              </div>
              <div className="pt-4 text-xs font-bold text-[#ea580c] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Get dumpster rental invoice template</span>
                <ArrowRight size={13} />
              </div>
            </Link>

            <Link
              href="/vs/docket"
              className="p-5 bg-white border border-[#dde4d4] rounded-2xl shadow-sm hover:border-[#ea580c] hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#ea580c] mb-1">Platform Comparison</div>
                <h4 className="text-base font-bold text-[#1f2d26] mb-2 group-hover:text-[#ea580c] transition-colors">
                  RollOS vs Docket
                </h4>
                <p className="text-xs text-[#556658] leading-relaxed">
                  Detailed comparison breakdown of pricing, mobile driver workflow, onboarding fees, and lock-in contracts.
                </p>
              </div>
              <div className="pt-4 text-xs font-bold text-[#ea580c] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Read RollOS vs Docket comparison</span>
                <ArrowRight size={13} />
              </div>
            </Link>

            <Link
              href="/vs/servicecore"
              className="p-5 bg-white border border-[#dde4d4] rounded-2xl shadow-sm hover:border-[#ea580c] hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#ea580c] mb-1">Software Review</div>
                <h4 className="text-base font-bold text-[#1f2d26] mb-2 group-hover:text-[#ea580c] transition-colors">
                  RollOS vs ServiceCore
                </h4>
                <p className="text-xs text-[#556658] leading-relaxed">
                  Why independent roll-off haulers choose simple, affordable software over expensive legacy septic platforms.
                </p>
              </div>
              <div className="pt-4 text-xs font-bold text-[#ea580c] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Read RollOS vs ServiceCore review</span>
                <ArrowRight size={13} />
              </div>
            </Link>
          </div>

          <div className="mt-8 p-6 bg-[#f8faf7] border border-[#d8e2cf] rounded-2xl text-center text-xs md:text-sm text-[#556658]">
            <div className="font-bold text-[#1f2d26] mb-2 uppercase tracking-wider text-xs">
              Operator Knowledge Hub &amp; Growth Benchmarks
            </div>
            <p className="max-w-2xl mx-auto mb-3 leading-relaxed">
              Explore practical, numbers-driven{' '}
              <Link
                href="/blog"
                className="font-bold text-[#ea580c] hover:underline inline-flex items-center gap-1"
              >
                dumpster rental business guides
                <ArrowRight size={13} />
              </Link>{' '}
              written specifically for small and mid-size roll-off haulers (1–25+ trucks):
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold">
              <Link href="/blog/how-to-start-a-dumpster-rental-business" className="text-[#3b533f] hover:text-[#ea580c] underline">
                Startup Costs &amp; Equipment Blueprint →
              </Link>
              <Link href="/blog/how-to-price-dumpster-rentals" className="text-[#3b533f] hover:text-[#ea580c] underline">
                Pricing Formula &amp; Tonnage Calculator →
              </Link>
              <Link href="/blog/dumpster-rental-profit-margins" className="text-[#3b533f] hover:text-[#ea580c] underline">
                Operator Profit Margins &amp; Benchmarks →
              </Link>
            </div>
          </div>
        </div>

        {/* Clean Column & Checkbox Pricing Matrix */}
        <PricingMatrix />

        {/* Objection Callout Reassurance */}
        <div className="p-5 bg-white border border-[#dde4d4] rounded-xl my-6 shadow-sm text-left max-w-3xl mx-auto">
          <h4 className="text-base font-bold text-[#1f2d26] mb-2 flex items-center gap-2">
            <ShieldCheck size={20} className="text-[#ea580c]" />
            Worried your customer won’t pay a $12 reservation fee?
          </h4>
          <p className="text-sm text-[#475569] leading-relaxed mb-3">
            Does Airbnb pay your guest’s booking fee? Does Ticketmaster pay yours? No. On a <strong>$450 dumpster rental</strong>, a homeowner won’t blink at a <strong>$12 reservation fee</strong> (less than 3%) to lock in guaranteed delivery for their project. They get instant peace of mind, and you save $3,600/year in software subscriptions.
          </p>
          <p className="text-sm text-[#475569] leading-relaxed">
            <strong>More money in your pocket:</strong> You keep 100% of your hard-earned dumpster revenue. No $150–$350/mo monthly software bills. No percentage taken out of your haul.
          </p>
        </div>

        {/* Manual Phone Orders Objection Reassurance */}
        <div className="p-5 bg-white border border-[#dde4d4] rounded-xl my-6 shadow-sm text-left max-w-3xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h4 className="text-base font-bold text-[#1f2d26] flex items-center gap-2">
              <CheckCircle2 size={20} className="text-[#ea580c] shrink-0" />
              What about contractors who call or text? Do you charge $12 for manual orders?
            </h4>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-[#eef3e6] text-[#4a6331] px-2.5 py-0.5 rounded-full border border-[#d2dec3] shrink-0">
              Starter Plan ($29/mo)
            </span>
          </div>
          <p className="text-sm text-[#475569] leading-relaxed mb-3">
            <strong>$0 Platform Fee on Offline &amp; Phone Orders:</strong> The $12 reservation fee strictly applies to self-service checkouts on your 24/7 online widget. When regular contractors, roofers, or commercial accounts call or text you, enter them onto your visual dispatch board with <strong>$0 platform fees forever</strong>.
          </p>
          <p className="text-sm text-[#475569] leading-relaxed mb-3">
            <strong>Why upgrading to Starter ($29/mo) is an absolute no-brainer:</strong> At just $29/mo (less than $1/day), a single contractor dumpster pull pays for the software for the entire month. While legacy tools like Docket or ServiceCore charge $350–$600+ every month ($4,200+/year) plus forced onboarding fees, RollOS Starter gives you unlimited manual phone dispatches, custom VIP contractor price tiers (cash, check, or net-30 terms), and 2-way Google Calendar sync—saving you <strong>$3,600+ every year</strong>.
          </p>
          <div className="text-xs font-semibold text-[#166534] bg-[#f0fdf4] p-3 rounded-lg border border-[#bbf7d0]">
            💡 <strong>Start 100% Free:</strong> Capture after-hours online bookings on our $0/mo Free Plan first. When you&apos;re ready to organize your manual phone contractor dispatches, take a 14-day free trial of Starter with 1 click.
          </div>
        </div>

        {/* Growth Fleet ($149/mo) High-ROI Front-Office Automation Card */}
        <div className="p-5 bg-[#fbfdfa] border-2 border-[#a7f3d0] rounded-xl my-6 shadow-sm text-left max-w-3xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h4 className="text-base font-bold text-[#1f2d26] flex items-center gap-2">
              <PhoneCall size={20} className="text-[#059669] shrink-0" />
              Growth Fleet ($149/mo): Missed-Call SMS Textback &amp; VIP Net-30 Portal
            </h4>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-[#dcfce7] text-[#166534] px-2.5 py-0.5 rounded-full border border-[#86efac] shrink-0">
              Recovers 2–3 Rentals/Mo
            </span>
          </div>
          <p className="text-sm text-[#475569] leading-relaxed mb-3">
            <strong>Missed-Call SMS Auto-Textback (Powered by Twilio):</strong> When a homeowner calls while you&apos;re driving, <strong>75% hang up and call the next dumpster company on Google</strong>. Growth Fleet instantly fires a customized text in under 5 seconds (<em>&ldquo;Hey, driving right now! Check prices and reserve a bin here in 60s: [your booking link]&rdquo;</em>). Saving just 2–3 lost rentals a month puts <strong>$900–$1,500 back in your pocket</strong>.
          </p>
          <p className="text-sm text-[#475569] leading-relaxed mb-3">
            <strong>VIP Contractor Net-30 Portal:</strong> Roofers and remodelers order 5–15 dumpsters a month. Give them their own self-service portal for <strong>1-click container swap requests</strong> (no 6:00 AM phone calls) and <strong>automated Net-30 monthly invoicing</strong> with attached landfill scale weight slips. Once a contractor has a Net-30 portal with you, they will never switch haulers.
          </p>
          <div className="text-xs font-semibold text-[#065f46] bg-[#ecfdf5] p-3 rounded-lg border border-[#a7f3d0] flex items-center justify-between flex-wrap gap-2">
            <span>🚀 <strong>No-Brainer ROI:</strong> Just 1 recovered dumpster rental ($450) pays for 3 full months of Growth Fleet.</span>
            <Link href="/pricing" className="text-[#059669] underline hover:text-[#047857]">
              Compare all plan features →
            </Link>
          </div>
        </div>

        {/* Stripe Payments Objection Handling */}
        <div className="p-5 bg-white border border-[#dde4d4] rounded-xl my-6 shadow-sm text-left max-w-3xl mx-auto">
          <h4 className="text-base font-bold text-[#1f2d26] mb-2 flex items-center gap-2">
            <CreditCard size={20} className="text-[#ea580c] shrink-0" />
            Don&apos;t have a Stripe account or never processed cards online?
          </h4>
          <p className="text-sm text-[#475569] leading-relaxed mb-3">
            <strong>$0 monthly fees and 3-minute setup:</strong> RollOS connects directly with <strong>Stripe Connect</strong>—the payment backbone trusted by Amazon, Shopify, and millions of businesses. Setting up your account is 100% free with <strong>$0 monthly account fees</strong>, zero statement charges, and <strong>zero credit checks</strong> (no score impact).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#334155] mb-3">
            <div className="flex items-center gap-1.5 bg-[#f8faf7] p-2.5 rounded-lg border border-[#e2e8db]">
              <span className="text-[#166534] font-bold">✓</span>
              <span><strong>Free Automatic 2-Day Payouts:</strong> Direct to your checking account.</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#f8faf7] p-2.5 rounded-lg border border-[#e2e8db]">
              <span className="text-[#166534] font-bold">✓</span>
              <span><strong>Deducted at Time of Payment:</strong> Standard 2.9% + 30¢ card processing.</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#f8faf7] p-2.5 rounded-lg border border-[#e2e8db]">
              <span className="text-[#166534] font-bold">✓</span>
              <span><strong>RollOS Never Holds Funds:</strong> Money flows straight to you.</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#f8faf7] p-2.5 rounded-lg border border-[#e2e8db]">
              <span className="text-[#166534] font-bold">✓</span>
              <span><strong>Free Stripe Mobile App:</strong> Live payout alerts on your phone.</span>
            </div>
          </div>
          <p className="text-xs text-[#64748b] leading-relaxed">
            <strong>How card fees work:</strong> When a customer pays online, Stripe automatically deducts standard card processing (2.9% + 30¢) at the moment of payment—meaning you never receive a surprise bill at the end of the month. Standard bank payouts on a 2-day rolling schedule are 100% free. Optional 30-minute instant debit card cashouts carry Stripe&apos;s standard 1.5% fee.
          </p>
        </div>

        {/* Card on File for Tonnage Overages & Scale Tickets */}
        <div className="p-5 bg-white border border-[#dde4d4] rounded-xl my-6 shadow-sm text-left max-w-3xl mx-auto">
          <h4 className="text-base font-bold text-[#1f2d26] mb-2 flex items-center gap-2">
            <ShieldCheck size={20} className="text-[#ea580c]" />
            How do I collect for overweight dumpsters and scale tickets?
          </h4>
          <p className="text-sm text-[#475569] leading-relaxed mb-3">
            <strong>Secure Card on File via Stripe:</strong> When a customer books online, their payment method is securely tokenized and saved on file. When your driver picks up the can and you get the landfill scale ticket, enter the actual tonnage into RollOS.
          </p>
          <p className="text-sm text-[#475569] leading-relaxed">
            Overages calculate automatically at the rate agreed upon at booking ($75/ton, $95/ton, etc.). Click <strong>&quot;Charge Overage to Card on File&quot;</strong> and the funds deposit directly into your bank account. No chasing checks or awkward calls.
          </p>
        </div>

        {/* Fleet Capacity & Overbooking Fear Reassurance */}
        <div className="p-5 bg-white border border-[#dde4d4] rounded-xl my-6 shadow-sm text-left max-w-3xl mx-auto">
          <h4 className="text-base font-bold text-[#1f2d26] mb-2 flex items-center gap-2">
            <Truck size={20} className="text-[#ea580c]" />
            Worried about taking bookings when your yard is empty?
          </h4>
          <p className="text-sm text-[#475569] leading-relaxed">
            <strong>Never Get Overbooked:</strong> Enter your available container counts and set your minimum dispatch notice (e.g., 24 or 48 hours). When all bins are booked out, dates automatically black out. You stay in total control of your calendar.
          </p>
        </div>

        {/* Visual Customer Receipt and Hauler 100% Payout Preview */}
        <div className="mt-8">
          <CheckoutReceiptPreview />
        </div>
      </section>

      {/* 8. Competitor Contrast Table (RollOS vs Traditional Software) */}
      <section className="px-6 py-12 max-w-[960px] mx-auto">
        <div className="text-center mb-8">
          <div className="eyebrow" style={{ color: '#8a9d73', marginBottom: 8 }}>
            HEAD-TO-HEAD COMPARISON
          </div>
          <h2 style={{ fontSize: 28 }}>Why independent haulers choose RollOS</h2>
          <p style={{ color: '#4a5d4e', fontSize: 15 }}>
            Stop paying monthly rent for software that should be generating you revenue.
          </p>
        </div>

        <div className="overflow-hidden">
          <table className="compare-table">
            <thead>
              <tr>
                <th>Feature / Pricing</th>
                <th className="highlight-col text-[#1d2527]">RollOS</th>
                <th>Docket / Jobber / Legacy</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Monthly Software Cost</td>
                <td className="highlight-col text-[#2e7d32] font-bold">
                  $0 Free · $29 Starter · $149 Growth
                </td>
                <td className="text-[#b54848]">$150 – $350+ / month</td>
              </tr>
              <tr>
                <td>Hauler Rental Commission</td>
                <td className="highlight-col text-[#2e7d32] font-bold">
                  0% hauler fee (keep 100%)
                </td>
                <td>0% to 2% + Stripe</td>
              </tr>
              <tr>
                <td>Software Overhead Model</td>
                <td className="highlight-col font-semibold">
                  Customer pays $12 booking fee
                </td>
                <td>Hauler absorbs 100% overhead</td>
              </tr>
              <tr>
                <td>Setup Time</td>
                <td className="highlight-col text-[#2e7d32] font-bold">
                  3 minutes self-serve
                </td>
                <td>2–3 weeks + sales calls</td>
              </tr>
              <tr>
                <td>Online Booking Checkout</td>
                <td className="highlight-col font-semibold">
                  Included (60s self-checkout widget)
                </td>
                <td>Extra cost or complex quotes</td>
              </tr>
              <tr>
                <td>Driver Mobile Access</td>
                <td className="highlight-col font-semibold">
                  SMS magic link (0 app install required)
                </td>
                <td>Mandatory App Store install</td>
              </tr>
              <tr>
                <td>Proof of Delivery Photos</td>
                <td className="highlight-col font-semibold">
                  Instant camera drop photos
                </td>
                <td>Included in higher tiers</td>
              </tr>
              <tr>
                <td>Missed-Call SMS Auto-Textback</td>
                <td className="highlight-col font-semibold">
                  Included in Growth ($149/mo)
                </td>
                <td>Not offered or $350+/mo</td>
              </tr>
              <tr>
                <td>VIP Contractor Net-30 Portal</td>
                <td className="highlight-col font-semibold">
                  Included in Growth ($149/mo)
                </td>
                <td>Requires enterprise tier</td>
              </tr>
              <tr>
                <td>Contract Lock-In</td>
                <td className="highlight-col text-[#2e7d32] font-bold">
                  None. Cancel anytime.
                </td>
                <td>Annual commitments typical</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 8.5. Founder Transparency & Personal 1-on-1 Walkthrough */}
      <FounderNoteSection />

      {/* 9. Uncollapsed Semantic FAQs (Edward Sturm Anti-Pogo & David Quaid Answer Engine) */}
      <section className="faq">
        <h2>Frequently asked questions about roll off dumpster software</h2>
        <p className="faq-subhead" style={{ fontSize: 16 }}>
          Straight answers on pricing, customer booking fees, driver links, and setup. No hidden fees or sales calls required.
        </p>

        <div className="faq-grid">
          <div className="faq-card">
            <h3>
              <HelpCircle size={20} className="text-[#ea580c] flex-shrink-0" />
              How does the free plan work?
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: '#334155' }}>
              The Free Plan gives you our full 24/7 online booking widget, visual drag-and-drop dispatch board, driver SMS magic links, and delivery photo proof with $0 monthly software bills. Your customer pays a standard $12 online reservation fee at checkout to guarantee their container delivery. You keep 100% of your rental money.
            </p>
          </div>

          <div className="faq-card">
            <h3>
              <HelpCircle size={20} className="text-[#ea580c] flex-shrink-0" />
              What about phone or manual orders? Do I pay $12 for manual dispatch?
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: '#334155' }}>
              No. The $12 reservation fee strictly applies to self-service checkouts on your 24/7 online widget. When regular contractors call or text you, our <strong>Starter Plan ($29/mo)</strong> unlocks unlimited manual phone dispatch with <strong>$0 platform fees forever</strong>, VIP contractor custom rates (cash, check, or net-30 terms), and 2-way Google Calendar sync. One single contractor haul per month pays for the entire software while saving you $3,600+/yr vs legacy tools.
            </p>
          </div>

          <div className="faq-card">
            <h3>
              <HelpCircle size={20} className="text-[#ea580c] flex-shrink-0" />
              What if I don&apos;t have a Stripe account or never processed cards online?
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: '#334155' }}>
              Setting up Stripe Connect takes under 3 minutes directly from your RollOS dashboard. There are <strong>$0 monthly fees</strong>, no setup charges, and <strong>zero credit checks</strong> (no score impact). When a customer pays online with a card, Stripe automatically deducts standard card processing (2.9% + 30¢) at the moment of payment, meaning you never get a surprise bill at the end of the month. Your payouts deposit automatically into your bank account on a 2-day rolling schedule (100% free), with optional 30-minute instant cashouts if you need emergency cash for fuel or landfill tipping fees. RollOS never holds your funds.
            </p>
          </div>

          <div className="faq-card">
            <h3>
              <HelpCircle size={20} className="text-[#ea580c] flex-shrink-0" />
              How do I collect for overweight dumpsters and scale tickets?
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: '#334155' }}>
              When a customer books online, their credit card is securely saved on file via Stripe Connect. When your driver picks up the can and you get the landfill scale ticket, enter the actual tonnage into RollOS. Overages calculate automatically at your agreed rate ($75/ton, etc.) and can be charged to the card on file in 1 click.
            </p>
          </div>

          <div className="faq-card">
            <h3>
              <HelpCircle size={20} className="text-[#ea580c] flex-shrink-0" />
              Can I export my customer records and data if I ever leave?
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: '#334155' }}>
              Yes, 100%. You own all your customer records, phone numbers, addresses, and job history. You can export everything to CSV at any time with zero lock-in.
            </p>
          </div>

          <div className="faq-card">
            <h3>
              <HelpCircle size={20} className="text-[#ea580c] flex-shrink-0" />
              Can I absorb the $12 booking fee instead of charging my customer?
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: '#334155' }}>
              Yes. In your RollOS dashboard settings, you can choose to pass the $12 reservation fee to the customer at checkout or absorb it into your container rental price with one toggle.
            </p>
          </div>

          <div className="faq-card">
            <h3>
              <HelpCircle size={20} className="text-[#ea580c] flex-shrink-0" />
              Will my customers complain about a $12 booking fee?
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: '#334155' }}>
              No. When a customer orders a $450 roll off container, a $12 reservation fee to guarantee their delivery date is completely routine—just like an Airbnb, hotel, or flight booking fee. They get instant online confirmation instead of playing phone tag, and you save thousands every year.
            </p>
          </div>

          <div className="faq-card">
            <h3>
              <HelpCircle size={20} className="text-[#ea580c] flex-shrink-0" />
              Do my drivers need to download an app from the App Store?
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: '#334155' }}>
              No. RollOS sends your driver an encrypted SMS link. Drivers open it directly in their mobile browser to view job addresses, click for turn-by-turn navigation, snap driveway drop photos, and submit scale tickets. Works on any phone with zero installation headaches.
            </p>
          </div>

          <div className="faq-card">
            <h3>
              <HelpCircle size={20} className="text-[#ea580c] flex-shrink-0" />
              Can I embed the booking widget on my existing website?
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: '#334155' }}>
              Yes. You can copy a one-line embed code into WordPress, Squarespace, Wix, or custom HTML. You can also share your direct booking link on Google Business Profile, Facebook, and Instagram.
            </p>
          </div>

          <div className="faq-card">
            <h3>
              <HelpCircle size={20} className="text-[#ea580c] flex-shrink-0" />
              What do the Starter ($29/mo) and Growth ($149/mo) plans include?
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: '#334155' }}>
              The Starter Plan ($29/mo with a 14-day free trial) unlocks offline cash/check logging and 2-way Google Calendar sync. The Growth Fleet Plan ($149/mo) adds high-value front-office automation: <strong>Missed-Call SMS Auto-Textback</strong> (instantly texts callers a 60-second booking link when you miss calls while driving, saving 2–3 lost rentals or $900–$1,500/mo) and the <strong>VIP Contractor Net-30 Portal</strong> (1-click swap requests and automated Net-30 monthly invoicing for roofers ordering 5–15 bins/month), plus multi-truck fleet dispatch.
            </p>
          </div>

          <div className="faq-card">
            <h3>
              <HelpCircle size={20} className="text-[#ea580c] flex-shrink-0" />
              How do I get paid for dumpster rentals?
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: '#334155' }}>
              RollOS connects directly to your own Stripe account. When a customer books online, rental payments and deposits flow straight into your bank account. RollOS never holds your money.
            </p>
          </div>
        </div>
      </section>

      {/* 10. Bottom Closing CTA Banner */}
      <section className="px-6 py-14 max-w-[1040px] mx-auto">
        <div className="p-8 md:p-12 bg-[#1f2d26] text-white rounded-3xl shadow-xl text-center relative overflow-hidden border border-[#2d3e35]">
          <div
            style={{
              position: 'absolute',
              top: '-30%',
              right: '-10%',
              width: 380,
              height: 380,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(234, 88, 12, 0.15) 0%, rgba(234, 88, 12, 0) 70%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(214, 239, 124, 0.12)',
              color: '#d6ef7c',
              padding: '6px 16px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 16,
              border: '1px solid rgba(214, 239, 124, 0.25)',
            }}
          >
            <Sparkles size={13} color="#d6ef7c" />
            GET STARTED IN 3 MINUTES
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            Ready to stop losing $450 dumpster jobs to voicemail?
          </h2>
          <p className="text-base md:text-lg text-[#b8c9b9] max-w-2xl mx-auto mb-8 leading-relaxed">
            Join independent haulers who let customers book and pay 24/7. Free plan includes the online booking widget, drag-and-drop dispatch board, and SMS driver routes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <Link href="/signup" className="btn btn-orange">
              Start Free in 3 Minutes — No Credit Card <ArrowRight size={15} />
            </Link>
            <Link
              href="/book/greenline"
              className="btn btn-dark"
              style={{ background: '#2c3e34', border: '1px solid #3c5447', color: '#ffffff' }}
            >
              Test Live Customer Checkout
            </Link>
          </div>
          <div className="text-xs md:text-sm text-[#8ca58b] flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-medium">
            <span>✓ $0/month free plan · Keep 100% rental money · Setup in 3 minutes · Zero contracts</span>
          </div>
        </div>

        <div className="mt-8 text-center text-xs md:text-sm text-[#556658]">
          Built specifically for independent roll-off fleets. Learn more{' '}
          <Link href="/about" className="font-semibold text-[#1f2d26] underline hover:text-[#ea580c]">
            about our story and mission
          </Link>
          , or{' '}
          <Link href="/contact" className="font-semibold text-[#1f2d26] underline hover:text-[#ea580c]">
            contact our founder directly
          </Link>{' '}
          for a free 1-on-1 dispatch setup.
        </div>
      </section>

      {/* 11. Bottom Colony Pillar & Reverse Silo Navigation (Kyle Roof Architecture) */}
      <Footer />
    </main>
  );
}
