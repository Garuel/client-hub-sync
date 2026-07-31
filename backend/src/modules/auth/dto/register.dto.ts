import { Type } from "class-transformer";
import {
    IsDate,
    IsDefined,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
    MinLength,
} from "class-validator";
import { MAX_LONG_NUMERO_DOC, MIN_LONG_NUMERO_DOC } from "src/core/domain/constants/max-min-numero-doc.constant";
import { TipoDocumentoEnum } from "src/core/domain/enum/tipo-documento.enum";


export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    readonly tokenPreRegistro!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(75)
    readonly username!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(100)
    readonly password!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    readonly nombres!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    readonly apellidoPaterno!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    readonly apellidoMaterno!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(MIN_LONG_NUMERO_DOC)
    @MaxLength(MAX_LONG_NUMERO_DOC)
    readonly numeroDocumento!: string;

    @IsDefined()
    @IsNotEmpty()
    @IsEnum(TipoDocumentoEnum)
    readonly idTipoDocumento!: number;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    readonly email!: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    numeroTelefono?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    fechaFinal?: Date

    // @IsDefined()
    // @IsUUID("4")
    // readonly rqUUID!: string;
}
