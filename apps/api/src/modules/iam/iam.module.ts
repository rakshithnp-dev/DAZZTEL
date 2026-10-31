import { Module } from '@nestjs/common';
import { AuthController, PrivacyController } from './iam.controller';
import { IamService } from './iam.service';
import { RolesGuard } from './guards/roles.guard';
import { PropertyScopeGuard } from './guards/property-scope.guard';
import { AuditLogInterceptor } from './interceptors/audit-log.interceptor';
import { PrismaService } from '../../common/prisma.service';

@Module({
  controllers: [AuthController, PrivacyController],
  providers: [
    IamService,
    PrismaService,
    RolesGuard,
    PropertyScopeGuard,
    AuditLogInterceptor,
  ],
  exports: [IamService, RolesGuard, PropertyScopeGuard, AuditLogInterceptor],
})
export class IamModule {}
