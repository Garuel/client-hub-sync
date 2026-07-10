import { Test, TestingModule } from '@nestjs/testing';
import { MantenimientoMigracionController } from './mantenimiento.controller';

describe('MantenimientoController', () => {
  let controller: MantenimientoMigracionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MantenimientoMigracionController],
    }).compile();

    controller = module.get<MantenimientoMigracionController>(
      MantenimientoMigracionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
