# HOTELYO - Option B (Phase 1b) Acceptance Verification Checklist

| Area | Acceptance Criterion | Verification Method | Status |
|---|---|---|---|
| **Coupons** | Fixed/percentage discounts with validity, min spend, non-stackable | Coupon service unit tests and checkout redemption pass | Ready |
| **Group Bookings** | Multi-bed booking under single reference with per-guest tracking | Group booking creation and member check-in verified | Ready |
| **Saved Payments** | Gateway tokenized card/UPI reference management (zero PAN stored) | Tokenization adapter test passes | Ready |
| **Auto-Release** | Unsold motorcycle beds auto-release prior to arrival without affecting confirmed bookings | Auto-release worker verified with integration test | Ready |
| **Visitor Access** | Time-bound visitor passes and extended stay access codes | Visitor pass issuance and expiry verified | Ready |
| **Live Staff Updates**| Socket.IO real-time event distribution with polling fallback | WebSocket gateway unit test passes | Ready |
| **Admin Analytics** | Occupancy rate, bed utilization, RevPAB, RevPAR, gross vs net revenue | Analytics calculation service tests pass | Ready |
| **Web Push** | Web push notification subscription and FCM dispatch | Push subscription and payload dispatch verified | Ready |
| **Food Marketplace** | Property food menus, guest cart ordering, isolated vendor inbox | Food order lifecycle and vendor isolation test pass | Ready |
| **Laundry Service**| Laundry ordering, pickup/delivery scheduling, folio integration | Laundry order flow verified | Ready |
| **FAQ & Loyalty** | FAQ category/article search; immutable loyalty ledger | Loyalty accrual and redemption ledger tests pass | Ready |
