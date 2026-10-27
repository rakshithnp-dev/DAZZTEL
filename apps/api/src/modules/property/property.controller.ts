import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PropertyService } from './property.service';

@ApiTags('Properties')
@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  @ApiOperation({ summary: 'List all active hostel properties' })
  async findAll() {
    return this.propertyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get property details with rooms, settings and amenities' })
  async findById(@Param('id') id: string) {
    return this.propertyService.findById(id);
  }
}
