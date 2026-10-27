import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AvailabilityService } from './availability.service';
import { AvailabilitySearchSchema } from '@hotelyo/validation';

@ApiTags('Availability')
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search available beds, rooms, motorcycle parking, and gear lockers' })
  @ApiQuery({ name: 'propertyId', required: true })
  @ApiQuery({ name: 'checkInDate', required: true, example: '2026-11-01' })
  @ApiQuery({ name: 'checkOutDate', required: true, example: '2026-11-04' })
  @ApiQuery({ name: 'guestCount', required: false, example: 1 })
  @ApiQuery({ name: 'motorcycleStay', required: false, example: true })
  async search(@Query() query: any) {
    const parseResult = AvailabilitySearchSchema.safeParse(query);
    if (!parseResult.success) {
      throw new BadRequestException({
        code: 'VALIDATION_FAILED',
        message: 'Invalid availability search parameters',
        details: parseResult.error.format(),
      });
    }

    return this.availabilityService.search(parseResult.data);
  }
}
