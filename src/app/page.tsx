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
  title: 'Dumpster Rental Software for Roll-Off Haulers',
  description:
    'Dumpster rental software for independent roll-off haulers. Free to start at $0/month, then $29 or $149. Online booking, dispatch, driver links, and tonnage billing.',
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
            Dumpster rental software for booking, dispatch, and billing.
          </h1>
          <p>
            RollOS is <strong>dumpster rental software</strong> for independent roll-off haulers.
            Customers book a container, the job lands on your board, and the driver opens a link on
            their phone. Start free at $0/month. Upgrade to $29 or $149 when you want to turn the
            customer reservation fee off.
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
            <span>✓ Free plan, $0/month</span>
            <span>✓ Starter $29/mo · Growth $149/mo</span>
            <span>✓ No annual contract</span>
            <span>✓ Driver links, no app install</span>
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
                  Sample rental $425 · Free-plan reservation fee $11.95
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
              <h4 style={{ fontSize: 12 }}>Sample booking · test data, no live charge</h4>
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

      {/* 5. Three plans. Free is the advertised starting offer. */}
      <section id="pricing" className="pricing-section">
        <div className="max-w-xl">
          <div className="eyebrow" style={{ color: '#8a9d73', marginBottom: 20 }}>
            THREE PLANS · START FREE
          </div>
          <h2>
            Free to start.
            <br />
            Upgrade when the fee should come off.
          </h2>
          <p style={{ fontSize: 14, color: '#687864', lineHeight: 1.8, marginTop: 16 }}>
            The free plan is $0 a month. Online bookings on that plan add an $11.95 customer
            reservation fee. Starter is $29 a month and Growth is $149 a month. On a paid plan you
            can turn the customer fee off. Stripe’s card-processing fees are separate on every plan.
          </p>
          <div style={{ display: 'grid', gap: 12, marginTop: 15, fontSize: 13, color: '#4a6344' }}>
            {[
              'Free: booking link, dispatch board, driver links, photo proof',
              'Starter $29: turn the $11.95 fee off, cash and check logging, calendar sync',
              'Growth $149: same operating tools, for a larger fleet',
              'No annual contract. Cancel or switch in settings.',
            ].map((t) => (
              <div key={t} style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
                <Check size={16} className="text-[#ea580c]" />
                <span>{t}</span>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 16, fontSize: 13 }}>
            <Link href="/pricing">See the full pricing breakdown</Link>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <div className="price-card p-6 flex flex-col justify-between">
            <div>
              <div className="eyebrow" style={{ color: '#d6ef7c', marginBottom: 8 }}>FREE</div>
              <strong style={{ fontSize: 36 }}>
                $0
                <span style={{ fontSize: 14, letterSpacing: 0, color: '#b8c8b0', fontWeight: 400 }}> / month</span>
              </strong>
              <p style={{ marginTop: 10, fontSize: 12, color: '#e2ecd9', lineHeight: 1.6 }}>
                Start here. Online bookings include an $11.95 customer reservation fee.
              </p>
              <ul style={{ margin: '16px 0', paddingLeft: 18, fontSize: 12, color: '#d6ef7c', lineHeight: 1.8 }}>
                <li>Booking link and website embed</li>
                <li>Dispatch board</li>
                <li>Driver SMS links, no app</li>
                <li>Delivery photo proof</li>
                <li>Manual tonnage on the invoice</li>
              </ul>
            </div>
            <Link href="/signup" className="btn btn-orange" style={{ width: '100%' }}>
              Start free <ArrowRight size={14} />
            </Link>
          </div>

          <div className="price-card p-6 flex flex-col justify-between">
            <div>
              <div className="eyebrow" style={{ color: '#d6ef7c', marginBottom: 8 }}>STARTER</div>
              <strong style={{ fontSize: 36 }}>
                $29
                <span style={{ fontSize: 14, letterSpacing: 0, color: '#b8c8b0', fontWeight: 400 }}> / month</span>
              </strong>
              <p style={{ marginTop: 10, fontSize: 12, color: '#e2ecd9', lineHeight: 1.6 }}>
                Turn the customer reservation fee off and log cash or check.
              </p>
              <ul style={{ margin: '16px 0', paddingLeft: 18, fontSize: 12, color: '#d6ef7c', lineHeight: 1.8 }}>
                <li>Everything on Free</li>
                <li>Customer fee can be disabled</li>
                <li>Cash and check payment log</li>
                <li>Calendar export and iCal sync</li>
              </ul>
            </div>
            <Link href="/signup" className="btn btn-orange" style={{ width: '100%' }}>
              Choose Starter <ArrowRight size={14} />
            </Link>
          </div>

          <div className="price-card p-6 flex flex-col justify-between" style={{ border: '2px solid #ea580c' }}>
            <div>
              <div className="eyebrow" style={{ color: '#fed7aa', marginBottom: 8 }}>GROWTH</div>
              <strong style={{ fontSize: 36 }}>
                $149
                <span style={{ fontSize: 14, letterSpacing: 0, color: '#b8c8b0', fontWeight: 400 }}> / month</span>
              </strong>
              <p style={{ marginTop: 10, fontSize: 12, color: '#e2ecd9', lineHeight: 1.6 }}>
                The fleet plan. Same tools, priced for a larger operation.
              </p>
              <ul style={{ margin: '16px 0', paddingLeft: 18, fontSize: 12, color: '#fed7aa', lineHeight: 1.8 }}>
                <li>Everything on Starter</li>
                <li>Customer fee can be disabled</li>
                <li>Built for more than one truck</li>
                <li>No annual contract</li>
              </ul>
            </div>
            <Link href="/signup" className="btn btn-orange" style={{ width: '100%' }}>
              Choose Growth <ArrowRight size={14} />
            </Link>
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
                  Free, or $29 / $149
                </td>
                <td>0% to 2% + Stripe</td>
              </tr>
              <tr>
                <td>Software Overhead Model</td>
                <td className="highlight-col font-semibold">
                  $11.95 fee on the free plan
                </td>
                <td>Hauler pays the software bill</td>
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
              What are the RollOS plans?
            </h3>
            <p>
              Three plans. <strong>Free is $0/month</strong> and includes an $11.95 customer reservation fee on online bookings. <strong>Starter is $29/month</strong> and <strong>Growth is $149/month</strong>. Paid plans can turn that customer fee off. Stripe processing fees are separate.
            </p>
          </div>

          <div className="faq-card">
            <h3>
              <HelpCircle size={18} className="text-[#ea580c] flex-shrink-0" />
              How does the $11.95 customer reservation fee work?
            </h3>
            <p>
              On the free plan, checkout adds an $11.95 reservation fee paid by the customer. That fee is how the free plan is funded. On Starter or Growth you can disable it and absorb the software cost yourself.
            </p>
          </div>

          <div className="faq-card">
            <h3>
              <HelpCircle size={18} className="text-[#ea580c] flex-shrink-0" />
              Can I remove the customer reservation fee?
            </h3>
            <p>
              Yes, on Starter ($29/month) or Growth ($149/month). The free plan requires the $11.95 fee. Show the fee in checkout so the customer sees it before they pay.
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
              Dumpster rental software for independent roll-off haulers. Free to start. Booking, dispatch, driver links, and tonnage billing in one workspace.
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
                RollOS vs Docket
              </Link>
              <Link href="/pricing" style={{ color: '#c8dac5' }}>
                Pricing
              </Link>
              <Link href="/tools/tonnage-calculator" style={{ color: '#c8dac5' }}>
                Tonnage calculator
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
            <Link href="/terms" style={{ color: '#9bb0a0' }}>
              Customer rental terms
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
