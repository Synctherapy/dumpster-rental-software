'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Calculator } from 'lucide-react';
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
        <Link href="/" className="btn" style={{ marginTop: 20 }}>
          Explore RollOS
        </Link>
      </div>
    </main>
  );
}
