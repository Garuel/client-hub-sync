import { z } from 'zod';

export const buildApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => {
    return z.object({
        success: z.boolean(),
        tipoRespuesta: z.string().optional(),
        title: z.string().optional(),
        message: z.string().optional(),
        data: dataSchema,
    });
};

export const BaseApiResponseSchema = z.object({
    success: z.boolean(),
    tipoRespuesta: z.string().optional(),
    title: z.string().optional(),
    message: z.string().optional(),
    data: z.unknown().nullable().optional(),
});

export type BaseApiResponse = z.infer<typeof BaseApiResponseSchema>;