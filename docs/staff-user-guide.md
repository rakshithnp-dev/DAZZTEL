# HOTELYO - Staff Operations User Guide

## 1. Front-Desk Portal Overview
The staff portal provides front-office operations without paper forms.
- **Arrivals & Departures:** View expected guests for today, late arrivals, checked-in status, and pending balance.
- **Pre-Check-in Verification:** Review uploaded government ID documents and approve or reject with a single click.
- **Arrival OTP Check-in:** Ask the guest for their 6-digit cryptographic arrival OTP. Enter it into the front-desk console to complete check-in and issue the room access code.
- **Walk-in Bookings:** Select available beds from the live inventory grid, collect guest details, process payment or cash collection, and confirm immediately.
- **Guest Folio & Billing:** Inspect accommodation charges, marketplace add-ons (food/laundry), and collect final balances.
- **Day Close:** At the end of the operating day, review arrivals, departures, folio revenue, and gateway settlements before locking the day's revenue snapshot.

## 2. Housekeeping & Maintenance
- **Housekeeping:** Tasks generate automatically upon guest checkout. Mark beds as `CLEANING_IN_PROGRESS`, `CLEANED`, and `INSPECTED`. Beds cannot be assigned to arriving guests until inspected.
- **Maintenance:** Submit repair tickets for beds, fixtures, or plumbing. If a bed requires structural repair, flag it to create an automatic `MAINTENANCE_BLOCK` in inventory.
