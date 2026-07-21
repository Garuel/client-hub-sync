
import { apiClient } from '../../../core/api/api-client';
import { ENDPOINTS } from '../../../core/constants/endpoints.contant';
import type { ResponseAPI, IPaginatedResponse } from '../../../share/type';
import { ClienteListadoResponseSchema } from '../schemas/cliente.schema';
import type { ClienteInterface } from '../types/cliente.type';

export interface ObtenerClientesQueryParams {
    page: number;
    limit: number;
    search?: string;
    active?: boolean;
    migrado?: boolean;
}

export const ClientesService = {
    obtenerClientesMigrados: async (params: ObtenerClientesQueryParams): Promise<IPaginatedResponse<ClienteInterface>> => {

        const response = await apiClient.get<IPaginatedResponse<ClienteInterface>>(ENDPOINTS.MIGRATION.CLIENTS, {
            params,
        });

        const resultado = ClienteListadoResponseSchema.safeParse(response.data);

        if (!resultado.success) {
            console.error('Error de contrato con el Backend:', resultado.error.message);
            throw new Error('Los datos recibidos del servidor no son válidos.');
        }

        return resultado.data;
    },

    ejecutarEtl: async (): Promise<ResponseAPI> => {

        const response = await apiClient.post<ResponseAPI>(ENDPOINTS.MIGRATION.RUN);
        return response.data;
    },
};