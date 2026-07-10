import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ClienteEntity, TipoDocumentoEntity } from './entities';
import { ClienteRepository, TipoDocumentoRepository } from './repositories';
import { ClienteMigracionEntity } from './entities/core/cliente-migracion.entity';
import { ClienteMigracionRepository } from './repositories/core/cliente-migracion/cliente-migracion.repository';

const ENTITIES = [ClienteEntity, TipoDocumentoEntity, ClienteMigracionEntity];

const REPOSITORIES = [ClienteRepository, TipoDocumentoRepository, ClienteMigracionRepository] as const;

const repositoryProviders = REPOSITORIES.map((Repo) => ({
  provide: Repo,
  useFactory: (dataSource: DataSource) => new Repo(dataSource),
  inject: [DataSource],
}));

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(ENTITIES)],
  providers: [...repositoryProviders],
  exports: [TypeOrmModule, ...REPOSITORIES],
})
export class DatabaseModule { }
