
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const apiClient = axios.create({

    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


apiClient.interceptors.response.use(
    (response) => {
        // const token = localStorage.getItem('token');
        // if (token && response.headers) {
        //     response.headers.Authorization = `Bearer ${token}`;
        // }
        return response
    },
    (error) => {
        const mensaje = error.response?.data?.message || 'Ocurrió un error inesperado';

        toast.error(`Error del Servidor: ${mensaje}`);



        return Promise.reject(error);
    }

);

