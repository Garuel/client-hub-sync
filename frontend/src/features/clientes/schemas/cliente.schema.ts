import { z } from 'zod';

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

export const ClienteListadoResponseSchema = z.object({
    success: z.boolean(),
    message: z.string().optional(),
    data: z.array(ClienteResponseSchema),
    meta: z.object({
        totalItems: z.number(),
        itemCount: z.number(),
        itemsPerPage: z.number(),
        totalPages: z.number(),
        currentPage: z.number(),
    }),
});