import { Test, TestingModule } from '@nestjs/testing';
import { MantenimientoMigracionController } from './mantenimiento.controller';
import { MantenimientoMigracionService } from './mantenimiento.service';
import { TipoRespuestaEnum } from 'src/core/domain/enum/tipo-alerta.enum';

describe('MantenimientoController', () => {
  let controller: MantenimientoMigracionController;
  let service: jest.Mocked<MantenimientoMigracionService>


  const mockMantenimientoService = {
    ejecutarMigracion: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MantenimientoMigracionController],
      providers: [
        {
          provide: MantenimientoMigracionService,
          useValue: mockMantenimientoService,
        },
      ],
    }).compile();

    controller = module.get<MantenimientoMigracionController>(
      MantenimientoMigracionController,
    );
    service = module.get(MantenimientoMigracionService)
  });

  it('debe llamar al servicio ejecutarMigracion ', async () => {
    const mockResponse = {
      message: 'Migración exitosa',
      tipoRespuesta: TipoRespuestaEnum.Success,
      title: 'Migración',
      data: {
        registrosMigradosContador: 1
      },
    };

    service.ejecutarMigracion.mockResolvedValue(mockResponse as any);

    const result = await controller.ejecutarEtl();

    expect(service.ejecutarMigracion).toHaveBeenCalledWith();
    expect(result).toBe(mockResponse);
  });
});
