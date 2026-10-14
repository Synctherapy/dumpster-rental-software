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
              'Setting up Stripe Connect takes under 3 minutes directly inside your RollOS dashboard. It is 100% free with $0 monthly fees, no credit check, and zero impact on your credit score. Payments deposit automatically to your business checking account on a 2-day rolling basis, with optional 30-minute instant payouts for fuel or landfill tipping fees. RollOS never holds your funds.',
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
              'The Starter Plan ($29/mo) unlocks offline cash/check logging (for contractors who pay on invoice terms) and two-way Google Calendar/Apple iCal sync. The Growth Fleet Plan ($149/mo) is designed for expanding operations with multiple trucks managing high container volumes.',
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
      <section id="features" className="feature-strip">
        {[
          {
            icon: Globe,
            title: '24/7 Online Booking Widget',
            text: 'Capture dumpster orders while you sleep. Give homeowners an intuitive 60-second checkout that checks ZIP codes and collects rental fees upfront.',
          },
          {
            icon: Truck,
            title: 'Visual Roll Off Dispatch Board',
            text: 'Move jobs from booked to delivered to picked up with drag-and-drop simplicity. Assign drivers, record swap containers, and keep bins rolling.',
          },
          {
            icon: MousePointer2,
            title: 'Driver SMS Magic Links (No App Required)',
            text: 'Send your driver a secure one-click link. They open turn-by-turn navigation, snap driveway drop photos, and record scale landfill tickets on their phone.',
          },
        ].map((f) => (
          <div key={f.title}>
            <f.icon size={26} className="text-[#ea580c]" />
            <h3>{f.title}</h3>
            <p style={{ fontSize: 14, lineHeight: 1.6 }}>{f.text}</p>
          </div>
        ))}
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

        {/* Stripe Payments Objection Handling */}
        <div className="p-5 bg-white border border-[#dde4d4] rounded-xl my-6 shadow-sm text-left max-w-3xl mx-auto">
          <h4 className="text-base font-bold text-[#1f2d26] mb-2 flex items-center gap-2">
            <CreditCard size={20} className="text-[#ea580c] shrink-0" />
            Don&apos;t have a Stripe account or never processed cards online?
          </h4>
          <p className="text-sm text-[#475569] leading-relaxed mb-3">
            <strong>Setup takes under 3 minutes and costs $0:</strong> RollOS connects directly with <strong>Stripe Connect</strong>—the gold standard payment system trusted by millions of businesses. Setting up your account is 100% free with $0 monthly fees, <strong>zero credit checks</strong>, and no impact on your credit score.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#334155] mb-3">
            <div className="flex items-center gap-1.5 bg-[#f8faf7] p-2.5 rounded-lg border border-[#e2e8db]">
              <span className="text-[#166534] font-bold">✓</span>
              <span><strong>Automatic 2-Day Payouts:</strong> Direct to your local bank.</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#f8faf7] p-2.5 rounded-lg border border-[#e2e8db]">
              <span className="text-[#166534] font-bold">✓</span>
              <span><strong>30-Min Instant Payouts:</strong> Ready for landfill tipping fees or fuel.</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#f8faf7] p-2.5 rounded-lg border border-[#e2e8db]">
              <span className="text-[#166534] font-bold">✓</span>
              <span><strong>RollOS Never Holds Funds:</strong> Money flows directly to you.</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#f8faf7] p-2.5 rounded-lg border border-[#e2e8db]">
              <span className="text-[#166534] font-bold">✓</span>
              <span><strong>Free Stripe Mobile App:</strong> Live payout alerts on your phone.</span>
            </div>
          </div>
          <p className="text-xs text-[#64748b] leading-relaxed">
            Card processing is standard interchange (2.9% + 30¢ per transaction). No merchant setup charges, no gateway fees, and no lock-in.
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
              Setting up Stripe Connect takes under 3 minutes directly from your RollOS dashboard. It is 100% free with $0 monthly fees and <strong>zero credit checks</strong> (no score impact). Your customer payments deposit automatically into your bank account on a 2-day rolling basis, with optional 30-minute instant payouts when you need cash for fuel or landfill tipping fees. RollOS never holds your funds.
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
              The Starter Plan ($29/mo) unlocks offline cash/check logging (for contractors who pay on invoice terms) and two-way Google Calendar/Apple iCal sync. The Growth Fleet Plan ($149/mo) is designed for expanding operations with multiple trucks managing high container volumes.
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
      </section>

      {/* 11. Bottom Colony Pillar & Reverse Silo Navigation (Kyle Roof Architecture) */}
      <Footer />
    </main>
  );
}
