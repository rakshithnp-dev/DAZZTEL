# HOTELYO - Role & Permissions Authorization Matrix

## 1. System Roles
1. `GUEST`: Standard hostel traveler.
2. `GROUP_ORGANIZER`: Guest managing multi-bed group reservation.
3. `FRONT_DESK`: Front-office staff managing arrivals, departures, walk-ins, and key issuance.
4. `HOUSEKEEPING`: Operations team responsible for room/bed cleaning and turnaround.
5. `MAINTENANCE`: Operations team managing repair tickets and room blocking.
6. `PROPERTY_MANAGER`: Overall operations, refunds, rate plans, and day close for assigned property.
7. `VENDOR`: External service partner (food or laundry) restricted strictly to assigned orders.
8. `PLATFORM_ADMIN`: Global administrator managing properties, system roles, and global audit logs.

## 2. Permission Matrix by Domain

| Domain Operation | GUEST | GROUP_ORG | FRONT_DESK | HOUSEKEEPING | MAINTENANCE | PROP_MGR | VENDOR | PLATFORM_ADMIN |
|---|---|---|---|---|---|---|---|---|
| **Search Availability** | Allowed | Allowed | Allowed | Denied | Denied | Allowed | Denied | Allowed |
| **Create Booking Hold** | Own | Own | Allowed | Denied | Denied | Allowed | Denied | Allowed |
| **Complete 5-Screen Checkout**| Own | Own | Allowed | Denied | Denied | Allowed | Denied | Allowed |
| **View Booking & Folio** | Own | Own/Group | Property | Denied | Denied | Property | Denied | Global |
| **Cancel Booking** | Own (Policy)| Own/Group | Property | Denied | Denied | Property | Denied | Global |
| **Upload ID Document** | Own | Own/Group | Property | Denied | Denied | Property | Denied | Global |
| **Verify ID Document** | Denied | Denied | Property | Denied | Denied | Property | Denied | Global |
| **Request Arrival OTP** | Own | Own/Group | Property | Denied | Denied | Property | Denied | Global |
| **Verify Arrival OTP (Check-In)**| Denied | Denied | Property | Denied | Denied | Property | Denied | Global |
| **View Room Access Code**| Checked-in | Checked-in | Property | Denied | Denied | Property | Denied | Global |
| **Issue Walk-In Booking** | Denied | Denied | Property | Denied | Denied | Property | Denied | Global |
| **Perform Day Close** | Denied | Denied | Denied | Denied | Denied | Property | Denied | Global |
| **Update Housekeeping Task**| Denied | Denied | Property | Own Assigned | Denied | Property | Denied | Global |
| **Trigger SOS Alert** | Allowed | Allowed | Allowed | Allowed | Allowed | Allowed | Denied | Global |
| **Acknowledge SOS Alert** | Denied | Denied | Property | Property | Property | Property | Denied | Global |
| **Place Food/Laundry Order**| Own Stay | Own Stay | Property | Denied | Denied | Property | Denied | Global |
| **Vendor Order Inbox** | Denied | Denied | Denied | Denied | Denied | Denied | Own Vendor | Global |
| **View Property Analytics**| Denied | Denied | Summary | Denied | Denied | Property | Denied | Global |
| **Manage Properties/Roles**| Denied | Denied | Denied | Denied | Denied | Denied | Denied | Global |

## 3. Cross-Tenant Isolation Enforcement
1. **Property Isolation:** Staff queries must include `WHERE property_id = :userActivePropertyId`. Staff members attempting to view or modify resources belonging to another property are rejected with HTTP 403 Forbidden.
2. **Vendor Isolation:** Vendor queries must enforce `WHERE vendor_id = :authenticatedVendorId`. Any request without matching `vendor_id` is rejected with HTTP 403 Forbidden.
3. **Guest Data Privacy:** Guests cannot access or view another guest's bookings, ID documents, folios, or loyalty records.
