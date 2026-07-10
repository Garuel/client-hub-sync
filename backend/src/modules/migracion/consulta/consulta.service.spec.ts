import { Test, TestingModule } from '@nestjs/testing';
import { ConsultaMigracionService } from './consulta.service';

describe('ConsultaService', () => {
  let service: ConsultaMigracionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsultaMigracionService],
    }).compile();

    service = module.get<ConsultaMigracionService>(ConsultaMigracionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
