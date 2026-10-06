import Link from 'next/link';
import { ArrowRight, Check, Globe, MousePointer2, Truck, CheckCircle2 } from 'lucide-react';
import { Brand, Dumpster } from '@/components/brand';
export default function Home() {
  return (
    <main className="marketing">
      <nav className="marketing-nav">
        <Brand />
        <div className="marketing-links">
          <a href="#features">Why RollOS</a>
          <a href="#pricing">Pricing</a>
          <Link href="/login">Log in</Link>
          <Link href="/dashboard" className="btn btn-dark">
            Explore the demo <ArrowRight size={13} />
          </Link>
        </div>
      </nav>
      <section className="hero">
        <div>
          <div className="eyebrow">
            <span className="dot" /> Built for the way you haul
          </div>
          <h1>
            Your business.
            <br />
            Always <em>rolling.</em>
          </h1>
          <p>
            The booking page that never sleeps. Dumpster rental software that brings your bookings,
            fleet, and crew into one simple workspace.
          </p>
          <div className="hero-actions">
            <Link href="/signup" className="btn btn-dark">
              Start hauling smarter <ArrowRight size={15} />
            </Link>
            <Link href="/dashboard" className="btn">
              Take a look around
            </Link>
          </div>
          <small>Free to start · 1% per transaction · No monthly software bill</small>
        </div>
        <div className="hero-visual">
          <div className="hero-mini">
            <div className="eyebrow" style={{ color: '#82956d', marginBottom: 12 }}>
              YOUR NEXT PROJECT STARTS HERE
            </div>
            <h3>A dumpster. Without the hassle.</h3>
            <p>Choose your size. Pick your dates. You’re all set.</p>
            <div className="hero-mini-sizes">
              {[10, 20, 30].map((size) => (
                <div key={size} className={size === 20 ? 'selected' : ''}>
                  <Dumpster size={size} />
                  {size} yard
                </div>
              ))}
            </div>
            <div className="hero-mini-total">
              <span>20 yard · 7 days · 2 tons included</span>
              <strong>$425</strong>
            </div>
            <Link href="/book/greenline" className="btn btn-primary" style={{ width: '100%' }}>
              Try a demo booking <ArrowRight size={14} />
            </Link>
          </div>
          <div className="hero-floating">
            <CheckCircle2 size={28} color="#d6ef7c" />
            <div>
              <h4 style={{ fontSize: 12 }}>Another booking. While you were hauling.</h4>
              <p>Your next job is already on the board.</p>
            </div>
          </div>
        </div>
      </section>
      <section id="features" className="feature-strip">
        {[
          {
            icon: Globe,
            title: 'Open for business. All the time.',
            text: 'Give customers a booking link they can use in minutes. Add it to your existing website with a simple embed.',
          },
          {
            icon: Truck,
            title: 'One board. Your whole operation.',
            text: 'From booked to picked up, see every job, assign your crew, and keep your containers moving.',
          },
          {
            icon: MousePointer2,
            title: 'Big buttons. Less back-and-forth.',
            text: 'Drivers get a secure link to their jobs. Navigate, upload delivery proof, and record pickup from their phone.',
          },
        ].map((f) => (
          <div key={f.title}>
            <f.icon size={24} />
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </section>
      <section id="pricing" className="pricing-section">
        <div>
          <div className="eyebrow" style={{ color: '#8a9d73', marginBottom: 20 }}>
            A BUSINESS MODEL THAT MAKES SENSE
          </div>
          <h2>
            We grow when
            <br />
            your business grows.
          </h2>
          <p style={{ fontSize: 13, color: '#8a9681', lineHeight: 1.9, marginTop: 20 }}>
            No seat fees. No monthly subscriptions. Our platform fee is 1% of each transaction.
            Stripe’s payment processing fees apply separately.
          </p>
          <div style={{ display: 'grid', gap: 14, marginTop: 25, fontSize: 12, color: '#647954' }}>
            {[
              'Booking, dispatch, and fleet management',
              'Driver links and proof of delivery',
              'Server-calculated invoices and transparent fees',
            ].map((t) => (
              <div key={t} style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
                <Check size={15} />
                {t}
              </div>
            ))}
          </div>
        </div>
        <div className="price-card">
          <h3>THE EVERYTHING PLAN</h3>
          <strong>
            $0
            <span style={{ fontSize: 15, letterSpacing: 0, color: '#b8c8b0', fontWeight: 400 }}>
              {' '}
              / month
            </span>
          </strong>
          <p>
            + 1% per transaction.
            <br />
            Software that earns its place on your truck.
          </p>
          <Link href="/signup" className="btn btn-primary">
            Get your business rolling <ArrowRight size={14} />
          </Link>
          <p style={{ fontSize: 10, textAlign: 'center', marginTop: 12 }}>
            Currently in test mode. No live charges.
          </p>
        </div>
      </section>
      <section className="faq">
        <h2>A few things you might be wondering.</h2>
        {[
          [
            'Do I need a new website?',
            'No. Share your booking link directly or embed the booking flow on your existing website. Your customers see your company name and pricing.',
          ],
          [
            'Can my drivers use it without installing an app?',
            'Yes. A dispatcher shares a signed, expiring link. Drivers can open it on their phone, navigate to the job, and upload delivery proof.',
          ],
          [
            'How is the 1% fee calculated?',
            'The platform fee is calculated on the server and attached to each Stripe transaction. Stripe processing fees are additional. Demo transactions are clearly marked and do not move money.',
          ],
          [
            'Can I set my own rental prices?',
            'Yes. Configure each size, included days and tons, extra-day rates, tonnage overages, service ZIP codes, and deposit percentage.',
          ],
          [
            'Is RollOS accepting live payments yet?',
            'This build uses Stripe test mode only. Hosted authentication, payments, and SMS must be configured and verified before a production launch.',
          ],
        ].map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
      <footer className="marketing-footer">
        <span>© {new Date().getFullYear()} RollOS. Keep good things rolling.</span>
        <Link href="/terms">
          Rental terms <ArrowRight size={10} style={{ display: 'inline' }} />
        </Link>
      </footer>
    </main>
  );
}
