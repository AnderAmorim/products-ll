import {Global, Module} from '@nestjs/common';
import {LoggingService} from './logging.service';
import {ILoggingToken} from './logging.interface';

@Global()
@Module({
  providers: [
    {
      provide: ILoggingToken,
      useClass: LoggingService,
    },
  ],
  exports: [
    {
      provide: ILoggingToken,
      useClass: LoggingService,
    },
  ],
})
export class LoggingModule {}
