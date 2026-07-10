
import { apiClient } from '../../../core/api/api-client';
import type { IPaginatedResponse } from '../../../share/type';
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

        const response = await apiClient.get<IPaginatedResponse<ClienteInterface>>('/migration/clients', {
            params,
        });
        return response.data;
    },
};