import { Test, TestingModule } from '@nestjs/testing';
import { ConsultaMigracionService } from './consulta.service';
import { ConsultaMigracionController } from './consulta.controller';

describe('ConsultaMigracionController', () => {
  let controller: ConsultaMigracionController;
  let service: jest.Mocked<ConsultaMigracionService>;

  const mockConsultaService = {
    obtenerClientes: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsultaMigracionController],
      providers: [
        {
          provide: ConsultaMigracionService,
          useValue: mockConsultaService,
        },
      ],
    }).compile();

    controller = module.get<ConsultaMigracionController>(ConsultaMigracionController);
    service = module.get(ConsultaMigracionService);
  });

  it('debe llamar al servicio obtenerClientes con el DTO correcto', async () => {
    const dto = { page: 1, limit: 10, search: 'Juan', active: true, offset: 0 };
    const mockResponse = { results: [], pagination: { totalItems: 0, itemsPerPage: 10, currentPage: 1 } };

    service.obtenerClientes.mockResolvedValue(mockResponse as any);

    const result = await controller.obtenerClientes(dto);

    expect(service.obtenerClientes).toHaveBeenCalledWith(dto);
    expect(result).toBe(mockResponse);
  });
});