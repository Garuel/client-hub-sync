import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { BasePaginationRequest } from 'src/core/domain/classes/base-pagination-request.class';

export class ObtenerClientesDto extends BasePaginationRequest {
  @ApiPropertyOptional({ description: 'Término de búsqueda', example: 'Juan' })
  @IsOptional()
  @IsString()
  search: string = '';

  @ApiPropertyOptional({ description: 'Estado del cliente', example: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  active: boolean = true;

  @ApiPropertyOptional({ description: 'Filtrar por estado de migración' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  @IsBoolean()
  migrado?: boolean;
}

export class TipoDocumentoDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'DNI' })
  abreviatura: string;
}

export class ClienteMigracionDto {
  @ApiProperty({ example: 1052 })
  legacyMysqlId: number;

  @ApiProperty({ example: '2026-05-10T14:30:00.000Z' })
  fechaMigracion: Date;

  @ApiPropertyOptional({ example: 'admin_user', nullable: true })
  usuarioMigrador?: string;
}

export class ObtenerClientesResponse {
  @ApiProperty({ example: 'cli_89f721a' })
  publicKey: string;

  @ApiProperty({ example: 'Juan Pérez' })
  nombreCompleto: string;

  @ApiProperty({ example: '72839102' })
  numeroDocumento: string;

  @ApiProperty({ example: true })
  activo: boolean;

  @ApiProperty({ type: () => TipoDocumentoDto })
  tipoDocumento: TipoDocumentoDto;

  @ApiPropertyOptional({ type: () => ClienteMigracionDto, nullable: true })
  clienteMigracion?: ClienteMigracionDto;
}
