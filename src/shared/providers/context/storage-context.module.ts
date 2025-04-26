import {Module, Global} from '@nestjs/common';
import {StorageContextService} from './storage-context.service';

@Global()
@Module({
  providers: [StorageContextService],
  exports: [StorageContextService],
})
export class StorageContextModule {}
