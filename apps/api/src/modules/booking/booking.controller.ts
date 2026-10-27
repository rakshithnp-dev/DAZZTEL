import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import {
  CreateBookingHoldSchema,
  CompleteCheckoutSchema,
} from '@hotelyo/validation';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('hold')
  @ApiOperation({ summary: 'Create a 10-minute inventory hold with database anti-double-booking invariant' })
  async createHold(@Body() body: any) {
    const parseResult = CreateBookingHoldSchema.safeParse(body);
    if (!parseResult.success) {
      throw new BadRequestException({
        code: 'VALIDATION_FAILED',
        message: 'Invalid booking hold parameters',
        details: parseResult.error.format(),
      });
    }

    return this.bookingService.createHold(parseResult.data);
  }

  @Post('checkout')
  @ApiOperation({ summary: 'Complete 5-screen checkout with guest info, coupon, and payment' })
  async completeCheckout(@Body() body: any) {
    const parseResult = CompleteCheckoutSchema.safeParse(body);
    if (!parseResult.success) {
      throw new BadRequestException({
        code: 'VALIDATION_FAILED',
        message: 'Invalid checkout parameters',
        details: parseResult.error.format(),
      });
    }

    return this.bookingService.completeCheckout(parseResult.data as any);
  }

  @Post('holds/release-expired')
  @ApiOperation({ summary: 'Manual or worker trigger to release expired booking holds' })
  async releaseExpiredHolds() {
    return this.bookingService.releaseExpiredHolds();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking details by ID' })
  async findById(@Param('id') id: string) {
    return this.bookingService.findById(id);
  }
}
