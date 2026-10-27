import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import {
  BookingStatus,
  BedAllocationStatus,
  PaymentStatus,
  PaymentMethodType,
  FolioStatus,
  FolioItemType,
  Prisma,
} from '@prisma/client';
import * as crypto from 'crypto';

export interface CreateHoldParams {
  propertyId: string;
  bedIds: string[];
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  userId?: string;
  needsParking?: boolean;
  needsLocker?: boolean;
  motorcycleStay?: boolean;
}

export interface CompleteCheckoutParams {
  holdId: string;
  guest: {
    fullName: string;
    email: string;
    phone: string;
    nationality?: string;
    bikeModel?: string;
    bikeRegNumber?: string;
  };
  couponCode?: string;
  paymentMethod: PaymentMethodType;
  idempotencyKey: string;
}

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(private readonly prisma: PrismaService) {}

  private generateBookingReference(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const year = new Date().getFullYear();
    return `HY-${year}-${code}`;
  }

  private getDatesInRange(startDateStr: string, endDateStr: string): Date[] {
    const dates: Date[] = [];
    const current = new Date(startDateStr);
    const end = new Date(endDateStr);

    if (current >= end) {
      throw new BadRequestException('Check-out date must be strictly after check-in date');
    }

    while (current < end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }

  /**
   * 1. Create a 10-minute inventory hold with database-enforced anti-double-booking guarantees.
   */
  async createHold(params: CreateHoldParams) {
    const { propertyId, bedIds, checkInDate, checkOutDate, needsParking, needsLocker, motorcycleStay } = params;
    const stayDates = this.getDatesInRange(checkInDate, checkOutDate);
    const totalNights = stayDates.length;

    // 1. Fetch property and settings
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
      include: { setting: true },
    });
    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }

    // 2. Fetch requested beds and verify they belong to this property
    const beds = await this.prisma.bed.findMany({
      where: {
        id: { in: bedIds },
        room: { propertyId },
        isActive: true,
      },
      include: { room: true },
    });

    if (beds.length !== bedIds.length) {
      throw new BadRequestException('One or more requested beds are invalid or inactive for this property');
    }

    // 3. Upfront price calculation in integer minor units (paise)
    let totalBaseAmountPaise = 0;
    for (const bed of beds) {
      totalBaseAmountPaise += bed.room.basePricePaise * totalNights;
    }

    // Optional parking add-on: ₹100/day = 10000 paise/night
    const parkingDailyPaise = 10000;
    const parkingTotalPaise = needsParking ? parkingDailyPaise * totalNights : 0;

    // Optional locker add-on: ₹50/day = 5000 paise/night
    const lockerDailyPaise = 5000;
    const lockerTotalPaise = needsLocker ? lockerDailyPaise * totalNights : 0;

    const subtotalPaise = totalBaseAmountPaise + parkingTotalPaise + lockerTotalPaise;

    // Taxes (GST): default 6% CGST + 6% SGST = 12% total GST
    const cgstRate = Number(property.setting?.cgstPercent ?? 6) / 100;
    const sgstRate = Number(property.setting?.sgstPercent ?? 6) / 100;

    const cgstAmountPaise = Math.round(subtotalPaise * cgstRate);
    const sgstAmountPaise = Math.round(subtotalPaise * sgstRate);
    const totalTaxAmountPaise = cgstAmountPaise + sgstAmountPaise;

    const totalGrandAmountPaise = subtotalPaise + totalTaxAmountPaise;

    // 4. Resolve or create anonymous / guest placeholder user
    let guestUserId = params.userId;
    if (!guestUserId) {
      // Create guest placeholder
      const placeholderUser = await this.prisma.user.create({
        data: {
          fullName: 'Guest Checkout',
        },
      });
      guestUserId = placeholderUser.id;
    }

    const holdTimeoutMinutes = property.setting?.holdTimeoutMinutes ?? 10;
    const expiresAt = new Date(Date.now() + holdTimeoutMinutes * 60 * 1000);
    const bookingReference = this.generateBookingReference();

    // 5. ACID Transaction: Insert Booking, BookingHold, and BedNightAllocations
    try {
      return await this.prisma.$transaction(async (tx) => {
        // Create booking
        const booking = await tx.booking.create({
          data: {
            bookingReference,
            propertyId,
            primaryGuestId: guestUserId,
            status: BookingStatus.PAYMENT_PENDING,
            checkInDate: new Date(checkInDate),
            checkOutDate: new Date(checkOutDate),
            totalNights,
            guestCount: bedIds.length,
            motorcycleStay: Boolean(motorcycleStay),
            totalBaseAmountPaise: subtotalPaise,
            totalTaxAmountPaise,
            totalDiscountAmountPaise: 0,
            totalGrandAmountPaise,
          },
        });

        // Create booking items
        for (const bed of beds) {
          const item = await tx.bookingItem.create({
            data: {
              bookingId: booking.id,
              bedId: bed.id,
              ratePerNightPaise: bed.room.basePricePaise,
              totalAmountPaise: bed.room.basePricePaise * totalNights,
            },
          });

          // Insert allocation rows for each date of stay
          for (const date of stayDates) {
            await tx.bedNightAllocation.create({
              data: {
                bedId: bed.id,
                calendarDate: date,
                status: BedAllocationStatus.HOLD,
                bookingItemId: item.id,
              },
            });
          }
        }

        // Create hold record
        const hold = await tx.bookingHold.create({
          data: {
            bookingId: booking.id,
            expiresAt,
            isReleased: false,
          },
        });

        return {
          holdId: hold.id,
          bookingId: booking.id,
          bookingReference: booking.bookingReference,
          expiresAt: expiresAt.toISOString(),
          holdTimeoutMinutes,
          pricing: {
            totalNights,
            bedCount: bedIds.length,
            accommodationPaise: totalBaseAmountPaise,
            parkingPaise: parkingTotalPaise,
            lockerPaise: lockerTotalPaise,
            subtotalPaise,
            cgstPaise: cgstAmountPaise,
            sgstPaise: sgstAmountPaise,
            totalTaxPaise: totalTaxAmountPaise,
            totalGrandAmountPaise,
            formattedGrandTotalINR: `₹${(totalGrandAmountPaise / 100).toFixed(2)}`,
          },
        };
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException({
          code: 'DOUBLE_BOOKING_CONFLICT',
          message: 'One or more of the selected beds was just reserved by another guest. Please select an alternate bed.',
        });
      }
      throw error;
    }
  }

  /**
   * 2. Release expired holds (worker invocation or manual trigger)
   */
  async releaseExpiredHolds(): Promise<{ releasedCount: number }> {
    const now = new Date();
    const expiredHolds = await this.prisma.bookingHold.findMany({
      where: {
        expiresAt: { lt: now },
        isReleased: false,
      },
      include: {
        booking: true,
      },
    });

    let releasedCount = 0;
    for (const hold of expiredHolds) {
      await this.prisma.$transaction(async (tx) => {
        // Mark hold released
        await tx.bookingHold.update({
          where: { id: hold.id },
          data: { isReleased: true },
        });

        // Release allocations
        await tx.bedNightAllocation.deleteMany({
          where: {
            bookingItem: {
              bookingId: hold.bookingId,
            },
            status: BedAllocationStatus.HOLD,
          },
        });

        // If booking is still in PAYMENT_PENDING, cancel it
        if (hold.booking.status === BookingStatus.PAYMENT_PENDING) {
          await tx.booking.update({
            where: { id: hold.bookingId },
            data: { status: BookingStatus.CANCELLED },
          });

          await tx.bookingStateHistory.create({
            data: {
              bookingId: hold.bookingId,
              fromState: BookingStatus.PAYMENT_PENDING,
              toState: BookingStatus.CANCELLED,
              reason: 'Hold expired after 10 minutes without payment',
            },
          });
        }
      });
      releasedCount++;
    }

    if (releasedCount > 0) {
      this.logger.log(`Released ${releasedCount} expired booking holds`);
    }

    return { releasedCount };
  }

  /**
   * 3. Complete 5-Screen Checkout
   */
  async completeCheckout(params: CompleteCheckoutParams) {
    const { holdId, guest, couponCode, paymentMethod, idempotencyKey } = params;

    // 1. Fetch hold and verify validity
    const hold = await this.prisma.bookingHold.findUnique({
      where: { id: holdId },
      include: {
        booking: {
          include: {
            items: true,
            property: { include: { setting: true } },
          },
        },
      },
    });

    if (!hold) {
      throw new NotFoundException(`Hold with ID ${holdId} not found`);
    }

    if (hold.isReleased || new Date() > hold.expiresAt) {
      throw new BadRequestException('Hold has expired. Please select beds again.');
    }

    const booking = hold.booking;
    if (booking.status !== BookingStatus.PAYMENT_PENDING) {
      throw new BadRequestException(`Booking is in invalid state: ${booking.status}`);
    }

    // 2. Validate & apply coupon discount (Option B)
    let discountPaise = 0;
    let appliedCoupon: any = null;
    if (couponCode) {
      appliedCoupon = await this.prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });

      if (!appliedCoupon || !appliedCoupon.isActive) {
        throw new BadRequestException('Invalid or expired coupon code');
      }

      if (booking.totalBaseAmountPaise < appliedCoupon.minSpendPaise) {
        throw new BadRequestException(
          `Coupon requires a minimum spend of ₹${appliedCoupon.minSpendPaise / 100}`,
        );
      }

      if (appliedCoupon.isPercent) {
        discountPaise = Math.round(
          (booking.totalBaseAmountPaise * appliedCoupon.discountValue) / 100,
        );
        if (appliedCoupon.maxDiscountPaise && discountPaise > appliedCoupon.maxDiscountPaise) {
          discountPaise = appliedCoupon.maxDiscountPaise;
        }
      } else {
        discountPaise = appliedCoupon.discountValue;
      }
    }

    const finalPayablePaise = Math.max(0, booking.totalGrandAmountPaise - discountPaise);

    // 3. Atomically confirm booking, create GuestFolio, and confirm bed allocations
    return await this.prisma.$transaction(async (tx) => {
      // Update primary guest profile
      await tx.user.update({
        where: { id: booking.primaryGuestId },
        data: {
          fullName: guest.fullName,
          email: guest.email,
          phone: guest.phone,
        },
      });

      // Update booking guest record
      await tx.bookingGuest.create({
        data: {
          bookingId: booking.id,
          fullName: guest.fullName,
          email: guest.email,
          phone: guest.phone,
          isPrimary: true,
        },
      });

      // Confirm allocations (transition from HOLD to CONFIRMED)
      await tx.bedNightAllocation.updateMany({
        where: {
          bookingItem: {
            bookingId: booking.id,
          },
          status: BedAllocationStatus.HOLD,
        },
        data: {
          status: BedAllocationStatus.CONFIRMED,
        },
      });

      // Record successful payment (or desk payment)
      const payment = await tx.payment.create({
        data: {
          bookingId: booking.id,
          gatewayPaymentId: `pay_${crypto.randomBytes(8).toString('hex')}`,
          gatewayOrderId: `order_${crypto.randomBytes(8).toString('hex')}`,
          amountPaise: finalPayablePaise,
          currency: 'INR',
          status: PaymentStatus.SUCCEEDED,
          paymentMethod,
          idempotencyKey,
        },
      });

      // Create Guest Folio
      const folio = await tx.guestFolio.create({
        data: {
          bookingId: booking.id,
          status: FolioStatus.OPEN,
          totalChargesPaise: booking.totalGrandAmountPaise,
          totalPaymentsPaise: finalPayablePaise,
          balancePaise: 0,
        },
      });

      // Add Folio Line Items
      await tx.folioLineItem.create({
        data: {
          folioId: folio.id,
          itemType: FolioItemType.ACCOMMODATION,
          description: `Hostel Accommodation (${booking.totalNights} nights)`,
          amountPaise: booking.totalBaseAmountPaise,
        },
      });

      if (discountPaise > 0) {
        await tx.folioLineItem.create({
          data: {
            folioId: folio.id,
            itemType: FolioItemType.DISCOUNT,
            description: `Coupon Discount (${couponCode})`,
            amountPaise: -discountPaise,
          },
        });
      }

      await tx.folioLineItem.create({
        data: {
          folioId: folio.id,
          itemType: FolioItemType.PAYMENT_CREDIT,
          description: `Payment via ${paymentMethod}`,
          amountPaise: -finalPayablePaise,
        },
      });

      // Update Booking status to CONFIRMED
      const updatedBooking = await tx.booking.update({
        where: { id: booking.id },
        data: {
          status: BookingStatus.CONFIRMED,
          totalDiscountAmountPaise: discountPaise,
          totalGrandAmountPaise: finalPayablePaise,
        },
      });

      // Record state history
      await tx.bookingStateHistory.create({
        data: {
          bookingId: booking.id,
          fromState: BookingStatus.PAYMENT_PENDING,
          toState: BookingStatus.CONFIRMED,
          reason: 'Checkout completed and payment captured',
        },
      });

      return {
        bookingId: updatedBooking.id,
        bookingReference: updatedBooking.bookingReference,
        status: updatedBooking.status,
        checkInDate: updatedBooking.checkInDate,
        checkOutDate: updatedBooking.checkOutDate,
        guest: {
          fullName: guest.fullName,
          email: guest.email,
          phone: guest.phone,
        },
        payment: {
          paymentId: payment.id,
          method: payment.paymentMethod,
          amountPaise: payment.amountPaise,
          status: payment.status,
          formattedAmountINR: `₹${(payment.amountPaise / 100).toFixed(2)}`,
        },
        folioId: folio.id,
        preArrivalChecklist: {
          idVerificationRequired: true,
          arrivalOtpWillBeSent: true,
          roomAccessCodeUponArrival: true,
        },
      };
    });
  }

  /**
   * 4. Retrieve booking details
   */
  async findById(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        property: true,
        items: {
          include: {
            allocations: true,
          },
        },
        guests: true,
        payments: true,
        folio: {
          include: {
            lineItems: true,
            taxInvoices: true,
          },
        },
        accessCodes: {
          where: { status: 'ACTIVE' },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }

    return booking;
  }
}
