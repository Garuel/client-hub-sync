
import axios from 'axios';
import { ENDPOINTS } from '../constants/endpoints.contant';

export const apiClient = axios.create({

    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.code === 'ECONNABORTED') {
            return Promise.reject(new Error('El servidor está tardando demasiado en responder.'));
        }
        if (error.response?.status === 401) {
            const isAuthRequest = error.config?.url?.includes('/auth/');
            if (!isAuthRequest) {
                originalRequest._retry = true;

                try {
                    const oldRefreshToken = localStorage.getItem('refreshToken');

                    if (!oldRefreshToken) {
                        throw new Error('No hay refresh token disponible')
                    }

                    const { data: responseData } = await axios.post(import.meta.env.VITE_API_BASE_URL + ENDPOINTS.AUTH.refreshToken, { oldRefreshToken });

                    const nuevosTokens = responseData?.data;

                    if (nuevosTokens?.accessToken && nuevosTokens?.refreshToken) {
                        localStorage.setItem('accessToken', nuevosTokens.accessToken);
                        localStorage.setItem('refreshToken', nuevosTokens.refreshToken);

                        originalRequest.headers.Authorization = `Bearer ${nuevosTokens.accessToken}`;
                        return apiClient(originalRequest);
                    }
                } catch (error) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');

                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }

                    return Promise.reject(new Error('La sesión ha expirado, por favor inicia sesión nuevamente.'));
                }
            }

            const rawMessage = error.response?.data?.message || 'Ocurrió un error inesperado';
            const mensajeFormateado = Array.isArray(rawMessage) ? rawMessage.join(', ') : rawMessage;

            return Promise.reject(new Error(mensajeFormateado));
        }
    });

