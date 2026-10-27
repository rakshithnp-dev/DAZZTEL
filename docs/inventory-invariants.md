# HOTELYO - Inventory Invariants and Concurrency Rules

## 1. Single Source of Truth: PMS Inventory Core
The PMS is the sole authority on room and bed inventory. No external cache, Redis key, or client session can maintain an authoritative copy of inventory status.

## 2. Bed-Night Allocation Invariants
1. **Mathematical Invariant:**
   For any physical Bed $B$ and Calendar Date $D$, there can exist at most one active record in `BedNightAllocation` where status is in `('HOLD', 'CONFIRMED', 'MAINTENANCE_BLOCK')`.
2. **Database Constraint:**
   ```sql
   CREATE UNIQUE INDEX idx_bed_night_active 
   ON "BedNightAllocation" ("bedId", "calendarDate") 
   WHERE "status" IN ('HOLD', 'CONFIRMED', 'MAINTENANCE_BLOCK');
   ```
3. **Double Booking Attempt Response:**
   Any overlapping insert triggers PostgreSQL error `23505 (unique_violation)`. The application handles this exception by rolling back the transaction and responding with:
   - HTTP Status: `409 Conflict`
   - Error Code: `DOUBLE_BOOKING_CONFLICT`
   - User Payload: List of remaining available alternative beds for the requested date range.

## 3. Hold Expiry Invariants
1. **10-Minute Lifetime:**
   Holds carry `expiresAt = createdAt + 10 minutes`.
2. **Hold Cleanup Worker:**
   Runs continuously every 30-60 seconds. Performs:
   ```sql
   UPDATE "BedNightAllocation" 
   SET "status" = 'RELEASED' 
   WHERE "status" = 'HOLD' AND "expiresAt" < NOW();
   ```
3. **Safe Lateness:** If a payment webhook arrives right after hold expiry (clock skew or worker delay), the booking confirmation checks if the bed was re-allocated. If re-allocated, the payment is captured and immediately flagged for automatic full refund and administrative alert.

## 4. Motorcyclist Reserved Segment Invariants
1. **Configurable Ratio:**
   By default, 50% of beds in designated rooms are assigned segment `MOTORCYCLE_RESERVED`.
2. **Auto-Release Worker (Option B):**
   At a configurable cutoff (default: 24 hours prior to check-in date at 18:00 local time), any unsold bed in `MOTORCYCLE_RESERVED` status is released to general inventory for that date.
3. **Safety Rule:** Confirmed bookings in the motorcycle segment are never modified or cancelled by the auto-release worker.
