import Link from 'next/link';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Globe,
  HelpCircle,
  MousePointer2,
  ShieldCheck,
  Truck,
  Sparkles,
  Calendar,
  DollarSign,
  Smartphone,
} from 'lucide-react';
import { Brand, Dumpster } from '@/components/brand';
import { ScreenshotLightbox } from '@/components/screenshot-lightbox';

export const metadata = {
  title: 'Roll Off Dumpster Software — Free Online Booking & Dispatch',
  description:
    'Get dumpster clients while you sleep with free roll off dumpster software. 24/7 online booking widget, visual dispatch board, and SMS driver links. $0/mo free plan.',
};

export default function Home() {
  return (
    <main className="marketing">
      {/* 1. Header & Navigation */}
      <nav className="marketing-nav">
        <Brand />
        <div className="marketing-links">
          <Link href="/uses/dumpster-booking-system">Online Booking</Link>
          <Link href="/uses/roll-off-dispatch-software">Dispatch Board</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/vs/docket">RollOS vs Docket</Link>
          <Link href="/templates/dumpster-rental-contract">Free Contract</Link>
          <Link href="/login">Log in</Link>
          <Link href="/signup" className="btn btn-orange">
            Start Free Demo <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* 2. Edward Sturm ATF Engine & Hormozi Hook (Compact Keywords, 3-min setup, orange CTA) */}
      <section className="hero">
        <div>
          <div className="eyebrow">
            <span className="dot" /> Built for Independent Haulers · 24/7 Booking Engine
          </div>
          <h1>
            Roll off dumpster software that gets you bookings <em>while you sleep.</em>
          </h1>
          <p>
            Stop playing phone tag while steering a 15-ton truck. RollOS gives independent haulers
            free <strong>roll off dumpster software</strong> with an embeddable 24/7 booking widget
            for your website, visual drag-and-drop dispatching, and 1-tap SMS driver routes with
            zero app downloads. Setup takes 3 minutes, customers pay upfront, and you keep 100% of
            your rental money.
          </p>
          <div className="hero-actions">
            <Link href="/signup" className="btn btn-orange">
              Start Free in 3 Minutes — No Credit Card <ArrowRight size={15} />
            </Link>
            <Link href="/dashboard" className="btn btn-dark">
              Open Live Dispatch Board
            </Link>
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: 13,
              color: '#687864',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <span>✓ Capture orders 24/7 while you drive</span>
            <span>✓ Free plan ($0/mo) · Keep 100% of rental revenue</span>
            <span>✓ Setup in 3 minutes on any website</span>
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
            <p>Select your container size. Pick delivery dates. Your booking is confirmed instantly.</p>
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
                <span>20 yard · 7 days included · 2 tons</span>
                <p style={{ fontSize: 11, color: '#82956d', margin: 0 }}>
                  Sample rental $425 · Customer reservation fee: $11.95 · Hauler keeps 100%
                </p>
              </div>
              <strong>$425</strong>
            </div>
            <Link href="/book/greenline" className="btn btn-orange" style={{ width: '100%' }}>
              Test Live Booking Flow <ArrowRight size={14} />
            </Link>
          </div>
          <div className="hero-floating">
            <CheckCircle2 size={28} color="#d6ef7c" />
            <div>
              <h4 style={{ fontSize: 12 }}>Instant booking confirmed · 0% hauler commission</h4>
              <p>Your dumpster is dispatched and locked on your board.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Real High-Resolution SEO Software Screenshots (Clickable Lightbox) */}
      <section className="px-6 py-12 max-w-[1240px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-4">
          <div className="eyebrow" style={{ color: '#82956d', marginBottom: 10 }}>
            FIELD-TESTED ROLL OFF DUMPSTER DISPATCH & BOOKING
          </div>
          <h2 style={{ fontSize: 32, marginBottom: 12 }}>
            See how roll off dumpster software runs your entire day.
          </h2>
          <p style={{ color: '#687864', fontSize: 15 }}>
            Click any screenshot to zoom in and inspect the real operational interface in full resolution.
          </p>
        </div>

        {/* Interactive Clickable Lightbox Component */}
        <ScreenshotLightbox />
      </section>

      {/* 4. Donald Miller 3-Step Success Plan */}
      <section className="px-6 py-12 max-w-[1040px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="eyebrow" style={{ color: '#82956d', marginBottom: 8 }}>
            SIMPLE 3-STEP PROCESS
          </div>
          <h2 style={{ fontSize: 30, marginBottom: 10 }}>
            How RollOS eliminates phone tag and fills your calendar
          </h2>
          <p style={{ color: '#687864', fontSize: 14 }}>
            You didn’t start a hauling business to spend all evening doing manual data entry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm relative">
            <div className="w-10 h-10 rounded-full bg-[#ffedd5] text-[#ea580c] font-black text-lg flex items-center justify-center mb-4">
              1
            </div>
            <h3 className="text-base font-bold text-[#1f2d26] mb-2">
              Set Your Sizes & Rates (3 Minutes)
            </h3>
            <p className="text-xs text-[#556658] leading-relaxed">
              Add your 10, 15, 20, 30, or 40-yard dumpsters, base rental prices, included days, tonnage allowances, and delivery ZIP codes in your settings.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm relative">
            <div className="w-10 h-10 rounded-full bg-[#ffedd5] text-[#ea580c] font-black text-lg flex items-center justify-center mb-4">
              2
            </div>
            <h3 className="text-base font-bold text-[#1f2d26] mb-2">
              Add the Booking Widget to Your Website
            </h3>
            <p className="text-xs text-[#556658] leading-relaxed">
              Copy one line of embed code into WordPress, Wix, Squarespace, or HTML. Or simply share your direct booking link on your Google Business Profile and Facebook page.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm relative">
            <div className="w-10 h-10 rounded-full bg-[#ffedd5] text-[#ea580c] font-black text-lg flex items-center justify-center mb-4">
              3
            </div>
            <h3 className="text-base font-bold text-[#1f2d26] mb-2">
              Wake Up to Paid Orders & 1-Tap Dispatch
            </h3>
            <p className="text-xs text-[#556658] leading-relaxed">
              Homeowners reserve and pay upfront while you sleep. Drivers receive instant SMS magic links with turn-by-turn navigation and camera delivery proof. You keep 100% of your rental money.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Core Features Strip */}
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
            <p>{f.text}</p>
          </div>
        ))}
      </section>

      {/* 6. Pricing Section (Value-Driven, No 'Turn Fee Off' Hook) */}
      <section id="pricing" className="pricing-section">
        <div className="max-w-xl">
          <div className="eyebrow" style={{ color: '#8a9d73', marginBottom: 20 }}>
            TRANSPARENT PRICING · START 100% FREE
          </div>
          <h2>
            You keep 100% of your rental money.
            <br />
            No $150–$350/mo software bills.
          </h2>
          <p style={{ fontSize: 14, color: '#687864', lineHeight: 1.8, marginTop: 16 }}>
            Why pay Docket, DumpsterSoft, or Jobber hundreds of dollars every month before you haul your first bin?
            With RollOS, your customers pay an $11.95 online reservation fee at checkout to guarantee their container delivery date.
            You keep 100% of your base rental rate, extra day charges, and weight overages.
          </p>

          <div className="p-4 bg-white border border-[#dde4d4] rounded-xl my-6 shadow-sm">
            <h4 className="text-sm font-bold text-[#1f2d26] mb-2 flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#ea580c]" />
              Worried your customer won’t pay it?
            </h4>
            <p className="text-xs text-[#556658] leading-relaxed">
              On a <strong>$450 dumpster rental</strong>, a homeowner won’t blink at an{' '}
              <strong>$11.95 reservation fee</strong> to lock in guaranteed Saturday delivery. You keep 100% of your
              hard-earned dumpster revenue. No $150–$300/mo software bills. No percentage taken out of
              your dumpster revenue. More money in your pocket.
            </p>
          </div>

          <div style={{ display: 'grid', gap: 12, marginTop: 15, fontSize: 13, color: '#4a6344' }}>
            {[
              'You keep 100% of base rental rates, daily extensions & tonnage overages',
              'Customer pays standard $11.95 online booking fee at checkout',
              'Driver mobile links, dispatch board & proof-of-delivery photos included',
              'Cancel or switch plans anytime with zero contract lock-ins',
            ].map((t) => (
              <div key={t} style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
                <Check size={16} className="text-[#ea580c]" />
                <span>{t}</span>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 20, fontSize: 13 }}>
            <Link href="/pricing" className="font-semibold text-[#ea580c] hover:underline">
              See the full pricing breakdown and ROI comparison →
            </Link>
          </p>
        </div>

        {/* 3 Plans Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {/* Plan 1: Free */}
          <div className="price-card p-6 flex flex-col justify-between" style={{ border: '2px solid #ea580c' }}>
            <div>
              <div className="eyebrow" style={{ color: '#d6ef7c', marginBottom: 8 }}>
                FREE PLAN
              </div>
              <strong style={{ fontSize: 36 }}>
                $0
                <span style={{ fontSize: 14, letterSpacing: 0, color: '#b8c8b0', fontWeight: 400 }}>
                  {' '}
                  / month
                </span>
              </strong>
              <p style={{ marginTop: 10, fontSize: 12, color: '#e2ecd9', lineHeight: 1.6 }}>
                Get bookings while you sleep. Everything you need to eliminate phone tag and run daily dispatches.
              </p>
              <ul
                style={{
                  margin: '16px 0',
                  paddingLeft: 18,
                  fontSize: 12,
                  color: '#d6ef7c',
                  lineHeight: 1.8,
                }}
              >
                <li>24/7 Website Booking Widget</li>
                <li>Visual Drag-and-Drop Dispatch</li>
                <li>Driver SMS magic links (No app)</li>
                <li>Driveway delivery photo proof</li>
                <li>Landfill scale ticket & overages</li>
                <li>$11.95 customer booking fee</li>
              </ul>
            </div>
            <div>
              <Link href="/signup" className="btn btn-orange" style={{ width: '100%' }}>
                Start Free in 3 Mins <ArrowRight size={14} />
              </Link>
              <p style={{ fontSize: 10, textAlign: 'center', color: '#97a892', marginTop: 8 }}>
                No credit card required
              </p>
            </div>
          </div>

          {/* Plan 2: Starter */}
          <div className="price-card p-6 flex flex-col justify-between">
            <div>
              <div className="eyebrow" style={{ color: '#d6ef7c', marginBottom: 8 }}>
                STARTER PLAN
              </div>
              <strong style={{ fontSize: 36 }}>
                $29
                <span style={{ fontSize: 14, letterSpacing: 0, color: '#b8c8b0', fontWeight: 400 }}>
                  {' '}
                  / month
                </span>
              </strong>
              <p style={{ marginTop: 10, fontSize: 12, color: '#e2ecd9', lineHeight: 1.6 }}>
                Full operational command: offline cash/check payments and two-way calendar synchronization.
              </p>
              <ul
                style={{
                  margin: '16px 0',
                  paddingLeft: 18,
                  fontSize: 12,
                  color: '#d6ef7c',
                  lineHeight: 1.8,
                }}
              >
                <li>Everything in Free included</li>
                <li>Offline Cash/Check payment logs</li>
                <li>2-Way Google & Apple Calendar Sync</li>
                <li>Option to disable customer fee</li>
                <li>Financial exports & priority filters</li>
              </ul>
            </div>
            <div>
              <Link href="/signup" className="btn btn-orange" style={{ width: '100%' }}>
                Choose Starter <ArrowRight size={14} />
              </Link>
              <p style={{ fontSize: 10, textAlign: 'center', color: '#97a892', marginTop: 8 }}>
                For active contractor accounts
              </p>
            </div>
          </div>

          {/* Plan 3: Growth Fleet */}
          <div className="price-card p-6 flex flex-col justify-between">
            <div>
              <div className="eyebrow" style={{ color: '#fed7aa', marginBottom: 8 }}>
                GROWTH FLEET
              </div>
              <strong style={{ fontSize: 36 }}>
                $149
                <span style={{ fontSize: 14, letterSpacing: 0, color: '#b8c8b0', fontWeight: 400 }}>
                  {' '}
                  / month
                </span>
              </strong>
              <p style={{ marginTop: 10, fontSize: 12, color: '#e2ecd9', lineHeight: 1.6 }}>
                Multi-truck fleet scheduling and priority support for larger, expanding operations.
              </p>
              <ul
                style={{
                  margin: '16px 0',
                  paddingLeft: 18,
                  fontSize: 12,
                  color: '#fed7aa',
                  lineHeight: 1.8,
                }}
              >
                <li>Everything in Starter included</li>
                <li>Multi-truck fleet dispatching</li>
                <li>Scale across dozens of containers</li>
                <li>Option to disable customer fee</li>
                <li>No per-user or per-driver seat fees</li>
              </ul>
            </div>
            <div>
              <Link href="/signup" className="btn btn-orange" style={{ width: '100%' }}>
                Choose Growth <ArrowRight size={14} />
              </Link>
              <p style={{ fontSize: 10, textAlign: 'center', color: '#97a892', marginTop: 8 }}>
                For multi-truck fleets
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Competitor Contrast Table (RollOS vs Traditional Software) */}
      <section className="px-6 py-12 max-w-[960px] mx-auto">
        <div className="text-center mb-8">
          <div className="eyebrow" style={{ color: '#8a9d73', marginBottom: 8 }}>
            HEAD-TO-HEAD COMPARISON
          </div>
          <h2 style={{ fontSize: 28 }}>Why independent haulers choose RollOS</h2>
          <p style={{ color: '#687864', fontSize: 14 }}>
            Stop paying monthly rent for software that should be generating you revenue.
          </p>
        </div>

        <div className="overflow-x-auto">
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
                  Customer pays $11.95 booking fee
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

      {/* 8. Uncollapsed Semantic FAQs (Edward Sturm Anti-Pogo & David Quaid Answer Engine) */}
      <section className="faq">
        <h2>Frequently asked questions about roll off dumpster software</h2>
        <p className="faq-subhead">
          Straight answers on pricing, customer booking fees, driver links, and setup. No hidden fees or sales calls required.
        </p>

        <div className="faq-grid">
          <div className="faq-card">
            <h3>
              <HelpCircle size={18} className="text-[#ea580c] flex-shrink-0" />
              How does the free plan work?
            </h3>
            <p>
              The Free Plan gives you our full 24/7 online booking widget, visual drag-and-drop dispatch board, driver SMS magic links, and delivery photo proof with $0 monthly software bills. Your customer pays an $11.95 online reservation fee at checkout to guarantee their container delivery. You keep 100% of your rental money.
            </p>
          </div>

          <div className="faq-card">
            <h3>
              <HelpCircle size={18} className="text-[#ea580c] flex-shrink-0" />
              Will my customers complain about an $11.95 booking fee?
            </h3>
            <p>
              No. When a customer orders a $450 roll off container, an $11.95 reservation fee to guarantee their delivery date is completely routine—just like an airline seat or hotel reservation fee. They get instant online confirmation instead of playing phone tag.
            </p>
          </div>

          <div className="faq-card">
            <h3>
              <HelpCircle size={18} className="text-[#ea580c] flex-shrink-0" />
              Do my drivers need to download an app from the App Store?
            </h3>
            <p>
              No. RollOS sends your driver an encrypted SMS link. Drivers open it directly in their mobile browser to view job addresses, click for turn-by-turn navigation, snap driveway drop photos, and submit scale tickets. Works on any phone with zero installation headaches.
            </p>
          </div>

          <div className="faq-card">
            <h3>
              <HelpCircle size={18} className="text-[#ea580c] flex-shrink-0" />
              Can I embed the booking widget on my existing website?
            </h3>
            <p>
              Yes. You can copy a one-line embed code into WordPress, Squarespace, Wix, or custom HTML. You can also share your direct booking link on Google Business Profile, Facebook, and Instagram.
            </p>
          </div>

          <div className="faq-card">
            <h3>
              <HelpCircle size={18} className="text-[#ea580c] flex-shrink-0" />
              What do the Starter ($29/mo) and Growth ($149/mo) plans include?
            </h3>
            <p>
              The Starter Plan ($29/mo) unlocks offline cash/check logging (for contractors who pay on invoice terms) and two-way Google Calendar/Apple iCal sync. The Growth Fleet Plan ($149/mo) is designed for expanding operations with multiple trucks managing high container volumes.
            </p>
          </div>

          <div className="faq-card">
            <h3>
              <HelpCircle size={18} className="text-[#ea580c] flex-shrink-0" />
              How do I get paid for dumpster rentals?
            </h3>
            <p>
              RollOS connects directly to your own Stripe account. When a customer books online, rental payments and deposits flow straight into your bank account. RollOS never holds your money.
            </p>
          </div>
        </div>
      </section>

      {/* 9. Bottom Colony Pillar & Reverse Silo Navigation (Kyle Roof Architecture) */}
      <footer className="marketing-footer">
        <div className="footer-cols">
          <div>
            <div className="flex items-center gap-2 mb-2 font-bold text-white">
              <Dumpster size={20} />
              RollOS
            </div>
            <p style={{ fontSize: 13, color: '#9bb0a0', lineHeight: 1.6 }}>
              The booking-first roll off dumpster software for independent haulers. Built to eliminate phone tag, dispatch drivers instantly, and keep 100% of your rental money.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: 13, marginBottom: 12 }}>Solutions</h4>
            <div style={{ display: 'grid', gap: 8, fontSize: 13 }}>
              <Link href="/uses/dumpster-booking-system" style={{ color: '#c8dac5' }}>
                Dumpster Booking System
              </Link>
              <Link href="/uses/roll-off-dispatch-software" style={{ color: '#c8dac5' }}>
                Roll Off Dispatch Software
              </Link>
              <Link href="/pricing" style={{ color: '#c8dac5' }}>
                Dumpster Software Pricing
              </Link>
              <Link href="/vs/docket" style={{ color: '#c8dac5' }}>
                RollOS vs Docket Comparison
              </Link>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: 13, marginBottom: 12 }}>Hauler Resources</h4>
            <div style={{ display: 'grid', gap: 8, fontSize: 13 }}>
              <Link href="/templates/dumpster-rental-contract" style={{ color: '#c8dac5' }}>
                Dumpster Rental Contract Template
              </Link>
              <Link href="/templates/dumpster-invoice" style={{ color: '#c8dac5' }}>
                Dumpster Rental Invoice Template
              </Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© {new Date().getFullYear()} RollOS (rolloffdumpstersoftware.com). All rights reserved.</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <Link href="/terms-of-service" style={{ color: '#9bb0a0' }}>
              Terms of Service
            </Link>
            <Link href="/privacy" style={{ color: '#9bb0a0' }}>
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
