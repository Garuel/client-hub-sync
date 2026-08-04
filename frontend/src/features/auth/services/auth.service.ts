import { apiClient } from '../../../core/api/api-client';
import { ENDPOINTS } from '../../../core/constants/endpoints.contant';
import { parseResponse } from '../../../core/utils/zod-validator';

import type { LoginDto } from '../dto/login.dto';
import { LoginResponseSchema, type LoginResponse } from '../schemas/login.schema';



export const AuthService = {
    login: async (loginDto: LoginDto): Promise<LoginResponse> => {
        const response = await apiClient.post(ENDPOINTS.AUTH.login, loginDto);

        const validatedData = parseResponse(LoginResponseSchema, response.data);

        const tokens = validatedData.data;

        if (tokens) {
            localStorage.setItem('accessToken', tokens.accessToken);
            localStorage.setItem('refreshToken', tokens.refreshToken);
        }

        return validatedData;
    },

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
    },
};