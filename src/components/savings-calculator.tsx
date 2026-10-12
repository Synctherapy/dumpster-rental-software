'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Moon,
  ShieldCheck,
  Info,
} from 'lucide-react';

interface CompetitorProfile {
  name: string;
  monthlyBase: number;
  perTruckMonthly: number;
  setupFee: number;
  notes: string;
  type: 'sub100_saas' | 'legacy_saas' | 'general_contractor' | 'manual';
}

const COMPETITORS: Record<string, CompetitorProfile> = {
  icans: {
    name: 'iCANS Software',
    monthlyBase: 99,
    perTruckMonthly: 0,
    setupFee: 0,
    notes: '$99/mo base plan (email-only notifications; $159/mo Plus required for SMS). Requires drivers to download native app from App Store.',
    type: 'sub100_saas',
  },
  binboss: {
    name: 'Bin Boss',
    monthlyBase: 99,
    perTruckMonthly: 0,
    setupFee: 0,
    notes: 'Flat $99/mo with no setup fees. Requires drivers to install and maintain native mobile app.',
    type: 'sub100_saas',
  },
  reservety: {
    name: 'Reservety',
    monthlyBase: 59,
    perTruckMonthly: 0,
    setupFee: 0,
    notes: '$59/mo Starter or $99/mo Pro. Generic rental software lacking dumpster scale tickets and swap logic.',
    type: 'sub100_saas',
  },
  docket: {
    name: 'Docket Software',
    monthlyBase: 299,
    perTruckMonthly: 50,
    setupFee: 1500,
    notes: 'Hidden pricing, mandatory sales demos, $1,500 onboarding fee, ~$3.0% processing rates, native app downloads.',
    type: 'legacy_saas',
  },
  servicecore: {
    name: 'ServiceCore',
    monthlyBase: 349,
    perTruckMonthly: 75,
    setupFee: 1200,
    notes: 'Per-truck pricing model built for septic/restrooms, $1,200 setup fee, enterprise quotes, locked-in contracts.',
    type: 'legacy_saas',
  },
  drs: {
    name: 'Dumpster Rental Systems (DRS)',
    monthlyBase: 195,
    perTruckMonthly: 0,
    setupFee: 500,
    notes: 'Caps Standard tier at 20 cans ($195.95/mo); jumps to $279.95/mo over 20 cans, plus $500 setup fee.',
    type: 'legacy_saas',
  },
  jobber: {
    name: 'Jobber (Grow Tier)',
    monthlyBase: 249,
    perTruckMonthly: 0,
    setupFee: 0,
    notes: 'Generic contractor software lacking dumpster driveway waivers, container yard tracking, or scale ticket billing.',
    type: 'general_contractor',
  },
  phone_tag: {
    name: 'Pen & Paper / Phone Tag',
    monthlyBase: 0,
    perTruckMonthly: 0,
    setupFee: 0,
    notes: '$0 monthly software bills, but you lose 2–4 high-intent bookings every month when you are driving or after 7 PM.',
    type: 'manual',
  },
};

export function SavingsCalculator({ showTitle = true }: { showTitle?: boolean }) {
  const [competitorKey, setCompetitorKey] = useState<string>('icans');
  // 'switching' means they already pay the competitor and paid setup long ago; 'evaluating' means first-time buyer
  const [isSwitching, setIsSwitching] = useState<boolean>(true);
  const [trucks, setTrucks] = useState<number>(2);
  const [rentalsPerMonth, setRentalsPerMonth] = useState<number>(30);
  const [averageRentalPrice, setAverageRentalPrice] = useState<number>(450);
  const [rollosPlan, setRollosPlan] = useState<'free' | 'starter' | 'growth'>('free');

  const selectedCompetitor = COMPETITORS[competitorKey];
  const isManual = selectedCompetitor.type === 'manual';

  // 1. Competitor Annual Cost calculation
  // Base monthly fee + per extra truck fee
  const competitorMonthlyFee =
    selectedCompetitor.monthlyBase + Math.max(0, trucks - 1) * selectedCompetitor.perTruckMonthly;
  
  // If switching: setup fee is $0 because they paid it in the past; if evaluating: include one-time setup fee in Year 1
  const effectiveSetupFee = isSwitching ? 0 : selectedCompetitor.setupFee;
  const competitorAnnualCost = isManual ? 0 : competitorMonthlyFee * 12 + effectiveSetupFee;

  // 2. RollOS Annual Cost
  // Free: $0/mo (homeowner pays $12 booking fee at checkout)
  // Starter: $29/mo ($348/yr)
  // Growth: $149/mo ($1,788/yr)
  const rollosMonthlyCost = rollosPlan === 'free' ? 0 : rollosPlan === 'starter' ? 29 : 149;
  const rollosAnnualCost = rollosMonthlyCost * 12;

  // 3. Direct Hard Software Savings (for SaaS comparisons)
  const directAnnualSavings = Math.max(0, competitorAnnualCost - rollosAnnualCost);

  // 4. Phone Tag Opportunity Cost (Realistic hauler economics: ~10% missed calls, ~45% net profit after landfill/fuel)
  const missedBookingsMonthly = Math.min(6, Math.max(2, Math.round(rentalsPerMonth * 0.10)));
  const missedRevenueAnnual = missedBookingsMonthly * averageRentalPrice * 12;
  // Realistic net profit margin (~45% margin after $130 landfill tip fee, $45 fuel, driver wages)
  const missedNetProfitAnnual = Math.round(missedRevenueAnnual * 0.45);

  return (
    <div className="w-full bg-white border border-[#dde4d4] rounded-2xl p-6 md:p-10 shadow-sm text-[#1f2d26]">
      {showTitle && (
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0fdf4] text-xs font-bold text-[#166534] border border-[#bbf7d0] mb-3">
            <ShieldCheck size={14} className="text-[#16a34a]" />
            Hauler-Audited Math · Real Landfill & Fuel Margins
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1f2d26] mb-3">
            How much money can RollOS save your hauling business?
          </h2>
          <p className="text-sm text-[#556658]">
            Compare honest, itemized software bills and after-hours bookings without inflated vanity metrics.
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
              <optgroup label="Independent & 1–3 Truck Dumpster Software">
                <option value="icans">iCANS ($99/mo flat · $1,188/yr)</option>
                <option value="binboss">Bin Boss ($99/mo flat · $1,188/yr)</option>
                <option value="reservety">Reservety ($59/mo · $708/yr)</option>
                <option value="phone_tag">No Software (Pen & Paper / Phone Tag)</option>
              </optgroup>
              <optgroup label="Multi-Truck & Enterprise Software">
                <option value="docket">Docket Software (~$299/mo + $50/truck + $1,500 setup)</option>
                <option value="servicecore">ServiceCore (~$349/mo per truck + $1,200 setup)</option>
                <option value="drs">Dumpster Rental Systems - DRS ($195–$280/mo + $500 setup)</option>
                <option value="jobber">Jobber Grow Tier ($249/mo)</option>
              </optgroup>
            </select>
            <p className="text-xs text-[#687864] mt-2 italic">{selectedCompetitor.notes}</p>
          </div>

          {/* Situation Toggle: Switching vs Shopping (only relevant when competitor charges a setup fee) */}
          {!isManual && selectedCompetitor.setupFee > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4a6344] mb-2">
                Your Current Situation:
              </label>
              <div className="grid grid-cols-2 gap-2 bg-[#eef3e6] p-1 rounded-lg border border-[#cbd5c4]">
                <button
                  type="button"
                  onClick={() => setIsSwitching(true)}
                  className={`py-2 px-3 rounded-md text-xs font-bold transition-all ${
                    isSwitching
                      ? 'bg-white text-[#1f2d26] shadow-sm'
                      : 'text-[#687864] hover:text-[#1f2d26]'
                  }`}
                >
                  I Currently Pay This
                  <span className="block text-[10px] font-normal text-[#71826d]">
                    (Setup fee excluded)
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsSwitching(false)}
                  className={`py-2 px-3 rounded-md text-xs font-bold transition-all ${
                    !isSwitching
                      ? 'bg-white text-[#1f2d26] shadow-sm'
                      : 'text-[#687864] hover:text-[#1f2d26]'
                  }`}
                >
                  Shopping / Evaluating
                  <span className="block text-[10px] font-normal text-[#71826d]">
                    (Includes Year 1 setup)
                  </span>
                </button>
              </div>
            </div>
          )}

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
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4a6344]">
                Compare Against RollOS Plan:
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRollosPlan('free')}
                className={`p-2.5 rounded-lg text-xs font-bold border text-center transition-all ${
                  rollosPlan === 'free'
                    ? 'bg-[#1f2d26] text-white border-[#1f2d26] shadow-sm'
                    : 'bg-white text-[#556658] border-[#cbd5c4] hover:bg-[#f1f5ee]'
                }`}
              >
                Free ($0/mo)
                <span className="block text-[10px] font-normal opacity-80 mt-0.5">
                  $12 fee at checkout
                </span>
              </button>
              <button
                type="button"
                onClick={() => setRollosPlan('starter')}
                className={`p-2.5 rounded-lg text-xs font-bold border text-center transition-all ${
                  rollosPlan === 'starter'
                    ? 'bg-[#1f2d26] text-white border-[#1f2d26] shadow-sm'
                    : 'bg-white text-[#556658] border-[#cbd5c4] hover:bg-[#f1f5ee]'
                }`}
              >
                Starter ($29/mo)
                <span className="block text-[10px] font-normal opacity-80 mt-0.5">
                  Offline Cash/Sync
                </span>
              </button>
              <button
                type="button"
                onClick={() => setRollosPlan('growth')}
                className={`p-2.5 rounded-lg text-xs font-bold border text-center transition-all ${
                  rollosPlan === 'growth'
                    ? 'bg-[#1f2d26] text-white border-[#1f2d26] shadow-sm'
                    : 'bg-white text-[#556658] border-[#cbd5c4] hover:bg-[#f1f5ee]'
                }`}
              >
                Fleet ($149/mo)
                <span className="block text-[10px] font-normal opacity-80 mt-0.5">
                  Multi-driver Fleet
                </span>
              </button>
            </div>
            <p className="text-[11px] text-[#687864] mt-2 flex items-center gap-1">
              <Info size={12} className="shrink-0 text-[#82956d]" />
              {rollosPlan === 'free' &&
                'Free Plan ($0/mo): Online booking & dispatch. Customer pays $12 fee at checkout.'}
              {rollosPlan === 'starter' &&
                'Starter Plan ($29/mo): Adds offline cash/check logging & calendar sync. Customer pays $12 fee.'}
              {rollosPlan === 'growth' &&
                'Fleet Plan ($149/mo): Adds unlimited driver logins & multi-truck dispatch. Customer pays $12 fee.'}
            </p>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-6">
          {!isManual ? (
            /* SaaS Comparison Result */
            <div className="p-6 bg-[#16201a] text-white rounded-2xl shadow-xl border border-[#2d3a31]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#ea580c] uppercase tracking-wider">
                  {selectedCompetitor.setupFee > 0 && !isSwitching
                    ? 'YEAR 1 TOTAL SAVINGS (INCL. SETUP)'
                    : 'ANNUAL HARD SOFTWARE SAVINGS'}
                </span>
                <span className="text-[11px] bg-[#223126] text-[#9bb0a0] px-2 py-0.5 rounded font-mono">
                  {selectedCompetitor.setupFee > 0
                    ? isSwitching
                      ? 'Year 2+ Ongoing'
                      : 'Year 1 Switching'
                    : 'Flat Rate SaaS'}
                </span>
              </div>
              <div className="text-4xl md:text-5xl font-black text-white tracking-tight my-2">
                ${directAnnualSavings.toLocaleString()}
                <span className="text-sm font-normal text-[#9bb0a0]"> / year</span>
              </div>
              <p className="text-xs text-[#cbd5cc] leading-relaxed">
                Direct subscription money kept in your business checking account instead of paying bloated monthly software fees.
              </p>

              {/* Itemized Math Breakdown */}
              <div className="mt-6 pt-5 border-t border-[#2d3a31] space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-[#cbd5cc]">
                  <span>{selectedCompetitor.name} Monthly Subscription:</span>
                  <span className="font-mono font-bold text-red-400">
                    ${competitorMonthlyFee.toLocaleString()}/mo
                  </span>
                </div>
                {effectiveSetupFee > 0 && (
                  <div className="flex justify-between items-center text-[#cbd5cc]">
                    <span>{selectedCompetitor.name} One-Time Setup Fee:</span>
                    <span className="font-mono font-bold text-red-400">
                      ${effectiveSetupFee.toLocaleString()} (waived with RollOS)
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-[#cbd5cc]">
                  <span>{selectedCompetitor.name} Total Annual Expense:</span>
                  <span className="font-mono font-bold text-red-400">
                    ${competitorAnnualCost.toLocaleString()}/yr
                  </span>
                </div>
                <div className="flex justify-between items-center text-[#cbd5cc]">
                  <span>RollOS ({rollosPlan === 'free' ? 'Free' : rollosPlan === 'starter' ? 'Starter' : 'Fleet'}) Annual Cost:</span>
                  <span className="font-mono font-bold text-green-400">
                    ${rollosAnnualCost.toLocaleString()}/yr
                  </span>
                </div>
                <div className="flex justify-between items-center text-[#cbd5cc]">
                  <span>Hauler Rental Revenue Kept:</span>
                  <span className="font-bold text-green-400">100% of rental price</span>
                </div>
              </div>
            </div>
          ) : (
            /* Pen & Paper / Phone Tag Result */
            <div className="p-6 bg-[#16201a] text-white rounded-2xl shadow-xl border border-[#2d3a31]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#ea580c] uppercase tracking-wider">
                  ESTIMATED PHONE TAG REVENUE LEAKAGE
                </span>
                <span className="text-[11px] bg-[#223126] text-[#9bb0a0] px-2 py-0.5 rounded font-mono">
                  Missed Call Analysis
                </span>
              </div>
              <div className="text-4xl md:text-5xl font-black text-white tracking-tight my-2">
                ${missedNetProfitAnnual.toLocaleString()}
                <span className="text-sm font-normal text-[#9bb0a0]"> / year net profit</span>
              </div>
              <p className="text-xs text-[#cbd5cc] leading-relaxed">
                Realistic take-home profit lost when homeowners call after 7 PM or while you’re driving and book the next hauler on Google.
              </p>

              {/* Itemized Breakdown */}
              <div className="mt-6 pt-5 border-t border-[#2d3a31] space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-[#cbd5cc]">
                  <span>Your Current Software Bill:</span>
                  <span className="font-mono font-bold text-green-400">$0/mo (Pen & Paper)</span>
                </div>
                <div className="flex justify-between items-center text-[#cbd5cc]">
                  <span>RollOS Free Plan Cost:</span>
                  <span className="font-mono font-bold text-green-400">$0/mo</span>
                </div>
                <div className="flex justify-between items-center text-[#cbd5cc]">
                  <span>Estimated Missed Orders (after-hours/driving):</span>
                  <span className="font-mono font-bold text-amber-400">
                    ~{missedBookingsMonthly} bookings / month
                  </span>
                </div>
                <div className="flex justify-between items-center text-[#cbd5cc]">
                  <span>Gross Rental Volume Lost:</span>
                  <span className="font-mono font-bold text-red-400">
                    ${missedRevenueAnnual.toLocaleString()} / year
                  </span>
                </div>
                <div className="flex justify-between items-center text-[#cbd5cc]">
                  <span>Net Profit Kept (after ~55% dump fees & fuel):</span>
                  <span className="font-bold text-green-400">
                    +${missedNetProfitAnnual.toLocaleString()} / year in your pocket
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Secondary Conversion & Cash Flow Card */}
          <div className="p-5 bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-[#166534] uppercase tracking-wider mb-1.5">
              <Moon size={15} className="text-[#ea580c]" />
              24/7 ONLINE BOOKING & CASH FLOW ADVANTAGE
            </div>
            {!isManual ? (
              <p className="text-xs text-[#14532d] leading-relaxed">
                Unlike legacy software that charges you <strong>${competitorMonthlyFee}/month</strong> through the dead of winter when trucks are parked, RollOS gives you 24/7 web checkout with zero software debt. Converting just <strong>1 extra after-hours booking per month</strong> adds <strong>+${(12 * averageRentalPrice).toLocaleString()} in gross volume</strong> (~${Math.round(12 * averageRentalPrice * 0.45).toLocaleString()} net profit).
              </p>
            ) : (
              <p className="text-xs text-[#14532d] leading-relaxed">
                Over 40% of residential dumpster searches happen between 7 PM and 7 AM. An embeddable 60-second booking widget captures payment while you sleep—stopping customers from calling the next hauler on Google.
              </p>
            )}
          </div>

          {/* Transparent Hauler Pricing Guarantee Note */}
          <div className="px-4 py-3 bg-[#f8faf6] border border-[#dde4d4] rounded-xl text-[11px] text-[#556658] leading-relaxed">
            <span className="font-bold text-[#1f2d26]">The Hauler Guarantee:</span> Every plan includes the $12 reservation fee, paid by the customer. Starter and Fleet add tools. They do not remove the fee.
          </div>

          {/* CTA */}
          <div>
            <Link
              href="/signup"
              className="btn btn-orange w-full py-4 text-center justify-center font-bold text-sm shadow-md"
            >
              Start Free in 3 Minutes — Keep 100% of Rental Revenue <ArrowRight size={16} />
            </Link>
            <p className="text-[11px] text-center text-[#687864] mt-2">
              No credit card required · Zero annual contracts · Embeds on any site in 3 min
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
