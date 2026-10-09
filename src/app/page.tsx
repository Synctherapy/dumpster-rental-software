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
} from 'lucide-react';
import { Brand, Dumpster } from '@/components/brand';
import { ScreenshotLightbox } from '@/components/screenshot-lightbox';

export const metadata = {
  title: 'Roll Off Dumpster Software — $29/Mo Dispatch & Online Booking',
  description:
    'Modern roll off dumpster software for haulers. Low $29/mo Starter or $149/mo Growth plans, 0% rental commission, automated 24/7 online booking, and SMS driver routes.',
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
          <Link href="/vs/docket">RollOS vs Docket</Link>
          <Link href="/templates/dumpster-rental-contract">Free Contract</Link>
          <a href="#pricing">Pricing</a>
          <Link href="/login">Log in</Link>
          <Link href="/signup" className="btn btn-orange">
            Start Free Demo <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* 2. Edward Sturm ATF Engine (5 placements, visible phone removed per user, interactive demo, orange CTA) */}
      <section className="hero">
        <div>
          <div className="eyebrow">
            <span className="dot" /> Built for Independent Haulers · Transparent Low Pricing
          </div>
          <h1>
            Roll off dumpster software with <em>zero bloated bills.</em>
          </h1>
          <p>
            Looking for modern <strong>roll off dumpster software</strong>? RollOS gives you
            automated 24/7 online booking, real-time dispatching, container fleet tracking, and
            driver routing without paying $150–$300/mo software fees. You keep 100% of your rental
            rate on every bin.
          </p>
          <div className="hero-actions">
            <Link href="/signup" className="btn btn-orange">
              Start Free Demo — No Credit Card <ArrowRight size={15} />
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
            <span>✓ Starter from $29/mo</span>
            <span>✓ Growth Fleet $149/mo</span>
            <span>✓ Keep 100% of dumpster revenue</span>
            <span>✓ 3-minute self-serve setup</span>
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
                  Hauler receives: <strong>$425.00 (100%)</strong> · Customer booking fee: $12.00
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
              <h4 style={{ fontSize: 12 }}>Instant booking confirmed · 0% commission</h4>
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

      {/* 4. Core Features Strip */}
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

      {/* 5. The 2 Plans & Customer Fee Conversion Psychology Section */}
      <section id="pricing" className="pricing-section">
        <div className="max-w-xl">
          <div className="eyebrow" style={{ color: '#8a9d73', marginBottom: 20 }}>
            TRANSPARENT PRICING · 2 SIMPLE PLANS
          </div>
          <h2>
            You keep 100% of your rental money.
            <br />
            No $150–$300/mo software bills.
          </h2>
          <p style={{ fontSize: 14, color: '#687864', lineHeight: 1.8, marginTop: 16 }}>
            You keep 100% of your rental money. Your customers pay a simple $12 online booking fee at
            checkout. No $150–$300/mo software bills. No percentage taken out of your hard-earned
            dumpster revenue.
          </p>

          <div className="p-4 bg-white border border-[#dde4d4] rounded-xl my-6 shadow-sm">
            <h4 className="text-sm font-bold text-[#1f2d26] mb-2 flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#ea580c]" />
              Worried your customer won’t pay it?
            </h4>
            <p className="text-xs text-[#556658] leading-relaxed">
              On a <strong>$450 dumpster rental</strong>, a homeowner won’t blink at a{' '}
              <strong>$12 reservation fee</strong> to lock in guaranteed delivery. You keep 100% of your
              hard-earned dumpster revenue. No $150–$300/mo software bills. No percentage taken out of
              your dumpster revenue. More money in your pocket.
            </p>
          </div>

          <div style={{ display: 'grid', gap: 12, marginTop: 15, fontSize: 13, color: '#4a6344' }}>
            {[
              'You keep 100% of base rental rates, daily extensions & tonnage overages',
              'Customer pays a simple $12 online booking fee at checkout',
              'Driver mobile links, dispatch board & proof-of-delivery photos included',
              'Cancel or switch plans anytime with zero contract lock-ins',
            ].map((t) => (
              <div key={t} style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
                <Check size={16} className="text-[#ea580c]" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2 Plans Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          {/* Plan 1: Starter */}
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
                Essential dispatch, offline cash/check logging, and payment flexibility for independent haulers.
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
                <li>0% platform commission on rentals</li>
                <li>Offline Cash/Check payment logs</li>
                <li>Calendar Export & iCal Sync</li>
                <li>Visual Drag-and-Drop Dispatch</li>
                <li>Driver SMS magic links (No app install)</li>
                <li>Driveway proof-of-delivery photos</li>
              </ul>
            </div>
            <div>
              <Link href="/signup" className="btn btn-orange" style={{ width: '100%' }}>
                Start Starter Plan ($29/mo) <ArrowRight size={14} />
              </Link>
              <p style={{ fontSize: 10, textAlign: 'center', color: '#97a892', marginTop: 8 }}>
                Customers pay $12 booking fee · You keep 100% of rental
              </p>
            </div>
          </div>

          {/* Plan 2: Growth Fleet */}
          <div
            className="price-card p-6 flex flex-col justify-between"
            style={{
              background: 'linear-gradient(180deg, #1f2b20 0%, #151d16 100%)',
              border: '2px solid #ea580c',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -12,
                right: 16,
                background: '#ea580c',
                color: 'white',
                fontSize: 10,
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Recommended for Fleets
            </div>
            <div>
              <div className="eyebrow flex items-center gap-1.5" style={{ color: '#fed7aa', marginBottom: 8 }}>
                <Sparkles size={13} className="text-[#ea580c]" /> GROWTH FLEET PLAN
              </div>
              <strong style={{ fontSize: 36 }}>
                $149
                <span style={{ fontSize: 14, letterSpacing: 0, color: '#b8c8b0', fontWeight: 400 }}>
                  {' '}
                  / month
                </span>
              </strong>
              <p style={{ marginTop: 10, fontSize: 12, color: '#e2ecd9', lineHeight: 1.6 }}>
                VIP contractor automation, multi-truck routing, and missed-call capture for expanding fleets.
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
                <li>Contractor VIP 1-Click Swaps</li>
                <li>Missed-Call Auto Text-Back</li>
                <li>White-Label CNAME Domain</li>
                <li>5-Star Google Review Gatekeeper</li>
                <li>Multi-truck route optimization</li>
              </ul>
            </div>
            <div>
              <Link href="/signup" className="btn btn-orange" style={{ width: '100%' }}>
                Start Growth Fleet ($149/mo) <ArrowRight size={14} />
              </Link>
              <p style={{ fontSize: 10, textAlign: 'center', color: '#97a892', marginTop: 8 }}>
                Everything included · Dedicated fleet onboarding
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Competitor Contrast Table (RollOS vs Traditional Software) */}
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
                  $29/mo (Starter) · $149/mo (Growth)
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
                <td>Online Booking Checkout</td>
                <td className="highlight-col font-semibold">
                  Included (60s self-checkout)
                </td>
                <td>Extra cost or complex quotes</td>
              </tr>
              <tr>
                <td>Driver Mobile App</td>
                <td className="highlight-col font-semibold">
                  SMS link (No app store install)
                </td>
                <td>Requires driver app downloads</td>
              </tr>
              <tr>
                <td>Proof of Delivery Photos</td>
                <td className="highlight-col font-semibold">
                  Instant photo upload to job
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

      {/* 7. Uncollapsed Semantic FAQs (Edward Sturm Anti-Pogo & David Quaid Answer Engine) */}
      <section className="faq">
        <h2>Frequently asked questions about roll off dumpster software</h2>
        <p className="faq-subhead">
          Straight answers on pricing, customer booking fees, driver links, and setup. No hidden fees or sales calls required.
        </p>

        <div className="faq-grid">
          <div className="faq-card">
            <h3>
              <HelpCircle size={18} className="text-[#ea580c] flex-shrink-0" />
              What are the 2 RollOS subscription plans?
            </h3>
            <p>
              RollOS offers two transparent plans: the <strong>Starter Plan ($29/mo)</strong> for independent haulers wanting offline cash/check logging, calendar sync, visual dispatching, and SMS driver links; and the <strong>Growth Fleet Plan ($149/mo)</strong> for multi-truck fleets wanting contractor 1-click swaps, missed-call auto text-back, white-label CNAME branding, and automated Google review collection.
            </p>
          </div>

          <div className="faq-card">
            <h3>
              <HelpCircle size={18} className="text-[#ea580c] flex-shrink-0" />
              How does the $12 customer reservation fee work?
            </h3>
            <p>
              Instead of burdening haulers with $300/mo software bills, your customer pays a simple $12 online booking fee at checkout to guarantee their container delivery. You keep 100% of your base rental rate, extra day charges, and weight overages.
            </p>
          </div>

          <div className="faq-card">
            <h3>
              <HelpCircle size={18} className="text-[#ea580c] flex-shrink-0" />
              Will my customers complain about a $12 online booking fee?
            </h3>
            <p>
              No. When a homeowner orders a $450 roll off container, a $12 reservation fee to guarantee their delivery date is completely routine—just like an airline seat or hotel reservation fee. They get instant guaranteed scheduling instead of playing phone tag.
            </p>
          </div>

          <div className="faq-card">
            <h3>
              <HelpCircle size={18} className="text-[#ea580c] flex-shrink-0" />
              Do my drivers need to download an app from the App Store?
            </h3>
            <p>
              No. RollOS sends your driver an encrypted SMS link. Drivers open it directly in their mobile browser to view job addresses, click for turn-by-turn navigation, snap driveway drop photos, and submit scale tickets.
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
              Can I customize my dumpster sizes, prices, and service ZIP codes?
            </h3>
            <p>
              Yes. You configure your exact container inventory (10, 15, 20, 30, 40 yard), base rental rates, included rental days, included tons, extra-day charges, per-ton overages, and delivery ZIP codes in your settings.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Bottom Colony Pillar & Reverse Silo Navigation (Kyle Roof Architecture) */}
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
            <Link href="/terms" style={{ color: '#9bb0a0' }}>
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
