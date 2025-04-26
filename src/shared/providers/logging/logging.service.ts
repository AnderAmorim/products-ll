import {Inject, Injectable} from '@nestjs/common';
import {WINSTON_MODULE_PROVIDER} from 'nest-winston';
import {Logger} from 'winston';
import {ILogging, LoggingMetadata} from './logging.interface';
import {StorageContextService} from '../context';
import { APP_NAME } from '../../constants/env';

@Injectable()
export class LoggingService implements ILogging {
  private appName: string;
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly contextService: StorageContextService,
  ) {
    this.appName = APP_NAME;
  }

  private enrichData(data?: object): object {
    const context = this.contextService.getAllContext();
    return {...context, ...data};
  }

  async info(message: string, data?: Partial<LoggingMetadata>): Promise<void> {
    this.logger.info(`${this.appName} - ${message}`, this.enrichData(data));
  }

  async error(message: string, data?: Partial<LoggingMetadata>): Promise<void> {
    this.logger.error(`${this.appName} - ${message}`, this.enrichData(data));
  }
}
