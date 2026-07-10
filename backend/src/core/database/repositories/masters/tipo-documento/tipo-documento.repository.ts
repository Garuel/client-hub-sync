import { TipoDocumentoEntity } from 'src/core/database/entities/masters/tipo-documento.entity';
import { DataSource, EntityManager } from 'typeorm';
import { BaseRepository } from '../../base.repository';
import { ITipoDocumentoInsert } from './insert/tipo-documento.insert';

export class TipoDocumentoRepository extends BaseRepository<TipoDocumentoEntity> {
  constructor(connection: DataSource | EntityManager) {
    super(connection, TipoDocumentoEntity);
  }

  async insert(data: ITipoDocumentoInsert[]) {
    return this.repo.createQueryBuilder().insert().values(data).execute();
  }
}
