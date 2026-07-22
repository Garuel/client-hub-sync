import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max } from 'class-validator';

export class BasePaginationRequest {
  @ApiPropertyOptional({
    description: 'Cantidad de elementos por página',
    example: 10,
    minimum: 3,
    maximum: 64,
    default: 3,
  })
  @IsOptional()
  @IsInt()
  @Min(3)
  @Max(64)
  readonly limit?: number = 3;

  @ApiPropertyOptional({
    description: 'Número de página a consultar',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  get offset(): number {
    return ((this.page ?? 1) - 1) * (this.limit ?? 3);
  }

  set offset(value: number) {
    const limit = this.limit ?? 3;
    const offset = Number(value);
    this.page = Math.floor(offset / limit) + 1;
  }
}
