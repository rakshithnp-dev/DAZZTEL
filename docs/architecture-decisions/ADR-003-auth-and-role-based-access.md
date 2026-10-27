# ADR-003: Authentication, JWT Rotation, and Property-Scoped Authorization

## Status
Accepted

## Context
HOTELYO manages sensitive personal data (passports, national IDs, contact numbers), payments, access codes, and multi-property staff operations. Front-desk staff or managers at Property A must never access Property B data. Vendors must see only their own orders.

## Decision
1. **Authentication:** Supports email/phone + password (hashed via Argon2id) or verified OTP.
2. **Tokens:**
   - Access tokens: Short-lived JWTs (15-minute TTL) containing `userId`, global `roles`, and current active `propertyId`.
   - Refresh tokens: Stored in the database with rotating token families, expiration, IP/UserAgent tracking, and reuse detection (if an old refresh token is reused, all tokens in the family are immediately revoked).
3. **Role-Based & Object-Level Access Control (RBAC):**
   - System Roles: `GUEST`, `GROUP_ORGANIZER`, `FRONT_DESK`, `HOUSEKEEPING`, `MAINTENANCE`, `PROPERTY_MANAGER`, `VENDOR`, `PLATFORM_ADMIN`.
   - Property Scoping: Operations by staff and managers are scoped via `PropertyMembership`. Every repository query for staff endpoints automatically enforces `WHERE property_id = :requestPropertyId`.
   - Vendor Isolation: Vendors are restricted strictly to `/api/v1/vendors/*` and can query only orders assigned to their `vendorId`.

## Consequences
- **Positive:** Maximum security adhering to OWASP ASVS Level 2; strict multi-tenant boundary isolation.
- **Negative:** Requires token refresh handling on frontend clients.
