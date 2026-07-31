import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MigrationModule } from './migracion/migracion.module';

@Module({
  imports: [AuthModule, MigrationModule,],
})
export class ModulesModule { }
