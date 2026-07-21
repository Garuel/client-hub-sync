
import axios from 'axios';
import { toast } from 'react-hot-toast';

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
            toast.error('El servidor está tardando demasiado en responder.');
            return Promise.reject(error);
        }

        const mensaje = error.response?.data?.message || 'Ocurrió un error inesperado';

        toast.error(`Error del Servidor: ${mensaje}`);

        return Promise.reject(error);
    }
);

