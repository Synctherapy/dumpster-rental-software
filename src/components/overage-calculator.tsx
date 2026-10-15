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
    <div className="w-full">
      <div className="bg-white border border-[#dde4d4] rounded-2xl p-6 md:p-10 shadow-sm text-left">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-[#eef3e6] text-[#2d4034]">
            <Calculator color="#819e5c" size={28} />
          </div>
          <div>
            <div className="eyebrow text-xs font-bold uppercase tracking-wider text-[#8b9e71]">
              KNOW WHAT’S GOING ON YOUR INVOICE · FREE HAULER UTILITY
            </div>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1f2d26] mt-2 mb-2">
          Dumpster Tonnage & Disposal Overage Calculator
        </h1>
        <p className="text-sm text-[#556658] mb-6 leading-relaxed">
          Estimate disposal overage charges directly from your included container allowance and measured net landfill scale ticket weight. Use the rates specified in your rental agreement.
        </p>

        <div className="form-stack max-w-xl">
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

        <div className="confirmation-details max-w-xl" role="status">
          <div className="summary-line">
            <span>Tons over your allowance</span>
            <strong>{overage.toFixed(2)} tons</strong>
          </div>
          <div className="summary-total">
            <span>Disposal overage</span>
            <strong>{money(Math.round(overage * rate * 100))}</strong>
          </div>
        </div>

        <p className="text-xs text-[#8d9884] mb-8">
          This estimate excludes base rental, extra days, and any other charges in your agreement.
        </p>

        {/* High-Converting Koray Reverse-Silo Contextual Vector Box */}
        <div className="mt-8 p-6 md:p-8 bg-gradient-to-br from-[#f8faf6] to-[#edf4e8] border border-[#cbd8c2] rounded-2xl shadow-sm text-left">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ea580c] mb-2">
            <Sparkles size={14} />
            <span>Automate Scale Slips & Tonnage Invoicing</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-[#1f2d26] mb-3">
            Stop doing manual transfer station math on greasy paper slips.
          </h2>
          <p className="text-sm text-[#4d5e53] leading-relaxed mb-4">
            Instead of crunching numbers by hand while sitting in line at the transfer station, modern roll-off haulers use automated{' '}
            <Link
              href="/features/tonnage-billing"
              className="font-semibold text-[#1f2d26] underline decoration-[#ea580c] hover:text-[#ea580c] transition-colors"
            >
              dumpster tonnage billing software
            </Link>
            . Drivers simply take a smartphone photo of the certified scale ticket; RollOS automatically calculates net short tons, deducts base allowances, attaches scale tickets to our official{' '}
            <Link
              href="/templates/dumpster-invoice"
              className="font-semibold text-[#1f2d26] underline decoration-[#ea580c] hover:text-[#ea580c] transition-colors"
            >
              dumpster rental invoice template
            </Link>
            , and processes the overage charge to the customer&apos;s pre-authorized card on file.
          </p>
          <p className="text-sm text-[#4d5e53] leading-relaxed mb-6">
            To protect your business against disputed overweight charges and driveway crack claims, pair this calculation with our legally vetted{' '}
            <Link
              href="/templates/dumpster-rental-contract"
              className="font-semibold text-[#1f2d26] underline decoration-[#ea580c] hover:text-[#ea580c] transition-colors"
            >
              dumpster rental contract template
            </Link>
            , or run your entire operation on dedicated{' '}
            <Link
              href="/"
              className="font-semibold text-[#1f2d26] underline decoration-[#ea580c] hover:text-[#ea580c] transition-colors"
            >
              dumpster rental software
            </Link>{' '}
            built for independent roll-off fleets.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/signup"
              className="btn btn-orange text-xs md:text-sm font-bold py-3 px-5 shadow-sm inline-flex items-center gap-2"
            >
              Start Free in 3 Minutes <ArrowRight size={14} />
            </Link>
            <Link
              href="/features/tonnage-billing"
              className="btn btn-secondary text-xs md:text-sm font-bold py-3 px-5"
            >
              How Tonnage Billing Works →
            </Link>
            <Link
              href="/book/greenline"
              className="text-xs font-semibold text-[#4d5e53] hover:text-[#ea580c] transition-colors px-3 py-2"
            >
              Test Live Customer Booking Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
