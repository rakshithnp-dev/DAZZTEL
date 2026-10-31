# HOTELYO MASTER IMPLEMENTATION PLAN
## Multi-Property Hostel Hospitality Platform (Option A MVP + Option B Phase 1b)

---

## 1. ARCHITECTURE & REPOSITORY TOPOLOGY

```
HOTELYO/
├── .agents/
│   ├── rules.md                     # Architectural & Governance Rules (SST, concurrency, DPDP)
│   └── subagents/
│       ├── db-architect.md          # Database schema, migrations, triggers, constraints
│       ├── pms-backend.md           # NestJS modules, BullMQ workers, financial engine
│       ├── pwa-frontend.md          # Next.js PWA, offline shell, 7 user portals
│       └── qa-verifier.md           # Concurrency, E2E, load, and traceability tests
├── apps/
│   ├── api/                         # NestJS Modular Monolith (/api/v1)
│   │   └── src/modules/
│   │       ├── iam/                 # Auth, RBAC, Sessions, DPDP Consent & Export
│   │       ├── property-inventory/  # Properties, Rooms, Beds (50% Moto), Lockers, Bays
│   │       ├── booking-engine/      # State machine, 10m holds, Coupons, Groups
│   │       ├── payments-billing/    # Razorpay/Cashfree HMAC, Invoices, Credit Notes
│   │       ├── arrival-access/      # Encrypted ID Vault, CSPRNG Arrival OTP, Door PINs
│   │       ├── pms-core/            # Front Desk, Folios, Cashiering, Day Close
│   │       ├── operations/          # Housekeeping tasks, Maintenance, Socket.IO
│   │       ├── safety-sos/          # SOS <5s SLA, 2-min BullMQ escalation, 112 offline
│   │       ├── marketplace/         # Food & Laundry with strict VENDOR isolation
│   │       └── engagement/          # Ratings, FAQs, Double-Entry Loyalty Ledger
│   ├── guest-web/                   # Next.js PWA for Guests & Group Organisers (Port 3003)
│   ├── staff-web/                   # Next.js PMS for Front Desk & Housekeeping (Port 3001)
│   └── admin-web/                   # Next.js HQ for Property Managers & Admins (Port 3002)
├── packages/
│   ├── database/                    # Prisma Schema, Custom SQL Migrations, Triggers
│   ├── contracts/                   # Shared DTOs, Zod Schemas, IRoomAccessProvider
│   ├── shared-types/                # Shared TypeScript models and enums
│   ├── ui/                          # WCAG 2.1 AA accessible UI component library
│   └── validation/                  # Common validation helpers
├── tests/
│   ├── concurrency/                 # 50-request parallel hold test (409 Conflict)
│   ├── e2e-playwright/              # Flows 1 to 5 (Motorcyclist, Group, SOS, Parity)
│   └── load-k6/                     # 200–500 concurrent user load test scripts
├── docker-compose.yml               # PostgreSQL 17, Redis 7, MinIO S3, NestJS API
├── turbo.json                       # Turborepo task pipeline
└── IMPLEMENTATION_PLAN.md           # This master document
```

---

## 2. DATABASE SCHEMA MAPPING (OPTION A + OPTION B)

### 2.1 IAM, Security & DPDP Compliance
| Table Name | Description | Key Constraints / Indexes |
| :--- | :--- | :--- |
| `users` | Primary user identity (guests, staff, vendors, admins) | `email UNIQUE`, `phone UNIQUE` |
| `roles` | 7 system roles (`GUEST`, `FRONT_DESK`, etc.) | `code UNIQUE` |
| `permissions` | Granular action permissions | `code UNIQUE` |
| `role_permissions` | Role-to-permission mapping | `PRIMARY KEY (role_id, permission_id)` |
| `user_property_roles` | Multi-property scoped staff assignments | `INDEX (user_id, property_id)` |
| `sessions` | Active sessions with rotating refresh tokens | `refresh_token_hash UNIQUE`, `expires_at` |
| `mfa_secrets` | TOTP secret keys for staff/admin 2FA | Encrypted at rest |
| `otp_challenges` | Short-lived auth & login OTPs | Rate-limited (30s cooldown) |
| `dpdp_consents` | Versioned India DPDP consent logs | `INDEX (user_id, consent_version)` |
| `dpdp_data_requests` | Export & deletion request pipeline | `status` (`PENDING`, `COMPLETED`) |
| `feature_flags` | Option B/C runtime feature flags | `flag_key UNIQUE` |
| `audit_logs` | Append-only tamper-evident audit ledger | **Trigger forbidding UPDATE/DELETE** |

### 2.2 Property, Inventory & Motorcyclist Allocation
| Table Name | Description | Key Constraints / Indexes |
| :--- | :--- | :--- |
| `properties` | Physical hostel locations (Goa, Manali, Leh) | `code UNIQUE`, `gstin` |
| `buildings` & `floors` | Architectural hierarchy | Foreign keys to `properties` |
| `rooms` & `room_types` | Room categorization (Dorms, En-suites, Suites) | `property_id` scoped |
| `inventory_units` | Discrete bookable units: `BED_STANDARD`, `BED_MOTORCYCLIST`, `BIKE_PARKING`, `GEAR_LOCKER` | `code`, `property_id`, `unit_type` |
| `biker_release_policies` | Option B 24h auto-release configuration | `property_id UNIQUE`, `release_hours_before` |
| `rate_plans` & `daily_rates` | Base tariffs & seasonal rate tables | Integer minor units (`paise`) |
| `inventory_night_locks` | Real-time reservation & hold lock ledger | **Partial Unique Index**: `uq_active_unit_night` |

### 2.3 Bookings, Groups, Coupons & Payments
| Table Name | Description | Key Constraints / Indexes |
| :--- | :--- | :--- |
| `bookings` | Core booking records & state machine | `booking_number UNIQUE`, `status` |
| `booking_line_items` | Itemized nights, parking, locker, addons | `booking_id`, `amount_paise` |
| `booking_guests` | Guest details, blood group, emergency contact | `booking_id`, `is_primary` |
| `group_bookings` | Option B multi-bed group reservations | `organizer_user_id`, `master_folio_id` |
| `group_members` | Roster of group participants | `group_booking_id`, `guest_id` |
| `checkout_holds` | 10-minute active checkout holds | `expires_at`, `status = 'ACTIVE'` |
| `idempotency_keys` | Idempotency record to prevent duplicate charges | `key UNIQUE`, `response_payload` |
| `coupons` & `redemptions` | Option B promotional discount codes | `code UNIQUE`, per-user usage limits |
| `saved_payment_methods` | Tokenized card/VPA references (no raw PAN) | Gateway customer ID |
| `payment_transactions` | Gateway orders, intents, settlements | `gateway_order_id UNIQUE`, `status` |
| `processed_webhooks` | Replay protection for gateway webhooks | `webhook_id UNIQUE`, HMAC verified |
| `refunds` | Full and partial refunds | `payment_transaction_id`, `amount_paise` |
| `gst_invoices` | Sequential immutable tax invoices | `invoice_number UNIQUE` per FY |
| `invoice_sequences` | Per-property Financial Year sequence locks | `SELECT ... FOR UPDATE` row lock |
| `credit_notes` | Sequential credit notes for refunds/cancellations | `credit_note_number UNIQUE` |
| `business_days` | Day close ledger locking daily revenue | `property_id`, `date`, `is_closed` |

### 2.4 Arrival, ID Vault & Access Codes
| Table Name | Description | Key Constraints / Indexes |
| :--- | :--- | :--- |
| `guest_identity_documents` | AES-256-GCM encrypted ID metadata & S3 key | Legal retention expiry timestamp |
| `arrival_otps` | 6-digit CSPRNG Arrival OTP | Stored only as `HMAC-SHA256` |
| `room_access_codes` | Stay, Visitor, and Extended-Stay door codes | `code_hash`, `revoked_at`, <60s SLA |

### 2.5 Operations, Safety, Marketplace & Engagement
| Table Name | Description | Key Constraints / Indexes |
| :--- | :--- | :--- |
| `housekeeping_tasks` | Auto-generated room turnover tasks | `priority` (`HIGH`, `STANDARD`), `status` |
| `maintenance_tickets` | Maintenance lifecycle & room blocks | `unit_id`, `status` |
| `sos_incidents` | Safety alerts (<5s SLA, 2-min escalation) | `triggered_at`, `acknowledged_at` |
| `vendors` | Service partners (Kitchen, Laundry) | `property_id`, `service_category` |
| `marketplace_orders` | In-house food & laundry orders | Restricted to assigned `vendor_id` |
| `faqs` | Searchable touring & hostel FAQs | `category`, `property_id` |
| `loyalty_accounts` & `entries` | Append-only double-entry points ledger | `user_id`, `points_delta` |

---

## 3. API ENDPOINTS SPECIFICATION (`/api/v1`)

### 3.1 Authentication & IAM (`/api/v1/auth`, `/api/v1/privacy`)
- `POST /api/v1/auth/login-password`: Argon2id credential verification; returns JWT + HttpOnly refresh cookie.
- `POST /api/v1/auth/request-otp`: Sends 6-digit phone login OTP with 30s resend cooldown.
- `POST /api/v1/auth/verify-otp`: Validates phone OTP and logs user in.
- `POST /api/v1/auth/refresh`: Rotates refresh token and issues fresh 15-minute access token.
- `POST /api/v1/auth/logout`: Invalidates session and clears cookies.
- `POST /api/v1/privacy/consent`: Captures versioned DPDP consent.
- `POST /api/v1/privacy/export`: Generates downloadable archive of user's personal data.
- `POST /api/v1/privacy/delete-request`: Schedules account and personal data erasure.

### 3.2 Property & Availability (`/api/v1/properties`)
- `GET /api/v1/properties`: Lists active hostel properties.
- `GET /api/v1/properties/:id/availability`: Search engine filtering by stay dates, motorcyclist tag, bike parking, and gear lockers; returns itemized up-front tariff with 12%/18% GST (p95 < 800ms).
- `PUT /api/v1/properties/:id/biker-release-policy`: Configures the Option B auto-release cutoff hours.

### 3.3 Booking Engine & Holds (`/api/v1/bookings`)
- `POST /api/v1/bookings/hold`: Creates 10-minute active lock in `inventory_night_locks` (returns 409 on collision).
- `POST /api/v1/bookings`: Atomic booking confirmation requiring `Idempotency-Key` header.
- `POST /api/v1/bookings/group`: Atomic multi-bed booking for `GROUP_ORGANISER`.
- `POST /api/v1/coupons/validate`: Validates promo code scope, dates, and biker-only criteria.
- `POST /api/v1/payments/orders`: Initiates payment order (Razorpay/Cashfree) with minor units in `paise`.
- `POST /api/v1/webhooks/payment-gateway`: Verifies HMAC signature, updates folio, issues invoice, and provisions access.
- `POST /api/v1/bookings/:id/refunds`: Issues partial or full refund with sequential Credit Note.

### 3.4 Arrival & Access (`/api/v1/check-in`, `/api/v1/staff/check-in`)
- `POST /api/v1/check-in/:bookingId/id-upload-url`: Returns presigned S3 upload URL for ID scan.
- `POST /api/v1/check-in/:bookingId/id-document`: Stores AES-256-GCM encrypted ID metadata.
- `POST /api/v1/check-in/:bookingId/verify-otp`: Validates 6-digit HMAC arrival OTP, transitions booking to `CheckedIn`, and issues `GUEST_STAY` access code.
- `POST /api/v1/bookings/:id/visitor-codes`: Issues time-bound Option B visitor code.
- `POST /api/v1/bookings/:id/extend-stay`: Extends stay nights and updates access code.
- `POST /api/v1/staff/check-in/:bookingId/desk-override`: Fallback check-in requiring verified ID and audit log entry.

### 3.5 PMS & Operations (`/api/v1/pms`, `/api/v1/operations`)
- `GET /api/v1/pms/dashboard`: Returns live arrivals, departures, occupancy, and room status grid.
- `POST /api/v1/pms/walk-in`: Instant walk-in reservation, ID capture, payment, and room assignment.
- `GET /POST /api/v1/pms/folios/:bookingId/charges`: Single-folio ledger posting (room, cafe, laundry, parking).
- `POST /api/v1/pms/properties/:id/day-close`: Reconciles business day, locks revenue, asserts Dashboard = Folio.
- `GET /api/v1/operations/sync`: ETag/timestamp-based polling fallback for Socket.IO disconnects.
- `PATCH /api/v1/operations/housekeeping/:id/status`: Updates room cleanliness state (`DIRTY` $\rightarrow$ `INSPECTED` $\rightarrow$ `CLEAN`).

### 3.6 Safety SOS & Marketplace (`/api/v1/sos`, `/api/v1/marketplace`)
- `POST /api/v1/sos/trigger`: Emits instant Socket.IO `SOS_ALERT` (<5s p95) and schedules 2-minute escalation BullMQ job.
- `POST /api/v1/sos/:id/acknowledge`: Acknowledges alert and cancels escalation timer.
- `GET /api/v1/vendor/orders`: Restricted vendor order stream (only shows assigned vendor's category).
- `PATCH /api/v1/vendor/orders/:id/status`: Progresses order status (`RECEIVED` $\rightarrow$ `PREPARING` $\rightarrow$ `READY` $\rightarrow$ `DELIVERED`).

---

## 4. FRONTEND SCREENS & USER PORTALS MAPPING

1. **Guest & Group Organiser Portal (`http://localhost:3003`)**:
   - `/`: Discovery, 50% biker inventory hero, availability search, 3D rig viewer, interactive CAD floorplan, 3D route elevation.
   - `/checkout`: 5-step flow (Beds/Addons $\rightarrow$ Roster $\rightarrow$ Coupons/Loyalty + 10m timer $\rightarrow$ UPI/Card payment $\rightarrow$ Confirmation).
   - Stay Hub: Pre-check-in ID upload, Arrival OTP screen with 30s resend timer, Door Keycard, Visitor Code generator, Extend-Stay flow.
   - Marketplace: Food and laundry ordering with bill-to-room folio toggle and live order tracker.
   - Floating SOS Trigger: Accessible on all pages with immediate fallback to India National Emergency Number `112`.
2. **Staff PMS Portal (`http://localhost:3001`)**:
   - Role-based login (Front Desk, Housekeeping, Duty Manager).
   - Arrivals & Departures terminal with 1-click ID verification and OTP entry.
   - 5-Day Gantt Tape Chart with drag-and-drop room assignment swaps.
   - Guest Folio terminal with split billing and instant UPI/cash settlement.
   - Housekeeping turnover queue and maintenance ticket submission.
   - Day Close wizard with revenue lock.
3. **Admin HQ Intelligence (`http://localhost:3002`)**:
   - Enterprise authentication guard (`admin@hotelyo.com`).
   - Multi-property switcher (Goa Vagator, Manali Old Village, Leh Fort Road).
   - 50% Motorcyclist allocation slider with 24-hour auto-release rule toggle.
   - Dynamic pricing multiplier engine (Weekend +20%, Monsoon -15%, Festival +35%).
   - Vendor procurement PO generator.
   - Master institutional ledger with valid HSN 9963 CSV export.
   - Cryptographic SHA-256 audit stream.

---

## 5. VERIFICATION GATES & TEST SUITES

- **Gate G1 (Prisma Schema & Constraints)**: Verify clean migrations, `uq_active_unit_night` unique lock, and `audit_logs` immutable trigger.
- **Gate G2 (Concurrency Stress Test)**: 50 simultaneous hold requests on the same bed night $\rightarrow$ exactly 1 succeeds (`201`), 49 return `409 Conflict`.
- **Gate G3 (Financial & GST Integrity)**: Sequential tax invoices (`INV/...`), sequential credit notes, and `Day Close` asserting Dashboard Revenue equals Folio Revenue to the exact `paisa`.
- **Gate G4 (Arrival OTP & 60s Revocation)**: 6-digit CSPRNG, max 5 attempts lockout, 30s cooldown, and door code revocation within 60 seconds of checkout.
- **Gate G5 (SOS Poor-Network Drill)**: Emulated 3G/offline network $\rightarrow$ immediate `112` display $\rightarrow$ online restore delivers alert to staff in <5s and escalates at 2 minutes if unacknowledged.
- **Gate G6 (Vendor Role Isolation)**: Vendor A receives `403 Forbidden` attempting to read or update Vendor B's orders.
- **Gate G7 (Load & Performance Targets)**: k6 load test under 200–500 concurrent users verifying p95 read < 300ms, write < 600ms, search < 800ms, and PWA 4G LCP < 2.5s.
- **Gate G8 (Requirement Traceability)**: Full `TRACEABILITY_MATRIX.md` linking every RFQ requirement to its code and test files.
