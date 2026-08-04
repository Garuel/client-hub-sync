import { ApiProperty } from "@nestjs/swagger";

export class AuthTokensDto {
    @ApiProperty({ description: 'Token de acceso JWT' })
    accessToken: string;

    @ApiProperty({ description: 'Token para refrescar la sesión' })
    refreshToken: string;
}