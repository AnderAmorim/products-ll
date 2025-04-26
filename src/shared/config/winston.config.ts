import {WinstonModuleOptions} from 'nest-winston';
import * as winston from 'winston';
import {transports} from 'winston';

export const winstonConfig: WinstonModuleOptions = {
  handleExceptions: true,
  transports: new transports.Console({
    format: winston.format.json(),
    level: process.env.LOG_LEVEL_ENABLED ?? 'info',
  }),
  level: process.env.LOG_LEVEL_ENABLED ?? 'info',
};
