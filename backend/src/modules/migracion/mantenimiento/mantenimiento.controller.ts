import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { EjecutarMigracionResponse } from './dto/migracion.dto';
import { MantenimientoMigracionService } from './mantenimiento.service';
import { ResponseAPI } from 'src/core/domain/interfaces/response-api.interface';

@Controller('migration')
export class MantenimientoMigracionController {
    constructor(
        private readonly mantenimientoService: MantenimientoMigracionService,
    ) { }

    @Post('run')
    @HttpCode(HttpStatus.OK)
    async ejecutarEtl(): Promise<ResponseAPI<EjecutarMigracionResponse>> {
        return this.mantenimientoService.ejecutarMigracion();
    }
}