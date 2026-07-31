import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  readonly oldRefreshToken!: string;

  @IsOptional()
  readonly ip?: string;

  @IsOptional()
  readonly userAgent?: string;
}
