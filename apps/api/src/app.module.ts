import { Module } from '@nestjs/common';
import { PrismaService } from './common/prisma.service';
import { PropertyModule } from './modules/property/property.module';
import { AvailabilityModule } from './modules/availability/availability.module';
import { BookingModule } from './modules/booking/booking.module';
import { PmsModule } from './modules/pms/pms.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
  imports: [
    PropertyModule,
    AvailabilityModule,
    BookingModule,
    PmsModule,
    AnalyticsModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
