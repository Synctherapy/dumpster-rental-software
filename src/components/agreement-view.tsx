'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Printer,
  Copy,
  Check,
  ShieldCheck,
  ArrowLeft,
  Truck,
  Building2,
  User,
  AlertTriangle,
  Camera,
  FileCheck,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { dateLabel, money } from '@/lib/types';
import { api } from '@/lib/client';
import type { AgreementData } from '@/lib/server/agreement';

export function AgreementView({ data }: { data: AgreementData }) {
  const [copied, setCopied] = useState(false);
  const { job, organization, pricingRule, rentalDays, currency } = data;

  const surcharges =
    organization.landfill_surcharges ??
    organization.pricing_config?.landfill_surcharges ?? {};

  const formatMoney = (cents: number) => money(cents, currency);
  const refCode = job.id.slice(0, 8).toUpperCase();

  const tireRate = formatMoney(surcharges.tire_cents ?? 2500);
  const mattressRate = formatMoney(surcharges.mattress_cents ?? 5000);
  const freonRate = formatMoney(surcharges.freon_cents ?? 7500);
  const propaneRate = formatMoney(surcharges.propane_cents ?? 3500);

  // Signing state for remote/phone order customers
  const [isSigned, setIsSigned] = useState(
    job.signed_by_customer ?? (job.signature.ip !== 'dispatch-phone')
  );
  const [signatureName, setSignatureName] = useState(
    job.signature.name.includes('(Phone Order') ? job.customer_name : job.signature.name
  );
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [signing, setSigning] = useState(false);
  const [signError, setSignError] = useState('');
  const [signerName, setSignerName] = useState(job.signature.name);
  const [signerTimestamp, setSignerTimestamp] = useState(job.signature.timestamp);
  const [signerIp, setSignerIp] = useState(job.signature.ip);

  const prohibitedItems =
    organization.prohibited_items ??
    organization.pricing_config?.prohibited_items ?? [
      'Hazardous waste, chemical waste, toxic substances, or biohazards',
      'Wet paint, thinners, solvents, resins, adhesives, or lacquers',
      'Motor oil, transmission fluid, gasoline, diesel, or automotive fluids',
      'Car/truck batteries, lithium-ion battery packs, or acid-containing cells',
      'Asbestos, lead-based materials, or contaminated soil/sludge',
      'Propane tanks, compressed gas cylinders, oxygen tanks, or fire extinguishers',
      'Freon-containing appliances (refrigerators, AC units, freezers) unless pre-authorized',
      'Tires, fluorescent light tubes, large electronic waste (e-waste)',
      'Medical, infectious, or biological waste',
    ];

  const handleRemoteSign = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigning(true);
    setSignError('');
    try {
      const res = await api<{ ok: boolean; job: typeof job }>(`/api/agreement/${job.id}/sign`, {
        method: 'POST',
        body: JSON.stringify({
          signature_name: signatureName,
          accepted_terms: true,
        }),
      });
      setIsSigned(true);
      setSignerName(res.job.signature.name);
      setSignerTimestamp(res.job.signature.timestamp);
      setSignerIp(res.job.signature.ip);
    } catch (err) {
      setSignError((err as Error).message);
    } finally {
      setSigning(false);
    }
  };

  const contractPlainContent = `ROLL OFF DUMPSTER RENTAL AGREEMENT & PROPERTY DAMAGE WAIVER
Reference: #${refCode}

HAULER / SERVICE PROVIDER:
Company Name: ${organization.name}
Phone: ${organization.phone || 'On file'}

CUSTOMER / RENTER:
Full Name: ${job.customer_name}
Service / Drop-Off Address: ${job.delivery_address}
Phone: ${job.customer_phone}
Email: ${job.customer_email}

CONTAINER & RENTAL SPECIFICATIONS:
• Container Size: ${job.size_yards} Cubic Yards
• Scheduled Delivery Date: ${dateLabel(job.delivery_date)}
• Scheduled Pick-Up Date: ${dateLabel(job.pickup_date)}
• Included Rental Period: ${pricingRule.included_days} Days (Reserved: ${rentalDays} Days)
• Base Rental Rate: ${formatMoney(job.price_cents)}
• Included Disposal Weight Allowance: ${job.tons_included} Tons
• Overage Fee Per Ton: ${formatMoney(pricingRule.overage_per_ton_cents)} per ton (pro-rated)
• Additional Rental Day Rate: ${formatMoney(job.extra_day_cents || pricingRule.extra_day_cents)} per calendar day
${job.protective_boards ? '• Protective Driveway Wood Blocking: Included' : ''}

STANDARD LANDFILL SURCHARGES (AUTOMATIC CARD-ON-FILE BILLING):
• Tires: ${tireRate} each
• Mattresses & Box Springs: ${mattressRate} each
• Freon Appliances (AC, Fridges): ${freonRate} each
• Propane / Gas Cylinders: ${propaneRate} each

TERMS AND CONDITIONS:
1. SURFACE & PROPERTY DAMAGE WAIVER: Customer releases ${organization.name} from any and all liability for damage to driveways, asphalt, concrete, brick pavers, curbs, sidewalks, lawns, trees, irrigation/sprinkler pipes, septic systems, or underground utilities. Customer assumes sole risk for off-pavement placement.
2. PROHIBITED & HAZARDOUS MATERIALS: Only non-hazardous municipal solid waste allowed. Fines of $150-$500 plus specialized disposal remediation fees apply for violations.
3. LANDFILL SURCHARGES: Customer authorizes automatic billing for tires (${tireRate}), mattresses (${mattressRate}), freon units (${freonRate}), and propane tanks (${propaneRate}).
4. DENSE INERT MATERIALS & HOIST CAPACITY: Dirt, concrete, rock, brick, or sod are prohibited in containers larger than 10 yards. Max gross load must not exceed 10 tons. If overloaded beyond hoist capacity, customer must manually offload excess debris at customer expense.
5. WEIGHT LIMITS & OVERAGE AUTHORIZATION: Customer authorizes hauler to automatically charge card on file for weight over ${job.tons_included} tons at ${formatMoney(pricingRule.overage_per_ton_cents)}/ton based on certified scale tickets.
6. WATER LEVEL RULE: Debris must not exceed the top lip of container walls.
7. SITE ACCESS & $125 DRY RUN TRIP FEE: Customer guarantees clear access (10ft wide, 14ft high). Blocked access incurs an automatic $125 dry run fee.
8. STREET PLACEMENT & MUNICIPAL PERMITS: Customer is solely responsible for obtaining and paying for all required municipal right-of-way (ROW) street permits, parking permits, and barricades, and indemnifies hauler against city citations or towing.
9. INDEMNIFICATION: Customer holds hauler harmless against damages or injuries resulting from unauthorized container movement.
10. PAYMENT AUTHORIZATION: Customer authorizes charges for overages, extra days, dry runs, or violations verified by scale tickets and photos.

CUSTOMER ELECTRONIC SIGNATURE:
Signed: ${signerName}
Timestamp: ${new Date(signerTimestamp).toLocaleString()}
Signer IP Address: ${signerIp}
Verified Digital Acceptance: ${isSigned ? 'Legally Binding E-Sign' : 'Pending Customer Remote Signature'}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contractPlainContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied(false);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="agreement-wrapper min-h-screen bg-[#f7f9f6] text-[#223026] py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Action Bar (Hidden during Print) */}
      <div className="print-hide max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-[#dde4d4] rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#556658] hover:text-[#ea580c] transition-colors"
          >
            <ArrowLeft size={14} /> Back
          </Link>
          <span className="text-[#cbd5cc]">|</span>
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className={isSigned ? 'text-[#16a34a]' : 'text-[#ea580c]'} />
            <span className="text-xs font-bold text-[#1f2d26]">
              Agreement #{refCode}
            </span>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                isSigned
                  ? 'bg-[#eef7ee] text-[#166534] border-[#bbf7d0]'
                  : 'bg-[#fff7ed] text-[#c2410c] border-[#fed7aa]'
              }`}
            >
              {isSigned ? '✓ Legally Signed' : '⚠️ Signature Pending'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f0f4ea] text-[#2f4233] text-xs font-bold hover:bg-[#e4ebdb] transition-colors border border-[#cbd5c4] cursor-pointer"
          >
            {copied ? (
              <>
                <Check size={14} className="text-[#166534]" /> Copied!
              </>
            ) : (
              <>
                <Copy size={14} /> Copy Text
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#ea580c] text-white text-xs font-bold hover:bg-[#c2410c] transition-colors shadow-sm cursor-pointer"
          >
            <Printer size={14} /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Interactive Remote Signing Prompt (If Unsigned) */}
      {!isSigned && (
        <div className="print-hide max-w-4xl mx-auto mb-6 bg-gradient-to-r from-[#fff7ed] to-[#fef2f2] border-2 border-[#ea580c] rounded-xl p-6 shadow-md">
          <div className="flex items-start gap-3">
            <AlertTriangle size={24} className="text-[#ea580c] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-base font-bold text-[#1f2d26]">
                Customer Action Required: Review & Sign Liability Waiver
              </h2>
              <p className="text-xs text-[#687864] mt-1 leading-relaxed">
                Before equipment drop-off, please review the rental terms below, confirm your placement instructions, and enter your electronic signature.
              </p>

              <form onSubmit={handleRemoteSign} className="mt-4 space-y-3 bg-white p-4 rounded-lg border border-[#fed7aa]">
                <div>
                  <label className="block text-xs font-bold text-[#1f2d26] mb-1">
                    Your Full Legal Name (Electronic Signature) *
                  </label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    placeholder="Type your first and last name"
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                    className="w-full text-sm p-2 border border-[#cbd5c4] rounded-md focus:border-[#ea580c] outline-none"
                  />
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    required
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span className="text-xs text-[#556658] leading-snug">
                    I agree to the <b>Dumpster Rental Agreement & Property Damage Waiver</b> below. I certify that no prohibited hazardous waste will be deposited and authorize automatic card-on-file billing for excess tonnage overages or landfill surcharges verified by certified scale tickets.
                  </span>
                </label>

                {signError && (
                  <div className="text-xs text-red-600 font-semibold">{signError}</div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={signing}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#ea580c] text-white text-xs font-bold rounded-lg hover:bg-[#c2410c] transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {signing ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Recording E-Signature…
                      </>
                    ) : (
                      <>
                        <FileCheck size={14} /> Electronically Sign & Accept Rental Terms
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Main Printable Legal Document */}
      <div className="agreement-document max-w-4xl mx-auto bg-white border border-[#d6dfce] rounded-xl shadow-md p-6 sm:p-10 text-xs sm:text-sm leading-relaxed text-[#2d3a31]">
        {/* Document Header */}
        <div className="border-b border-[#cbd5c4] pb-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#ea580c] mb-1">
              OFFICIAL SERVICE AGREEMENT & LIABILITY WAIVER
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1c2921]">
              Roll Off Dumpster Rental Contract & Property Waiver
            </h1>
            <p className="text-xs text-[#687864] mt-1">
              Executed under federal and state digital signature & electronic transaction acts.
            </p>
          </div>
          <div className="sm:text-right bg-[#f8faf7] p-3 rounded-lg border border-[#dde4d4]">
            <div className="text-[10px] font-semibold text-[#687864] uppercase">Booking Reference</div>
            <div className="text-base font-black text-[#1c2921]">#{refCode}</div>
            <div className="text-[11px] text-[#556658]">
              {dateLabel(job.created_at.slice(0, 10))}
            </div>
          </div>
        </div>

        {/* The Parties */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-[#fafcf9] border border-[#e2e9dc]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#556658] mb-2 flex items-center gap-1.5">
              <Building2 size={14} className="text-[#ea580c]" /> Hauler / Service Provider
            </div>
            <div className="font-bold text-[#1c2921] text-sm">{organization.name}</div>
            {organization.phone && (
              <div className="text-xs text-[#556658] mt-0.5">Phone: {organization.phone}</div>
            )}
            <div className="text-[11px] text-[#687864] mt-1">Dispatch & Operations Center</div>
          </div>

          <div className="p-4 rounded-lg bg-[#fafcf9] border border-[#e2e9dc]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#556658] mb-2 flex items-center gap-1.5">
              <User size={14} className="text-[#ea580c]" /> Customer / Renter
            </div>
            <div className="font-bold text-[#1c2921] text-sm">{job.customer_name}</div>
            <div className="text-xs text-[#556658] mt-0.5">
              <b>Service Address:</b> {job.delivery_address}
            </div>
            <div className="text-xs text-[#556658] mt-0.5">
              Phone: {job.customer_phone} · Email: {job.customer_email}
            </div>
          </div>
        </div>

        {/* Container & Rental Specifications */}
        <div className="mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-[#1c2921] mb-2 flex items-center gap-2">
            <Truck size={14} className="text-[#ea580c]" />
            Rental Specifications & Authorized Rates
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f8faf7] border border-[#dde4d4] rounded-lg p-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#687864] block">Container Size</span>
              <span className="text-sm font-bold text-[#1c2921]">{job.size_yards} Cubic Yards</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#687864] block">Scheduled Delivery</span>
              <span className="text-sm font-bold text-[#1c2921]">{dateLabel(job.delivery_date)}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#687864] block">Scheduled Pick-Up</span>
              <span className="text-sm font-bold text-[#1c2921]">{dateLabel(job.pickup_date)}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#687864] block">Rental Period</span>
              <span className="text-sm font-bold text-[#1c2921]">{rentalDays} Days</span>
            </div>
            <div className="pt-2 border-t border-[#e2e9dc]">
              <span className="text-[10px] uppercase font-bold text-[#687864] block">Base Rental Rate</span>
              <span className="text-sm font-bold text-[#1c2921]">{formatMoney(job.price_cents)}</span>
            </div>
            <div className="pt-2 border-t border-[#e2e9dc]">
              <span className="text-[10px] uppercase font-bold text-[#687864] block">Included Weight</span>
              <span className="text-sm font-bold text-[#1c2921]">{job.tons_included} Tons</span>
            </div>
            <div className="pt-2 border-t border-[#e2e9dc]">
              <span className="text-[10px] uppercase font-bold text-[#687864] block">Overage Rate</span>
              <span className="text-sm font-bold text-[#1c2921]">
                {formatMoney(pricingRule.overage_per_ton_cents)} / ton
              </span>
            </div>
            <div className="pt-2 border-t border-[#e2e9dc]">
              <span className="text-[10px] uppercase font-bold text-[#687864] block">Extra Day Rate</span>
              <span className="text-sm font-bold text-[#1c2921]">
                {formatMoney(job.extra_day_cents || pricingRule.extra_day_cents)} / day
              </span>
            </div>
          </div>
          {job.protective_boards && (
            <div className="mt-2 text-xs font-semibold text-[#166534] bg-[#f0fdf4] border border-[#bbf7d0] px-3 py-1.5 rounded-md flex items-center gap-2">
              <Check size={14} /> Protective driveway wood blocking requested and authorized.
            </div>
          )}
          {job.notes && (
            <div className="mt-2 text-xs text-[#556658] bg-[#fafcf9] border border-[#e2e9dc] p-2.5 rounded-md">
              <span className="font-bold text-[#1c2921]">Placement Instructions:</span> {job.notes}
            </div>
          )}
        </div>

        {/* Standard Landfill Surcharge Schedule */}
        <div className="mb-6 p-3.5 bg-[#fefce8] border border-[#fef08a] rounded-lg">
          <div className="text-xs font-bold uppercase tracking-wider text-[#854d0e] mb-1">
            Standard Landfill Surcharges (Authorized Card-on-File Billing)
          </div>
          <p className="text-[11px] text-[#713f12] mb-2 leading-relaxed">
            The disposal facility levies flat surcharges for non-standard household items. Customer authorizes Hauler to charge the payment method on file for the following items discovered upon unloading:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-white p-2 rounded border border-[#fde047]">
              <span className="text-[10px] text-[#713f12] block">Automotive Tires</span>
              <strong className="text-[#854d0e]">{tireRate} / tire</strong>
            </div>
            <div className="bg-white p-2 rounded border border-[#fde047]">
              <span className="text-[10px] text-[#713f12] block">Mattress / Box Spring</span>
              <strong className="text-[#854d0e]">{mattressRate} / item</strong>
            </div>
            <div className="bg-white p-2 rounded border border-[#fde047]">
              <span className="text-[10px] text-[#713f12] block">Freon Appliance (AC/Fridge)</span>
              <strong className="text-[#854d0e]">{freonRate} / unit</strong>
            </div>
            <div className="bg-white p-2 rounded border border-[#fde047]">
              <span className="text-[10px] text-[#713f12] block">Propane / Gas Cylinder</span>
              <strong className="text-[#854d0e]">{propaneRate} / tank</strong>
            </div>
          </div>
        </div>

        {/* Legal Clauses */}
        <div className="space-y-4 text-xs leading-relaxed text-[#3b4b3f]">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#1c2921] border-b border-[#cbd5c4] pb-1.5">
            Terms, Conditions & Liability Releases
          </h2>

          <div>
            <h3 className="font-bold text-[#1c2921] mb-1">
              1. Surface, Underground Utilities & Lawn Damage Waiver (Read Carefully)
            </h3>
            <p>
              Customer acknowledges that roll-off containers, delivery trucks, and hoist equipment are heavy and exert significant surface pressure (up to 30,000–60,000+ lbs). Customer authorizes {organization.name} (“Hauler”) to place the roll-off container upon Customer’s driveway, parking lot, or designated drop zone.
            </p>
            <p className="mt-1 font-semibold text-[#1f2d26] bg-[#f9faf8] p-2.5 rounded border border-[#e2e9dc]">
              TO THE FULLEST EXTENT PERMITTED BY LAW, CUSTOMER EXPRESSLY WAIVES ALL CLAIMS AND RELEASES HAULER, ITS OFFICERS, DRIVERS, EMPLOYEES, AND AGENTS FROM ANY AND ALL LIABILITY FOR DAMAGE TO DRIVEWAYS, ASPHALT, CONCRETE, BRICK PAVERS, CURBS, SIDEWALKS, LAWNS, TREES, UNDERGROUND IRRIGATION/SPRINKLER SYSTEMS, PVC PIPES, SEPTIC TANKS, DRAIN FIELDS, OR UTILITY MAINS RESULTING FROM PLACEMENT, LOADING, OR RETRIEVAL. CUSTOMER ASSUMES 100% OF RISK FOR OFF-PAVEMENT OR LAWN PLACEMENT.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[#1c2921] mb-1">
              2. Prohibited & Hazardous Materials Policy
            </h3>
            <p>
              Customer agrees that ONLY non-hazardous municipal solid waste, construction & demolition (C&D) debris, or household junk shall be deposited into the container. Under NO circumstances shall Customer place hazardous chemicals, toxic waste, wet paint, motor oils, car batteries, lithium batteries, asbestos, propane cylinders, medical waste, or unauthorized appliances.
            </p>
            <ul className="my-1.5 pl-4 list-disc space-y-0.5 text-[11px] text-[#6b3535]">
              {prohibitedItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <div className="mt-1.5 bg-[#fef2f2] border border-[#fecaca] p-2 rounded text-[#991b1b]">
              <b>FINES & PENALTIES:</b> If prohibited materials are discovered upon dumping, Customer agrees to pay a <b>$150.00 to $500.00</b> hazardous material surcharge per item, PLUS all landfill penalties and specialized remediation fees incurred by Hauler.
            </div>
          </div>

          <div>
            <h3 className="font-bold text-[#1c2921] mb-1">
              3. Dense Inert Materials & Hoist Lifting Capacity (Dirt, Concrete, Rock)
            </h3>
            <p>
              Due to extreme weight, dense materials including concrete, dirt, rock, brick, tile, sand, or sod are <b>STRICTLY PROHIBITED</b> in containers larger than 10 yards. In no circumstance shall total gross load exceed 10 tons (20,000 lbs). If a container exceeds the truck hoist lifting capacity or violates Department of Transportation (DOT) axle legal limits, Hauler cannot haul the container. <b>Customer is solely responsible for manually offloading excess weight at Customer’s expense prior to rescheduling pickup.</b>
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[#1c2921] mb-1">
              4. Weight Limits & Certified Scale Overage Authorization
            </h3>
            <p>
              This rental includes <b>{job.tons_included} tons</b> of disposal weight. All containers are weighed upon disposal on certified transfer station scale systems. Customer authorizes Hauler to automatically charge the payment method on file for any weight exceeding the included allowance at <b>{formatMoney(pricingRule.overage_per_ton_cents)} per ton</b> (pro-rated to the pound). Rain, snow, and ice absorb into debris and increase weight; weather-related weight remains Customer’s sole responsibility.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[#1c2921] mb-1">
              5. DOT Fill Level & Transportation Safety (“Water Level Rule”)
            </h3>
            <p>
              DOT regulations mandate that containers must be securely covered with a mechanical tarp during transit. Debris must NOT exceed the top lip of the container walls. Hauler drivers are prohibited by law from transporting overloaded containers. Drivers may refuse retrieval until the load is safely leveled, or assess an extra handling fee to safely adjust protruding debris.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[#1c2921] mb-1">
              6. Site Access & Dry Run Trip Fees
            </h3>
            <p>
              Customer guarantees clear, unobstructed access to the placement site between 6:00 AM and 8:00 PM on service days (minimum clearance: 10 ft wide and 14 ft vertical clearance). If access is blocked by parked cars, locked gates, snowbanks, or low wires, an automatic <b>$125.00 Dry Run Trip Fee</b> will be charged to Customer’s card on file, and service will be rescheduled.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[#1c2921] mb-1">
              7. Street Placement & Municipal Right-of-Way (ROW) Permits
            </h3>
            <p>
              If the container is placed on a public street, alley, easement, or municipal right-of-way, Customer warrants that Customer has acquired and paid for all required municipal ROW permits, parking variances, barricades, and reflectors. <b>Customer agrees to defend and indemnify Hauler against any city citations, parking fines, impound charges, or towing fees.</b>
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[#1c2921] mb-1">
              8. Rental Duration & Extensions
            </h3>
            <p>
              The container remains the exclusive property of Hauler. Customer must provide at least 24 hours advance notice to extend the rental beyond the scheduled pick-up date ({dateLabel(job.pickup_date)}). Additional days are billed at <b>{formatMoney(job.extra_day_cents || pricingRule.extra_day_cents)} per calendar day</b>.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[#1c2921] mb-1">
              9. Indemnification & Hold Harmless
            </h3>
            <p>
              Customer agrees to indemnify and hold harmless Hauler from any and all claims, lawsuits, or damages arising out of improper loading, unauthorized container movement, or prohibited waste placement. Customer shall NOT push, tow, or relocate the container with personal vehicles or heavy machinery.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[#1c2921] mb-1">
              10. Payment Authorization & Chargeback Waiver
            </h3>
            <p>
              Customer guarantees payment for all rental charges, weight overages, extra days, dry run fees, and landfill penalties. Customer grants express authorization for Hauler to charge the credit card, debit card, or payment method submitted at booking for post-service overages verified by scale tickets and timestamped photos.
            </p>
          </div>
        </div>

        {/* Signature & Audit Block */}
        <div className="mt-8 pt-6 border-t-2 border-[#1c2921]">
          <h2 className="text-xs font-black uppercase tracking-wider text-[#1c2921] mb-4">
            Executed Electronic Signatures & Audit Trail
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Customer Electronic Signature */}
            <div className="p-4 rounded-xl bg-[#f8faf7] border border-[#d2dec3]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#556658] mb-1">
                Customer Electronic Signature & Waiver Acceptance
              </div>
              <div
                className="text-xl font-serif italic font-bold text-[#1c2921] py-2 border-b border-[#cbd5c4]"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {signerName || job.customer_name}
              </div>
              <div className="mt-3 space-y-1 text-[11px] text-[#556658]">
                <div className="flex items-center justify-between">
                  <span>Signer Name:</span>
                  <strong className="text-[#1c2921]">{signerName || job.customer_name}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Signed Timestamp:</span>
                  <strong>{new Date(signerTimestamp).toLocaleString()}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Audit IP Address:</span>
                  <code className="bg-[#eef3e6] px-1.5 py-0.5 rounded text-[10px] text-[#1c2921]">
                    {signerIp}
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span>Waiver Status:</span>
                  {isSigned ? (
                    <strong className="text-[#166534] flex items-center gap-1">
                      <CheckCircle2 size={12} /> Verified Legally Binding E-Sign
                    </strong>
                  ) : (
                    <strong className="text-[#ea580c] flex items-center gap-1">
                      <AlertTriangle size={12} /> Pending Remote Customer Signature
                    </strong>
                  )}
                </div>
              </div>
            </div>

            {/* Hauler Counter-Signature Stamp */}
            <div className="p-4 rounded-xl bg-[#fafcf9] border border-[#d2dec3]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#556658] mb-1">
                Hauler Operations Execution Stamp
              </div>
              <div
                className="text-xl font-serif italic font-bold text-[#1c2921] py-2 border-b border-[#cbd5c4]"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {organization.name}
              </div>
              <div className="mt-3 space-y-1 text-[11px] text-[#556658]">
                <div className="flex items-center justify-between">
                  <span>Service Provider:</span>
                  <strong className="text-[#1c2921]">{organization.name}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Authorization:</span>
                  <strong>Automated Dispatch & Scheduling</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Booking Reference:</span>
                  <strong className="text-[#ea580c]">#{refCode}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Contract Audit ID:</span>
                  <span className="font-mono text-[10px]">{job.id.slice(0, 16)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Photographic Evidence & Scale Ticket Appendix (Unified Chargeback Defense Packet) */}
        {(job.proof_url || job.pickup_proof_url || job.scale_ticket_url) && (
          <div className="mt-8 pt-6 border-t-2 border-[#1c2921]">
            <div className="text-xs font-black uppercase tracking-wider text-[#1c2921] mb-2 flex items-center gap-2">
              <Camera size={15} className="text-[#ea580c]" />
              Photographic Evidence & Certified Scale Ticket Appendix
            </div>
            <p className="text-[11px] text-[#687864] mb-4">
              Verified operational field records documenting placement surface condition, retrieval condition, and disposal facility scale tickets for dispute defense.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {job.proof_url && (
                <div className="border border-[#cbd5c4] rounded-lg p-3 bg-[#fafcf9]">
                  <span className="text-[11px] font-bold text-[#1c2921] block mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-[#16a34a]" /> 1. Drop-Off / Placement Photo
                  </span>
                  <img
                    src={job.proof_url}
                    alt="Drop condition proof"
                    className="w-full h-40 object-cover rounded border border-[#e2e9dc]"
                  />
                  <span className="text-[10px] text-[#556658] block mt-1.5">
                    Driveway surface condition prior to drop
                  </span>
                </div>
              )}

              {job.pickup_proof_url && (
                <div className="border border-[#cbd5c4] rounded-lg p-3 bg-[#fafcf9]">
                  <span className="text-[11px] font-bold text-[#1c2921] block mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-[#16a34a]" /> 2. Pick-Up / Retrieval Photo
                  </span>
                  <img
                    src={job.pickup_proof_url}
                    alt="Pickup condition proof"
                    className="w-full h-40 object-cover rounded border border-[#e2e9dc]"
                  />
                  <span className="text-[10px] text-[#556658] block mt-1.5">
                    Driveway condition upon container retrieval
                  </span>
                </div>
              )}

              {job.scale_ticket_url && (
                <div className="border border-[#cbd5c4] rounded-lg p-3 bg-[#fafcf9]">
                  <span className="text-[11px] font-bold text-[#1c2921] block mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-[#16a34a]" /> 3. Certified Scale Ticket
                  </span>
                  <img
                    src={job.scale_ticket_url}
                    alt="Landfill scale ticket"
                    className="w-full h-40 object-cover rounded border border-[#e2e9dc]"
                  />
                  <span className="text-[10px] text-[#556658] block mt-1.5">
                    State-certified transfer station weight slip
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer legal note */}
        <div className="mt-8 pt-4 border-t border-[#e2e9dc] text-[10px] text-[#889886] text-center">
          Electronically generated and maintained by RollOS Roll Off Dumpster Software · Permanent audit ID {job.id}
        </div>
      </div>

      {/* Print-specific CSS */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .print-hide {
            display: none !important;
          }
          .agreement-wrapper {
            background: white !important;
            padding: 0 !important;
          }
          .agreement-document {
            border: none !important;
            box-shadow: none !important;
            max-width: 100% !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
