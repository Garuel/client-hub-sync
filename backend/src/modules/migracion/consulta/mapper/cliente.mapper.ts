import { ClienteEntity } from 'src/core/database/entities';
import { ObtenerClientesResponse } from '../dto/obtener-clientes.dto';

export class ClienteMapper {
  static toResponse(entities: ClienteEntity[]): ObtenerClientesResponse[] {
    return entities.map(entity => ({
      publicKey: entity.publicKey,
      nombreCompleto: entity.nombreCompleto,
      numeroDocumento: entity.numeroDocumento,
      activo: entity.activo,
      tipoDocumento: {
        id: entity.tipoDocumento.id,
        abreviatura: entity.tipoDocumento.abreviatura
      },
      clienteMigracion: entity.clienteMigracion ? {
        legacyMysqlId: entity.clienteMigracion?.legacyMysqlId,
        fechaMigracion: entity.clienteMigracion?.fechaMigracion,
        usuarioMigrador: entity.clienteMigracion?.usuarioMigrador,
      } : undefined,
    }));

  }
}
