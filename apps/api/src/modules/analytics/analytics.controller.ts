import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get platform-wide or property-specific occupancy and revenue analytics' })
  async getOverview(@Query('propertyId') propertyId?: string) {
    return this.analyticsService.getOverview(propertyId);
  }
}
