import { Injectable } from '@nestjs/common';
import { ClienteFiltros } from 'src/core/domain/interfaces/repositories/cliente-filtros.interface';
import { DataSource, EntityManager, InsertResult, Repository, SelectQueryBuilder } from 'typeorm';
import { ClienteEntity } from '../../../entities/core/cliente.entity';
import { IClienteInsert } from './insert/cliente.insert';

@Injectable()
export class ClienteRepository {
  // constructor(connection: DataSource | EntityManager) {
  //   super(
  //     ClienteEntity,
  //     typeof (connection as any).createEntityManager === 'function'
  //       ? (connection as DataSource).createEntityManager()
  //       : (connection as EntityManager)
  //   );
  // }
  constructor(private readonly dataSource: DataSource) { }
  private getRepo(manager?: EntityManager): Repository<ClienteEntity> {
    return manager
      ? manager.getRepository(ClienteEntity)
      : this.dataSource.getRepository(ClienteEntity);
  }

  async insert(clienteInsert: IClienteInsert[], manager?: EntityManager): Promise<InsertResult> {
    return this.getRepo(manager)
      .createQueryBuilder()
      .insert()
      .into(ClienteEntity)
      .values(clienteInsert)
      .returning(['id', 'publicKey'])
      .execute();
  }


  private getBaseQuery(filtros: ClienteFiltros, manager?: EntityManager): SelectQueryBuilder<ClienteEntity> {
    const query = this.getRepo(manager)
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


  async findPaginado(filtros: ClienteFiltros, manager?: EntityManager): Promise<[ClienteEntity[], number]> {
    return this.getBaseQuery(filtros, manager)
      .skip(filtros.offset)
      .take(filtros.limit)
      .getManyAndCount();
  }


  async findSinPaginar(filtros: ClienteFiltros, manager?: EntityManager): Promise<ClienteEntity[]> {
    return this.getBaseQuery(filtros, manager).getMany();
  }
}