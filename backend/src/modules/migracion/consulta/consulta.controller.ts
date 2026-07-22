import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ObtenerClientesDto, ObtenerClientesResponse } from '../consulta/dto/obtener-clientes.dto';
import { ConsultaMigracionService } from './consulta.service';
import { ApiExtraModels, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('migration')
export class ConsultaMigracionController {
    constructor(
        private readonly consultaService: ConsultaMigracionService,
    ) { }

    @Get('clients')
    @ApiExtraModels(ObtenerClientesDto)
    @ApiOperation({ summary: 'Obtener listado de clientes migrados con paginación' })
    @ApiResponse({
        status: 200,
        description: 'Lista paginada de clientes',
        type: ObtenerClientesResponse,
        isArray: true,
    })
    async obtenerClientes(
        @Query()
        filtrosDto: ObtenerClientesDto,
    ) {
        return this.consultaService.obtenerClientes(filtrosDto);
    }
}