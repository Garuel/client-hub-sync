import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './core/infrastructure/interceptors/response.interceptor';
import { DatabaseExceptionFilter } from './core/infrastructure/filters/database.exception.filters';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const PORT = config.get<number>('PORT', 5523);
  const CONTEXT = config.get<string>('CONTEXT');
  const CORS_ENV = config.get<string>('CORS');

  if (CONTEXT) {
    app.setGlobalPrefix(CONTEXT);
  }

  const allowedOrigins = CORS_ENV
    ? CORS_ENV.split(',').map((origin) => origin.trim())
    : ['http://localhost:5173'];

  app.enableCors({
    credentials: true,
    origin: allowedOrigins,
    exposedHeaders: ['filename'],
    allowedHeaders: [
      'x-requested-with',
      'content-type',
      'authorization',
      'accept',
      'refresh',
      'x-api-key',
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new DatabaseExceptionFilter());

  const SWAGGER_TITLE = 'Client Sync Transformer API';
  const SWAGGER_VERSION = '1.0';

  const swaggerConfig = new DocumentBuilder()
    .setTitle(SWAGGER_TITLE)
    .setDescription('API de integración y migración de clientes')
    .setVersion(SWAGGER_VERSION)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);



  await app.listen(PORT);

  Logger.debug(
    `====== CLIENT SYNC TRANSFORMER RUNNING ON PORT ${PORT} ======`,
    'Application',
  );
}
bootstrap();