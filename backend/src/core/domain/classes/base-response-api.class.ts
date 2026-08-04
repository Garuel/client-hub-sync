import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { TipoRespuestaEnum } from "../enum/tipo-alerta.enum";

export class ResponseApiDto<T> {

    @ApiProperty({ example: 'Operación realizada con éxito' })
    message: string;

    @ApiProperty({ example: 'Migración', required: false })
    title?: string;

    @ApiProperty({ enum: TipoRespuestaEnum, example: TipoRespuestaEnum.Success, required: false })
    tipoRespuesta?: TipoRespuestaEnum;

    @ApiPropertyOptional()
    data?: T;
}