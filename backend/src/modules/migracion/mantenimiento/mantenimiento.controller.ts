import { Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { EjecutarMigracionResponse } from './dto/migracion.dto';
import { MantenimientoMigracionService } from './mantenimiento.service';
import { JwtAuthGuard } from 'src/core/infrastructure/auth/guards/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseApiDto } from 'src/core/domain/classes/base-response-api.class';
import { ApiResponseWithData } from 'src/core/infrastructure/decorators/api-response.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('migration')
export class MantenimientoMigracionController {
    constructor(
        private readonly mantenimientoService: MantenimientoMigracionService,
    ) { }

    @Post('run')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Migrar clientes' })
    @ApiResponseWithData(EjecutarMigracionResponse)
    async ejecutarEtl(): Promise<ResponseApiDto<EjecutarMigracionResponse>> {
        return this.mantenimientoService.ejecutarMigracion();
    }
}