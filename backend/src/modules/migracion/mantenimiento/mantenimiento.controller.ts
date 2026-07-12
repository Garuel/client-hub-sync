import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { MantenimientoMigracionService } from './mantenimiento.service';
import { ResponseAPI } from 'src/core/domain/interfaces/response-api.interface';

@Controller('migration')
export class MantenimientoMigracionController {
    constructor(
        private readonly mantenimientoService: MantenimientoMigracionService,
    ) { }

    @Post('run')
    @HttpCode(HttpStatus.OK)
    async ejecutarEtl(): Promise<ResponseAPI> {
        return this.mantenimientoService.ejecutarMigracion();
    }
}