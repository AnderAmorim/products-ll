import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Global } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AUTHORIZATION_HEADER_NOT_FOUND,
  ACCESS_TOKEN_NOT_PROVIDED,
  INVALID_OR_EXPIRED_ACCESS_TOKEN,
} from '../../shared/constants/http-response-description';

@Global()
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException(AUTHORIZATION_HEADER_NOT_FOUND);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException(ACCESS_TOKEN_NOT_PROVIDED);
    }

    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException(INVALID_OR_EXPIRED_ACCESS_TOKEN);
    }
  }
}