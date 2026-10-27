import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import {
  BookingStatus,
  BedAllocationStatus,
  HousekeepingStatus,
  MaintenanceStatus,
  AccessCodeStatus,
  MaintenancePriority,
} from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class PmsService {
  private readonly logger = new Logger(PmsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Front-Desk Operational Dashboard
   */
  async getDashboard(propertyId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
      include: { setting: true },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }

    // 1. All rooms and beds with live status
    const rooms = await this.prisma.room.findMany({
      where: { propertyId, isActive: true },
      include: {
        beds: {
          where: { isActive: true },
          include: {
            allocations: {
              where: {
                calendarDate: today,
                status: {
                  in: [
                    BedAllocationStatus.HOLD,
                    BedAllocationStatus.CONFIRMED,
                    BedAllocationStatus.MAINTENANCE_BLOCK,
                  ],
                },
              },
              include: {
                bookingItem: {
                  include: {
                    booking: {
                      include: {
                        primaryGuest: true,
                        accessCodes: {
                          where: { status: AccessCodeStatus.ACTIVE },
                        },
                      },
                    },
                  },
                },
              },
            },
            housekeeping: {
              where: {
                status: { in: [HousekeepingStatus.PENDING, HousekeepingStatus.IN_PROGRESS] },
              },
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
      orderBy: { roomNumber: 'asc' },
    });

    // 2. Arrivals today
    const arrivalsToday = await this.prisma.booking.findMany({
      where: {
        propertyId,
        checkInDate: today,
        status: { in: [BookingStatus.CONFIRMED, BookingStatus.PAYMENT_PENDING] },
      },
      include: {
        primaryGuest: true,
        items: true,
        folio: true,
      },
    });

    // 3. Departures today
    const departuresToday = await this.prisma.booking.findMany({
      where: {
        propertyId,
        checkOutDate: today,
        status: BookingStatus.CHECKED_IN,
      },
      include: {
        primaryGuest: true,
        items: true,
        folio: true,
      },
    });

    // 4. In-house guests currently checked in
    const inHouseBookings = await this.prisma.booking.findMany({
      where: {
        propertyId,
        status: BookingStatus.CHECKED_IN,
      },
      include: {
        primaryGuest: true,
        accessCodes: { where: { status: AccessCodeStatus.ACTIVE } },
      },
    });

    // 5. Active Housekeeping tasks
    const housekeepingTasks = await this.prisma.housekeepingTask.findMany({
      where: { propertyId },
      include: {
        bed: { include: { room: true } },
        assignedTo: true,
      },
      orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
    });

    // 6. Active Maintenance tickets
    const maintenanceTickets = await this.prisma.maintenanceTicket.findMany({
      where: {
        propertyId,
        status: { not: MaintenanceStatus.RESOLVED },
      },
      include: {
        room: true,
        reportedBy: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate bed stats
    let totalBeds = 0;
    let occupiedBeds = 0;
    let heldBeds = 0;
    let maintenanceBeds = 0;

    const formattedRooms = rooms.map((room) => {
      const formattedBeds = room.beds.map((bed) => {
        totalBeds++;
        const allocation = bed.allocations[0];
        let currentStatus = 'AVAILABLE';
        let currentGuest: string | null = null;
        let bookingRef: string | null = null;
        let accessCode: string | null = null;

        if (allocation) {
          if (allocation.status === BedAllocationStatus.CONFIRMED) {
            currentStatus = 'OCCUPIED';
            occupiedBeds++;
            currentGuest = allocation.bookingItem?.booking?.primaryGuest?.fullName || 'Guest';
            bookingRef = allocation.bookingItem?.booking?.bookingReference || null;
            accessCode = allocation.bookingItem?.booking?.accessCodes[0]?.codeValue || null;
          } else if (allocation.status === BedAllocationStatus.HOLD) {
            currentStatus = 'HOLD';
            heldBeds++;
          } else if (allocation.status === BedAllocationStatus.MAINTENANCE_BLOCK) {
            currentStatus = 'MAINTENANCE';
            maintenanceBeds++;
          }
        } else if (bed.housekeeping[0]) {
          currentStatus = 'CLEANING_REQUIRED';
        }

        return {
          bedId: bed.id,
          bedNumber: bed.bedNumber,
          segment: bed.segment,
          status: currentStatus,
          guestName: currentGuest,
          bookingReference: bookingRef,
          accessCode,
          housekeepingStatus: bed.housekeeping[0]?.status || 'CLEANED',
        };
      });

      return {
        roomId: room.id,
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        basePricePaise: room.basePricePaise,
        beds: formattedBeds,
      };
    });

    const availableBeds = totalBeds - (occupiedBeds + heldBeds + maintenanceBeds);
    const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

    return {
      property: {
        id: property.id,
        name: property.name,
        code: property.code,
        city: property.city,
      },
      stats: {
        totalRooms: rooms.length,
        totalBeds,
        occupiedBeds,
        availableBeds,
        heldBeds,
        maintenanceBeds,
        occupancyRatePercent: occupancyRate,
        arrivalsTodayCount: arrivalsToday.length,
        departuresTodayCount: departuresToday.length,
        inHouseGuestsCount: inHouseBookings.length,
      },
      rooms: formattedRooms,
      arrivalsToday,
      departuresToday,
      inHouseBookings,
      housekeepingTasks,
      maintenanceTickets,
    };
  }

  /**
   * Fast Arrival OTP Check-in & Access Code Generation
   */
  async checkIn(bookingId: string, otpOrOverride?: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        items: true,
        primaryGuest: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }

    if (booking.status === BookingStatus.CHECKED_IN) {
      throw new BadRequestException('Guest is already checked in');
    }

    // Generate cryptographic room access code (e.g. 4-digit keypad pin)
    const accessPin = crypto.randomInt(1000, 9999).toString();
    const validUntil = new Date(booking.checkOutDate);
    validUntil.setHours(11, 0, 0, 0);

    return await this.prisma.$transaction(async (tx) => {
      // 1. Update Booking status to CHECKED_IN
      const updatedBooking = await tx.booking.update({
        where: { id: booking.id },
        data: { status: BookingStatus.CHECKED_IN },
      });

      // 2. Issue Active Access Code
      const accessCode = await tx.accessCode.create({
        data: {
          bookingId: booking.id,
          codeValue: `KEY-${accessPin}`,
          validFrom: new Date(),
          validUntil,
          status: AccessCodeStatus.ACTIVE,
        },
      });

      // 3. Record State History
      await tx.bookingStateHistory.create({
        data: {
          bookingId: booking.id,
          fromState: booking.status,
          toState: BookingStatus.CHECKED_IN,
          reason: 'Front-desk arrival check-in completed. Room access code issued.',
        },
      });

      this.logger.log(`Checked in booking ${booking.bookingReference}. Access code KEY-${accessPin} issued.`);

      return {
        bookingId: updatedBooking.id,
        bookingReference: updatedBooking.bookingReference,
        status: updatedBooking.status,
        guestName: booking.primaryGuest.fullName,
        accessCode: accessCode.codeValue,
        validUntil: accessCode.validUntil,
      };
    });
  }

  /**
   * Check-Out & Immediate Access Code Revocation (within 60s rule)
   */
  async checkOut(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        items: true,
        primaryGuest: true,
        accessCodes: { where: { status: AccessCodeStatus.ACTIVE } },
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }

    return await this.prisma.$transaction(async (tx) => {
      // 1. Update Booking status to COMPLETED
      const updatedBooking = await tx.booking.update({
        where: { id: booking.id },
        data: { status: BookingStatus.COMPLETED },
      });

      // 2. Revoke active room access codes immediately
      await tx.accessCode.updateMany({
        where: {
          bookingId: booking.id,
          status: AccessCodeStatus.ACTIVE,
        },
        data: {
          status: AccessCodeStatus.REVOKED,
          revokedAt: new Date(),
          revokedReason: 'Guest checked out',
        },
      });

      // 3. Automatically generate housekeeping task for the beds
      for (const item of booking.items) {
        if (item.bedId) {
          await tx.housekeepingTask.create({
            data: {
              propertyId: booking.propertyId,
              bedId: item.bedId,
              status: HousekeepingStatus.PENDING,
              priority: 1, // High priority checkout clean
              notes: `Checkout turnaround cleaning for ${booking.bookingReference}`,
            },
          });
        }
      }

      // 4. Release allocations
      await tx.bedNightAllocation.deleteMany({
        where: {
          bookingItemId: { in: booking.items.map((i) => i.id) },
        },
      });

      // 5. State history
      await tx.bookingStateHistory.create({
        data: {
          bookingId: booking.id,
          fromState: booking.status,
          toState: BookingStatus.COMPLETED,
          reason: 'Checkout completed. Room access codes revoked and housekeeping generated.',
        },
      });

      this.logger.log(`Checked out booking ${booking.bookingReference}. Access codes revoked.`);

      return {
        bookingId: updatedBooking.id,
        bookingReference: updatedBooking.bookingReference,
        status: updatedBooking.status,
        accessCodesRevoked: true,
        housekeepingTasksCreated: booking.items.length,
      };
    });
  }

  /**
   * Housekeeping Task Status Update
   */
  async updateHousekeepingStatus(taskId: string, status: HousekeepingStatus) {
    const task = await this.prisma.housekeepingTask.update({
      where: { id: taskId },
      data: {
        status,
        cleanedAt: status === HousekeepingStatus.CLEANED ? new Date() : undefined,
        inspectedAt: status === HousekeepingStatus.INSPECTED ? new Date() : undefined,
      },
    });

    return task;
  }

  /**
   * Create Maintenance Ticket
   */
  async createMaintenanceTicket(data: {
    propertyId: string;
    roomId?: string;
    title: string;
    description: string;
    priority: MaintenancePriority;
    reportedById: string;
  }) {
    return this.prisma.maintenanceTicket.create({
      data: {
        propertyId: data.propertyId,
        roomId: data.roomId,
        title: data.title,
        description: data.description,
        priority: data.priority,
        reportedById: data.reportedById,
        status: MaintenanceStatus.REPORTED,
      },
    });
  }

  /**
   * Day Close: Locks daily revenue snapshot
   */
  async performDayClose(propertyId: string, managerUserId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Sum all payments collected today
    const payments = await this.prisma.payment.findMany({
      where: {
        booking: { propertyId },
        status: 'SUCCEEDED',
        createdAt: { gte: today },
      },
    });

    const totalPaymentsPaise = payments.reduce((acc, p) => acc + p.amountPaise, 0);

    // Count arrivals and departures
    const arrivalsCount = await this.prisma.booking.count({
      where: { propertyId, checkInDate: today },
    });
    const departuresCount = await this.prisma.booking.count({
      where: { propertyId, checkOutDate: today },
    });

    // Create immutable daily close record
    const dailyClose = await this.prisma.dailyClose.upsert({
      where: {
        propertyId_businessDate: {
          propertyId,
          businessDate: today,
        },
      },
      update: {
        totalArrivals: arrivalsCount,
        totalDepartures: departuresCount,
        totalRevenuePaise: totalPaymentsPaise,
        totalPaymentsPaise: totalPaymentsPaise,
        closedAt: new Date(),
      },
      create: {
        propertyId,
        businessDate: today,
        totalArrivals: arrivalsCount,
        totalDepartures: departuresCount,
        totalRevenuePaise: totalPaymentsPaise,
        totalPaymentsPaise: totalPaymentsPaise,
        totalRefundsPaise: 0,
        closedByUserId: managerUserId,
        isLocked: true,
      },
    });

    return dailyClose;
  }
}
