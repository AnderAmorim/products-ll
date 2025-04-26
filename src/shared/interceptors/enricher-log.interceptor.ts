import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { StorageContextService } from '../providers/context/storage-context.service';
import * as contexts from '../constants/contexts';

@Injectable()
export class EnricherLogInterceptor implements NestInterceptor {
  constructor(private readonly storageContextService: StorageContextService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const traceId = uuidv4();
    this.storageContextService.setContext(contexts.CONTEXT_TRACE_ID, traceId);
    const request = context.switchToHttp().getRequest();
    if (request.user && request.user.id) {
      const userId = request.user.id;
      this.storageContextService.setContext(contexts.CONTEXT_USER_ID, userId);
    }
    if (request.body && request.body.product_id) {
      const productId = request.body.product_id;
      this.storageContextService.setContext(contexts.CONTEXT_PRODUCT_ID, productId);
    }
    return next.handle();
  }
}