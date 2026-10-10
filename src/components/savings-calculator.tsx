'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DollarSign, ArrowRight, TrendingUp, Moon, Sparkles, CheckCircle2 } from 'lucide-react';

interface CompetitorProfile {
  name: string;
  monthlyBase: number;
  perTruckMonthly: number;
  setupFee: number;
  notes: string;
}

const COMPETITORS: Record<string, CompetitorProfile> = {
  docket: {
    name: 'Docket Software',
    monthlyBase: 299,
    perTruckMonthly: 50,
    setupFee: 1500,
    notes: 'Hidden subscription pricing, mandatory sales demos, ~3.0% processing rates, native driver app downloads.',
  },
  servicecore: {
    name: 'ServiceCore',
    monthlyBase: 349,
    perTruckMonthly: 75,
    setupFee: 1200,
    notes: 'Per-truck pricing model built for septic/restrooms, complex enterprise quotes, mandatory sales calls.',
  },
  drs: {
    name: 'Dumpster Rental Systems (DRS)',
    monthlyBase: 195,
    perTruckMonthly: 0,
    setupFee: 500,
    notes: 'Restricts Standard plan to only 20 cans ($195.95/mo); jumps to $279.95/mo for over 20 cans.',
  },
  jobber: {
    name: 'Jobber (Grow Tier)',
    monthlyBase: 249,
    perTruckMonthly: 0,
    setupFee: 0,
    notes: 'General contractor tool without dumpster-specific driveway waivers, container inventory, or scale slips.',
  },
  phone_tag: {
    name: 'Pen & Paper / Phone Tag',
    monthlyBase: 0,
    perTruckMonthly: 0,
    setupFee: 0,
    notes: 'Zero software fees, but loses 3–5 after-hours bookings every month to competitors with instant online booking.',
  },
};

export function SavingsCalculator({ showTitle = true }: { showTitle?: boolean }) {
  const [trucks, setTrucks] = useState<number>(2);
  const [rentalsPerMonth, setRentalsPerMonth] = useState<number>(30);
  const [averageRentalPrice, setAverageRentalPrice] = useState<number>(450);
  const [competitorKey, setCompetitorKey] = useState<string>('docket');
  const [rollosPlan, setRollosPlan] = useState<'free' | 'starter'>('free');

  const selectedCompetitor = COMPETITORS[competitorKey];

  // Competitor Annual Cost calculation
  let competitorAnnualCost = 0;
  let missedRevenueAnnual = 0;

  if (competitorKey === 'phone_tag') {
    // Estimating 3 missed bookings/month when driving or after-hours
    const missedBookingsMonthly = Math.max(2, Math.round(rentalsPerMonth * 0.12));
    missedRevenueAnnual = missedBookingsMonthly * averageRentalPrice * 12;
    competitorAnnualCost = missedRevenueAnnual;
  } else {
    const monthlyFee = selectedCompetitor.monthlyBase + (trucks - 1) * selectedCompetitor.perTruckMonthly;
    competitorAnnualCost = monthlyFee * 12 + selectedCompetitor.setupFee;
  }

  // RollOS Annual Cost
  // Free: $0/mo (homeowner pays $11.95 booking fee)
  // Starter: $29/mo ($348/yr)
  const rollosAnnualCost = rollosPlan === 'free' ? 0 : 29 * 12;

  // Net Savings
  const netSavingsAnnual = Math.max(0, competitorAnnualCost - rollosAnnualCost);

  // Extra after-hours online bookings captured while sleeping (estimate 15% increase from 24/7 web booking)
  const extraBookingsAnnual = Math.round(rentalsPerMonth * 0.15 * 12);
  const extraRevenueAnnual = extraBookingsAnnual * averageRentalPrice;

  return (
    <div className="w-full bg-white border border-[#dde4d4] rounded-2xl p-6 md:p-10 shadow-sm text-[#1f2d26]">
      {showTitle && (
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="eyebrow" style={{ color: '#82956d', marginBottom: 8 }}>
            ROI & SOFTWARE COST CALCULATOR
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1f2d26] mb-3">
            How much money can RollOS save your hauling business?
          </h2>
          <p className="text-sm text-[#556658]">
            See the true cost comparison between legacy software subscriptions, lost phone-tag revenue, and RollOS.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-6 bg-[#f8faf6] p-6 rounded-xl border border-[#e5ebd9]">
          {/* Competitor Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4a6344] mb-2">
              Who are you currently using or comparing?
            </label>
            <select
              value={competitorKey}
              onChange={(e) => setCompetitorKey(e.target.value)}
              className="w-full p-3 rounded-lg border border-[#cbd5c4] bg-white text-sm font-semibold text-[#1f2d26] focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
            >
              <option value="docket">Docket Software (~$299/mo + $1,500 setup)</option>
              <option value="servicecore">ServiceCore (~$349/mo per truck + $1,200 setup)</option>
              <option value="drs">Dumpster Rental Systems - DRS ($195–$280/mo)</option>
              <option value="jobber">Jobber Grow Tier ($249/mo)</option>
              <option value="phone_tag">No Software (Pen & Paper / Phone Tag)</option>
            </select>
            <p className="text-xs text-[#687864] mt-2 italic">{selectedCompetitor.notes}</p>
          </div>

          {/* Trucks Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4a6344]">
                Number of Roll-Off Trucks
              </label>
              <span className="text-base font-extrabold text-[#ea580c] bg-white px-3 py-1 rounded-md border border-[#cbd5c4]">
                {trucks} {trucks === 1 ? 'Truck' : 'Trucks'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              value={trucks}
              onChange={(e) => setTrucks(Number(e.target.value))}
              className="w-full accent-[#ea580c] cursor-pointer"
            />
          </div>

          {/* Rentals Per Month Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4a6344]">
                Dumpster Rentals Per Month
              </label>
              <span className="text-base font-extrabold text-[#ea580c] bg-white px-3 py-1 rounded-md border border-[#cbd5c4]">
                {rentalsPerMonth} Rentals/mo
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="150"
              step="5"
              value={rentalsPerMonth}
              onChange={(e) => setRentalsPerMonth(Number(e.target.value))}
              className="w-full accent-[#ea580c] cursor-pointer"
            />
          </div>

          {/* Average Rental Price */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4a6344]">
                Average Dumpster Rental Price ($)
              </label>
              <span className="text-base font-extrabold text-[#ea580c] bg-white px-3 py-1 rounded-md border border-[#cbd5c4]">
                ${averageRentalPrice}
              </span>
            </div>
            <input
              type="range"
              min="250"
              max="800"
              step="25"
              value={averageRentalPrice}
              onChange={(e) => setAverageRentalPrice(Number(e.target.value))}
              className="w-full accent-[#ea580c] cursor-pointer"
            />
          </div>

          {/* RollOS Plan Choice */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4a6344] mb-2">
              Compare Against RollOS Plan:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRollosPlan('free')}
                className={`p-3 rounded-lg text-xs font-bold border text-center transition-all ${
                  rollosPlan === 'free'
                    ? 'bg-[#1f2d26] text-white border-[#1f2d26] shadow-sm'
                    : 'bg-white text-[#556658] border-[#cbd5c4]'
                }`}
              >
                Free Plan ($0/mo)
              </button>
              <button
                type="button"
                onClick={() => setRollosPlan('starter')}
                className={`p-3 rounded-lg text-xs font-bold border text-center transition-all ${
                  rollosPlan === 'starter'
                    ? 'bg-[#1f2d26] text-white border-[#1f2d26] shadow-sm'
                    : 'bg-white text-[#556658] border-[#cbd5c4]'
                }`}
              >
                Starter ($29/mo)
              </button>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-6">
          <div className="p-6 bg-[#16201a] text-white rounded-2xl shadow-xl border border-[#2d3a31]">
            <div className="text-xs font-bold text-[#ea580c] uppercase tracking-wider mb-1">
              ESTIMATED ANNUAL HARD SAVINGS
            </div>
            <div className="text-4xl md:text-5xl font-black text-white tracking-tight my-2">
              ${netSavingsAnnual.toLocaleString()}
              <span className="text-sm font-normal text-[#9bb0a0]"> / year</span>
            </div>
            <p className="text-xs text-[#cbd5cc] leading-relaxed">
              Money kept directly in your bank account instead of paying bloated monthly subscriptions or losing orders to phone tag.
            </p>

            <div className="mt-6 pt-6 border-t border-[#2d3a31] space-y-3 text-xs">
              <div className="flex justify-between items-center text-[#cbd5cc]">
                <span>{selectedCompetitor.name} Annual Expense:</span>
                <span className="font-mono font-bold text-red-400">
                  ${competitorAnnualCost.toLocaleString()}/yr
                </span>
              </div>
              <div className="flex justify-between items-center text-[#cbd5cc]">
                <span>RollOS ({rollosPlan === 'free' ? 'Free Plan' : 'Starter'}) Annual Cost:</span>
                <span className="font-mono font-bold text-green-400">
                  ${rollosAnnualCost.toLocaleString()}/yr
                </span>
              </div>
              <div className="flex justify-between items-center text-[#cbd5cc]">
                <span>Hauler Rental Commission:</span>
                <span className="font-bold text-green-400">0% (You keep 100%)</span>
              </div>
            </div>
          </div>

          {/* Extra Bookings Captured While Sleeping */}
          <div className="p-6 bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-[#166534] uppercase tracking-wider mb-2">
              <Moon size={16} className="text-[#ea580c]" />
              REVENUE CAPTURED WHILE YOU SLEEP
            </div>
            <div className="text-2xl font-black text-[#166534] my-1">
              +${extraRevenueAnnual.toLocaleString()} / year
            </div>
            <p className="text-xs text-[#14532d] leading-relaxed">
              Based on an estimated <strong>{extraBookingsAnnual} extra online bookings per year</strong> captured via your 24/7 website widget while you are driving or resting.
            </p>
          </div>

          {/* CTA */}
          <div>
            <Link
              href="/signup"
              className="btn btn-orange w-full py-4 text-center justify-center font-bold text-sm shadow-md"
            >
              Start Free in 3 Minutes — Keep 100% of Your Revenue <ArrowRight size={16} />
            </Link>
            <p className="text-[11px] text-center text-[#687864] mt-2">
              No credit card required · Zero annual contracts · Up & running today
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
