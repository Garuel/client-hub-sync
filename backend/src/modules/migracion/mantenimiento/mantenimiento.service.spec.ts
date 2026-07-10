import { Test, TestingModule } from '@nestjs/testing';
import { MantenimientoMigracionService } from './mantenimiento.service';

describe('MantenimientoService', () => {
  let service: MantenimientoMigracionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MantenimientoMigracionService],
    }).compile();

    service = module.get<MantenimientoMigracionService>(
      MantenimientoMigracionService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
