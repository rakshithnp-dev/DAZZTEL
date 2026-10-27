# HOTELYO - REST API Specification Guide (/api/v1)

## 1. Global Conventions
- **Base URL:** `/api/v1`
- **Request Format:** `application/json` with UTC ISO-8601 timestamps (`YYYY-MM-DDTHH:mm:ss.sssZ`).
- **Response Format:**
  ```json
  {
    "success": true,
    "data": { ... },
    "error": null,
    "meta": {
      "timestamp": "2026-10-27T17:15:00.000Z",
      "requestId": "req-12345"
    }
  }
  ```
- **Error Format:**
  ```json
  {
    "success": false,
    "data": null,
    "error": {
      "code": "DOUBLE_BOOKING_CONFLICT",
      "message": "One or more requested beds are no longer available for the selected dates.",
      "details": { "bedId": "bed-uuid-1", "date": "2026-11-01" }
    },
    "meta": { ... }
  }
  ```
- **Idempotency Header:** `Idempotency-Key: <UUID>` supported on all mutating POST/PUT commands.
- **Authentication:** Bearer token in `Authorization: Bearer <JWT>`.

## 2. Route Groups Summary

| Group | Method | Path | Role Required | Description |
|---|---|---|---|---|
| **Auth** | POST | `/api/v1/auth/register` | Public | Register guest account |
| **Auth** | POST | `/api/v1/auth/login` | Public | Login with password or OTP |
| **Auth** | POST | `/api/v1/auth/refresh` | Public | Rotate refresh token |
| **Auth** | POST | `/api/v1/auth/logout` | Authenticated | Revoke session |
| **Properties** | GET | `/api/v1/properties` | Public | List active hostel properties |
| **Properties** | GET | `/api/v1/properties/:id` | Public | Get property details & policies |
| **Availability**| GET | `/api/v1/availability/search` | Public | Check available beds, rooms, bike parking, lockers |
| **Bookings** | POST | `/api/v1/bookings/hold` | Authenticated | Create 10-minute inventory hold |
| **Bookings** | POST | `/api/v1/bookings/checkout` | Authenticated | Complete 5-screen checkout & confirm |
| **Bookings** | GET | `/api/v1/bookings/my` | Guest | List personal bookings |
| **Bookings** | GET | `/api/v1/bookings/:id` | Guest/Staff | Retrieve booking folio & stay info |
| **Bookings** | POST | `/api/v1/bookings/:id/cancel` | Guest/Staff | Request cancellation with server refund computation |
| **Payments** | POST | `/api/v1/payments/initiate` | Authenticated | Create payment order (Razorpay/UPI) |
| **Payments** | POST | `/api/v1/payments/webhook` | Gateway Only | Signed webhook with replay verification |
| **Check-In** | POST | `/api/v1/identity-documents/upload`| Guest | Upload pre-check-in ID doc to private storage |
| **Check-In** | POST | `/api/v1/check-in/otp/request` | Guest | Request 6-digit cryptographic arrival OTP |
| **Check-In** | POST | `/api/v1/check-in/otp/verify` | Staff/Kiosk | Verify arrival OTP and complete check-in |
| **Access** | GET | `/api/v1/access-codes/active` | Checked-in Guest | Retrieve current room access code |
| **PMS** | GET | `/api/v1/pms/dashboard` | Front-Desk/Manager | Live arrivals, departures, walk-in metrics |
| **PMS** | POST | `/api/v1/pms/walk-in` | Front-Desk | Create instant walk-in reservation |
| **PMS** | POST | `/api/v1/pms/day-close` | Property Manager | Execute business day close & revenue lock |
| **Operations** | GET | `/api/v1/housekeeping/tasks` | Staff | Housekeeping queue sorted by priority |
| **Operations** | PATCH| `/api/v1/housekeeping/tasks/:id`| Staff | Update task status (Cleaned, Inspected) |
| **Safety** | POST | `/api/v1/sos/trigger` | Authenticated Guest| 1-click SOS emergency alert |
| **Safety** | POST | `/api/v1/sos/:id/acknowledge`| Staff | Staff 1-click emergency acknowledgement |
| **Marketplace**| GET | `/api/v1/marketplace/menu` | Public/Guest | Property food & snack menu |
| **Marketplace**| POST | `/api/v1/marketplace/food-orders`| Checked-in Guest | Place food order to vendor inbox |
| **Marketplace**| GET | `/api/v1/vendors/orders` | Vendor | Vendor's own isolated order queue |
| **Analytics** | GET | `/api/v1/analytics/overview` | Property Manager | Occupancy, RevPAB, RevPAR, gross vs net |
