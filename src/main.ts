import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PORT } from './shared/constants/env';
import * as winston from 'winston';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Products API')
    .setDescription('API para gerenciamento de produtos e usuários')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('products')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = PORT || 3002;
  console.log(`Server running on port ${port}`);
  const logger = app.get<winston.Logger>(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  await app.listen(port);
}
bootstrap();
