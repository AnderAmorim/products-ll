import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RepositoriesModule } from './shared/infraestructure/repositories/repositories.module';
import { DecodeUriPipe } from './shared/pipes/decode-uri.pipe';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { JWT_EXPIRATION_TIME, JWT_SECRET } from './shared/constants/env';
import { FavoritesModule } from './favorites/favorites.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    RepositoriesModule,
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
  ],
  controllers: [],
  providers: [DecodeUriPipe, JwtAuthGuard],
})
export class AppModule {}
