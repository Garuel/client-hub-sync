import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/infrastructure/auth/guards/jwt.guard';
import { ObtenerClientesDto, ObtenerClientesResponse } from '../consulta/dto/obtener-clientes.dto';
import { ConsultaMigracionService } from './consulta.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
    })
    async obtenerClientes(
        @Query()
        filtrosDto: ObtenerClientesDto,
    ) {
        return this.consultaService.obtenerClientes(filtrosDto);
    }
}