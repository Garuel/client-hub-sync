import { Module } from '@nestjs/common';
import { MantenimientoMigracionController } from './mantenimiento.controller';
import { MantenimientoMigracionService } from './mantenimiento.service';

@Module({
  controllers: [MantenimientoMigracionController],
  providers: [MantenimientoMigracionService],
})
export class MantenimientoMigracionModule {}
