import { Injectable, Logger } from '@nestjs/common';
import { ClienteRepository } from 'src/core/database/repositories/core/cliente/cliente.repository';
import { ResponseAPI } from 'src/core/domain/interfaces/response-api.interface';
import { DataSource } from 'typeorm';
import { ILegacyClienteMySQL } from './interfaces/legacy-cliente-mysql.interface';
import { TransformarDatosUtil } from './utils/transformar-datos-migracion.util';
import { ClienteMigracionRepository } from 'src/core/database/repositories/core/cliente-migracion/cliente-migracion.repository';
import { IClienteMigracionInsert } from 'src/core/database/repositories/core/cliente-migracion/insert/cliente-migracion.insert';
import { TypeGuardsUtil } from 'src/core/infrastructure/utils/type-guards.util';

@Injectable()
export class MantenimientoMigracionService {
  private readonly logger = new Logger(MantenimientoMigracionService.name);
  private readonly CHUNK_SIZE = 500;

  constructor(
    private readonly dataSource: DataSource,
    private readonly clienteRepositoryInyectado: ClienteRepository,
    private readonly clienteMigracionRepositoryInyectado: ClienteMigracionRepository,
  ) { }

  async ejecutarMigracion(): Promise<ResponseAPI> {
    this.logger.log('Iniciando proceso de extracción desde MySQL Legacy...');

    //simulado
    const datosLegacyMySQL: ILegacyClienteMySQL[] =
      this.obtenerDatosFalsosDeMySQL();

    if (datosLegacyMySQL.length === 0) {
      return {
        message: 'data migrada',
        data: {
          registrosMigradosContador: 0,
        },
      };
    }
    const totalRegistros = datosLegacyMySQL.length;

    const migracionResponse = await this.dataSource.transaction<ResponseAPI>(
      async (manager) => {
        const clienteRepository =
          manager.withRepository(this.clienteRepositoryInyectado);
        const clienteMigracionRepository =
          manager.withRepository(this.clienteMigracionRepositoryInyectado);

        let registrosMigradosContador = 0;

        for (let i = 0; i < totalRegistros; i += this.CHUNK_SIZE) {
          const chunk = datosLegacyMySQL.slice(i, i + this.CHUNK_SIZE);
          this.logger.log(`Procesando lote: registros del ${i + 1} al ${Math.min(i + this.CHUNK_SIZE, totalRegistros)}`);

          const { clientesTransformados } = TransformarDatosUtil.migracion(chunk);
          const clientesInsertDto = clientesTransformados.map(item => item.cliente);

          const insertResult = await clienteRepository.insert(clientesInsertDto);

          const registrosInsertados: { id: number; publicKey: string }[] = insertResult.raw;

          const idMap = new Map<string, number>();

          registrosInsertados.forEach(row => {
            const publicKey = row.publicKey || (row as any).public_key;
            idMap.set(publicKey, row.id);
          });

          const clienteMigracionInsert: IClienteMigracionInsert[] = clientesTransformados
            .map(item => {
              const idClienteGenerado = idMap.get(item.cliente.publicKey);

              if (!idClienteGenerado) return null;

              return {
                idCliente: idClienteGenerado,
                legacyMysqlId: item.migracionMetadata.legacyMysqlId,
                fechaMigracion: item.migracionMetadata.fechaMigracion,
              };
            })
            .filter(TypeGuardsUtil.IsNotNull);

          if (clienteMigracionInsert.length > 0) {
            await clienteMigracionRepository.insert(clienteMigracionInsert);
            registrosMigradosContador += clienteMigracionInsert.length;
          }
        }

        return {
          message: 'data migrada con éxito',
          data: {
            registrosMigradosContador,
          },
        };
      },
    );
    return migracionResponse;
  }

  private obtenerDatosFalsosDeMySQL(): ILegacyClienteMySQL[] {
    return [
      {
        id: 101,
        txt_primer_nombre: 'Erick',
        txt_segundo_nombre: 'Andrés',
        txt_apellido_paterno: 'Sánchez',
        txt_apellido_materno: 'Quispe',
        num_dni_ruc: '74839201',
        id_tipo_doc_legacy: 1, // DNI
        flg_activo: 1,
      },
      {
        id: 102,
        txt_primer_nombre: 'Empresa',
        txt_apellido_paterno: 'SanMarket',
        txt_apellido_materno: 'S.A.C.',
        num_dni_ruc: '20123456789',
        id_tipo_doc_legacy: 2, // RUC
        flg_activo: 1,
      },
      {
        id: 103,
        txt_primer_nombre: 'Gisela',
        txt_apellido_paterno: 'Flores',
        num_dni_ruc: '45671234',
        id_tipo_doc_legacy: 1,
        flg_activo: 0,
      },
    ];
  }
}
