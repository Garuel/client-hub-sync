import { z } from 'zod';
import { buildPaginatedSchema } from '../../../core/schemas/pagination.schema';
import type { components } from '../../../core/types/api.generated';

export const ClienteResponseSchema = z.object({
    publicKey: z.string(),
    nombreCompleto: z.string(),
    numeroDocumento: z.string(),
    activo: z.boolean(),
    tipoDocumento: z.object({
        id: z.number(),
        abreviatura: z.string(),
    }),
    clienteMigracion: z
        .object({
            legacyMysqlId: z.number(),
            fechaMigracion: z.string(),
            usuarioMigrador: z.string().nullable().optional(),
        })
        .nullable()
        .optional(),
});

export const ClienteListadoResponseSchema = buildPaginatedSchema(ClienteResponseSchema);
export type ClienteInterface = z.infer<typeof ClienteResponseSchema>;
export type ObtenerClientesQueryParams = components['schemas']['ObtenerClientesDto'];
export type TipoDocumento = components['schemas']['TipoDocumentoDto'];