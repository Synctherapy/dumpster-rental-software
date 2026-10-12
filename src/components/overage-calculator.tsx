'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calculator, Sparkles } from 'lucide-react';
import { money } from '@/lib/types';
export function OverageCalculator() {
  const [included, setIncluded] = useState(2);
  const [actual, setActual] = useState(3.2);
  const [rate, setRate] = useState(85);
  const overage = Math.max(0, actual - included);
  return (
    <main className="booking-page">
      <div className="confirmation" style={{ textAlign: 'left' }}>
        <Calculator color="#819e5c" size={30} />
        <div className="eyebrow" style={{ color: '#8b9e71', marginTop: 18 }}>
          KNOW WHAT’S GOING ON YOUR INVOICE
        </div>
        <h1 style={{ marginTop: 14 }}>Dumpster tonnage calculator</h1>
        <p style={{ marginBottom: 25 }}>
          Estimate disposal overage from your included allowance and measured weight. Use the rates
          in your rental agreement.
        </p>
        <div className="form-stack">
          <label className="field">
            Included tons
            <input
              type="number"
              min="0"
              step="0.1"
              value={included}
              onChange={(e) => setIncluded(Math.max(0, Number(e.target.value)))}
            />
          </label>
          <label className="field">
            Actual tons
            <input
              type="number"
              min="0"
              step="0.1"
              value={actual}
              onChange={(e) => setActual(Math.max(0, Number(e.target.value)))}
            />
          </label>
          <label className="field">
            Overage rate per ton ($)
            <input
              type="number"
              min="0"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
            />
          </label>
        </div>
        <div className="confirmation-details" role="status">
          <div className="summary-line">
            <span>Tons over your allowance</span>
            <strong>{overage.toFixed(2)}</strong>
          </div>
          <div className="summary-total">
            <span>Disposal overage</span>
            <strong>{money(Math.round(overage * rate * 100))}</strong>
          </div>
        </div>
        <p style={{ fontSize: 11 }}>
          This estimate excludes base rental, extra days, and any other charges in your agreement.
        </p>
        <div
          style={{
            marginTop: 26,
            padding: '20px 22px',
            background: '#f8faf6',
            border: '1px solid #d4dfce',
            borderRadius: 14,
            textAlign: 'left',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#ea580c',
              marginBottom: 8,
            }}
          >
            <Sparkles size={13} />
            <span>Automate Weight Overages with RollOS</span>
          </div>
          <h3
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: '#1f2d26',
              margin: '0 0 8px',
              lineHeight: 1.35,
            }}
          >
            Tired of doing manual disposal math and paper scale tickets?
          </h3>
          <p
            style={{
              fontSize: 13.5,
              color: '#475569',
              lineHeight: 1.6,
              margin: '0 0 16px',
            }}
          >
            RollOS automatically calculates overages and charges the customer&apos;s card on file the second your driver uploads the certified scale ticket.
          </p>
          <div
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
            }}
          >
            <Link
              href="/signup"
              className="btn btn-orange"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                fontWeight: 700,
                padding: '10px 16px',
              }}
            >
              Start Free in 3 Minutes <ArrowRight size={14} />
            </Link>
            <Link
              href="/book/greenline"
              className="btn btn-dark"
              style={{
                fontSize: 13,
                fontWeight: 600,
                padding: '10px 16px',
              }}
            >
              Test Live Demo
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
