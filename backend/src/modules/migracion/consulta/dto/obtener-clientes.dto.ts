import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BasePaginationRequest } from 'src/core/domain/classes/base-pagination-request.class';

export class ObtenerClientesDto extends BasePaginationRequest {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  search: string = '';

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  active: boolean = true;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  @IsBoolean()
  migrado?: boolean;
}

export class ObtenerClientesResponse {
  publicKey: string;
  nombreCompleto: string;
  numeroDocumento: string;
  activo: boolean;
  tipoDocumento: {
    id: number;
    abreviatura: string;
  };

  clienteMigracion?: {
    legacyMysqlId: number;
    fechaMigracion: Date;
    usuarioMigrador: string;
  }
}
