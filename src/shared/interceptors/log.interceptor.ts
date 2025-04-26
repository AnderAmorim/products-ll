import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ILogging, ILoggingToken } from '../providers/logging';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  constructor(
    @Inject(ILoggingToken) private readonly logger: ILogging,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const startTime = Date.now();

    this.logger.info(`Incoming Request: ${method} ${url}`);

    return next.handle().pipe(
      tap(() => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        this.logger.info(`Request Completed: ${method} ${url} - ${duration}ms`);
      }),
    );
  }
}