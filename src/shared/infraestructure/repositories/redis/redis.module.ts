import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_PORT, REDIS_URL } from '../../../constants/env';
export const REDIS_CLIENT = 'REDIS_CLIENT';
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: () => {
        return new Redis({
          host: REDIS_URL,
          port: REDIS_PORT,
        });
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}