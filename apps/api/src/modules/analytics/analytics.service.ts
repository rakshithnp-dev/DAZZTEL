import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(propertyId?: string) {
    const whereClause = propertyId ? { propertyId } : {};

    // 1. Total bookings count
    const totalBookings = await this.prisma.booking.count({ where: whereClause });
    const confirmedBookings = await this.prisma.booking.count({
      where: { ...whereClause, status: { in: ['CONFIRMED', 'CHECKED_IN', 'COMPLETED'] } },
    });
    const cancelledBookings = await this.prisma.booking.count({
      where: { ...whereClause, status: 'CANCELLED' },
    });

    // 2. Revenue calculations
    const allSuccessfulPayments = await this.prisma.payment.findMany({
      where: {
        booking: whereClause,
        status: 'SUCCEEDED',
      },
    });

    const grossRevenuePaise = allSuccessfulPayments.reduce(
      (acc, p) => acc + p.amountPaise,
      0,
    );
    const totalRefundsPaise = allSuccessfulPayments.reduce(
      (acc, p) => acc + p.refundedAmountPaise,
      0,
    );
    const netRevenuePaise = grossRevenuePaise - totalRefundsPaise;

    // 3. Beds & Occupancy
    const totalBedsCount = await this.prisma.bed.count({
      where: propertyId ? { room: { propertyId } } : {},
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const occupiedBedsCount = await this.prisma.bedNightAllocation.count({
      where: {
        calendarDate: today,
        status: { in: ['HOLD', 'CONFIRMED'] },
        bed: propertyId ? { room: { propertyId } } : {},
      },
    });

    const occupancyRate =
      totalBedsCount > 0 ? Math.round((occupiedBedsCount / totalBedsCount) * 100) : 0;

    // 4. Recent bookings
    const recentBookings = await this.prisma.booking.findMany({
      where: whereClause,
      include: {
        primaryGuest: true,
        property: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // 5. Audit logs
    const auditLogs = await this.prisma.auditLog.findMany({
      include: { actor: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // 6. Properties list
    const properties = await this.prisma.property.findMany({
      include: {
        _count: { select: { rooms: true, bookings: true } },
      },
    });

    return {
      metrics: {
        grossRevenueINR: (grossRevenuePaise / 100).toFixed(2),
        netRevenueINR: (netRevenuePaise / 100).toFixed(2),
        totalRefundsINR: (totalRefundsPaise / 100).toFixed(2),
        totalBookings,
        confirmedBookings,
        cancelledBookings,
        totalBedsCount,
        occupiedBedsCount,
        occupancyRatePercent: occupancyRate,
      },
      recentBookings,
      auditLogs,
      properties,
    };
  }
}
