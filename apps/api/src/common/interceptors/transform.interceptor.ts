import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StandardApiResponse<T> {
  success: boolean;
  data: T;
  error: null;
  meta: {
    timestamp: string;
  };
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, StandardApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardApiResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        error: null,
        meta: {
          timestamp: new Date().toISOString(),
        },
      })),
    );
  }
}
