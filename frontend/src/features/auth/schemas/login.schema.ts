import z from "zod";
import { EstadoUsuarioEnum } from "../../../core/constants/enums/estado-usuario.enum";
import { TipoDocumentoEnum } from "../../../core/constants/enums/tipo-documento.enum";
import { buildApiResponseSchema } from "../../../core/schemas/api-response.schema";

export const UsuarioInfoTokenSchema = z.object({
    id: z.number().int(),
    username: z.string(),
    idEstado: z.enum(EstadoUsuarioEnum),
    email: z.string(),
    nombres: z.string(),
    apellidoPaterno: z.string(),
    apellidoMaterno: z.string().optional(),
    numeroDocumento: z.string(),
    idTipoDocumento: z.enum(TipoDocumentoEnum),
    abreviaturaTipoDocumento: z.string(),
});


export const RefreshInfoTokenSchema = z.object({
    idUsuario: z.number().int(),
    codigo: z.string()
})

export const AuthTokensSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
});

export const LoginResponseSchema = buildApiResponseSchema(AuthTokensSchema);

export type AuthTokens = z.infer<typeof AuthTokensSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;