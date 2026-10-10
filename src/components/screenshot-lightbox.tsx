'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { LayoutGrid, Calendar, Receipt, Warehouse, Smartphone, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

export interface ScreenshotItem {
  id: string;
  title: string;
  badge: string;
  subtitle: string;
  src: string;
  alt: string;
  iconName: 'grid' | 'calendar' | 'receipt' | 'warehouse' | 'phone';
  description: string;
  isWide?: boolean;
}

const screenshots: ScreenshotItem[] = [
  {
    id: 'dispatch-board',
    title: 'Visual Drag-and-Drop Dispatch Board',
    badge: 'Real-Time Dispatch',
    subtitle: 'Assign trucks, schedule drops, and track active rentals with intuitive color-coded status columns.',
    src: '/images/screenshots/roll-off-dumpster-dispatch-board-software.png',
    alt: 'Dumpster rental dispatch board software showing drag-and-drop schedule columns for Booked, Delivered, and Completed roll off jobs',
    iconName: 'grid',
    description: 'Keep your entire roll off operation organized on one visual board. Drag bins from Booked to Delivered to Picked Up. Dispatch drivers in seconds, see bin rental duration, and filter by container size or driver assignment without messy paper whiteboards.',
  },
  {
    id: 'booking-engine',
    title: 'High-Converting Online Customer Booking Widget',
    badge: 'Self-Serve Checkout',
    subtitle: 'Let homeowners and contractors reserve containers 24/7 with real-time ZIP validation and Stripe checkout.',
    src: '/images/screenshots/dumpster-rental-online-booking-system.png',
    alt: 'Online dumpster booking system checkout widget showing 10 to 40 yard roll off dumpster sizes, delivery dates, and transparent pricing',
    iconName: 'calendar',
    description: 'Stop playing phone tag while driving your roll off truck. Homeowners select their dumpster size (10, 15, 20, 30, 40 yard), choose their delivery date, enter drop-off placement notes, and pay securely online. On the free plan, the customer pays a $12 reservation fee at checkout. Paid plans can turn that fee off.',
  },
  {
    id: 'invoice-scale-tickets',
    title: 'Invoicing From Measured Tonnage',
    badge: 'Zero-Leakage Invoicing',
    subtitle: 'Record the scale weight, then bill included tons, extra days, and the overage from the rate agreed at booking.',
    src: '/images/screenshots/roll-off-container-delivery-pickup-calendar.png',
    alt: 'Dumpster rental invoice and tonnage overage billing system showing automatic scale weight overage calculations and receipts',
    iconName: 'receipt',
    description: 'Enter the weight from the landfill scale ticket. RollOS calculates tons over the included allowance and adds that overage to the invoice using the rate locked at booking. Weight entry is manual. There is no scale-ticket OCR.',
  },
  {
    id: 'fleet-inventory',
    title: 'Live Container Yard & Serialized Inventory Tracking',
    badge: 'Total Fleet Visibility',
    subtitle: 'Know exactly which bins are in your yard, sitting on customer driveways, or marked for welding maintenance.',
    src: '/images/screenshots/dumpster-fleet-inventory-management-software.png',
    alt: 'Dumpster fleet inventory management software dashboard showing container serials, locations, and yard availability',
    iconName: 'warehouse',
    description: 'Gain total control over your roll off fleet. Track every container by serial number and size, and see whether it is in the yard or assigned to a job. This is recorded inventory, not live GPS.',
  },
  {
    id: 'driver-mobile-sms',
    title: 'Driver SMS Route Link & Delivery Proof (Zero App Install)',
    badge: 'Instant Mobile Link',
    subtitle: 'Send an expiring SMS link straight to your driver’s phone for turn-by-turn navigation, drop photos, and ticket uploads.',
    src: '/images/screenshots/mobile-driver-sms-delivery-proof-app.png',
    alt: 'Mobile driver SMS delivery proof and turn-by-turn routing app interface inside roll off dumpster software',
    iconName: 'phone',
    description: 'Zero driver app downloads, zero forgotten passwords. Drivers simply tap a secure SMS magic link on their phone. The link opens turn-by-turn maps, lets the driver upload a delivery photo, and lets staff record the scale weight after pickup.',
    isWide: true,
  },
];

export function ScreenshotLightbox() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (activeIdx === null) return;
      if (e.key === 'Escape') setActiveIdx(null);
      if (e.key === 'ArrowRight') setActiveIdx((prev) => (prev !== null ? (prev + 1) % screenshots.length : null));
      if (e.key === 'ArrowLeft') setActiveIdx((prev) => (prev !== null ? (prev - 1 + screenshots.length) % screenshots.length : null));
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIdx]);

  const activeItem = activeIdx !== null ? screenshots[activeIdx] : null;

  const renderIcon = (name: ScreenshotItem['iconName']) => {
    switch (name) {
      case 'grid':
        return <LayoutGrid size={18} className="text-[#ea580c]" />;
      case 'calendar':
        return <Calendar size={18} className="text-[#ea580c]" />;
      case 'receipt':
        return <Receipt size={18} className="text-[#ea580c]" />;
      case 'warehouse':
        return <Warehouse size={18} className="text-[#ea580c]" />;
      case 'phone':
        return <Smartphone size={18} className="text-[#ea580c]" />;
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
        {screenshots.map((s, idx) => (
          <div
            key={s.id}
            onClick={() => setActiveIdx(idx)}
            className={`panel p-5 bg-white border border-[#dde4d4] rounded-xl shadow-sm hover:border-[#ea580c] hover:shadow-md transition-all cursor-pointer group ${
              s.isWide ? 'md:col-span-2' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-[#1f2d26] flex items-center gap-2 group-hover:text-[#ea580c] transition-colors">
                {renderIcon(s.iconName)}
                {s.title}
              </h3>
              <span className="pill text-xs font-semibold bg-[#eef3e6] text-[#4f6b3b]">
                {s.badge}
              </span>
            </div>
            <p className="text-xs text-[#687864] mb-4">{s.subtitle}</p>
            <div className="relative rounded-lg overflow-hidden border border-[#e5ebd9] bg-[#f8faf6]">
              <Image
                src={s.src}
                alt={s.alt}
                width={1440}
                height={900}
                className="w-full h-auto object-cover rounded-lg group-hover:scale-[1.01] transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-xs font-bold text-[#1f2d26] shadow-lg">
                  <ZoomIn size={14} className="text-[#ea580c]" /> Click to Inspect Full Resolution
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeItem && activeIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveIdx(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#1e2621] border border-[#3b4c3e] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d3a31] bg-[#161c18]">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#ea580c] text-white">
                  {activeItem.badge}
                </span>
                <h3 className="text-base md:text-lg font-bold text-white">
                  {activeItem.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#9bb0a0] mr-2">
                  {activeIdx + 1} of {screenshots.length}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveIdx(null)}
                  className="p-1.5 rounded-lg text-[#9bb0a0] hover:text-white hover:bg-[#2d3a31] transition-colors"
                  aria-label="Close dialog"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Image Preview Container */}
            <div className="relative p-4 md:p-6 bg-[#0f1411] flex items-center justify-center max-h-[70vh] overflow-auto">
              <Image
                src={activeItem.src}
                alt={activeItem.alt}
                width={1600}
                height={1000}
                className="max-h-[65vh] w-auto h-auto object-contain rounded-lg shadow-2xl border border-[#2d3a31]"
                priority
              />

              {/* Prev / Next buttons */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((activeIdx - 1 + screenshots.length) % screenshots.length);
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-[#ea580c] text-white transition-colors shadow-lg"
                aria-label="Previous screenshot"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((activeIdx + 1) % screenshots.length);
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-[#ea580c] text-white transition-colors shadow-lg"
                aria-label="Next screenshot"
              >
                <ChevronRight size={22} />
              </button>
            </div>

            {/* Footer with Description */}
            <div className="px-6 py-4 bg-[#161c18] border-t border-[#2d3a31] text-sm text-[#cbd5cc] leading-relaxed">
              <p>{activeItem.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
