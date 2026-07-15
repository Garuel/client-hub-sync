import { ClienteFiltros } from 'src/core/domain/interfaces/repositories/cliente-filtros.interface';
import { DataSource, InsertResult, Repository, SelectQueryBuilder } from 'typeorm';
import { ClienteEntity } from '../../../entities/core/cliente.entity';
import { IClienteInsert } from './insert/cliente.insert';
import { ClienteFilters } from './utils/cliente-filters.util';

export class ClienteRepository extends Repository<ClienteEntity> {
  constructor(connection: DataSource) {
    super(ClienteEntity, connection.createEntityManager());
  }

  async insert(clienteInsert: IClienteInsert[]): Promise<InsertResult> {
    return this
      .createQueryBuilder()
      .insert()
      .into(ClienteEntity)
      .values(clienteInsert)
      .returning(['id', 'publicKey'])
      .execute();
  }


  private getBaseQuery(filtros: ClienteFiltros): SelectQueryBuilder<ClienteEntity> {
    const query = this
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

        'clienteMigracion.id',
        'clienteMigracion.legacyMysqlId',
        'clienteMigracion.fechaMigracion',
        'clienteMigracion.usuarioMigrador',
      ])
      .leftJoin('cliente.clienteMigracion', 'clienteMigracion')
      .innerJoinAndSelect('cliente.tipoDocumento', 'tipoDocumento')


    if (filtros.search) {
      query.andWhere('cliente.nombreCompleto ILIKE :search', {
        search: `%${filtros.search}%`,
      });
    }

    if (filtros.activo !== undefined) {
      query.andWhere('cliente.activo = :activo', { activo: filtros.activo });
    }

    if (filtros.migrado === true) {
      query.andWhere('clienteMigracion.id IS NOT NULL');
    } else if (filtros.migrado === false) {
      query.andWhere('clienteMigracion.id IS NULL');
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