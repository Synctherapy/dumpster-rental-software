'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  Rocket,
  Star,
  Globe,
  Code,
  Copy,
  Check,
  ArrowUpRight,
  Sparkles,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { Button } from './ui/button';
import { Modal } from './ui/dialog';
import type { Workspace } from '@/lib/types';

export function GrowthHub({
  data,
  notify,
}: {
  data: Workspace;
  notify: (message: string, error?: boolean) => void;
}) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [showWebsiteModal, setShowWebsiteModal] = useState(false);
  const [websiteRequested, setWebsiteRequested] = useState(false);

  const bookingUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/book/${data.organization.slug}`
      : `/book/${data.organization.slug}`;

  const embedCode = `<iframe src="${bookingUrl}" width="100%" height="900" style="border:0;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.08);" title="Rent a dumpster"></iframe>`;

  const copyBookingLink = async () => {
    try {
      await navigator.clipboard.writeText(bookingUrl);
      setCopiedLink(true);
      notify('Public booking link copied to clipboard.');
      setTimeout(() => setCopiedLink(false), 3000);
    } catch {
      notify('Failed to copy. Please copy manually.', true);
    }
  };

  const copyEmbedCode = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopiedEmbed(true);
      notify('Embed code copied! Paste it into your WordPress, Squarespace, or Wix site.');
      setTimeout(() => setCopiedEmbed(false), 3000);
    } catch {
      notify('Failed to copy. Please copy manually.', true);
    }
  };

  return (
    <div className="growth-container" style={{ display: 'grid', gap: '24px' }}>
      {/* Top Banner */}
      <section
        className="panel"
        style={{
          background: 'linear-gradient(135deg, #182820 0%, #1c3626 100%)',
          color: '#f0fdf4',
          padding: '28px',
          borderRadius: '14px',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.12)', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', color: '#86efac', marginBottom: '12px', fontWeight: 600 }}>
          <Rocket size={13} />
          CLIENT ACQUISITION & REVENUE ACCELERATOR
        </div>
        <h2 style={{ fontSize: '24px', margin: '0 0 8px 0', color: '#fff', fontWeight: 600 }}>
          Keep your dumpsters on driveways, not sitting in your yard.
        </h2>
        <p style={{ margin: 0, fontSize: '13px', color: '#bbf7d0', maxWidth: '640px', lineHeight: 1.6 }}>
          Turn your digital presence into automated rentals. Collect 5-star Google reviews on autopilot, embed
          direct checkout on your website, or let our waste marketing team build a turnkey website for you.
        </p>
      </section>

      {/* 3 Pillars of Client Growth */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Pillar 1: 5-Star Review Booster */}
        <section className="panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span style={{ background: '#fef3c7', color: '#b45309', padding: '8px', borderRadius: '8px', display: 'grid' }}>
              <Star size={18} />
            </span>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Google 5-Star Review Booster</h3>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Automated SMS reputation engine</span>
            </div>
          </div>
          <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6, flex: 1 }}>
            Homeowners search Google first when booking a dumpster. When your driver picks up a container, RollOS
            automatically texts the customer asking for a 5-star Google review.
          </p>
          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', margin: '14px 0', fontSize: '11px' }}>
            <div style={{ color: '#0f172a', fontWeight: 600, marginBottom: '4px' }}>Current Review Link:</div>
            <div style={{ color: '#64748b', wordBreak: 'break-all' }}>
              {data.organization.google_review_url || data.organization.pricing_config?.google_review_url || 'No link configured yet.'}
            </div>
          </div>
          <Button asChild variant="primary" style={{ width: '100%', justifyContent: 'center' }}>
            <Link href="/settings">Configure Google Review Link</Link>
          </Button>
        </section>

        {/* Pillar 2: 1-Click Booking Embed */}
        <section className="panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '8px', borderRadius: '8px', display: 'grid' }}>
              <Code size={18} />
            </span>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Instant Website Embed</h3>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Turn your existing site into an online store</span>
            </div>
          </div>
          <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6, flex: 1 }}>
            Drop our responsive booking widget directly onto your WordPress, Squarespace, Wix, or custom website.
            Homeowners can quote, pick dates, sign terms, and pay deposits right on your site.
          </p>
          <div style={{ display: 'flex', gap: '8px', margin: '14px 0' }}>
            <Button onClick={copyBookingLink} variant="ghost" style={{ flex: 1, fontSize: '11px' }}>
              {copiedLink ? <Check size={12} style={{ color: '#16a34a' }} /> : <Copy size={12} />}
              {copiedLink ? 'Link Copied' : 'Copy Direct Link'}
            </Button>
            <Button onClick={copyEmbedCode} variant="ghost" style={{ flex: 1, fontSize: '11px' }}>
              {copiedEmbed ? <Check size={12} style={{ color: '#16a34a' }} /> : <Code size={12} />}
              {copiedEmbed ? 'Snippet Copied' : 'Copy Embed Code'}
            </Button>
          </div>
          <Button asChild variant="primary" style={{ width: '100%', justifyContent: 'center' }}>
            <Link href={`/book/${data.organization.slug}`} target="_blank">
              Preview Customer Booking Page <ArrowUpRight size={12} />
            </Link>
          </Button>
        </section>

        {/* Pillar 3: High-Ticket Upsell: "We Build Your Website" */}
        <section
          className="panel"
          style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            border: '2px solid #bbf7d0',
            background: '#fcfdfc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span style={{ background: '#dcfce7', color: '#15803d', padding: '8px', borderRadius: '8px', display: 'grid' }}>
              <Globe size={18} />
            </span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Custom Website & Local SEO</h3>
                <span style={{ fontSize: '9px', background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                  VIP SETUP
                </span>
              </div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Done-for-you waste hauling website</span>
            </div>
          </div>
          <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6, flex: 1 }}>
            Don&apos;t have a website or tired of an outdated site that doesn&apos;t rank? Our dedicated waste industry web team
            will build, host, and optimize a custom website for your service ZIP codes with the RollOS booking engine pre-installed.
          </p>
          <div style={{ margin: '14px 0', fontSize: '11px', color: '#166534', display: 'grid', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} /> High-speed Google Mobile optimized
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} /> Local ZIP code SEO landing pages
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} /> Direct booking & dispatch integration
            </div>
          </div>
          <Button
            variant="primary"
            style={{ width: '100%', justifyContent: 'center', background: '#1b3323', color: '#fff' }}
            onClick={() => setShowWebsiteModal(true)}
          >
            <Sparkles size={13} />
            Request Website Setup Consultation
          </Button>
        </section>
      </div>

      {/* Subscription Model Upgrade Card */}
      <section
        className="panel"
        style={{
          padding: '24px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={16} style={{ color: '#d97706' }} />
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Upgrade to RollOS Pro Fleet</h3>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b', maxWidth: '580px', lineHeight: 1.5 }}>
            Running 5+ trucks or 50+ bins? Unlock unlimited driver route links, custom branded SMS sender ID,
            dedicated phone dispatch hotline, and zero platform transaction cut.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button asChild variant="primary">
            <Link href="/settings">Manage Membership & Billing</Link>
          </Button>
        </div>
      </section>

      {/* Website Setup Consultation Modal */}
      {showWebsiteModal && (
        <Modal
          open={showWebsiteModal}
          onOpenChange={(open) => !open && setShowWebsiteModal(false)}
          title="Turnkey Hauling Website & Local SEO"
          description="Have our specialized team build and launch your company website with direct RollOS booking."
        >
          {websiteRequested ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
                <CheckCircle2 size={24} />
              </div>
              <h3 style={{ fontSize: '18px', margin: '0 0 8px 0' }}>Request Submitted!</h3>
              <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '380px', margin: '0 auto 20px' }}>
                We&apos;ve received your request for {data.organization.name}. Our web launch specialist will reach out to{' '}
                <strong>{data.organization.phone || 'your business phone'}</strong> within 1 business day.
              </p>
              <Button variant="primary" onClick={() => setShowWebsiteModal(false)}>
                Done
              </Button>
            </div>
          ) : (
            <form
              className="form-stack"
              onSubmit={(e) => {
                e.preventDefault();
                setWebsiteRequested(true);
                notify('Website consultation request submitted!');
              }}
            >
              <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6, background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                <strong>What’s Included:</strong>
                <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
                  <li>Custom modern design showcasing your dumpster sizes (10, 20, 30, 40 yd)</li>
                  <li>Local SEO pages targeting your primary service cities and ZIP codes</li>
                  <li>Directly connected to your RollOS dispatch calendar and Stripe account</li>
                  <li>Fast turnaround (typically live in 5–7 business days)</li>
                </ul>
              </div>
              <label className="field">
                Business Name
                <input defaultValue={data.organization.name} required />
              </label>
              <label className="field">
                Contact Phone
                <input defaultValue={data.organization.phone} type="tel" required />
              </label>
              <label className="field">
                Primary Cities / Areas Served
                <input placeholder="e.g. Austin, Round Rock, Cedar Park" required />
              </label>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <Button type="button" variant="ghost" onClick={() => setShowWebsiteModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Submit Request
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}
