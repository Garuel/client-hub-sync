import { z } from 'zod';
import { toast } from 'react-hot-toast';

export function parseResponse<T>(
    schema: z.ZodType<T>,
    data: any,
    message: string = 'Error al procesar la respuesta del servidor. Estructura inválida.') {
    const result = schema.safeParse(data);
    if (!result.success) {
        console.error('Error de contrato con el Backend:', result.error.message);
        toast.error(message);
        throw new Error(message);
    }
    return result.data;
}