import { Module } from '@nestjs/common';
import { ConsultaMigracionController } from './consulta.controller';
import { ConsultaMigracionService } from './consulta.service';

@Module({
  controllers: [ConsultaMigracionController],
  providers: [ConsultaMigracionService],
})
export class ConsultaMigracionModule {}
