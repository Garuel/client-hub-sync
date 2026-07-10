import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModulesModule } from './modules/modules.module';
import { DatabaseModule } from './core/database/database.module';
import { ClienteEntity, TipoDocumentoEntity } from './core/database/entities';
import { envValidationSchema } from './core/infrastructure/config/validator.config';
import { ClienteMigracionEntity } from './core/database/entities/core/cliente-migracion.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: Number(configService.get<number>('DATABASE_PORT', 5432)),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [ClienteEntity, TipoDocumentoEntity, ClienteMigracionEntity],
        ssl:
          configService.get('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    ModulesModule,
  ],
})
export class AppModule { }
