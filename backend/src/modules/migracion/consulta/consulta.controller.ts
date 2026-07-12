import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ObtenerClientesDto } from '../consulta/dto/obtener-clientes.dto';
import { ConsultaMigracionService } from './consulta.service';

@Controller('migration')
export class ConsultaMigracionController {
    constructor(
        private readonly consultaService: ConsultaMigracionService,
    ) { }

    @Get('clients')
    async obtenerClientes(
        @Query(new ValidationPipe({ transform: true }))
        filtrosDto: ObtenerClientesDto,
    ) {
        return this.consultaService.obtenerClientes(filtrosDto);
    }
}