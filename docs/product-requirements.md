# HOTELYO - Product Requirements Specification

## 1. Executive Summary
HOTELYO is an end-to-end, multi-property hostel hospitality management platform built specifically for the Indian market.
The platform enables guests to discover, book, pay for, pre-verify ID documents, check in with cryptographic OTP, access rooms via access codes, order marketplace services (food/laundry), and trigger emergency SOS assistance. Simultaneously, staff and property managers manage inventory, front-desk walk-ins, housekeeping, maintenance, and folios/billing from a single source of truth: the Property Management System (PMS).

## 2. Market & Regional Context
- **Market:** India
- **Currency:** Indian Rupee (INR) stored in integer minor units (paise)
- **Time Zone:** Configurable per property, defaulting to `Asia/Kolkata` (IST, UTC+05:30)
- **Language:** English (initial release)
- **Taxation:** Indian Goods & Services Tax (GST) with sequential invoice numbering per property per financial year
- **Specialized Inventory:** Approximately 50% of bed inventory reserved for touring motorcyclists (configurable per property), with bookable motorcycle parking and secure gear lockers.

## 3. Scope Boundaries

### Option A: Mandatory MVP
1. **Property Discovery & Search:** Location, dates, guests, motorcyclist preference, bike parking, gear lockers.
2. **Authoritative PMS Single Source of Truth:** Centralized rooms, beds, inventory blocks, reservations, and folios.
3. **Five-Screen Checkout:**
   - Screen 1: Stay Selection (dates, beds, room, parking, locker)
   - Screen 2: Guest Information (primary & group member details)
   - Screen 3: Review & Offers (transparent pricing, GST breakdown, cancellation policy, coupons)
   - Screen 4: Payment (Indian Gateway: UPI, cards, net banking)
   - Screen 5: Confirmation (booking reference, receipt, pre-arrival checklist)
4. **Booking Holds & Concurrency Protection:** 10-minute inventory holds with background release worker; database-enforced unique constraints per bed-night to prevent double bookings.
5. **Indian Payment Gateway & Refunds:** Verified signed webhooks, replay safety, partial/full refund support, daily gateway reconciliation.
6. **GST Invoices & Folios:** Immutable sequential tax invoices, credit notes for adjustments, day-close revenue lock.
7. **Pre-Check-In & ID Document Verification:** Private S3 storage, pre-signed expiring URLs, staff approval workflow.
8. **Cryptographic 6-Digit Arrival OTP:** Keyed-hash storage (HMAC-SHA256), 15-minute validity, 5 attempts max, 30-second cooldown, daily cap.
9. **Room Access Codes:** Time-bound, stay-bound, revoked within 60s of checkout/cancellation, manual desk fallback.
10. **Front-Desk PMS Operations:** Arrivals/departures dashboard, walk-in reservations, room changes, day-close summary.
11. **Operations Workflows:** Automatic housekeeping task generation, maintenance ticket queue with room blocking.
12. **Safety & SOS:** 1-click emergency button, delivery to on-duty staff within 5s, 2-minute escalation chain, national emergency fallback.
13. **Notifications:** SMS, Email, In-app notification delivery.
14. **PWA Platform:** Installable Progressive Web App with offline shell for SOS fallback and last booking.

### Option B: Mandatory Phase 1b Additions
1. **Coupons & Promotions:** Fixed/percentage discount rules, validity dates, minimum spend, usage caps, anti-stacking controls.
2. **Multi-Bed Group Bookings:** Single master reservation with individual guest detail tracking.
3. **Saved Payment Methods:** Gateway tokenized card/UPI reference management (zero PAN/CVV storage).
4. **Motorcycle Auto-Release Worker:** Configurable pre-arrival cutoff to release unsold motorcycle beds to general inventory without invalidating confirmed bookings.
5. **Visitor & Extended-Stay Access:** Authorized visitor passes and stay extensions with auditable access code lifecycles.
6. **Real-time Staff Updates:** Socket.IO WebSocket gateway with graceful polling fallback.
7. **Admin Analytics:** Occupancy rate, Bed utilization, RevPAB, RevPAR, gross vs. net revenue, cancellations and refund metrics.
8. **Web Push Notifications:** Firebase Cloud Messaging (FCM) integration.
9. **Marketplace & Food Ordering:** Property menus, guest ordering, vendor inbox with strict data isolation.
10. **Laundry Workflows:** Configurable laundry items, pickup/delivery tracking, folio charge integration.
11. **FAQ & Loyalty Ledger:** FAQ management and immutable loyalty points ledger (earn, redeem, reversal).

### Explicit Exclusions (Option C)
- Native mobile apps (iOS/Android).
- Physical NFC or RFID card door integrations.
- Multi-currency or non-English localizations.
- Dynamic pricing algorithms or channel manager integrations.
- Accounting software exports (Tally/Zoho/QuickBooks).
- WhatsApp Business API.
- Taxi, trekking, event, or tour guide booking.
