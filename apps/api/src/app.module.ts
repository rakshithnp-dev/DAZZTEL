import { Module } from '@nestjs/common';
import { PrismaService } from './common/prisma.service';
import { PropertyModule } from './modules/property/property.module';
import { AvailabilityModule } from './modules/availability/availability.module';
import { BookingModule } from './modules/booking/booking.module';

@Module({
  imports: [
    PropertyModule,
    AvailabilityModule,
    BookingModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
