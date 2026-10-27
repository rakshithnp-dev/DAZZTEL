# ADR-002: Database-Enforced Anti-Double-Booking and Inventory Invariants

## Status
Accepted

## Context
In hospitality platforms, simultaneous booking attempts on the same bed for the same night cause disastrous double bookings if concurrency control is handled only in application memory or Redis locks. Network partitions, worker crashes, or node restarts can lead to race conditions.

## Decision
1. We enforce inventory availability at the **PostgreSQL database level**.
2. We introduce the entity `BedNightAllocation`. Every bed reserved (whether in an active `HOLD`, a `CONFIRMED` booking, or an operational `MAINTENANCE_BLOCK`) must have a row for each calendar date of the stay.
3. PostgreSQL enforces a unique composite constraint:
   ```sql
   UNIQUE ("bedId", "calendarDate")
   ```
4. If two concurrent users attempt to hold or book the same bed for the same date, PostgreSQL throws a unique constraint violation (`23505`). The application catches this error and returns an HTTP 409 Conflict with a clear, user-facing error message suggesting alternate available beds.
5. Holds are created with a 10-minute expiry timestamp (`expiresAt`). A BullMQ background worker scans and releases expired holds every 60 seconds, deleting the temporary `BedNightAllocation` rows or transitioning them to `RELEASED`.

## Consequences
- **Positive:** Mathematically impossible to double-book a bed-night, regardless of frontend refreshes, simultaneous API requests, or server crashes.
- **Negative:** Requires creating N rows for an N-night stay, which is negligible in size for typical hostel stays (1-14 nights).
