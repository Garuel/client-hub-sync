import { Test, TestingModule } from '@nestjs/testing';
import { ConsultaMigracionService } from './consulta.service';
import { ClienteRepository } from 'src/core/database/repositories';

describe('ConsultaMigracionService', () => {
  let service: ConsultaMigracionService;
  let repository: jest.Mocked<ClienteRepository>

  const mockClienteRepository = {
    findPaginado: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsultaMigracionService,
        {
          provide: ClienteRepository,
          useValue: mockClienteRepository,
        },
      ],
    }).compile();

    service = module.get<ConsultaMigracionService>(ConsultaMigracionService);
    repository = module.get(ClienteRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe aplicar paginación por defecto (limit=3, page=1) si no se proveen en el DTO', async () => {
    const mockClientes = [
      { publicKey: '123', tipoDocumento: { id: 1, abreviatura: 'DNI' } },
    ] as any;

    repository.findPaginado.mockResolvedValue([mockClientes, 1]);

    const result = await service.obtenerClientes({
      search: '',
      active: true,
      offset: 0,
      limit: 3,
    });

    expect(repository.findPaginado).toHaveBeenCalledWith({
      search: undefined,
      activo: undefined,
      migrado: undefined,
      offset: undefined,
      limit: 3,
    });

    expect(result.pagination).toEqual({
      totalItems: 1,
      itemsPerPage: 3,
      currentPage: 1,
    });
  });
});