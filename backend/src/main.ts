// main.ts (Tu versión personal profesionalizada)
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

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


  await app.listen(PORT);

  Logger.debug(
    `====== CLIENT SYNC TRANSFORMER RUNNING ON PORT ${PORT} ======`,
    'Application',
  );
}
bootstrap();