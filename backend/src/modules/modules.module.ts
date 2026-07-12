import { Module } from '@nestjs/common';
import { MigrationModule } from './migracion/migracion.module';

@Module({
  imports: [MigrationModule],
})
export class ModulesModule { }
