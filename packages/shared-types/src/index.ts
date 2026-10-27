export type UserRole =
  | 'GUEST'
  | 'GROUP_ORGANIZER'
  | 'FRONT_DESK'
  | 'HOUSEKEEPING'
  | 'MAINTENANCE'
  | 'PROPERTY_MANAGER'
  | 'VENDOR'
  | 'PLATFORM_ADMIN';

export type BookingStatus =
  | 'DRAFT'
  | 'PAYMENT_PENDING'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type BedAllocationStatus =
  | 'HOLD'
  | 'CONFIRMED'
  | 'MAINTENANCE_BLOCK'
  | 'RELEASED';

export type PaymentStatus =
  | 'INITIATED'
  | 'PENDING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export type PaymentMethod =
  | 'UPI'
  | 'CARD'
  | 'NET_BANKING'
  | 'WALLET'
  | 'CASH_AT_DESK';

export type RoomType =
  | 'DORM_MALE'
  | 'DORM_FEMALE'
  | 'DORM_MIXED'
  | 'PRIVATE_ROOM';

export type BedSegment = 'STANDARD' | 'MOTORCYCLE_RESERVED';

export interface PropertyDTO {
  id: string;
  code: string;
  name: string;
  description?: string;
  timezone: string;
  currency: string;
  city: string;
  state: string;
  gstin?: string;
  phone: string;
  email: string;
}

export interface BedAvailabilityDTO {
  bedId: string;
  bedNumber: string;
  roomId: string;
  roomNumber: string;
  roomType: RoomType;
  segment: BedSegment;
  pricePerNightPaise: number;
}

export interface AvailabilitySearchQuery {
  propertyId: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  guestCount: number;
  motorcycleStay?: boolean;
  needsParking?: boolean;
  needsLocker?: boolean;
}

export interface AvailabilitySearchResultDTO {
  propertyId: string;
  checkInDate: string;
  checkOutDate: string;
  totalNights: number;
  availableBedsCount: number;
  motorcycleBedsAvailable: number;
  availableBeds: BedAvailabilityDTO[];
  parkingSpacesAvailable: number;
  parkingDailyRatePaise: number;
  gearLockersAvailable: number;
  gearLockerDailyRatePaise: number;
}

export interface CreateBookingHoldRequest {
  propertyId: string;
  bedIds: string[];
  checkInDate: string;
  checkOutDate: string;
  needsParking?: boolean;
  needsLocker?: boolean;
  motorcycleStay?: boolean;
}

export interface BookingHoldResponseDTO {
  holdId: string;
  bookingId: string;
  bookingReference: string;
  expiresAt: string; // ISO UTC
  holdTimeoutMinutes: number;
  totalBaseAmountPaise: number;
  totalTaxAmountPaise: number;
  totalGrandAmountPaise: number;
}

export interface FiveScreenCheckoutDTO {
  // Screen 1: Stay Selection
  stay: {
    propertyId: string;
    checkInDate: string;
    checkOutDate: string;
    bedIds: string[];
    needsParking?: boolean;
    needsLocker?: boolean;
    motorcycleStay?: boolean;
  };
  // Screen 2: Guest Information
  guest: {
    fullName: string;
    email: string;
    phone: string;
    nationality?: string;
    bikeModel?: string;
    bikeRegNumber?: string;
  };
  // Screen 3: Offers / Coupons
  couponCode?: string;
  // Screen 4: Payment
  payment: {
    method: PaymentMethod;
    idempotencyKey: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: any;
  } | null;
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}
