# HOTELYO - Option A Acceptance Verification Checklist

| Area | Acceptance Criterion | Verification Method | Status |
|---|---|---|---|
| **Inventory** | Bed inventory cannot be double-booked under concurrent attempts | PostgreSQL unique index `idx_bed_night_active` verified with concurrent test | Ready |
| **Holds** | 10-minute inventory holds release automatically on expiry | Hold cleanup worker verified in unit & integration tests | Ready |
| **Checkout** | 5-screen guest checkout operates with server-authoritative pricing | Playwright E2E scenario 3 passes | Ready |
| **Payments** | Gateway webhooks verified via HMAC-SHA256 signature; replay-safe | Mock webhook replay test passes | Ready |
| **Invoicing** | Sequential GST tax invoices per FY; immutable day close | Sequential numbering and day close lock verified | Ready |
| **Arrival** | 6-digit cryptographic OTP challenge; max 5 attempts; 15m expiry | Crypto OTP unit test and E2E scenario 10-11 pass | Ready |
| **Access** | Room access codes revoked within 60s of checkout | Access code revocation unit test and E2E scenario 12 pass | Ready |
| **PMS** | Front-desk dashboard displays arrivals, departures, walk-in bookings | Front-desk PMS dashboard verified | Ready |
| **Operations** | Housekeeping tasks generated on checkout; maintenance bed blocking | Operations workflow verified in tests | Ready |
| **Safety** | SOS alert delivered to staff; 2-minute escalation chain operational | SOS escalation worker verified in tests | Ready |
| **PWA** | Installable PWA with offline shell displaying last booking summary | Web manifest and service worker verified | Ready |
