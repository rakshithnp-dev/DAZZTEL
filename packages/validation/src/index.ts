import { z } from 'zod';

export const AvailabilitySearchSchema = z.object({
  propertyId: z.string().uuid(),
  checkInDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  checkOutDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  guestCount: z.coerce.number().int().min(1).max(20),
  motorcycleStay: z.preprocess((val: unknown) => val === 'true' || val === true, z.boolean()).optional(),
  needsParking: z.preprocess((val: unknown) => val === 'true' || val === true, z.boolean()).optional(),
  needsLocker: z.preprocess((val: unknown) => val === 'true' || val === true, z.boolean()).optional(),
}).refine((data: { checkInDate: string; checkOutDate: string }) => data.checkOutDate > data.checkInDate, {
  message: 'Check-out date must be after check-in date',
  path: ['checkOutDate'],
});

export const CreateBookingHoldSchema = z.object({
  propertyId: z.string().uuid(),
  bedIds: z.array(z.string().uuid()).min(1, 'At least one bed must be selected'),
  checkInDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOutDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  needsParking: z.boolean().optional(),
  needsLocker: z.boolean().optional(),
  motorcycleStay: z.boolean().optional(),
}).refine((data: { checkInDate: string; checkOutDate: string }) => data.checkOutDate > data.checkInDate, {
  message: 'Check-out date must be after check-in date',
  path: ['checkOutDate'],
});

export const CheckoutGuestSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[1-9]\d{7,14}$/, 'Must be valid phone number'),
  nationality: z.string().default('IN'),
  bikeModel: z.string().optional(),
  bikeRegNumber: z.string().optional(),
});

export const CompleteCheckoutSchema = z.object({
  holdId: z.string().uuid(),
  guest: CheckoutGuestSchema,
  couponCode: z.string().optional(),
  paymentMethod: z.enum(['UPI', 'CARD', 'NET_BANKING', 'WALLET', 'CASH_AT_DESK']),
  idempotencyKey: z.string().min(8, 'Idempotency key required'),
});

export const ArrivalOtpVerifySchema = z.object({
  bookingId: z.string().uuid(),
  otp: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d{6}$/, 'OTP must be digits only'),
});

export const SosTriggerSchema = z.object({
  propertyId: z.string().uuid(),
  incidentNotes: z.string().max(500).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});
