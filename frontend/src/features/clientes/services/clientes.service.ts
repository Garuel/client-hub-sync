
import { apiClient } from '../../../core/api/api-client';
import { ENDPOINTS } from '../../../core/constants/endpoints.contant';
import { parseResponse } from '../../../core/utils/zod-validator';
import type { IPaginatedResponse, ResponseAPI } from '../../../share/type';
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
            params: {
                ...params,
                limit: Math.max(3, params.limit),
            },
        });

        return parseResponse(ClienteListadoResponseSchema, response.data);
    },

    migrarClientes: async (): Promise<ResponseAPI> => {

        const response = await apiClient.post<ResponseAPI>(ENDPOINTS.MIGRATION.RUN);
        return response.data;
    },
};