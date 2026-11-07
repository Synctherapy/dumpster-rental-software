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
  CheckCircle2,
  Building2,
  Truck,
  MapPin,
  ShieldCheck,
  PhoneCall,
  MessageSquare,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { Button } from './ui/button';
import { Modal } from './ui/dialog';
import type { Workspace } from '@/lib/types';
import { api } from '@/lib/client';
import { generateQrMatrix } from '@/lib/qr';

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
  const [showGbpModal, setShowGbpModal] = useState(false);
  const [gbpRequested, setGbpRequested] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [contractorName, setContractorName] = useState('');
  const [copiedContractorLink, setCopiedContractorLink] = useState(false);
  const [contractorLink, setContractorLink] = useState('');
  const [mintingContractorLink, setMintingContractorLink] = useState(false);
  const [socialTab, setSocialTab] = useState<'facebook' | 'instagram' | 'google' | 'sms'>('facebook');
  const [copiedSocial, setCopiedSocial] = useState<string | null>(null);
  const [decalFormat, setDecalFormat] = useState<'decal' | 'magnet' | 'lawn'>('decal');
  const [copiedDecalSpec, setCopiedDecalSpec] = useState(false);

  const baseOrigin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://rolloffdumpstersoftware.com';

  const bookingUrl = `${baseOrigin}/book/${data.organization.slug}`;

  const qrPromoUrl = `${bookingUrl}?promo=NEIGHBOR15`;

  const qrMatrix = generateQrMatrix(qrPromoUrl);

  const decalOrderSpecs = `Order Spec: 12x18 inch Weatherproof Die-Cut Rectangle Decal. Material: 3M IJ180cV3 Controltac Vinyl with 3M 8518 Gloss UV Overlaminate (Outdoor Heavy Equipment / Pressure-Washer Safe). Target URL: ${bookingUrl}?promo=NEIGHBOR15`;

  const copyDecalOrderSpecs = async () => {
    try {
      await navigator.clipboard.writeText(decalOrderSpecs);
      setCopiedDecalSpec(true);
      notify('Print-shop order specs copied to clipboard!');
      setTimeout(() => setCopiedDecalSpec(false), 3000);
    } catch {
      notify('Failed to copy specs. Please copy manually.', true);
    }
  };

  const downloadDecalSvg = () => {
    const escapeXml = (str: string) =>
      str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const orgName = escapeXml(data.organization.name || 'Roll-Off Dumpster Rentals');
    const orgPhone = escapeXml(data.organization.phone || '24/7 Online Dispatch');
    const targetUrlEscaped = escapeXml(qrPromoUrl);
    const rects = qrMatrix.cells
      .map((cell) => `<rect x="${cell.x}" y="${cell.y}" width="1" height="1" fill="#0f172a" />`)
      .join('\n      ');

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1800" width="1200" height="1800">
  <!-- Bleed & Crop Marks -->
  <rect x="0" y="0" width="1200" height="1800" fill="#0f291a" />
  <g stroke="#ffffff" stroke-width="2" opacity="0.6">
    <line x1="20" y1="40" x2="60" y2="40" />
    <line x1="40" y1="20" x2="40" y2="60" />
    <line x1="1140" y1="40" x2="1180" y2="40" />
    <line x1="1160" y1="20" x2="1160" y2="60" />
    <line x1="20" y1="1760" x2="60" y2="1760" />
    <line x1="40" y1="1740" x2="40" y2="1780" />
    <line x1="1140" y1="1760" x2="1180" y2="1760" />
    <line x1="1160" y1="1740" x2="1160" y2="1780" />
  </g>
  <!-- Main Print Safe Area -->
  <rect x="50" y="50" width="1100" height="1700" rx="36" fill="#166534" stroke="#facc15" stroke-width="10" />
  <!-- Safety Yellow Promo Badge -->
  <rect x="140" y="120" width="920" height="84" rx="42" fill="#facc15" />
  <text x="600" y="175" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="900" fill="#0f172a">
    NEIGHBOR SCAN PERK: PRIORITY LOCAL DROP-OFF
  </text>
  <!-- Headline & Subhead -->
  <text x="600" y="300" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="56" font-weight="900" fill="#ffffff">
    NEED A DUMPSTER FOR
  </text>
  <text x="600" y="370" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="56" font-weight="900" fill="#ffffff">
    YOUR PROJECT?
  </text>
  <text x="600" y="445" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700" fill="#fef08a">
    SCAN TO CHECK LIVE PRICING &amp; BOOK IN 60 SECONDS
  </text>
  <!-- QR Code Container (ISO/IEC 18004 Scannable Matrix with Quiet Zone) -->
  <rect x="360" y="510" width="480" height="480" rx="28" fill="#ffffff" stroke="#facc15" stroke-width="8" />
  <svg x="380" y="530" width="440" height="440" viewBox="-3 -3 ${qrMatrix.size + 6} ${qrMatrix.size + 6}" shape-rendering="crispEdges">
    <rect x="-3" y="-3" width="${qrMatrix.size + 6}" height="${qrMatrix.size + 6}" fill="#ffffff" />
    <g>
      ${rects}
    </g>
  </svg>
  <!-- Human-Readable URL -->
  <text x="600" y="1045" text-anchor="middle" font-family="Courier New, monospace" font-size="24" font-weight="700" fill="#ffffff">
    ${targetUrlEscaped}
  </text>
  <!-- Company Name & Phone -->
  <rect x="120" y="1120" width="960" height="240" rx="24" fill="#14532d" stroke="#86efac" stroke-width="3" />
  <text x="600" y="1215" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="48" font-weight="900" fill="#ffffff">
    ${orgName}
  </text>
  <text x="600" y="1300" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="800" fill="#facc15">
    ${orgPhone}
  </text>
  <!-- Customer-Facing Value Footer -->
  <text x="600" y="1465" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#fef08a">
    10 • 15 • 20 • 30 • 40 YARD ROLL-OFF CONTAINERS
  </text>
  <text x="600" y="1520" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="#dcfce7">
    SAME-DAY &amp; NEXT-DAY DRIVEWAY DELIVERY • UPFRONT PRICING
  </text>
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.organization.slug}-weatherproof-decal.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    notify('Print-shop ready vector artwork (.SVG) downloaded!');
  };

  const facebookCopy = `Need a dumpster for a home cleanout, renovation, or job site? 🚛\n\nWe now have 24/7 instant online booking! Check available delivery dates, transparent pricing, and reserve your container in 60 seconds:\n\n👉 ${bookingUrl}\n\nFast delivery, reliable pickup, zero hidden fees!`;

  const instagramCopy = `📍 Roll-off Dumpster Rentals in ${data.organization.name || 'Your Area'}\n⚡ Instant 24/7 Online Booking\n👇 Reserve Your Container in 60s:\n${bookingUrl}`;

  const smsCopy = `Hey! We now have online booking for our roll-off dumpsters. Next time you need a bin dropped off on a job or driveway, you can check availability and lock it in directly here: ${bookingUrl}`;

  const copySocialText = async (text: string, type: string, msg: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSocial(type);
      notify(msg);
      setTimeout(() => setCopiedSocial(null), 3000);
    } catch {
      notify('Failed to copy. Please copy manually.', true);
    }
  };

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

  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const mintContractorLink = async () => {
    const account = contractorName.trim() || 'Premier Roofing';
    setMintingContractorLink(true);
    try {
      const res = await api<{ url: string }>('/api/contractor-link', {
        method: 'POST',
        body: JSON.stringify({ account_name: account }),
      });
      const full = `${origin}${res.url}`;
      setContractorLink(full);
      try {
        await navigator.clipboard.writeText(full);
        setCopiedContractorLink(true);
        setTimeout(() => setCopiedContractorLink(false), 3000);
        notify(`VIP portal link for ${account} created and copied to clipboard.`);
      } catch {
        notify(`VIP portal link for ${account} created. Copy it from the field above.`);
      }
      return full;
    } catch (err) {
      notify((err as Error).message || 'Could not create the VIP portal link.', true);
      return '';
    } finally {
      setMintingContractorLink(false);
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

      {/* Social Media & Client Launchpad */}
      <section
        className="panel"
        style={{
          padding: '24px',
          background: '#ffffff',
          border: '1px solid #dce4d6',
          borderRadius: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: '#dcfce7', color: '#166534', padding: '6px', borderRadius: '6px', display: 'grid' }}>
                <Rocket size={18} />
              </span>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                First-Client Social & Web Launchpad
              </h3>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>
              Copy pre-tested marketing copy and drop your booking link directly onto Facebook, Instagram, Google, or SMS.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Button onClick={copyBookingLink} variant="ghost" style={{ fontSize: '12px' }}>
              {copiedLink ? <Check size={13} style={{ color: '#16a34a' }} /> : <Copy size={13} />}
              {copiedLink ? 'Link Copied' : 'Copy Booking Link'}
            </Button>
            <Button asChild variant="primary" style={{ fontSize: '12px', background: '#166534', color: '#fff' }}>
              <Link href={`/book/${data.organization.slug}`} target="_blank">
                <ArrowUpRight size={13} /> Test Booking Page
              </Link>
            </Button>
          </div>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '14px', overflowX: 'auto' }}>
          {[
            { id: 'facebook', label: 'Facebook Post Template' },
            { id: 'instagram', label: 'Instagram Bio Template' },
            { id: 'google', label: 'Google Business Profile' },
            { id: 'sms', label: 'Contractor Text Message' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSocialTab(tab.id as typeof socialTab)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: socialTab === tab.id ? '#f1f5f9' : 'transparent',
                color: socialTab === tab.id ? '#0f172a' : '#64748b',
                fontWeight: socialTab === tab.id ? 700 : 500,
                fontSize: '12px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {socialTab === 'facebook' && (
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', color: '#334155', whiteSpace: 'pre-wrap', lineHeight: 1.5, marginBottom: '12px' }}>
              {facebookCopy}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                onClick={() => copySocialText(facebookCopy, 'fb', 'Facebook post template copied!')}
                style={{ fontSize: '12px', background: '#1877f2', color: '#fff' }}
              >
                {copiedSocial === 'fb' ? <Check size={13} /> : <Copy size={13} />} Copy Facebook Post
              </Button>
              <Button asChild variant="ghost" style={{ fontSize: '12px' }}>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                  Open Facebook <ArrowUpRight size={12} />
                </a>
              </Button>
            </div>
          </div>
        )}

        {socialTab === 'instagram' && (
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', color: '#334155', whiteSpace: 'pre-wrap', lineHeight: 1.5, marginBottom: '12px' }}>
              {instagramCopy}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                onClick={() => copySocialText(instagramCopy, 'ig', 'Instagram bio template copied!')}
                style={{ fontSize: '12px', background: '#e1306c', color: '#fff' }}
              >
                {copiedSocial === 'ig' ? <Check size={13} /> : <Copy size={13} />} Copy Bio Text & Link
              </Button>
              <Button asChild variant="ghost" style={{ fontSize: '12px' }}>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                  Open Instagram <ArrowUpRight size={12} />
                </a>
              </Button>
            </div>
          </div>
        )}

        {socialTab === 'google' && (
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: '12px', color: '#334155', margin: '0 0 10px 0', lineHeight: 1.6 }}>
              Add your booking URL under <b>Online Appointments</b> or as your primary <b>Website</b> on your Google Business Profile. When homeowners find your business on Google Search and Maps, they can instantly book without calling.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                onClick={() => copySocialText(bookingUrl, 'gbp', 'Booking link copied for Google Business!')}
                style={{ fontSize: '12px', background: '#166534', color: '#fff' }}
              >
                {copiedSocial === 'gbp' ? <Check size={13} /> : <Copy size={13} />} Copy Link for Google
              </Button>
              <Button asChild variant="ghost" style={{ fontSize: '12px' }}>
                <a href="https://business.google.com" target="_blank" rel="noopener noreferrer">
                  Open Google Business Profile <ArrowUpRight size={12} />
                </a>
              </Button>
            </div>
          </div>
        )}

        {socialTab === 'sms' && (
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', color: '#334155', whiteSpace: 'pre-wrap', lineHeight: 1.5, marginBottom: '12px' }}>
              {smsCopy}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                onClick={() => copySocialText(smsCopy, 'sms', 'SMS template copied!')}
                style={{ fontSize: '12px', background: '#166534', color: '#fff' }}
              >
                {copiedSocial === 'sms' ? <Check size={13} /> : <Copy size={13} />} Copy SMS Template
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Weatherproof 3M Vinyl Dumpster Decals & Magnetic Truck Signs (Print-Shop Ready Kit) */}
      <section
        className="panel"
        style={{
          padding: '28px',
          background: '#ffffff',
          border: '2px solid #166534',
          borderRadius: '14px',
          boxShadow: '0 6px 24px rgba(22, 101, 52, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ background: '#dcfce7', color: '#166534', padding: '8px', borderRadius: '8px', display: 'grid' }}>
              <Truck size={20} />
            </span>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
                Weatherproof 3M Vinyl Dumpster Decals &amp; Magnetic Truck Signs (Print-Shop Ready Kit)
              </h3>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Turn every steel container on a driveway into a 24/7 neighborhood booking billboard.
              </span>
            </div>
          </div>
          <span
            style={{
              background: '#fef9c3',
              color: '#854d0e',
              border: '1px solid #fde047',
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 800,
            }}
          >
            3M IJ180 UV-Laminated Vinyl Spec
          </span>
        </div>

        {/* 1. Pro Hauler Field Advisory Callout */}
        <div
          style={{
            background: '#fffbeb',
            border: '1px solid #fcd34d',
            borderRadius: '10px',
            padding: '14px 16px',
            marginBottom: '18px',
            fontSize: '12.5px',
            color: '#78350f',
            lineHeight: 1.6,
            fontWeight: 500,
          }}
        >
          ⚠️ Never tape home-printed paper to a steel container—rain, mud, and gravel ruin paper in 24 hours and make your fleet look amateur. Instead, download the print-ready vector artwork below and order weatherproof 3M UV-laminated vinyl decals or heavy-duty truck magnets from StickerMule, Signs.com, VistaPrint, or your local truck wrap shop (~$12 each, pressure-washer proof for 5+ years).
        </div>

        {/* 2. Format Selector Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {[
            { id: 'decal' as const, label: 'Steel Container Side Decal (12" × 18" 3M Vinyl)' },
            { id: 'magnet' as const, label: 'Truck Door Magnet (12" × 24" Heavy Gauge)' },
            { id: 'lawn' as const, label: 'Coroplast Lawn Sign (18" × 24" Yard Stake)' },
          ].map((tab) => {
            const active = decalFormat === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setDecalFormat(tab.id)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: active ? '2px solid #166534' : '1px solid #cbd5e1',
                  background: active ? '#dcfce7' : '#f8fafc',
                  color: active ? '#166534' : '#334155',
                  fontWeight: active ? 700 : 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 3. Live Visual Decal Preview Card + 4. Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'start' }}>
          {/* Live Visual Decal Preview Card */}
          <div
            style={{
              background: '#166534',
              border: '4px solid #facc15',
              borderRadius: '16px',
              padding: '22px 20px',
              color: '#ffffff',
              textAlign: 'center',
              boxShadow: '0 12px 28px rgba(15, 23, 42, 0.18)',
              position: 'relative',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                background: '#facc15',
                color: '#0f172a',
                fontWeight: 900,
                fontSize: '11px',
                padding: '5px 12px',
                borderRadius: '999px',
                letterSpacing: '0.04em',
                marginBottom: '12px',
              }}
            >
              NEIGHBOR SCAN PERK: PRIORITY LOCAL DROP-OFF
            </div>

            <div style={{ fontSize: '20px', fontWeight: 900, lineHeight: 1.2, color: '#ffffff', letterSpacing: '0.01em' }}>
              NEED A DUMPSTER FOR YOUR PROJECT?
            </div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#fef08a', marginTop: '6px', marginBottom: '16px', letterSpacing: '0.03em' }}>
              SCAN TO CHECK LIVE PRICING &amp; BOOK IN 60 SECONDS
            </div>

            {/* ISO/IEC 18004 Scannable SVG QR Code Matrix */}
            <div
              style={{
                background: '#ffffff',
                border: '3px solid #facc15',
                borderRadius: '12px',
                padding: '10px',
                width: '188px',
                height: '188px',
                margin: '0 auto 10px auto',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <svg
                viewBox={`-3 -3 ${qrMatrix.size + 6} ${qrMatrix.size + 6}`}
                width="162"
                height="162"
                shapeRendering="crispEdges"
                role="img"
                aria-label={`QR code for ${qrPromoUrl}`}
                style={{ display: 'block' }}
              >
                <rect
                  x={-3}
                  y={-3}
                  width={qrMatrix.size + 6}
                  height={qrMatrix.size + 6}
                  fill="#ffffff"
                />
                {qrMatrix.cells.map((cell, idx) => (
                  <rect key={idx} x={cell.x} y={cell.y} width={1} height={1} fill="#0f172a" />
                ))}
              </svg>
            </div>

            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '10.5px',
                color: '#dcfce7',
                wordBreak: 'break-all',
                marginBottom: '14px',
                fontWeight: 600,
              }}
            >
              {qrPromoUrl}
            </div>

            <div
              style={{
                background: '#14532d',
                border: '1px solid #86efac',
                borderRadius: '10px',
                padding: '10px 12px',
              }}
            >
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>
                {data.organization.name}
              </div>
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#facc15', marginTop: '2px' }}>
                {data.organization.phone || '24/7 Instant Online Dispatch'}
              </div>
            </div>

            <div style={{ fontSize: '10.5px', color: '#fef08a', marginTop: '10px', fontWeight: 800, letterSpacing: '0.02em' }}>
              10 • 15 • 20 • 30 • 40 YARD ROLL-OFF CONTAINERS • FAST LOCAL DELIVERY
            </div>
          </div>

          {/* Action Buttons & Print-Shop Instructions */}
          <div style={{ display: 'grid', gap: '14px' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                Step 1: Download Print-Ready Vector Artwork &amp; Specs
              </h4>
              <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
                Includes bleed/crop marks, high-contrast QR matrix linked to <code>?promo=NEIGHBOR15</code>, and your company phone number.
              </p>
              <div style={{ display: 'grid', gap: '10px' }}>
                <Button
                  type="button"
                  onClick={downloadDecalSvg}
                  variant="primary"
                  style={{ width: '100%', justifyContent: 'center', background: '#166534', color: '#ffffff', fontWeight: 700, fontSize: '12.5px', padding: '10px 14px' }}
                >
                  ⬇️ Download Print-Shop Ready Vector Artwork (.SVG)
                </Button>
                <Button
                  type="button"
                  onClick={copyDecalOrderSpecs}
                  variant="ghost"
                  style={{ width: '100%', justifyContent: 'center', border: '1px solid #cbd5e1', fontWeight: 700, fontSize: '12px', padding: '9px 14px' }}
                >
                  {copiedDecalSpec ? <Check size={14} style={{ color: '#16a34a' }} /> : <Copy size={14} />}
                  📋 Copy Print-Shop Order Specs (For StickerMule / Local Wrap Shop)
                </Button>
              </div>
              <div
                style={{
                  marginTop: '10px',
                  padding: '8px 10px',
                  background: '#ffffff',
                  border: '1px dashed #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '11px',
                  color: '#334155',
                  fontFamily: 'monospace',
                  lineHeight: 1.4,
                }}
              >
                {decalOrderSpecs}
              </div>
            </div>

            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 700, color: '#166534' }}>
                Step 2: Upload &amp; Order Weatherproof Vinyl or Magnets (~$12 each)
              </h4>
              <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#15803d', lineHeight: 1.5 }}>
                Upload your downloaded <code>{data.organization.slug}-weatherproof-decal.svg</code> file directly to any commercial vinyl printer:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <Button asChild variant="ghost" style={{ fontSize: '12px', background: '#ffffff', border: '1px solid #86efac', color: '#166534', fontWeight: 700 }}>
                  <a href="https://www.stickermule.com/products/rectangle-stickers" target="_blank" rel="noopener noreferrer">
                    StickerMule <ArrowUpRight size={13} />
                  </a>
                </Button>
                <Button asChild variant="ghost" style={{ fontSize: '12px', background: '#ffffff', border: '1px solid #86efac', color: '#166534', fontWeight: 700 }}>
                  <a href="https://www.signs.com/decals/" target="_blank" rel="noopener noreferrer">
                    Signs.com <ArrowUpRight size={13} />
                  </a>
                </Button>
                <Button asChild variant="ghost" style={{ fontSize: '12px', background: '#ffffff', border: '1px solid #86efac', color: '#166534', fontWeight: 700 }}>
                  <a href="https://www.vistaprint.com/signs-posters/car-door-magnets" target="_blank" rel="noopener noreferrer">
                    VistaPrint <ArrowUpRight size={13} />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
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
            border: '2px solid #ea580c',
            background: '#fffbf7',
            position: 'relative',
          }}
        >
          <div style={{ position: 'absolute', top: -10, right: 16, background: '#ea580c', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '3px 8px', borderRadius: '12px', textTransform: 'uppercase' }}>
            Save $200
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span style={{ background: '#ffedd5', color: '#c2410c', padding: '8px', borderRadius: '8px', display: 'grid' }}>
              <Globe size={18} />
            </span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1f2d26' }}>Done-For-You 24/7 Booking Website</h3>
              </div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                <span style={{ textDecoration: 'line-through', color: '#94a3b8' }}>$499</span>{' '}
                <strong style={{ color: '#ea580c', fontSize: '12px' }}>$299 One-Time (1 Rental Pays For It)</strong>
              </span>
            </div>
          </div>
          <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6, flex: 1 }}>
            Agencies charge $3,000+ and take months. We write your sales copy, dial in your town’s service areas, and launch your 24/7 online booking checkout so customers book directly with credit cards while you sleep.
          </p>
          <div style={{ margin: '14px 0', fontSize: '11px', color: '#166534', display: 'grid', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} color="#16a34a" /> <strong>🔥 The Math:</strong> 1 single dumpster rental covers 100% of the cost
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} color="#16a34a" /> Zero tech work required from you
            </div>
          </div>
          <Button
            variant="orange"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => setShowWebsiteModal(true)}
          >
            <Sparkles size={13} />
            Claim $299 Website Offer
          </Button>
        </section>

        {/* Pillar 4: Google Business Profile (GBP) 3-Pack Optimization */}
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
              <MapPin size={18} />
            </span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Google Maps 3-Pack Domination Kit</h3>
                <span style={{ fontSize: '9px', background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                  SAVE $120
                </span>
              </div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                <span style={{ textDecoration: 'line-through', color: '#94a3b8' }}>$199</span>{' '}
                <strong style={{ color: '#166534', fontSize: '12px' }}>$79 One-Time Setup</strong>
              </span>
            </div>
          </div>
          <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6, flex: 1 }}>
            80% of dumpster calls go to the top 3 spots on Google Maps. When a roofer or homeowner searches &ldquo;dumpster rental near me&rdquo;, be the first company they call.
          </p>
          <div style={{ margin: '14px 0', fontSize: '11px', color: '#166534', display: 'grid', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} color="#16a34a" /> Dialed-in high-ticket commercial waste categories
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} color="#16a34a" /> Automated 5-star review request texts on container pickup
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} color="#16a34a" /> <strong>✓ Instant ROI:</strong> 1 customer phone call pays for this 5x over
            </div>
          </div>
          <Button
            variant="primary"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => setShowGbpModal(true)}
          >
            <Sparkles size={13} />
            Get Google 3-Pack Kit ($79)
          </Button>
        </section>
      </div>

      {/* Commercial Contractor Partner Booking Link Generator */}
      <section
        className="panel"
        style={{
          padding: '28px',
          background: '#ffffff',
          border: '1px solid #dde4d4',
          borderRadius: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '8px', borderRadius: '8px', display: 'grid' }}>
            <Building2 size={20} />
          </span>
          <div>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#1f2d26' }}>
              Contractor VIP 1-Tap Swap Portal &amp; Net-30 Link Generator
            </h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Give roofers, remodelers, and builders a dedicated VIP portal for 1-tap swaps, zero-card drops, and consolidated monthly Net-30 statements.
            </span>
          </div>
        </div>
        <p style={{ fontSize: '13px', color: '#556658', lineHeight: 1.6, maxWidth: '780px', margin: '8px 0 16px 0' }}>
          Tired of contractors texting you at 6:00 AM asking for a swap or complaining about 15 separate credit card receipts? Generate a dedicated <strong>VIP 1-Tap Swap Portal Link</strong> for each trade account. Foremen request dump-and-return swaps in 1 tap, and their bookkeeper gets one consolidated monthly Net-30 statement.
        </p>

        <div style={{ background: '#f8faf6', border: '1px solid #dde4d4', borderRadius: '10px', padding: '16px', display: 'grid', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            <label className="field" style={{ margin: 0 }}>
              Contractor / Business Name
              <input
                value={contractorName}
                onChange={(e) => {
                  setContractorName(e.target.value);
                  setContractorLink('');
                }}
                placeholder="e.g. Miller Roofing or Summit Construction"
                style={{ background: '#ffffff' }}
              />
            </label>
            <label className="field" style={{ margin: 0 }}>
              Contractor VIP 1-Tap Swap Portal Link
              <input
                readOnly
                value={contractorLink}
                placeholder="Create a secure link for this trade account →"
                style={{ background: '#ffffff', color: '#166534', fontWeight: 600, fontSize: '12px' }}
              />
            </label>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#166534' }}>
              <ShieldCheck size={16} />
              <span>
                Swaps &amp; drops bill to <strong>{contractorName.trim() || 'Trade Account'}</strong> Consolidated Net-30 Statement.
                Each link is signed, expires in 90 days, and shows only that account&apos;s jobs.
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Button
                onClick={mintContractorLink}
                variant="orange"
                disabled={mintingContractorLink}
                style={{ fontSize: '12px' }}
              >
                {mintingContractorLink ? (
                  <Loader2 size={13} className="spin" />
                ) : copiedContractorLink ? (
                  <Check size={13} />
                ) : (
                  <Copy size={13} />
                )}
                {mintingContractorLink
                  ? 'Creating secure link...'
                  : copiedContractorLink
                    ? 'VIP Link Copied!'
                    : contractorLink
                      ? 'Create a New VIP Link'
                      : 'Create & Copy VIP Portal Link'}
              </Button>
              {contractorLink ? (
                <Button asChild variant="primary" style={{ fontSize: '12px', background: '#166534', color: '#fff' }}>
                  <Link href={contractorLink} target="_blank">
                    Open VIP Contractor Portal <ArrowUpRight size={13} />
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Growth Fleet ($99/mo) Automation Engine: Missed-Call Textback & VIP Contractor Net-30 */}
      <section
        className="panel"
        style={{
          padding: '28px',
          background: 'linear-gradient(135deg, #121f17 0%, #192d22 100%)',
          color: '#f0fdf4',
          borderRadius: '16px',
          border: '1px solid #284433',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(214,239,124,0.15)', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', color: '#d6ef7c', fontWeight: 700, letterSpacing: '0.04em' }}>
            <Sparkles size={14} />
            GROWTH FLEET AUTOMATION ($99/MO)
          </div>
          <span style={{ fontSize: '12px', color: '#86efac', fontWeight: 600 }}>
            🔥 Recovers 2–3 Lost Rentals/Mo ($900–$1,500 Extra Revenue)
          </span>
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', margin: '0 0 8px 0' }}>
          Stop losing $450 rentals while driving &amp; lock in repeat roofers.
        </h2>
        <p style={{ margin: '0 0 24px 0', fontSize: '13px', color: '#cbd5e1', maxWidth: '780px', lineHeight: 1.6 }}>
          When homeowners call while you&apos;re hauling or dropping a can, <strong>75% hang up and immediately dial the next dumpster company on Google</strong>. Growth Fleet equips your operation with automated Twilio missed-call text-back and a dedicated VIP Contractor Net-30 Portal that pays for itself week one.
        </p>

        {/* 2 Column Feature Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          {/* Card 1: Missed-Call SMS Auto-Textback */}
          <div
            style={{
              background: '#1a2c21',
              border: '1px solid #2d4c38',
              borderRadius: '12px',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ background: 'rgba(234,88,12,0.2)', color: '#fb923c', padding: '8px', borderRadius: '8px', display: 'grid' }}>
                  <PhoneCall size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
                    Missed-Call SMS Auto-Textback
                  </h3>
                  <span style={{ fontSize: '11px', color: '#fb923c', fontWeight: 600 }}>
                    Powered by Twilio · Instant 5-Second Response
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 14px 0' }}>
                Driving down the highway or running landfill tickets? When a caller hangs up, RollOS instantly fires a customized text before they have time to call another hauler on Google Maps:
              </p>

              {/* SMS Mockup */}
              <div style={{ background: '#0e1812', borderRadius: '8px', padding: '12px', border: '1px solid #22382a', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>
                  <MessageSquare size={12} color="#38bdf8" /> Automated SMS (Fires in &lt;5s):
                </div>
                <div style={{ background: '#193022', padding: '10px 12px', borderRadius: '8px', color: '#d6ef7c', fontSize: '12px', lineHeight: 1.5, border: '1px solid #2d5038' }}>
                  &ldquo;Hey! Driving right now. Check live dumpster prices and reserve your bin here in 60s: <span style={{ textDecoration: 'underline' }}>{bookingUrl}</span>&rdquo;
                </div>
              </div>

              <div style={{ background: 'rgba(5,150,105,0.15)', border: '1px solid rgba(5,150,105,0.3)', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: '#86efac', lineHeight: 1.5 }}>
                <strong>💰 The Hauler Math:</strong> Saving just <strong>2–3 lost rentals a month</strong> recovers <strong>$900–$1,500</strong> in revenue that would have gone to your competitor.
              </div>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #284433', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#86efac' }}>
              <span>✓ Twilio instant integration</span>
              <span style={{ fontWeight: 700, color: '#d6ef7c' }}>Exclusive to Growth ($99)</span>
            </div>
          </div>

          {/* Card 2: VIP Contractor Net-30 Portal */}
          <div
            style={{
              background: '#1a2c21',
              border: '1px solid #2d4c38',
              borderRadius: '12px',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ background: 'rgba(59,130,246,0.2)', color: '#60a5fa', padding: '8px', borderRadius: '8px', display: 'grid' }}>
                  <Building2 size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
                    VIP Contractor Net-30 Portal
                  </h3>
                  <span style={{ fontSize: '11px', color: '#60a5fa', fontWeight: 600 }}>
                    High-Volume Commercial Lock-In
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 14px 0' }}>
                Roofers and remodelers order <strong>5–15 dumpsters every single month</strong>. Gating 1-click dumpster swap requests and Net-30 monthly invoicing to paid tiers creates permanent lock-in:
              </p>

              {/* Feature Points */}
              <div style={{ background: '#0e1812', borderRadius: '8px', padding: '12px', border: '1px solid #22382a', marginBottom: '14px', display: 'grid', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#e2e8f0' }}>
                  <CheckCircle2 size={14} color="#86efac" />
                  <span><strong>1-Click Job-Site Swaps:</strong> Foremen request swaps in 10s from phones.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#e2e8f0' }}>
                  <CheckCircle2 size={14} color="#86efac" />
                  <span><strong>Automated Net-30 Invoices:</strong> Monthly consolidated billing.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#e2e8f0' }}>
                  <CheckCircle2 size={14} color="#86efac" />
                  <span><strong>Scale Overages Included:</strong> Landfill slips attached to invoices.</span>
                </div>
              </div>

              <div style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: '#93c5fd', lineHeight: 1.5 }}>
                <strong>🔒 High Account Lock-In:</strong> Once a roofer has a seamless 1-click swap portal and Net-30 billing with you, they will never switch haulers.
              </div>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #284433', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#86efac' }}>
              <span>✓ Multi-truck route management</span>
              <span style={{ fontWeight: 700, color: '#d6ef7c' }}>Exclusive to Growth ($99)</span>
            </div>
          </div>
        </div>

        {/* Upgrade / Management Callout Banner */}
        <div
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '10px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
              Ready to recover missed calls and lock in commercial accounts?
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
              Upgrade to the Growth Fleet Plan ($99/mo) — just 1 recovered dumpster pays for 4 months.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button asChild variant="orange" style={{ fontSize: '13px', padding: '10px 18px' }}>
              <Link href="/settings">
                Upgrade to Growth Fleet ($99/mo) <ArrowRight size={14} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Website Setup Modal */}
      {showWebsiteModal && (
        <Modal
          open={showWebsiteModal}
          onOpenChange={(open) => !open && setShowWebsiteModal(false)}
          title="Turnkey Dumpster Rental Website ($299 Offer)"
          description="Have our waste industry web team design, build, and launch your company website with direct RollOS booking."
        >
          {websiteRequested ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
                <CheckCircle2 size={24} />
              </div>
              <h3 style={{ fontSize: '18px', margin: '0 0 8px 0' }}>$299 Website Setup Reserved!</h3>
              <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '380px', margin: '0 auto 20px' }}>
                We&apos;ve locked in your \$299 discounted rate for {data.organization.name}. Our web launch specialist will contact{' '}
                <strong>{data.organization.phone || 'your business phone'}</strong> within 1 business day to collect your logo and service areas.
              </p>
              <Button variant="primary" onClick={() => setShowWebsiteModal(false)}>
                Done
              </Button>
            </div>
          ) : (
            <form
              className="form-stack"
              onSubmit={async (e) => {
                e.preventDefault();
                setPurchasing(true);
                try {
                  const res = await api<{ url: string }>('/api/billing', {
                    method: 'POST',
                    body: JSON.stringify({
                      addon: 'website',
                      company: data.organization.name,
                      phone: data.organization.phone,
                      success_url: `${window.location.origin}/growth?purchased=website`,
                      cancel_url: `${window.location.origin}/growth`,
                    }),
                  });
                  if (res.url) {
                    window.location.assign(res.url);
                    return;
                  }
                  setWebsiteRequested(true);
                  notify('Website request received! We will be in touch within 24 hours.');
                } catch (err) {
                  notify((err as Error).message || 'Failed to initiate checkout', true);
                } finally {
                  setPurchasing(false);
                }
              }}
            >
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
                <Button type="button" variant="ghost" disabled={purchasing} onClick={() => setShowWebsiteModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="orange" disabled={purchasing}>
                  {purchasing ? <Loader2 className="spin" size={14} /> : null}
                  Checkout Website Setup ($299)
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}

      {/* GBP 3-Pack Setup Modal */}
      {showGbpModal && (
        <Modal
          open={showGbpModal}
          onOpenChange={(open) => !open && setShowGbpModal(false)}
          title="Done-For-You Google 3-Pack Optimization ($79)"
          description="Get your Google Business Profile optimized for top local visibility on Google Maps."
        >
          {gbpRequested ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
                <CheckCircle2 size={24} />
              </div>
              <h3 style={{ fontSize: '18px', margin: '0 0 8px 0' }}>Google 3-Pack Request Received!</h3>
              <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '380px', margin: '0 auto 20px' }}>
                We&apos;ll audit your profile and reach out to configure your local waste categories and automated review links.
              </p>
              <Button variant="primary" onClick={() => setShowGbpModal(false)}>
                Done
              </Button>
            </div>
          ) : (
            <form
              className="form-stack"
              onSubmit={async (e) => {
                e.preventDefault();
                setPurchasing(true);
                try {
                  const res = await api<{ url: string }>('/api/billing', {
                    method: 'POST',
                    body: JSON.stringify({
                      addon: 'gbp',
                      company: data.organization.name,
                      phone: data.organization.phone,
                      success_url: `${window.location.origin}/growth?purchased=gbp`,
                      cancel_url: `${window.location.origin}/growth`,
                    }),
                  });
                  if (res.url) {
                    window.location.assign(res.url);
                    return;
                  }
                  setGbpRequested(true);
                  notify('Google 3-Pack optimization request submitted!');
                } catch (err) {
                  notify((err as Error).message || 'Failed to initiate checkout', true);
                } finally {
                  setPurchasing(false);
                }
              }}
            >
              <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6, background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                <strong>What You Get:</strong>
                <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
                  <li>Google Maps audit & optimal category configuration</li>
                  <li>Local service ZIP code radius setup</li>
                  <li>Automated post-delivery SMS review link connection</li>
                </ul>
              </div>
              <label className="field">
                Business Name on Google
                <input defaultValue={data.organization.name} required />
              </label>
              <label className="field">
                Google Business Profile Link or Address
                <input placeholder="e.g. google.com/maps/... or 123 Main St" required />
              </label>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <Button type="button" variant="ghost" disabled={purchasing} onClick={() => setShowGbpModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={purchasing}>
                  {purchasing ? <Loader2 className="spin" size={14} /> : null}
                  Checkout Google 3-Pack ($79)
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}
