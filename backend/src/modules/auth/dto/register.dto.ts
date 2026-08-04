import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
    IsDate,
    IsDefined,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength
} from "class-validator";
import { MAX_LONG_NUMERO_DOC, MIN_LONG_NUMERO_DOC } from "src/core/domain/constants/max-min-numero-doc.constant";
import { TipoDocumentoEnum } from "src/core/domain/enum/tipo-documento.enum";


export class RegisterDto {
    @ApiProperty({
        description: 'Token guardado en pre registro',
        example: 'R48t1HBFvXq4RzQiy2S2BLDS6ZOEhkIZAOGXFnWw4WTGGm88'
    })
    @IsString()
    @IsNotEmpty()
    readonly tokenPreRegistro!: string;


    @ApiProperty({
        description: 'usuario nuevo',
        example: 'usuario123'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(75)
    readonly username!: string;

    @ApiProperty({
        description: 'contraseña para nuevo usuario',
        example: 'R48t1HBFvXq4RzQi'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(100)
    readonly password!: string;

    @ApiProperty({
        description: 'nombres del nuevo usuario',
        example: 'Gabriel'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    readonly nombres!: string;

    @ApiProperty({
        description: 'apellido paterno del nuevo usuario',
        example: 'Domenack'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    readonly apellidoPaterno!: string;

    @ApiProperty({
        description: 'apellido materno del nuevo usuario',
        example: 'Domenack'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    readonly apellidoMaterno!: string;

    @ApiProperty({
        description: 'numero de documento del nuevo usuario',
        example: '12345698'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(MIN_LONG_NUMERO_DOC)
    @MaxLength(MAX_LONG_NUMERO_DOC)
    readonly numeroDocumento!: string;

    @ApiProperty({
        description: 'tipo de documento enum',
        example: '1'
    })
    @IsDefined()
    @IsNotEmpty()
    @IsEnum(TipoDocumentoEnum)
    readonly idTipoDocumento!: number;

    @ApiProperty({
        description: 'email del nuevo usuario ',
        example: 'domenack@gmail.com'
    })
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    readonly email!: string;

    @ApiProperty({
        description: 'número de telefono para el nuevo usuario',
        example: '950147852'
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    numeroTelefono?: string;

    @ApiProperty({
        description: 'Fecha en que el usuario dejará de estar activo',
        example: '2026-07-31'
    })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    fechaFinal?: Date

    // @IsDefined()
    // @IsUUID("4")
    // readonly rqUUID!: string;
}
