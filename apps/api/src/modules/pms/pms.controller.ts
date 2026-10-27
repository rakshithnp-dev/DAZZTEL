import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PmsService } from './pms.service';
import { HousekeepingStatus, MaintenancePriority } from '@prisma/client';

@ApiTags('PMS')
@Controller('pms')
export class PmsController {
  constructor(private readonly pmsService: PmsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get live front-desk PMS operational dashboard' })
  async getDashboard(@Query('propertyId') propertyId: string) {
    return this.pmsService.getDashboard(propertyId);
  }

  @Post('check-in/:bookingId')
  @ApiOperation({ summary: 'Verify arrival and check in guest, issuing active room access code' })
  async checkIn(
    @Param('bookingId') bookingId: string,
    @Body('otp') otp?: string,
  ) {
    return this.pmsService.checkIn(bookingId, otp);
  }

  @Post('check-out/:bookingId')
  @ApiOperation({ summary: 'Check out guest, revoke access code immediately, and generate housekeeping task' })
  async checkOut(@Param('bookingId') bookingId: string) {
    return this.pmsService.checkOut(bookingId);
  }

  @Patch('housekeeping/:taskId/status')
  @ApiOperation({ summary: 'Update housekeeping task status' })
  async updateHousekeepingStatus(
    @Param('taskId') taskId: string,
    @Body('status') status: HousekeepingStatus,
  ) {
    return this.pmsService.updateHousekeepingStatus(taskId, status);
  }

  @Post('maintenance')
  @ApiOperation({ summary: 'Create maintenance ticket' })
  async createMaintenanceTicket(
    @Body()
    body: {
      propertyId: string;
      roomId?: string;
      title: string;
      description: string;
      priority: MaintenancePriority;
      reportedById: string;
    },
  ) {
    return this.pmsService.createMaintenanceTicket(body);
  }

  @Post('day-close')
  @ApiOperation({ summary: 'Execute daily close and lock property revenue snapshot' })
  async performDayClose(
    @Body('propertyId') propertyId: string,
    @Body('managerUserId') managerUserId: string,
  ) {
    return this.pmsService.performDayClose(propertyId, managerUserId);
  }
}
