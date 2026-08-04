import { ApiProperty } from "@nestjs/swagger";

export class EjecutarMigracionResponse {
    @ApiProperty({ example: 150, description: 'Cantidad de registros procesados' })
    registrosMigradosContador: number
}