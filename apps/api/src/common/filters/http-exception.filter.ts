import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = 'An unexpected error occurred';
    let details: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;
      code = typeof res === 'object' && res.code ? res.code : exception.name;
      message = typeof res === 'object' && res.message ? res.message : exception.message;
      details = typeof res === 'object' && res.details ? res.details : null;
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002: Unique constraint failed
      if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        code = 'DOUBLE_BOOKING_CONFLICT';
        message = 'One or more requested beds or resources are no longer available for the selected dates.';
        details = {
          fields: exception.meta?.target,
        };
      } else if (exception.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        code = 'RESOURCE_NOT_FOUND';
        message = 'The requested resource was not found.';
      } else {
        code = `PRISMA_${exception.code}`;
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    this.logger.error(`[${request.method}] ${request.url} - Status: ${status} - Error: ${message}`, (exception as any)?.stack);

    response.status(status).json({
      success: false,
      data: null,
      error: {
        code,
        message,
        details,
      },
      meta: {
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    });
  }
}
