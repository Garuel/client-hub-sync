import { apiClient } from '../../../core/api/api-client';
import { ENDPOINTS } from '../../../core/constants/endpoints.contant';
import { parseResponse } from '../../../core/utils/zod-validator';
import type { IPaginatedResponse, ResponseAPI } from '../../../share/type';
import { ClienteListadoResponseSchema, type ClienteInterface } from '../schemas/cliente.schema';
import type { components } from '../../../core/types/api.generated';

export type ObtenerClientesQueryParams = components['schemas']['ObtenerClientesDto'];

export const ClientesService = {
    obtenerClientesMigrados: async (params: ObtenerClientesQueryParams): Promise<IPaginatedResponse<ClienteInterface>> => {

        const response = await apiClient.get(ENDPOINTS.MIGRATION.CLIENTS, {
            params: {
                ...params,
                limit: Math.max(3, params.limit || 10),
            },
        });

        return parseResponse(ClienteListadoResponseSchema, response.data);
    },

    migrarClientes: async (): Promise<ResponseAPI> => {
        const response = await apiClient.post<ResponseAPI>(ENDPOINTS.MIGRATION.RUN);
        return response.data;
    },
};