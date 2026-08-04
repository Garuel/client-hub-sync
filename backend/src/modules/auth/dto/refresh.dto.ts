import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh antiguo para refrescar nuevo acceso',
    example: 'R48t1HBFvXq4RzQiy2S2BLDS6ZOEhkIZAOGXFnWw4WTGGm88'
  })
  @IsString()
  @IsNotEmpty()
  readonly oldRefreshToken!: string;

  @IsOptional()
  readonly ip?: string;

  @IsOptional()
  readonly userAgent?: string;
}
