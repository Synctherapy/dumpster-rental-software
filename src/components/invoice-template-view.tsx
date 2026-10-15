'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Copy,
  Check,
  Printer,
  ArrowRight,
  Scale,
  Receipt,
  ShieldCheck,
  AlertCircle,
  FileText,
  CheckCircle2,
  DollarSign,
  Clock,
  TrendingUp,
  CreditCard,
  Building2,
  Camera,
} from 'lucide-react';

export const FULL_INVOICE_TEXT = `================================================================================
                    COMMERCIAL ROLL-OFF INVOICE & SCALE AUDIT
================================================================================

HAULER / SERVICE PROVIDER:
Company Name:      [YOUR DUMPSTER COMPANY NAME, LLC]
Operating Address: [100 INDUSTRIAL PARKWAY, SUITE A, CITY, STATE, ZIP]
Dispatch Phone:    [(555) 019-2834]
Billing Email:     [billing@yourdumpstercompany.com]
DOT Number:        [USDOT 3928104]
State Tax ID:      [XX-XXXXXXX]

================================================================================
INVOICE DETAILS & TERMS:
================================================================================
Invoice Number:    INV-2026-08492
Invoice Date:      October 14, 2026
Service Drop Date: October 02, 2026 (08:30 AM EST)
Service Pick Date: October 12, 2026 (02:15 PM EST)
Payment Terms:     Due Upon Receipt (Card on File) / Net 30 Commercial
Payment Method:    Visa ending in •••• 4242 (Stripe Pre-Authorized)
Dispatch Order #:  RO-77194

================================================================================
BILL TO (CONTRACTOR / CUSTOMER):
================================================================================
Customer Name:     David Miller
Company:           Miller Residential Renovations LLC
Billing Address:   4520 West End Blvd, Suite 210, City, State, ZIP
Phone:             (555) 438-9210
Email:             dmiller@millerrenovations.com

JOBSITE / DROP-OFF ADDRESS:
Jobsite Location:  1842 Sycamore Creek Lane, City, State, ZIP
Placement Notes:   Right side of driveway on wood boards. Overhead wires clear.
Container Serial:  RO-20YD-044

================================================================================
ITEMIZED SERVICES & DISPOSAL ACCOUNTING:
================================================================================
ITEM DESCRIPTION                           QTY    RATE           AMOUNT
--------------------------------------------------------------------------------
1. Base Roll-Off Container Rental          1 EA   $425.00        $425.00
   • Container Size: 20 Yard Open-Top Roll-Off
   • Included Rental Duration: 7 Calendar Days
   • Included Disposal Allowance: 2.00 Tons (4,000 lbs)
   • Drop & Retrieval Service Included

2. Extended Rental Period                  3 DAYS $20.00/day     $60.00
   • Days Exceeded Included 7-Day Window
   • Extension Dates: Oct 10, Oct 11, Oct 12, 2026

3. Certified Landfill Tonnage Overage      1.86 TN $85.00/ton    $158.10
   -------------------------------------------------------------------------
   CERTIFIED LANDFILL SCALE SLIP RECORD:
   • Disposal Facility: Metro Transfer Station & County Resource Recovery
   • Certified Scale Ticket #: SLIP-984210
   • Disposal Date & Time: October 12, 2026 - 03:08 PM EST
   • State Scale Certification #: DEPT-WM-55829
   • Gross Vehicle Weight (Inbound):  31,840 lbs (15.92 tons)
   • Tare Vehicle Weight (Outbound):  24,120 lbs (12.06 tons)
   • Net Waste Disposed:               7,720 lbs  (3.86 tons)
   • Included Base Weight Allowance:   4,000 lbs  (2.00 tons)
   -------------------------------------------------------------------------
   • Billable Overage (Net - Base):    3,720 lbs  (1.86 tons)
   • Billed Rate: $85.00/ton (pro-rated to exact pound: $0.0425/lb)

4. Site Access / Blocked Run Fee (if app.) 0 EA   $125.00        $0.00
   • Clear site access verified at drop-off and pickup

5. Prohibited Waste Remediation (if app.)  0 EA   $250.00        $0.00
   • Visual inspection clean; no hazardous items, tires, or liquids detected
--------------------------------------------------------------------------------
SUBTOTAL:                                                        $643.10
State / Local Waste Surcharge & Franchise Fee (4.5%):             $28.94
--------------------------------------------------------------------------------
TOTAL INVOICE AMOUNT:                                            $672.04
================================================================================

================================================================================
PAYMENT & TRANSACTION SUMMARY:
================================================================================
Date         Description                                   Status         Amount
--------------------------------------------------------------------------------
10/02/2026   Initial Booking Authorization / Base Rental   PAID (Stripe) -$444.13
             (Base Rental $425.00 + $19.13 Tax/Fee)
10/12/2026   Post-Disposal Scale Overage & Extra Days      PAID (Stripe) -$227.91
             (Overage $158.10 + 3 Days $60.00 + $9.81 Tax)
--------------------------------------------------------------------------------
FINAL BALANCE DUE:                                                         $0.00
================================================================================

DISPUTE-PROOF LEGAL & SCALE AUDIT NOTE:
"All waste was weighed on state-certified, weights-and-measures inspected scales. Timestamped scale receipt and driveway delivery/pickup photos are attached to this electronic record. Under the terms of the Dumpster Rental Agreement, overages are pro-rated and charged to the payment method on file."

ATTACHMENTS ON FILE IN DIGITAL AUDIT TRAIL:
[X] 1. Timestamped Delivery Placement Photo (Driveway condition pre-drop: Clear)
[X] 2. Timestamped Pickup Retrieval Photo (Driveway condition post-pull: Clear)
[X] 3. Scanned Certified Scale Ticket (Metro Transfer Station Ticket #SLIP-984210)
[X] 4. Signed Dumpster Rental Agreement & Damage Waiver (E-Signed Oct 02, 2026)

Thank you for your business. For billing questions or commercial Net-30 credit terms, contact billing@yourdumpstercompany.com or call (555) 019-2834.`;

export function InvoiceTemplateView() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(FULL_INVOICE_TEXT);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
        return;
      }
      throw new Error('Clipboard API unavailable');
    } catch {
      // Fallback for browsers/contexts without navigator.clipboard
      try {
        const textarea = document.createElement('textarea');
        textarea.value = FULL_INVOICE_TEXT;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (successful) {
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
          return;
        }
      } catch {
        // Fallback failed
      }
      setCopied(false);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="my-8">
      {/* Action Toolbar */}
      <div className="print-hide flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-[#dde4d4] rounded-xl shadow-sm mb-6">
        <div className="flex items-center gap-2">
          <Receipt size={20} className="text-[#ea580c]" />
          <span className="text-sm font-bold text-[#1f2d26]">
            Itemized Commercial Roll-Off Invoice Template
          </span>
          <span className="pill text-xs font-semibold bg-[#eef3e6] text-[#4f6b3b]">
            Updated for 2026
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy full invoice text to clipboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ea580c] text-white text-xs font-bold hover:bg-[#c2410c] transition-colors shadow-sm cursor-pointer"
          >
            {copied ? (
              <span className="inline-flex items-center gap-1.5" aria-live="polite">
                <Check size={14} className="text-white" /> Copied to Clipboard!
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <Copy size={14} /> Copy Full Invoice Text
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            aria-label="Print or save invoice template as PDF"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#f0f4ea] text-[#2f4233] text-xs font-bold hover:bg-[#e4ebdb] transition-colors border border-[#cbd5c4] cursor-pointer"
          >
            <Printer size={14} /> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Invoice Viewer Box */}
      <div
        role="region"
        aria-label="Commercial Dumpster Rental Invoice Template"
        tabIndex={0}
        className="invoice-viewer-box relative p-6 md:p-8 bg-[#fafcf9] border border-[#d6dfce] rounded-xl font-mono text-xs md:text-sm text-[#2d3a31] leading-relaxed whitespace-pre-wrap shadow-inner overflow-x-auto selection:bg-[#fed7aa] focus:outline-none focus:ring-2 focus:ring-[#ea580c]/50"
      >
        {FULL_INVOICE_TEXT}
      </div>

      {/* In-Depth Hauler Educational Sections */}
      <div className="print-hide mt-14 space-y-12">
        {/* Section 1 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-[#ffedd5] text-[#ea580c]">
              <ShieldCheck size={22} />
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#ea580c]">
                Chargeback Defense & Scale Verification
              </span>
              <h2 className="text-2xl font-extrabold text-[#1f2d26]">
                Section 1: The Anatomy of a Dispute-Proof Dumpster Invoice
              </h2>
            </div>
          </div>
          <p className="text-sm text-[#556658] leading-relaxed">
            When a homeowner or contractor rents a 20-yard roll-off container, they frequently assume their debris fits well under the included weight limit. But when demolition plaster, soaked roofing felt, or concrete tile tips the scales at 3.86 tons, an unexpected $158 overage charge often triggers a credit card dispute. Without strict, verifiable proof, merchant processors (Visa, Mastercard, and American Express) routinely side with the cardholder under claims of unauthorized or incorrect billing.
          </p>
          <p className="text-sm text-[#556658] leading-relaxed">
            To make your dumpster invoice bulletproof against merchant chargebacks, your invoice must document four non-negotiable data points:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-white border border-[#dde4d4] rounded-xl shadow-sm">
              <h3 className="text-sm font-bold text-[#1f2d26] mb-1.5 flex items-center gap-2">
                <Scale size={16} className="text-[#ea580c]" />
                1. Certified Landfill Scale Slip Number & Weights
              </h3>
              <p className="text-xs text-[#687864] leading-relaxed">
                Never summarize waste with just a single “overage: $158.10” line item. Banks demand proof that scales were calibrated by state weights-and-measures departments. Documenting the facility name, ticket number, gross inbound weight (31,840 lbs), and tare outbound weight (24,120 lbs) establishes an indisputable chain of custody.
              </p>
            </div>

            <div className="p-4 bg-white border border-[#dde4d4] rounded-xl shadow-sm">
              <h3 className="text-sm font-bold text-[#1f2d26] mb-1.5 flex items-center gap-2">
                <Camera size={16} className="text-[#ea580c]" />
                2. Timestamped Delivery & Pickup Photos
              </h3>
              <p className="text-xs text-[#687864] leading-relaxed">
                Disputed overage claims are often accompanied by false property damage claims or disputes about service dates. Attaching timestamped GPS-tagged delivery photos (showing placement condition) and retrieval photos (showing the loaded bin) closes the loop and proves the container was delivered and retrieved as billed.
              </p>
            </div>

            <div className="p-4 bg-white border border-[#dde4d4] rounded-xl shadow-sm">
              <h3 className="text-sm font-bold text-[#1f2d26] mb-1.5 flex items-center gap-2">
                <DollarSign size={16} className="text-[#ea580c]" />
                3. Mathematical Pro-Rated Transparency
              </h3>
              <p className="text-xs text-[#687864] leading-relaxed">
                Always show the arithmetic clearly: <code>(Net Weight - Included Tons) × Per-Ton Rate</code>. When customers see that 3,720 lbs converts directly to 1.86 tons at $85.00/ton ($0.0425/lb), confusion dissolves. Transparent itemization removes the emotional sticker shock that causes angry phone calls. You can verify net weights beforehand on our free{' '}
                <Link
                  href="/tools/tonnage-calculator"
                  className="text-[#ea580c] font-semibold underline hover:text-[#c2410c]"
                >
                  dumpster tonnage calculator
                </Link>{' '}
                to ensure zero customer billing disputes.
              </p>
            </div>

            <div className="p-4 bg-white border border-[#dde4d4] rounded-xl shadow-sm">
              <h3 className="text-sm font-bold text-[#1f2d26] mb-1.5 flex items-center gap-2">
                <FileText size={16} className="text-[#ea580c]" />
                4. Pre-Authorized Agreement Cross-Reference
              </h3>
              <p className="text-xs text-[#687864] leading-relaxed">
                Your invoice must reference the signed rental agreement and quote the specific overage clause authorizing post-disposal card billing (see our free{' '}
                <Link
                  href="/templates/dumpster-rental-contract"
                  className="text-[#ea580c] font-semibold underline hover:text-[#c2410c]"
                >
                  dumpster rental contract template
                </Link>
                ). In the event of a dispute, submitting the invoice alongside the signed digital waiver wins merchant representation over 94% of the time.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-4 pt-4 border-t border-[#e2e8da]">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-[#eef3e6] text-[#2d4034]">
              <Building2 size={22} />
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#577242]">
                Commercial vs Residential Billing Workflows
              </span>
              <h2 className="text-2xl font-extrabold text-[#1f2d26]">
                Section 2: Residential Upfront Card Authorization vs Commercial Net-30 Billing
              </h2>
            </div>
          </div>
          <p className="text-sm text-[#556658] leading-relaxed">
            A major mistake made by growing haulers is treating residential DIY homeowners and commercial general contractors with the same payment process. These customer segments operate under completely different financial frameworks:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Residential Card Authorization */}
            <div className="p-5 bg-white border border-[#dde4d4] rounded-xl shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-[#ea580c]" />
                <h3 className="text-base font-bold text-[#1f2d26]">Residential: Upfront Card Authorization</h3>
              </div>
              <p className="text-xs text-[#556658] leading-relaxed">
                Homeowners should <strong>never</strong> be extended credit or invoiced after container retrieval without a credit card pre-authorization on file. Once the dumpster is removed from their driveway, your leverage drops to zero.
              </p>
              <ul className="space-y-2 text-xs text-[#415346]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#22c55e] shrink-0 mt-0.5" />
                  <span><strong>Phase 1 (Booking):</strong> Collect base rental rate ($425) via Stripe with explicit authorization to store card credentials for post-rental overages.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#22c55e] shrink-0 mt-0.5" />
                  <span><strong>Phase 2 (Disposal):</strong> Immediately charge the card on file within 2 hours of scale ticket recording, sending the finalized paid receipt automatically.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#22c55e] shrink-0 mt-0.5" />
                  <span><strong>No Paper Checks:</strong> Avoid cash or checks for residential jobs—insufficient funds and stop-payments leave haulers holding disposal fees.</span>
                </li>
              </ul>
            </div>

            {/* Commercial Net-30 */}
            <div className="p-5 bg-white border border-[#dde4d4] rounded-xl shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-[#577242]" />
                <h3 className="text-base font-bold text-[#1f2d26]">Commercial: Structured Net-30 Terms</h3>
              </div>
              <p className="text-xs text-[#556658] leading-relaxed">
                Roofers, framers, and commercial general contractors require Net-30 terms to align with their owner draw schedules. However, commercial accounts will hold up entire $10,000 monthly statements if a single $150 overage lacks documentation.
              </p>
              <ul className="space-y-2 text-xs text-[#415346]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#22c55e] shrink-0 mt-0.5" />
                  <span><strong>PO & Jobsite Cost-Coding:</strong> Always include the contractor’s Purchase Order number and specific job address so their project manager can allocate costs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#22c55e] shrink-0 mt-0.5" />
                  <span><strong>Direct Scale Attachment:</strong> Commercial accounts payable departments require verified scale tickets stapled or digitally linked to release payment.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#22c55e] shrink-0 mt-0.5" />
                  <span><strong>Automated Late Reminders:</strong> Implement automated 7-day, 14-day, and 30-day payment reminders to avoid chasing accounts receivable manually.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-4 pt-4 border-t border-[#e2e8da]">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-[#fee2e2] text-[#dc2626]">
              <TrendingUp size={22} />
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#dc2626]">
                The Cost of Manual Paperwork
              </span>
              <h2 className="text-2xl font-extrabold text-[#1f2d26]">
                Section 3: Why Independent Haulers Lose $15,000+/Year on Manual Invoicing
              </h2>
            </div>
          </div>
          <p className="text-sm text-[#556658] leading-relaxed">
            Most independent roll-off operators with 1 to 5 trucks start out managing invoices on Excel spreadsheets, Word templates, or generic QuickBooks forms. While this feels free, it is quietly one of the most expensive operational leaks in waste management:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 bg-white border border-[#dde4d4] rounded-xl shadow-sm">
              <h3 className="text-sm font-bold text-[#1f2d26] mb-2 flex items-center gap-2">
                <Clock size={16} className="text-[#ea580c]" />
                The &ldquo;Dashboard Slip&rdquo; Delay
              </h3>
              <p className="text-xs text-[#687864] leading-relaxed">
                Drivers toss paper scale tickets into a cup holder or truck visor. By the time tickets are transcribed on Sunday evening, 10–14 days have elapsed. Customers question delayed charges, and card authorizations often expire or get declined.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#dde4d4] rounded-xl shadow-sm">
              <h3 className="text-sm font-bold text-[#1f2d26] mb-2 flex items-center gap-2">
                <AlertCircle size={16} className="text-[#ea580c]" />
                Tonnage Overage Leakage
              </h3>
              <p className="text-xs text-[#687864] leading-relaxed">
                When manual calculations take 10 minutes per haul, busy owners frequently let &ldquo;small&rdquo; overages slide (e.g., 0.4 tons = $34). Across 400 hauls per year, forgiving just $35 in unbilled disposal equals <strong>$14,000 in pure margin given away to transfer stations</strong>.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#dde4d4] rounded-xl shadow-sm">
              <h3 className="text-sm font-bold text-[#1f2d26] mb-2 flex items-center gap-2">
                <Receipt size={16} className="text-[#ea580c]" />
                Transcription & Scale Math Errors
              </h3>
              <p className="text-xs text-[#687864] leading-relaxed">
                Manually converting gross vehicle weights (31,840 lbs) and tare weights (24,120 lbs) into short tons and deducting allowances invites typo errors. A single misplaced decimal point causes contractor mistrust and delays thousands in invoice approvals.
              </p>
            </div>
          </div>
        </section>

        {/* Reverse Silo Callout Box */}
        <div className="p-8 bg-[#eef3e6] border border-[#d2dec3] rounded-2xl text-center my-10 shadow-sm">
          <div className="eyebrow text-xs font-bold text-[#577242] uppercase tracking-wider mb-2">
            AUTOMATE SCALE SLIPS & INVOICING
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-[#1f2d26] mb-3">
            Stop Calculating Overage Invoices by Hand
          </h3>
          <p className="text-sm text-[#556658] max-w-2xl mx-auto mb-6 leading-relaxed">
            RollOS eliminates manual invoicing entirely. Instead of running scale math manually on paper slips, independent haulers use our automated{' '}
            <Link
              href="/features/tonnage-billing"
              className="font-bold text-[#1f2d26] underline decoration-[#ea580c] hover:text-[#ea580c] transition-colors"
            >
              dumpster tonnage billing software
            </Link>
            . When your driver drops at the landfill, they snap a single smartphone photo of the certified scale slip. RollOS automatically computes exact poundage overages, links the ticket to your{' '}
            <Link
              href="/templates/dumpster-rental-contract"
              className="font-bold text-[#1f2d26] underline decoration-[#ea580c] hover:text-[#ea580c] transition-colors"
            >
              dumpster rental contract template
            </Link>
            , and charges the customer&apos;s pre-authorized card on file via Stripe.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/features/tonnage-billing"
              className="btn btn-orange text-xs md:text-sm font-bold px-5 py-3 inline-flex items-center gap-2"
            >
              dumpster tonnage billing software <ArrowRight size={15} />
            </Link>
            <Link
              href="/tools/tonnage-calculator"
              className="btn btn-secondary text-xs md:text-sm font-bold px-5 py-3"
            >
              dumpster tonnage calculator
            </Link>
            <Link
              href="/templates/dumpster-rental-contract"
              className="btn btn-secondary text-xs md:text-sm font-bold px-5 py-3"
            >
              dumpster rental contract template
            </Link>
            <Link
              href="/pricing"
              className="btn btn-dark text-xs md:text-sm font-bold px-5 py-3"
            >
              View Simple Pricing
            </Link>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          nav,
          header,
          footer,
          .marketing-nav,
          .print-hide {
            display: none !important;
          }
          .invoice-viewer-box {
            border: none !important;
            background: white !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            font-size: 9.5pt !important;
            line-height: 1.35 !important;
            color: black !important;
            overflow: visible !important;
            white-space: pre-wrap !important;
          }
        }
      `}</style>
    </div>
  );
}
