
import { z } from 'zod';

export const buildPaginatedSchema = <T extends z.ZodTypeAny>(itemSchema: T) => {
    return z.object({
        success: z.boolean(),
        data: z.array(itemSchema),
        meta: z.object({
            totalItems: z.number(),
            itemCount: z.number(),
            itemsPerPage: z.number(),
            totalPages: z.number(),
            currentPage: z.number(),
        }),
    });
};