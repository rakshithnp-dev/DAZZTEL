import { Module } from '@nestjs/common';
import { PmsController } from './pms.controller';
import { PmsService } from './pms.service';
import { PrismaService } from '../../common/prisma.service';

@Module({
  controllers: [PmsController],
  providers: [PmsService, PrismaService],
  exports: [PmsService],
})
export class PmsModule {}
