import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

const PORT = process.env.PORT || 5523;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  await app.listen(config.get<number>(`${PORT}`, 3000));


  Logger.debug(
    `====== CLIENT SYNC TRANSFORMER RUNNING [${process.env.NODE_ENV}] ======`,
    'Application',
  );
}
bootstrap();
