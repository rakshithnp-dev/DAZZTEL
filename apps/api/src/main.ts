import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const logger = new Logger('HOTELYO-API');
  const app = await NestFactory.create(AppModule);

  // Global REST API Versioning: /api/v1
  app.setGlobalPrefix('api/v1');

  // Global Exception & Transform Interceptors
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // OpenAPI Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('HOTELYO Hospitality Platform API')
    .setDescription('Production-grade REST API for hostel management in India')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.API_PORT || 4000;
  await app.listen(port);
  logger.log(`HOTELYO REST API is running on http://localhost:${port}/api/v1`);
  logger.log(`OpenAPI Swagger documentation available on http://localhost:${port}/api/docs`);
}

bootstrap();
