import { Module } from '@nestjs/common';
import { ConsultaMigracionModule } from './migracion/consulta/consulta.module';
import { MantenimientoMigracionModule } from './migracion/mantenimiento/mantenimiento.module';

@Module({
  imports: [MantenimientoMigracionModule, ConsultaMigracionModule],
})
export class ModulesModule { }
