# HOTELYO - Threat Model (STRIDE Methodology)

## 1. Overview & Trust Boundaries
This threat model assesses HOTELYO across all trust boundaries:
- Public Internet <-> API Gateway
- Guest Web App <-> Staff / Admin Operations
- Backend API <-> PostgreSQL / Redis
- Backend API <-> Third-Party Payment Gateway & S3 Storage

## 2. Threat Analysis by Category

| STRIDE Category | Threat Description | Vulnerable Surface | Mitigation Implemented |
|---|---|---|---|
| **Spoofing** | Attacker impersonates guest or staff member to access bookings or check in | `/api/v1/auth/*`, OTP verification | Argon2id password hashing; short-lived JWT (15m); cryptographic 6-digit OTP stored as keyed HMAC hash with 5-attempt lockout. |
| **Tampering** | Attacker modifies bed price, discount, or payment status during checkout | Five-screen checkout; Webhook callbacks | Server-calculated authoritative pricing; client prices rejected; signed webhook HMAC-SHA256 signature verification with secret key. |
| **Repudiation** | Staff member claims they did not verify document or approve unauthorized refund | Front-desk operations; Refunds; Day Close | Append-only `AuditLog` table capturing actor ID, IP address, user agent, timestamp, before/after JSON diffs; sequential immutable GST invoices. |
| **Information Disclosure** | Unauthorized guest views another guest's government ID or room access code | Document storage; `/api/v1/access-codes/*` | Private S3 buckets with expiring pre-signed URLs (5m TTL); access codes restricted to verified checked-in guests of that specific bed; secrets excluded from logs. |
| **Denial of Service** | Bot flooding availability search or OTP endpoints exhausts SMS/DB resources | `/api/v1/availability/*`; `/api/v1/check-in/otp/request` | Rate limiting per IP and user account; 30s resend cooldown; 5 daily OTP generation cap per stay; connection pooling. |
| **Elevation of Privilege** | Vendor or front-desk staff attempts cross-property or administrative changes | Staff & Admin API endpoints | Strict server-side RBAC guards; property scoping enforcement in every SQL query (`property_id = :activePropertyId`); vendor queries strictly scoped to `vendor_id`. |

## 3. Concurrency Threats
- **Double Booking Race Condition:** Two users click pay at the exact same millisecond for the last bed in a dorm.
  - *Mitigation:* Database-enforced composite unique constraint on `BedNightAllocation(bedId, calendarDate)` inside an explicit database transaction.
