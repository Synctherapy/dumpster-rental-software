'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Globe,
  Truck,
  Smartphone,
  Play,
  Pause,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Calendar,
  CreditCard,
  Navigation,
  Camera,
  Check,
  Clock,
  Sparkles,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { Dumpster } from '@/components/brand';

interface StepData {
  id: number;
  title: string;
  badge: string;
  shortDesc: string;
  fullDesc: string;
}

const STEPS: StepData[] = [
  {
    id: 1,
    title: 'Homeowner Books Online',
    badge: 'Step 1 · 60 Seconds',
    shortDesc: 'Customer self-serves on your site 24/7',
    fullDesc:
      'Homeowner visits your website at 9:15 PM, selects a 20-yard dumpster, picks delivery dates, e-signs the driveway damage waiver, and pays upfront via Apple Pay or credit card. No phone tag, no lost jobs.',
  },
  {
    id: 2,
    title: 'Order Lands on Dispatch Board',
    badge: 'Step 2 · Instant Sync',
    shortDesc: 'Automated dispatch with zero manual paperwork',
    fullDesc:
      'Zero manual data entry or whiteboard scribbles. The confirmed order instantly populates your visual drag-and-drop board under "Ready to Dispatch" with drop instructions, payment cleared, and container allocation.',
  },
  {
    id: 3,
    title: 'Driver Gets 1-Tap SMS Magic Link',
    badge: 'Step 3 · Zero App Downloads',
    shortDesc: 'Instant GPS routing & photo proof capture',
    fullDesc:
      'Your driver receives an encrypted SMS link. Opens in their mobile browser with 1-tap turn-by-turn navigation in Google or Apple Maps. After setting down the can, driver snaps a driveway photo proof for liability protection.',
  },
];

const STEP_DURATION_MS = 6000;

export function WorkflowVisualizer() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Step Auto-cycle logic with smooth progress bar
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    startTimeRef.current = Date.now();
    setProgress(0);

    const interval = 50; // update progress every 50ms
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const nextProgress = Math.min((elapsed / STEP_DURATION_MS) * 100, 100);
      setProgress(nextProgress);

      if (elapsed >= STEP_DURATION_MS) {
        setActiveStep((prev) => (prev >= 3 ? 1 : prev + 1));
        startTimeRef.current = Date.now();
        setProgress(0);
      }
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, activeStep]);

  const handleStepClick = (stepId: number) => {
    setActiveStep(stepId);
    setProgress(0);
    startTimeRef.current = Date.now();
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      className="workflow-visualizer-container"
      style={{
        maxWidth: 1040,
        margin: '0 auto',
        padding: '24px 16px',
        fontFamily: 'inherit',
      }}
    >
      {/* Section Eyebrow & Title */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#eef4ea',
            color: '#1f2d26',
            padding: '5px 14px',
            borderRadius: 999,
            fontSize: 12.5,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 10,
            border: '1px solid #dde4d4',
          }}
        >
          <Sparkles size={14} color="#ea580c" />
          Interactive 3-Step Live Tour
        </div>
        <h2
          style={{
            fontSize: 'clamp(24px, 3.5vw, 34px)',
            fontWeight: 800,
            color: '#1f2d26',
            lineHeight: 1.25,
            letterSpacing: '-0.02em',
          }}
        >
          From Online Booking to Driver Dropoff <span style={{ color: '#ea580c' }}>in 3 Steps</span>
        </h2>
        <p
          style={{
            fontSize: 15,
            color: '#556658',
            maxWidth: 620,
            margin: '8px auto 0',
            lineHeight: 1.6,
          }}
        >
          Watch how RollOS automates your entire dumpster rental operation without phone tag,
          dry-erase boards, or driver App Store downloads.
        </p>
      </div>

      {/* Top Step Selector Tabs with Auto-Play & Progress Bars */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 12,
          marginBottom: 20,
        }}
      >
        {STEPS.map((step) => {
          const isActive = activeStep === step.id;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => handleStepClick(step.id)}
              style={{
                background: isActive ? '#ffffff' : '#f7f8fa',
                border: isActive ? '2px solid #ea580c' : '1px solid #dde4d4',
                borderRadius: 12,
                padding: '14px 16px',
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 4px 14px rgba(234, 88, 12, 0.12)' : 'none',
              }}
            >
              {/* Progress bar along the bottom of the active tab */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: 4,
                    width: `${progress}%`,
                    background: '#ea580c',
                    transition: 'width 50ms linear',
                  }}
                />
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: isActive ? '#ea580c' : '#728373',
                    background: isActive ? '#fff7ed' : '#e8ebed',
                    padding: '2px 8px',
                    borderRadius: 4,
                  }}
                >
                  {step.badge}
                </span>
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: isActive ? '#ea580c' : '#dde4d4',
                    color: isActive ? '#ffffff' : '#556658',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  {step.id}
                </span>
              </div>

              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#1f2d26',
                  marginBottom: 4,
                }}
              >
                {step.title}
              </div>
              <div style={{ fontSize: 12.5, color: '#556658', lineHeight: 1.4 }}>
                {step.shortDesc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage Box */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #dde4d4',
          borderRadius: 16,
          boxShadow: '0 8px 30px rgba(31, 45, 38, 0.06)',
          overflow: 'hidden',
        }}
      >
        {/* Stage Header Toolbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 20px',
            background: '#f4f7f2',
            borderBottom: '1px solid #dde4d4',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#628f34',
                boxShadow: '0 0 0 3px rgba(98, 143, 52, 0.25)',
                display: 'inline-block',
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1f2d26' }}>
              {STEPS[activeStep - 1].title}
            </span>
            <span style={{ fontSize: 12, color: '#728373' }}>— Live Simulation</span>
          </div>

          {/* Play/Pause & Step Switcher Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              onClick={togglePlayPause}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: '#ffffff',
                border: '1px solid #dde4d4',
                padding: '5px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                color: '#1f2d26',
              }}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              {isPlaying ? 'Pause Tour' : 'Auto Play'}
            </button>

            <button
              type="button"
              onClick={() => handleStepClick(activeStep >= 3 ? 1 : activeStep + 1)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: '#ea580c',
                border: 'none',
                color: '#ffffff',
                padding: '5px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Next Step <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Dynamic Visual Content Area */}
        <div style={{ padding: '24px 20px 28px' }}>
          {/* Step 1: Online Booking Mockup */}
          {activeStep === 1 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 24,
                alignItems: 'center',
              }}
            >
              {/* Left: Explanatory Context */}
              <div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#ea580c',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Step 1: 24/7 Self-Service
                </span>
                <h3
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: '#1f2d26',
                    margin: '6px 0 10px',
                  }}
                >
                  Homeowners Book in 60 Seconds
                </h3>
                <p style={{ fontSize: 14, color: '#556658', lineHeight: 1.6, marginBottom: 16 }}>
                  {STEPS[0].fullDesc}
                </p>

                <div style={{ display: 'grid', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#1f2d26' }}>
                    <CheckCircle2 size={16} color="#628f34" />
                    <span>Works on mobile, desktop, WordPress, Squarespace, or Wix</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#1f2d26' }}>
                    <CheckCircle2 size={16} color="#628f34" />
                    <span>Zero hauler commission · Homeowner pays $12 delivery lock fee</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#1f2d26' }}>
                    <CheckCircle2 size={16} color="#628f34" />
                    <span>Digital liability waiver signed prior to checkout</span>
                  </div>
                </div>
              </div>

              {/* Right: Mini Booking Widget Mockup */}
              <div
                style={{
                  background: '#fbfcf9',
                  border: '1px solid #dde4d4',
                  borderRadius: 14,
                  padding: '20px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                }}
              >
                {/* Widget Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: 12,
                    borderBottom: '1px solid #dde4d4',
                    marginBottom: 14,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <Globe size={16} color="#ea580c" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1f2d26' }}>
                      Greenline Dumpster Rentals · 24/7 Booking
                    </span>
                  </div>
                  <span
                    style={{
                      background: '#d6ef7c',
                      color: '#1f2d26',
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: 4,
                    }}
                  >
                    ONLINE NOW
                  </span>
                </div>

                {/* Size Choice Buttons */}
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#687864', textTransform: 'uppercase' }}>
                    1. Select Container Size
                  </label>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: 8,
                      marginTop: 6,
                    }}
                  >
                    {[
                      { yd: 10, price: '$325', active: false },
                      { yd: 20, price: '$425', active: true },
                      { yd: 30, price: '$525', active: false },
                    ].map((item) => (
                      <div
                        key={item.yd}
                        style={{
                          border: item.active ? '2px solid #ea580c' : '1px solid #dde4d4',
                          background: item.active ? '#fff7ed' : '#ffffff',
                          borderRadius: 8,
                          padding: '8px 6px',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ height: 20, width: 32, margin: '0 auto 4px', color: '#1f2d26' }}>
                          <Dumpster size={item.yd} />
                        </div>
                        <div style={{ fontSize: 12.5, fontWeight: 800, color: '#1f2d26' }}>
                          {item.yd} Yard
                        </div>
                        <div style={{ fontSize: 11, color: item.active ? '#ea580c' : '#728373', fontWeight: 700 }}>
                          {item.price}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Date & Address Inputs */}
                <div style={{ display: 'grid', gap: 10, marginBottom: 14 }}>
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid #dde4d4',
                      borderRadius: 8,
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 12.5,
                      color: '#1f2d26',
                    }}
                  >
                    <Calendar size={14} color="#628f34" />
                    <div>
                      <div style={{ fontSize: 10, color: '#728373' }}>Delivery Date Window</div>
                      <div style={{ fontWeight: 600 }}>Friday, Oct 16 · 8:00 AM - 12:00 PM</div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid #dde4d4',
                      borderRadius: 8,
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 12.5,
                      color: '#1f2d26',
                    }}
                  >
                    <MapPin size={14} color="#ea580c" />
                    <div>
                      <div style={{ fontSize: 10, color: '#728373' }}>Delivery Address</div>
                      <div style={{ fontWeight: 600 }}>482 Maple Ridge Rd, Austin TX</div>
                    </div>
                  </div>
                </div>

                {/* Instant Confirmation Badge Box */}
                <div
                  style={{
                    background: '#eef4ea',
                    border: '1px solid #c9dec2',
                    borderRadius: 8,
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <CheckCircle2 size={16} color="#2d6a36" />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#1f2d26' }}>
                      Instant Booking Confirmed
                    </span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#1f2d26' }}>
                    $437.00 Paid
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Visual Dispatch Board Mockup */}
          {activeStep === 2 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 24,
                alignItems: 'center',
              }}
            >
              {/* Left: Explanatory Context */}
              <div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#ea580c',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Step 2: Instant Operations Sync
                </span>
                <h3
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: '#1f2d26',
                    margin: '6px 0 10px',
                  }}
                >
                  Lands on Your Visual Dispatch Board
                </h3>
                <p style={{ fontSize: 14, color: '#556658', lineHeight: 1.6, marginBottom: 16 }}>
                  {STEPS[1].fullDesc}
                </p>

                <div style={{ display: 'grid', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#1f2d26' }}>
                    <CheckCircle2 size={16} color="#628f34" />
                    <span>Automatically assigned to available 20-yd container (#C-204)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#1f2d26' }}>
                    <CheckCircle2 size={16} color="#628f34" />
                    <span>Customer driveway drop instructions highlighted</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#1f2d26' }}>
                    <CheckCircle2 size={16} color="#628f34" />
                    <span>Drag and drop between drivers or reschedule in 1 click</span>
                  </div>
                </div>
              </div>

              {/* Right: Kanban Column Mockup */}
              <div
                style={{
                  background: '#192322',
                  borderRadius: 14,
                  padding: '18px',
                  color: '#ffffff',
                  boxShadow: '0 8px 24px rgba(25, 35, 34, 0.4)',
                }}
              >
                {/* Kanban Top Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: 12,
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    marginBottom: 14,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Truck size={16} color="#d6ef7c" />
                    <span style={{ fontSize: 13, fontWeight: 700 }}>
                      RollOS Dispatch Board · Today
                    </span>
                  </div>
                  <span
                    style={{
                      background: '#ea580c',
                      color: '#ffffff',
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: 4,
                    }}
                  >
                    AUTO-DISPATCHED
                  </span>
                </div>

                {/* Column: Ready to Dispatch */}
                <div style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#c4d7c0',
                      marginBottom: 8,
                    }}
                  >
                    <span>READY TO DISPATCH (1 NEW)</span>
                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 6px', borderRadius: 4 }}>
                      Oct 16 Morning
                    </span>
                  </div>

                  {/* Highlighted Freshly Booked Card */}
                  <div
                    style={{
                      background: '#24322e',
                      border: '2px solid #ea580c',
                      borderRadius: 10,
                      padding: '12px 14px',
                      boxShadow: '0 4px 16px rgba(234, 88, 12, 0.25)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          background: '#ea580c',
                          color: '#fff',
                          fontSize: 10,
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: 4,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 3,
                        }}
                      >
                        <Sparkles size={10} /> NEW ONLINE ORDER
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#d6ef7c' }}>
                        Can #C-204 (20 Yd)
                      </span>
                    </div>

                    <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 2 }}>
                      Sarah Jenkins · 482 Maple Ridge Rd
                    </div>
                    <div style={{ fontSize: 11.5, color: '#99ac91', marginBottom: 8 }}>
                      Placement: Left side of driveway near garage door. Avoid flower bed.
                    </div>

                    {/* Driver assignment dropdown mockup */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#1a2422',
                        padding: '6px 10px',
                        borderRadius: 6,
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      <div style={{ fontSize: 11.5, color: '#e8ebed' }}>
                        Assigned Driver: <strong style={{ color: '#d6ef7c' }}>Dave M. (Truck #1)</strong>
                      </div>
                      <span style={{ fontSize: 10, color: '#82898c' }}>Change ▾</span>
                    </div>
                  </div>
                </div>

                {/* Sub status row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 11,
                    color: '#82956d',
                    paddingTop: 8,
                  }}
                >
                  <Check size={13} color="#d6ef7c" />
                  <span>Stripe $425 deposited · Liability waiver e-signed & attached</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Driver SMS Magic Link Mockup */}
          {activeStep === 3 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 24,
                alignItems: 'center',
              }}
            >
              {/* Left: Explanatory Context */}
              <div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#ea580c',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Step 3: Zero App Store Headaches
                </span>
                <h3
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: '#1f2d26',
                    margin: '6px 0 10px',
                  }}
                >
                  Driver Receives 1-Tap SMS Magic Link
                </h3>
                <p style={{ fontSize: 14, color: '#556658', lineHeight: 1.6, marginBottom: 16 }}>
                  {STEPS[2].fullDesc}
                </p>

                <div style={{ display: 'grid', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#1f2d26' }}>
                    <CheckCircle2 size={16} color="#628f34" />
                    <span>Works on any smartphone (iPhone or Android) without downloading apps</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#1f2d26' }}>
                    <CheckCircle2 size={16} color="#628f34" />
                    <span>1-tap launches turn-by-turn navigation in Apple or Google Maps</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#1f2d26' }}>
                    <CheckCircle2 size={16} color="#628f34" />
                    <span>Driver snaps driveway drop photo proof to prevent damage disputes</span>
                  </div>
                </div>
              </div>

              {/* Right: Mobile Phone Frame Mockup */}
              <div
                style={{
                  maxWidth: 320,
                  margin: '0 auto',
                  background: '#0d1312',
                  borderRadius: 30,
                  padding: '12px 10px 18px',
                  border: '4px solid #33443b',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
                }}
              >
                {/* Phone Speaker Notch & Status */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 10px 8px',
                    fontSize: 10.5,
                    color: '#99ac91',
                  }}
                >
                  <span>9:18 PM</span>
                  <div
                    style={{
                      width: 50,
                      height: 4,
                      background: '#23322b',
                      borderRadius: 99,
                    }}
                  />
                  <span>5G 100%</span>
                </div>

                {/* SMS Incoming Bubble */}
                <div
                  style={{
                    background: '#192322',
                    borderRadius: 14,
                    padding: '10px 12px',
                    marginBottom: 10,
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div style={{ fontSize: 10, color: '#ea580c', fontWeight: 800, marginBottom: 2 }}>
                    MESSAGES · ROLLOS DISPATCH
                  </div>
                  <div style={{ fontSize: 11.5, color: '#ffffff', lineHeight: 1.4 }}>
                    New drop-off assigned for tomorrow 9 AM: <strong>482 Maple Ridge Rd</strong> (20 Yd #C-204).
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: '#d6ef7c',
                      marginTop: 4,
                      textDecoration: 'underline',
                    }}
                  >
                    rollos.app/driver/9x4k →
                  </div>
                </div>

                {/* Magic Link Driver Web Screen View */}
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: 14,
                    padding: '12px',
                    color: '#1f2d26',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#ea580c' }}>
                      JOB #1 OF 4 · DROP-OFF
                    </span>
                    <span style={{ fontSize: 10, color: '#687864' }}>Can #C-204</span>
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 2 }}>
                    482 Maple Ridge Rd
                  </div>
                  <div style={{ fontSize: 11, color: '#556658', marginBottom: 8 }}>
                    Note: &quot;Left driveway near garage door&quot;
                  </div>

                  {/* 1-Tap Navigation Button */}
                  <div
                    style={{
                      background: '#1f2d26',
                      color: '#ffffff',
                      borderRadius: 8,
                      padding: '8px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      fontSize: 11.5,
                      fontWeight: 700,
                      marginBottom: 8,
                    }}
                  >
                    <Navigation size={13} color="#d6ef7c" />
                    <span>1-Tap Maps Navigation</span>
                  </div>

                  {/* Driveway Drop Photo Proof Box */}
                  <div
                    style={{
                      background: '#eef4ea',
                      border: '1px dashed #628f34',
                      borderRadius: 8,
                      padding: '8px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        background: '#628f34',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Camera size={14} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#1f2d26' }}>
                        Drop Photo Proof Attached
                      </div>
                      <div style={{ fontSize: 9.5, color: '#556658' }}>
                        GPS Verified · Oct 16 9:24 AM
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Banner with Quick CTA */}
        <div
          style={{
            borderTop: '1px solid #dde4d4',
            padding: '14px 20px',
            background: '#fcfdfb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#556658' }}>
            <span style={{ fontWeight: 700, color: '#1f2d26' }}>Ready to eliminate phone tag?</span>
            <span>Takes under 3 minutes to activate on your website.</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link
              href="/book/greenline"
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                color: '#1f2d26',
                padding: '7px 12px',
                borderRadius: 6,
                border: '1px solid #dde4d4',
                background: '#ffffff',
              }}
            >
              Test Live Customer Demo
            </Link>
            <Link
              href="/signup"
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                color: '#ffffff',
                background: '#ea580c',
                padding: '7px 14px',
                borderRadius: 6,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              Start Free ($0/mo) <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
