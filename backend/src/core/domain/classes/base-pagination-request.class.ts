import { IsOptional, IsInt, Min, Max } from 'class-validator';

export class BasePaginationRequest {
  @IsOptional()
  @IsInt()
  @Min(3)
  @Max(64)
  readonly limit?: number = 3;

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
