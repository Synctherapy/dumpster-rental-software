# RollOS Growth Roadmap & Feature Backlog

This document captures high-value product, business, and expansion strategies to scale RollOS from \$2,000 to \$50,000+ MRR.

---

## 1. Growth Tier (\$149/mo) Expansion Features

Targeted at haulers running 3+ trucks or 30+ containers who want white-label operations and maximum customer capture.

### A. Missed-Call Instant SMS Text-Back
* **The Problem:** Haulers drive noisy diesel trucks with heavy gloves. When a prospect calls and reaches voicemail, 75%+ immediately hang up and call the next dumpster company on Google.
* **The Solution:** A Twilio voice webhook triggers an instant SMS whenever a call goes unanswered or busy:
  > *"Hey! I'm behind the wheel or delivering a container right now. Looking to rent a 10, 20, or 30-yard dumpster? Check availability and lock in your delivery date here in 60 seconds: [rent.haulername.com]"*
* **Value Proposition:** Saving just **1 rental per month (\$450)** pays for the entire \$149/mo plan 3x over.

### B. Custom White-Label Subdomain & CNAME (`rent.haulername.com`)
* Custom domain/subdomain mapping with automatic SSL certificate provisioning (via Vercel Domains API).
* Completely hides RollOS branding, displaying the hauler's company colors and logo.

### C. Commercial Contractor & Roofer VIP Portal (Net-30 / Quick Swap)
* Roofers and general contractors order 5–20 dumpsters every month.
* Features:
  - 1-click dumpster swap request (*"EmptyGL-014 and bring a new 20-yard to 1420 South Lamar"*).
  - Saved company credit cards or Net-30 invoice support.
  - Dedicated contractor volume discount tiers.

### D. Automated 2-Way Review Gatekeeper
* Expand the current Google Review SMS engine:
  - Text sent 2 hours after pickup.
  - Ratings 4–5 stars redirect straight to Google Maps review form.
  - Ratings 1–3 stars route to an internal private owner feedback box, protecting public Google reputation.

---

## 2. Winter & Off-Season Playbook (Keeping Haulers Busy & Preventing Churn)

In northern states (Midwest, Northeast, Canada), residential construction and roofing slow down between December and March. 

### A. Winter Services Pivot Feature
RollOS can allow haulers to configure seasonal container rental options during off-peak months:
* **Snow Plowing & Salting Dispatch:** Route and job tracking for commercial snow clearing.
* **Estate & Basement Cleanout Specials:** Automated winter promotion codes / email blast to past summer customers (*"Winter Basement & Garage Cleanout: \$50 off 10-yard bins"*).
* **Scrap Metal & Appliance Drop-offs:** Flat-rate junk removal bookings.

### B. "Winter Yard Hold" Subscription (\$10/mo or Freezed Plan)
* Rather than haulers cancelling their subscription in November and having to re-acquire them in April, offer a **Winter Yard Hold**:
  - Keeps their custom booking URL, customer data, and driver profiles active.
  - Pauses their dispatch seat fees until April 1st.
  - Retains customer loyalty and eliminates spring churn.

---

## 3. Regulatory & Compliance Architecture (Twilio A2P 10DLC)

* **Scope:** 10DLC registration is completed **once by RollOS** (as the SaaS platform).
* **Why it matters:** Guarantees that automated driver dispatch magic links and customer booking confirmations are not filtered or marked as spam by Verizon, AT&T, and T-Mobile.
* **Cost:** One-time \$15–\$20 carrier registration fee.
* **Action:** Register Brand + "Customer Care & Delivery Alerts" Campaign under RollOS LLC in the Twilio Console.
