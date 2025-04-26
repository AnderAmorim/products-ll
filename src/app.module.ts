import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RepositoriesModule } from './shared/infraestructure/repositories/repositories.module';
import { DecodeUriPipe } from './shared/pipes/decode-uri.pipe';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { JWT_EXPIRATION_TIME, JWT_SECRET } from './shared/constants/env';
import { FavoritesModule } from './favorites/favorites.module';
import { ProductsModule } from './products/products.module';
import { RepositoriesCacheModule } from './shared/infraestructure/repositories/repositories-cache.module';
import { LoggingModule } from './shared/providers/logging';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './shared/config/winston.config';
import { StorageContextModule } from './shared/providers/context';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EnricherLogInterceptor } from './shared/interceptors/enricher-log.interceptor';
import { LogInterceptor } from './shared/interceptors/log.interceptor';

@Module({
  imports: [
    RepositoriesModule,
    RepositoriesCacheModule,
    AuthModule,
    UserModule,
    FavoritesModule,
    ProductsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: JWT_EXPIRATION_TIME },
    }),
    StorageContextModule,
    WinstonModule.forRoot(winstonConfig),
    LoggingModule,
  ],
  controllers: [],
  providers: [
    DecodeUriPipe,
    JwtAuthGuard,
    {
      provide: APP_INTERCEPTOR,
      useClass: EnricherLogInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LogInterceptor,
    }
  ],
})
export class AppModule {}
