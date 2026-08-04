import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsString, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({ description: 'usuario del usuario', example: 'sebastiandomenack' })
  @IsDefined({
    message: "El usuario es requerido",
  })
  @IsString()
  username!: string;

  @ApiProperty({ description: 'contraseña del usuario' })
  @IsString()
  @MinLength(6, { message: "El password debe tener al menos 6 caracteres" })
  password!: string;

  // @IsDefined()
  // @IsUUID("4")
  // readonly rqUUID!: string;

}

export interface UsuarioInfoToken {
  id: number;
  username: string;
  idEstado: number;
  email: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  numeroDocumento: string;
  idTipoDocumento: number;
  abreviaturaTipoDocumento: string;
}

export interface RefreshInfoToken {
  idUsuario: number;
  codigo: string;
}
