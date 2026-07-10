import { Injectable, Logger } from '@nestjs/common';
import { ClienteRepository } from 'src/core/database/repositories/core/cliente/cliente.repository';
import { ResponseAPI } from 'src/core/domain/interfaces/response-api.interface';
import { DataSource } from 'typeorm';
import { ILegacyClienteMySQL } from './interfaces/legacy-cliente-mysql.interface';
import { TransformarDatosUtil } from './utils/transformar-datos-migracion.util';
import { ClienteMigracionRepository } from 'src/core/database/repositories/core/cliente-migracion/cliente-migracion.repository';

@Injectable()
export class MantenimientoMigracionService {
  private readonly logger = new Logger(MantenimientoMigracionService.name);

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

    const migracionResponse = await this.dataSource.transaction<ResponseAPI>(
      async (manager) => {
        const clienteRepository =
          this.clienteRepositoryInyectado.setTransactionManager(manager);
        const clienteMigracionRepository =
          this.clienteMigracionRepositoryInyectado.setTransactionManager(
            manager,
          );

        const responseTransformacion =
          TransformarDatosUtil.migracion(datosLegacyMySQL);
        const { clientesTransformados } = responseTransformacion;

        const clientesInsertDto = clientesTransformados.map(item => item.cliente);

        const insertResult = await clienteRepository.insert(clientesInsertDto);

        const migracionInserts = clientesTransformados.map((item, index) => {
          const idClienteGenerado = insertResult.identifiers[index].id;
          return {
            idCliente: idClienteGenerado,
            legacyMysqlId: item.migracionMetadata.legacyMysqlId,
            fechaMigracion: item.migracionMetadata.fechaMigracion,
          }
        })

        await clienteMigracionRepository.insert(migracionInserts)

        return {
          message: 'data migrada',
          data: {
            registrosMigradosContador:
              responseTransformacion.registrosMigradosContador,
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
