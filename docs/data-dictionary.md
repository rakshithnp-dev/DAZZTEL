# HOTELYO - Data Dictionary

## 1. Domain: Inventory & Core PMS

### `BedNightAllocation`
Enforces the single source of truth for bed availability.
- `id` (UUID, PK): Unique record identifier.
- `bedId` (UUID, FK -> Bed.id): Target bed reference.
- `calendarDate` (DATE): Distinct calendar date for the reserved night.
- `status` (ENUM: `HOLD`, `CONFIRMED`, `MAINTENANCE_BLOCK`, `RELEASED`): Allocation lifecycle state.
- `bookingItemId` (UUID, Nullable, FK -> BookingItem.id): Associated booking item.
- `bookingHoldId` (UUID, Nullable, FK -> BookingHold.id): Associated hold if pending payment.
- `createdAt` (TIMESTAMPTZ): Record creation timestamp.
- **Constraints:** `UNIQUE("bedId", "calendarDate")` where status IN (`HOLD`, `CONFIRMED`, `MAINTENANCE_BLOCK`).

### `Property`
Hostel property entity supporting multi-property deployment.
- `id` (UUID, PK): Unique property ID.
- `code` (VARCHAR(16), UNIQUE): Property code (e.g., `GOA-ANJ-01`).
- `name` (VARCHAR(128)): Human-readable property name.
- `timezone` (VARCHAR(64)): IANA timezone name (default: `Asia/Kolkata`).
- `addressLine1` (VARCHAR(255)): Street address.
- `city` (VARCHAR(64)): City location (e.g. Anjuna, Goa).
- `state` (VARCHAR(64)): State (e.g. Goa).
- `postalCode` (VARCHAR(16)): PIN code.
- `gstin` (VARCHAR(15)): Property Goods and Services Tax Identification Number.
- `status` (ENUM: `ACTIVE`, `INACTIVE`, `MAINTENANCE`): Property status.

### `Room`
Physical room or dormitory.
- `id` (UUID, PK): Room ID.
- `propertyId` (UUID, FK -> Property.id): Parent property.
- `roomNumber` (VARCHAR(32)): Room or dorm number (e.g. `DORM-101`, `PVT-202`).
- `roomType` (ENUM: `DORM_MALE`, `DORM_FEMALE`, `DORM_MIXED`, `PRIVATE_ROOM`).
- `totalBeds` (INTEGER): Total capacity.

### `Bed`
Bookable bed unit within a room.
- `id` (UUID, PK): Bed ID.
- `roomId` (UUID, FK -> Room.id): Parent room.
- `bedNumber` (VARCHAR(16)): Identifier (e.g. `B1`, `B2-TOP`).
- `segment` (ENUM: `STANDARD`, `MOTORCYCLE_RESERVED`): Inventory classification.
- `isActive` (BOOLEAN): Sellable flag.

---

## 2. Domain: Bookings & Financials

### `Booking`
Master reservation record.
- `id` (UUID, PK): Unique booking ID.
- `bookingReference` (VARCHAR(16), UNIQUE): Human-readable alphanumeric code (e.g. `HY-2026-X892`).
- `propertyId` (UUID, FK -> Property.id): Target property.
- `primaryGuestId` (UUID, FK -> User.id): Guest user ID.
- `status` (ENUM: `DRAFT`, `PAYMENT_PENDING`, `CONFIRMED`, `CHECKED_IN`, `COMPLETED`, `CANCELLED`, `NO_SHOW`).
- `checkInDate` (DATE): Check-in business date.
- `checkOutDate` (DATE): Check-out business date.
- `totalBaseAmountPaise` (BIGINT): Pre-tax accommodation amount in paise.
- `totalTaxAmountPaise` (BIGINT): Total GST amount in paise.
- `totalDiscountAmountPaise` (BIGINT): Applied coupon or loyalty discount in paise.
- `totalGrandAmountPaise` (BIGINT): Final payable total in paise.
- `idempotencyKey` (VARCHAR(64), Nullable): Safe client deduplication key.

### `GuestFolio`
Financial tracking folio for guest stay.
- `id` (UUID, PK): Folio ID.
- `bookingId` (UUID, UNIQUE, FK -> Booking.id): Associated booking.
- `status` (ENUM: `OPEN`, `SETTLED`, `CLOSED`).
- `totalChargesPaise` (BIGINT): Cumulative debits.
- `totalPaymentsPaise` (BIGINT): Cumulative credits.
- `balancePaise` (BIGINT): Current net balance (Charges - Payments).

### `TaxInvoice`
Sequential, immutable GST tax invoice.
- `id` (UUID, PK): Invoice ID.
- `invoiceNumber` (VARCHAR(32), UNIQUE): Sequential code (`INV/{PropertyCode}/{FY}/{Seq}`).
- `folioId` (UUID, FK -> GuestFolio.id): Parent folio.
- `financialYear` (VARCHAR(16)): Indian financial year (e.g., `2026-2027`).
- `issuedAt` (TIMESTAMPTZ): Issuance timestamp.
- `cgstPaise` (BIGINT): Central GST component.
- `sgstPaise` (BIGINT): State GST component.
- `igstPaise` (BIGINT): Integrated GST component.
- `totalAmountPaise` (BIGINT): Final invoiced amount.
- `pdfUrl` (VARCHAR(512), Nullable): Signed PDF document storage link.
