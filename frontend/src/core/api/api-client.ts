
import axios from 'axios';

export const apiClient = axios.create({

    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
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
    (error) => {
        if (error.code === 'ECONNABORTED') {
            return Promise.reject(new Error('El servidor está tardando demasiado en responder.'));
        }
        const rawMessage = error.response?.data?.message || 'Ocurrió un error inesperado';
        const mensajeFormateado = Array.isArray(rawMessage) ? rawMessage.join(', ') : rawMessage;

        return Promise.reject(new Error(mensajeFormateado));
    }
);

