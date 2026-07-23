import { Test, TestingModule } from '@nestjs/testing';
import { MantenimientoMigracionService } from './mantenimiento.service';
import { ClienteRepository } from 'src/core/database/repositories';
import { ClienteMigracionRepository } from 'src/core/database/repositories/core/cliente-migracion/cliente-migracion.repository';
import { DataSource } from 'typeorm';
import { TipoRespuestaEnum } from 'src/core/domain/enum/tipo-alerta.enum';

describe('MantenimientoMigracionService', () => {
  let service: MantenimientoMigracionService;

  const mockClienteRepo = { insert: jest.fn() };
  const mockClienteMigracionRepo = { insert: jest.fn() };

  const mockDataSource = {
    transaction: jest.fn().mockImplementation(async (cb) => {
      const fakeManager = {
        withRepository: (repo: any) => {
          if (repo === mockClienteRepo) return mockClienteRepo;
          if (repo === mockClienteMigracionRepo) return mockClienteMigracionRepo;
          return repo;
        },
      };
      return await cb(fakeManager);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MantenimientoMigracionService,
        { provide: DataSource, useValue: mockDataSource },
        { provide: ClienteRepository, useValue: mockClienteRepo },
        { provide: ClienteMigracionRepository, useValue: mockClienteMigracionRepo },
      ],
    }).compile();

    service = module.get<MantenimientoMigracionService>(MantenimientoMigracionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe ejecutar la migración exitosamente', async () => {
    mockClienteRepo.insert.mockResolvedValue({
      raw: [
        { id: 1, publicKey: 'CLI-uuid-1' },
        { id: 2, publicKey: 'CLI-uuid-2' },
        { id: 3, publicKey: 'CLI-uuid-3' },
      ],
    });
    mockClienteMigracionRepo.insert.mockResolvedValue({});

    const result = await service.ejecutarMigracion();

    expect(result).toEqual({
      message: 'Migración exitosa',
      tipoRespuesta: TipoRespuestaEnum.Success,
      title: 'Migración',
      data: {
        registrosMigradosContador: 3,
      },
    });
    expect(mockClienteRepo.insert).toHaveBeenCalledTimes(1);
    expect(mockClienteMigracionRepo.insert).toHaveBeenCalledTimes(1);
  });
});