import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { PrismaService } from '../../common/prisma.service';
import { ConflictException } from '@nestjs/common';

describe('BookingService (Vertical Slice 1)', () => {
  let service: BookingService;
  let prisma: PrismaService;
  let propertyId: string;
  let bed1Id: string;
  let bed2Id: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookingService, PrismaService],
    }).compile();

    service = module.get<BookingService>(BookingService);
    prisma = module.get<PrismaService>(PrismaService);
    await prisma.$connect();

    // Fetch seeded property and beds
    const property = await prisma.property.findFirstOrThrow({
      where: { code: 'GOA-ANJ-01' },
      include: {
        rooms: {
          include: { beds: true },
        },
      },
    });
    propertyId = property.id;
    bed1Id = property.rooms[0].beds[0].id;
    bed2Id = property.rooms[0].beds[1].id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('createHold & Anti-Double-Booking Invariant', () => {
    const checkIn = '2026-11-10';
    const checkOut = '2026-11-12'; // 2 nights

    afterEach(async () => {
      // Clean up test holds
      await prisma.bedNightAllocation.deleteMany({
        where: {
          calendarDate: {
            in: [new Date('2026-11-10'), new Date('2026-11-11')],
          },
        },
      });
      await prisma.booking.deleteMany({
        where: {
          checkInDate: new Date('2026-11-10'),
        },
      });
    });

    it('should successfully create a 10-minute hold with transparent GST breakdown', async () => {
      const result = await service.createHold({
        propertyId,
        bedIds: [bed1Id],
        checkInDate: checkIn,
        checkOutDate: checkOut,
        motorcycleStay: true,
        needsParking: true,
      });

      expect(result).toBeDefined();
      expect(result.holdId).toBeDefined();
      expect(result.bookingReference).toMatch(/^HY-2026-/);
      expect(result.holdTimeoutMinutes).toBe(10);
      expect(result.pricing.totalNights).toBe(2);
      expect(result.pricing.bedCount).toBe(1);
      // Pricing in paise:
      expect(result.pricing.accommodationPaise).toBeGreaterThan(0);
      expect(result.pricing.parkingPaise).toBe(20000); // 2 nights * ₹100 = 20000 paise
      expect(result.pricing.totalTaxPaise).toBe(
        result.pricing.cgstPaise + result.pricing.sgstPaise,
      );
      expect(result.pricing.totalGrandAmountPaise).toBe(
        result.pricing.subtotalPaise + result.pricing.totalTaxPaise,
      );

      // Verify database allocation rows exist for both nights
      const allocations = await prisma.bedNightAllocation.findMany({
        where: { bedId: bed1Id },
      });
      expect(allocations.length).toBe(2);
      expect(allocations[0].status).toBe('HOLD');
    });

    it('should reject simultaneous double-booking on the same bed-night with ConflictException (409)', async () => {
      // 1. First user holds bed1
      await service.createHold({
        propertyId,
        bedIds: [bed1Id],
        checkInDate: checkIn,
        checkOutDate: checkOut,
      });

      // 2. Second user attempts to hold the same bed for the same dates -> Must throw ConflictException
      await expect(
        service.createHold({
          propertyId,
          bedIds: [bed1Id],
          checkInDate: checkIn,
          checkOutDate: checkOut,
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should permit concurrent holds on distinct beds for the same dates without conflict', async () => {
      const [hold1, hold2] = await Promise.all([
        service.createHold({
          propertyId,
          bedIds: [bed1Id],
          checkInDate: checkIn,
          checkOutDate: checkOut,
        }),
        service.createHold({
          propertyId,
          bedIds: [bed2Id],
          checkInDate: checkIn,
          checkOutDate: checkOut,
        }),
      ]);

      expect(hold1.holdId).toBeDefined();
      expect(hold2.holdId).toBeDefined();
      expect(hold1.holdId).not.toEqual(hold2.holdId);
    });
  });

  describe('5-Screen Checkout Completion', () => {
    it('should successfully complete checkout, capture payment, and create folio', async () => {
      // 1. Create initial hold
      const hold = await service.createHold({
        propertyId,
        bedIds: [bed1Id],
        checkInDate: '2026-11-15',
        checkOutDate: '2026-11-17',
      });

      // 2. Complete checkout
      const checkoutResult = await service.completeCheckout({
        holdId: hold.holdId,
        guest: {
          fullName: 'Test Traveler',
          email: 'traveler.test@gmail.com',
          phone: '+919876500000',
          nationality: 'IN',
        },
        paymentMethod: 'UPI',
        idempotencyKey: 'idemp-checkout-test-001',
      });

      expect(checkoutResult).toBeDefined();
      expect(checkoutResult.status).toBe('CONFIRMED');
      expect(checkoutResult.payment.status).toBe('SUCCEEDED');
      expect(checkoutResult.folioId).toBeDefined();

      // Clean up
      await prisma.folioLineItem.deleteMany({
        where: { folioId: checkoutResult.folioId },
      });
      await prisma.guestFolio.delete({
        where: { id: checkoutResult.folioId },
      });
      await prisma.payment.deleteMany({
        where: { bookingId: checkoutResult.bookingId },
      });
      await prisma.bedNightAllocation.deleteMany({
        where: { bedId: bed1Id },
      });
      await prisma.booking.delete({
        where: { id: checkoutResult.bookingId },
      });
    });
  });
});
