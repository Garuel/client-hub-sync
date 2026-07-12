import { Module } from '@nestjs/common';
import { ConsultaMigracionModule } from './consulta/consulta.module';
import { MantenimientoMigracionModule } from './mantenimiento/mantenimiento.module';

@Module({
    imports: [MantenimientoMigracionModule, ConsultaMigracionModule],
})
export class MigrationModule { }
