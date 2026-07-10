import { DataSource, EntityManager, InsertResult, SelectQueryBuilder } from 'typeorm';
import { ClienteEntity } from '../../../entities/core/cliente.entity';
import { BaseRepository } from '../../base.repository';
import { IClienteInsert } from './insert/cliente.insert';
import { ClienteFilters } from './utils/cliente-filters.util';
import { ClienteFiltros } from 'src/core/domain/interfaces/repositories/cliente-filtros.interface';

export class ClienteRepository extends BaseRepository<ClienteEntity> {
  constructor(connection: DataSource | EntityManager) {
    super(connection, ClienteEntity);
  }

  async insert(clienteInsert: IClienteInsert[]): Promise<InsertResult> {
    return this.repo
      .createQueryBuilder()
      .insert()
      .into(ClienteEntity)
      .values(clienteInsert)
      .execute();
  }


  private getBaseQuery(filtros: ClienteFiltros): SelectQueryBuilder<ClienteEntity> {
    const filters = ClienteFilters.getFilters(filtros);

    const query = this.repo
      .createQueryBuilder('cliente')
      .select([
        'cliente.id',
        'cliente.publicKey',
        'cliente.nombreCompleto',
        'cliente.nombres',
        'cliente.apellidoPaterno',
        'cliente.apellidoMaterno',
        'cliente.numeroDocumento',
        'cliente.idTipoDocumento',
        'cliente.activo',

        'migracionInfo.id',
        'migracionInfo.legacyMysqlId',
        'migracionInfo.fechaMigracion',
        'migracionInfo.usuarioMigrador',
      ])
      .leftJoin('cliente.migracionInfo', 'migracionInfo')
      .innerJoinAndSelect('cliente.tipoDocumento', 'tipoDocumento');

    if (filters.length > 0) {
      query.where(filters, {
        search: `%${filtros.search}%`,
        activo: filtros.activo,
        migrado: filtros.migrado,
      });
    }

    return query;
  }


  async findPaginado(filtros: ClienteFiltros): Promise<[ClienteEntity[], number]> {
    return this.getBaseQuery(filtros)
      .skip(filtros.offset)
      .take(filtros.limit)
      .getManyAndCount();
  }


  async findSinPaginar(filtros: ClienteFiltros): Promise<ClienteEntity[]> {
    return this.getBaseQuery(filtros).getMany();
  }
}