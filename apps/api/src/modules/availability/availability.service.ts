import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { BedSegment, BedAllocationStatus } from '@prisma/client';

export interface SearchAvailabilityParams {
  propertyId: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  guestCount?: number;
  motorcycleStay?: boolean;
  needsParking?: boolean;
  needsLocker?: boolean;
}

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates array of dates between checkIn (inclusive) and checkOut (exclusive)
   */
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

  async search(params: SearchAvailabilityParams) {
    const { propertyId, checkInDate, checkOutDate, motorcycleStay } = params;
    const stayDates = this.getDatesInRange(checkInDate, checkOutDate);
    const totalNights = stayDates.length;

    // 1. Get Property and settings
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        setting: true,
        parkingSpaces: { where: { isActive: true } },
        gearLockers: { where: { isActive: true } },
      },
    });

    if (!property) {
      throw new BadRequestException(`Property with ID ${propertyId} not found`);
    }

    // 2. Fetch all active beds in this property
    const allBeds = await this.prisma.bed.findMany({
      where: {
        isActive: true,
        room: {
          propertyId,
          isActive: true,
        },
      },
      include: {
        room: true,
      },
      orderBy: [
        { room: { roomNumber: 'asc' } },
        { bedNumber: 'asc' },
      ],
    });

    // 3. Find all occupied or held bed-night allocations across the stay dates
    const activeAllocations = await this.prisma.bedNightAllocation.findMany({
      where: {
        calendarDate: { in: stayDates },
        status: { in: [BedAllocationStatus.HOLD, BedAllocationStatus.CONFIRMED, BedAllocationStatus.MAINTENANCE_BLOCK] },
      },
      select: {
        bedId: true,
        calendarDate: true,
      },
    });

    // Create a Set of occupied bed IDs
    const occupiedBedIds = new Set<string>();
    for (const alloc of activeAllocations) {
      occupiedBedIds.add(alloc.bedId);
    }

    // 4. Filter available beds
    const availableBeds = allBeds
      .filter((bed) => !occupiedBedIds.has(bed.id))
      .filter((bed) => {
        // If guest is not a motorcyclist, can they book motorcycle-reserved beds?
        // Prior to auto-release cutoff, motorcycle-reserved beds are reserved for motorcyclists.
        if (!motorcycleStay && bed.segment === BedSegment.MOTORCYCLE_RESERVED) {
          return false;
        }
        return true;
      })
      .map((bed) => ({
        bedId: bed.id,
        bedNumber: bed.bedNumber,
        roomId: bed.roomId,
        roomNumber: bed.room.roomNumber,
        roomType: bed.room.roomType,
        segment: bed.segment,
        pricePerNightPaise: bed.room.basePricePaise,
        totalStayPricePaise: bed.room.basePricePaise * totalNights,
      }));

    // Count motorcycle vs standard available beds
    const motorcycleBedsAvailable = availableBeds.filter(
      (b) => b.segment === BedSegment.MOTORCYCLE_RESERVED,
    ).length;

    // 5. Check parking spaces availability
    const occupiedParking = await this.prisma.bookableResourceReservation.findMany({
      where: {
        calendarDate: { in: stayDates },
        parkingSpaceId: { not: null },
      },
      select: { parkingSpaceId: true },
    });
    const occupiedParkingIds = new Set(occupiedParking.map((p) => p.parkingSpaceId));
    const parkingSpacesAvailable = property.parkingSpaces.filter(
      (p) => !occupiedParkingIds.has(p.id),
    ).length;

    // 6. Check gear lockers availability
    const occupiedLockers = await this.prisma.bookableResourceReservation.findMany({
      where: {
        calendarDate: { in: stayDates },
        gearLockerId: { not: null },
      },
      select: { gearLockerId: true },
    });
    const occupiedLockerIds = new Set(occupiedLockers.map((l) => l.gearLockerId));
    const gearLockersAvailable = property.gearLockers.filter(
      (l) => !occupiedLockerIds.has(l.id),
    ).length;

    return {
      propertyId: property.id,
      propertyName: property.name,
      checkInDate,
      checkOutDate,
      totalNights,
      availableBedsCount: availableBeds.length,
      motorcycleBedsAvailable,
      availableBeds,
      parkingSpacesAvailable,
      parkingDailyRatePaise: 10000, // ₹100/day
      gearLockersAvailable,
      gearLockerDailyRatePaise: 5000, // ₹50/day
      taxes: {
        cgstPercent: Number(property.setting?.cgstPercent ?? 6),
        sgstPercent: Number(property.setting?.sgstPercent ?? 6),
      },
    };
  }
}
