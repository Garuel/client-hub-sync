import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class PreRegisterDto {

  @ApiProperty({ description: 'Email para guaradar pre registro', example: 'sebastian@gmail.com' })
  @IsEmail({}, { message: "El email debe ser válido" })
  @IsNotEmpty({ message: "El email es requerido" })
  readonly email!: string;

  @IsOptional()
  @IsString()
  readonly ip?: string;

  @IsOptional()
  @IsString()
  readonly userAgent?: string;
}
