import { Test, TestingModule } from '@nestjs/testing';
import { MantenimientoMigracionService } from './mantenimiento.service';
import { ClienteRepository } from 'src/core/database/repositories';
import { ClienteMigracionRepository } from 'src/core/database/repositories/core/cliente-migracion/cliente-migracion.repository';
import { DataSource } from 'typeorm';
import { TipoRespuestaEnum } from 'src/core/domain/enum/tipo-alerta.enum';
import { ILegacyClienteMySQL } from './interfaces/legacy-cliente-mysql.interface';

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
    mockClienteRepo.insert.mockImplementation(async (clientes: any[]) => {
      return {
        raw: clientes.map((c, index) => ({
          id: index + 1,
          publicKey: c.publicKey,
        })),
      };
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

  it('debe retornar 0 registros migrados y no iniciar transacción si la lista de datos está vacía', async () => {
    jest.spyOn(service as any, 'obtenerDatosFalsosDeMySQL').mockReturnValue([]);

    const result = await service.ejecutarMigracion();

    expect(result).toEqual({
      message: 'No hay datos para migrar',
      tipoRespuesta: TipoRespuestaEnum.Success,
      title: 'Migración',
      data: { registrosMigradosContador: 0 },
    });

    expect(mockDataSource.transaction).not.toHaveBeenCalled();
  });

  it('debe procesar los datos en lotes (chunks) correctamente', async () => {
    const largeData: ILegacyClienteMySQL[] = [];
    for (let i = 0; i < 1200; i++) {
      largeData.push({
        id: i,
        txt_primer_nombre: `Test${i}`,
        txt_apellido_paterno: 'Test',
        num_dni_ruc: `1234567${i}`,
        id_tipo_doc_legacy: 1,
        flg_activo: 1,
      });
    }

    jest.spyOn(service as any, 'obtenerDatosFalsosDeMySQL').mockReturnValue(largeData);

    mockClienteRepo.insert.mockImplementation(async (clientes: any[]) => {
      return {
        raw: clientes.map((c, index) => ({
          id: index + 1000,
          publicKey: c.publicKey,
        })),
      };
    });
    mockClienteMigracionRepo.insert.mockResolvedValue({});

    const result = await service.ejecutarMigracion();

    expect(result.data?.registrosMigradosContador).toBe(1200);

    expect(mockDataSource.transaction).toHaveBeenCalledTimes(1);

    expect(mockClienteRepo.insert).toHaveBeenCalledTimes(3);
  });
});