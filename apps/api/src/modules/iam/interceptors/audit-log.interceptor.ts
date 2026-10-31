import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../../common/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, ip, headers } = request;

    // Only audit mutating state changes (POST, PUT, PATCH, DELETE)
    const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase());

    return next.handle().pipe(
      tap(async (responseBody) => {
        if (!isMutation) return;

        try {
          const actorId = user?.id && user.id.length === 36 ? user.id : null;
          await this.prisma.auditLog.create({
            data: {
              id: crypto.randomUUID(),
              action: `${method.toUpperCase()} ${url}`,
              resourceType: url.split('/')[3] || 'GENERAL',
              resourceId: request.params?.id || request.params?.bookingId || 'N/A',
              actorUserId: actorId,
              ipAddress: ip || (headers['x-forwarded-for'] as string) || '127.0.0.1',
              userAgent: headers['user-agent'] || 'Unknown',
              diffJson: {
                requestBody: request.body ? { ...request.body, password: '[REDACTED]' } : null,
                responseStatus: 'SUCCESS',
              },
            },
          });
        } catch (err) {
          // Failure to log in audit trail shouldn't break the response, but log to error output
          console.error('[AuditLogInterceptor] Failed to write audit record:', err);
        }
      })
    );
  }
}
