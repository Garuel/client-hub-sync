import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ClienteEntity, EstadoUsuarioEntity, TipoDocumentoEntity } from './entities';
import { ClienteRepository, TipoDocumentoRepository } from './repositories';
import { ClienteMigracionEntity } from './entities/core/cliente-migracion.entity';
import { ClienteMigracionRepository } from './repositories/core/cliente-migracion/cliente-migracion.repository';
import { PreRegistroEntity, UsuarioDatosPersonalesEntity, UsuarioEntity, UsuarioRefreshTokenEntity } from './entities/auth';
import { PreRegisterRepository, UsuarioDatosRepository, UsuarioRepository, UsuarioRefreshTokenRepository } from './repositories/auth';


const ENTITIES = [
  ClienteEntity,
  TipoDocumentoEntity,
  ClienteMigracionEntity,
  PreRegistroEntity,
  UsuarioDatosPersonalesEntity,
  UsuarioRefreshTokenEntity,
  UsuarioEntity,
  EstadoUsuarioEntity
];

const REPOSITORIES = [
  ClienteRepository,
  TipoDocumentoRepository,
  ClienteMigracionRepository,
  PreRegisterRepository,
  UsuarioDatosRepository,
  UsuarioRefreshTokenRepository,
  UsuarioRepository
] as const;

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
