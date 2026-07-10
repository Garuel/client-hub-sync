import { Test, TestingModule } from '@nestjs/testing';
import { ConsultaMigracionController } from './consulta.controller';

describe('ConsultaController', () => {
  let controller: ConsultaMigracionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsultaMigracionController],
    }).compile();

    controller = module.get<ConsultaMigracionController>(
      ConsultaMigracionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
