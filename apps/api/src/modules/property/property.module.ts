import { Module } from '@nestjs/common';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { PrismaService } from '../../common/prisma.service';

@Module({
  controllers: [PropertyController],
  providers: [PropertyService, PrismaService],
  exports: [PropertyService],
})
export class PropertyModule {}
