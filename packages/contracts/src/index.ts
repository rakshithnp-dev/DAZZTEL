import { z } from 'zod';

// Roles
export const RoleNameEnum = z.enum([
  'GUEST',
  'GROUP_ORGANIZER',
  'FRONT_DESK',
  'HOUSEKEEPING',
  'MAINTENANCE',
  'PROPERTY_MANAGER',
  'VENDOR',
  'PLATFORM_ADMIN',
]);
export type RoleName = z.infer<typeof RoleNameEnum>;

// Booking Status
export const BookingStatusEnum = z.enum([
  'DRAFT',
  'PAYMENT_PENDING',
  'CONFIRMED',
  'CHECKED_IN',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW',
]);
export type BookingStatus = z.infer<typeof BookingStatusEnum>;

// Inventory Unit Types
export const InventoryUnitTypeEnum = z.enum([
  'BED_STANDARD',
  'BED_MOTORCYCLIST',
  'BIKE_PARKING',
  'GEAR_LOCKER',
]);
export type InventoryUnitType = z.infer<typeof InventoryUnitTypeEnum>;

// Arrival OTP Validation Contract
export const VerifyArrivalOtpSchema = z.object({
  bookingId: z.string().uuid(),
  otp: z.string().length(6),
});
export type VerifyArrivalOtpDto = z.infer<typeof VerifyArrivalOtpSchema>;

// Room Access Code Provider Interface
export interface IRoomAccessProvider {
  issueCode(params: {
    bookingId: string;
    unitId: string;
    type: 'GUEST_STAY' | 'VISITOR' | 'EXTENDED_STAY';
    validFrom: Date;
    validUntil: Date;
    guestName?: string;
  }): Promise<{ code: string; validUntil: Date }>;
  revokeCode(params: { codeId?: string; bookingId: string }): Promise<{ revoked: boolean; revokedAt: Date }>;
  verifyCode(params: { code: string; unitId: string }): Promise<boolean>;
}

// SOS Trigger Contract
export const TriggerSosSchema = z.object({
  propertyId: z.string().uuid(),
  bookingId: z.string().uuid().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  details: z.string().max(500).optional(),
});
export type TriggerSosDto = z.infer<typeof TriggerSosSchema>;

// Day Close Contract
export const DayCloseSchema = z.object({
  propertyId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  cashReconciledMinorUnits: z.number().int().nonnegative(),
});
export type DayCloseDto = z.infer<typeof DayCloseSchema>;
