# HOTELYO - Assumptions and Open Questions

## 1. Document Purpose
This document formally records all engineering and business assumptions made during the design and implementation of HOTELYO (Option A + Option B Phase 1b), along with open questions requiring client clarification.

---

## 2. Documented Assumptions

### A. Inventory & Motorcycle Segment Allocation
1. **Assumption:** The motorcycle reserved segment applies to dormitory beds and designated private rooms. By default, 50% of the beds in designated dorms are tagged as `MOTORCYCLE_RESERVED`.
2. **Auto-Release Worker:** Eligible unsold motorcycle beds automatically release to general public inventory at 18:00 (property local time) 24 hours prior to the check-in date (configurable via `PropertySetting.motorcycleReleaseHoursBeforeCheckin`). Confirmed bookings are never modified or cancelled by this worker.
3. **Add-on Inventory:** Bike parking slots and gear lockers are modeled as distinct bookable resources linked to the property, preventing over-allocation.

### B. Financials, Currencies & GST
1. **Currency Representation:** All amounts are stored in INR minor units (integer paise, where 100 paise = 1 INR) to completely eliminate floating-point rounding errors.
2. **GST Rates:** Under Indian tax guidelines for budget hostels:
   - Below ₹1,000/night: 0% or standard slab per notification (configurable).
   - ₹1,001 to ₹7,500/night: 12% GST (6% CGST + 6% SGST, or 12% IGST for interstate).
   - Food/Marketplace: 5% without ITC.
   - Rates are modeled as configurable tax rules in `PropertySetting` and `RatePlan` rather than hardcoded constants.
3. **Invoice Numbering:** Sequential format: `INV/{PropertyCode}/{FinancialYear}/{SequentialNumber:05d}` (e.g., `INV/GOA01/2026-27/00042`).
4. **Day-Close Financial Lock:** Once a business day is closed by an authorized property manager, folio charges and revenue figures for that date are locked into an immutable snapshot. Any subsequent adjustments require a formal Credit Note or Debit Adjustment entry.

### C. Security, OTP & Access Codes
1. **Arrival OTP:** A 6-digit cryptographic numeric OTP generated via `crypto.randomInt(100000, 999999)`. Plaintext is never stored in the database or logs; only an HMAC-SHA256 keyed hash is persisted. Attempt counter is capped at 5; validity is 15 minutes.
2. **Access Codes:** Represented by an abstraction layer (`AccessCodeService`). In Option A/B, delivery is manual/keypad or staff front-desk entry. Codes are automatically revoked in the database within 60 seconds upon guest checkout or cancellation.

### D. Concurrency & Anti-Double-Booking
1. **Bed-Night Allocation Table:** Double booking is strictly prevented at the database level by the `BedNightAllocation` table with a composite unique index: `UNIQUE(bedId, calendarDate)`.
2. **Booking Holds:** 10-minute validity. A row in `BedNightAllocation` with status `HOLD` reserves the bed-night. If checkout is not completed within 10 minutes, the background hold-cleanup worker expires the hold and frees the row.

---

## 3. Open Questions Requiring Client Confirmation

| Q# | Area | Question | Default / Fallback Chosen in Implementation |
|---|---|---|---|
| **Q1** | GST | Does the client property hold an active GSTIN, and is composition scheme applicable, or standard forward-charge GST? | Defaulting to standard GST (CGST+SGST/IGST breakdown) with configurable rates per property. |
| **Q2** | Pre-Check-in ID | Which photo ID types are accepted (Aadhaar, Passport, Driving License, Voter ID)? For Indian citizens, is Aadhaar masking required? | Implementing front/back document upload with explicit masking guidance and encrypted private storage. |
| **Q3** | Food Payment | Should food and laundry orders be added directly to the guest's folio (settled at checkout) or prepaid immediately via gateway? | Folio charge default for checked-in guests, with property-level toggle `allowFolioPost`. |
| **Q4** | Loyalty Rules | What is the exact earn and redemption ratio (e.g., 1 point per ₹100 spent; 1 point = ₹1 value)? | Configurable ledger rule: 1 point earned per ₹50 accommodation spend; 1 point = ₹1 redemption value, max 20% order discount. |
| **Q5** | Group Cancellation | Can an individual bed in a group booking be cancelled independently by a member, or only by the master organizer? | Only master group organizer or front-desk staff can alter or cancel group booking beds. |
