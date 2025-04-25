// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { LoginService } from './services/login.service';
import { AuthController } from './controller/auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { JWT_EXPIRATION_TIME } from '../shared/constants/env';
import { LoginHandler } from './commands/login.handler';

@Module({
  imports: [
    CqrsModule,
    PassportModule,
    JwtModule.register({
      secret: 'JWT_SECRET',
      signOptions: { expiresIn: JWT_EXPIRATION_TIME },
    }),
  ],
  providers: [
    LoginHandler,
    LoginService,
    JwtStrategy,
    JwtAuthGuard,
  ],
  controllers: [AuthController],
  exports: [
    JwtModule,
    LoginService,
    JwtAuthGuard,
  ],
})
export class AuthModule {}
