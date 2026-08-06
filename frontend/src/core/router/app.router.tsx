import { createBrowserRouter, Navigate } from 'react-router-dom';

import { ProtectedRoute } from './protected-route.router';
import { LoginPage } from '../../features/auth/pages/login.page';
import { ClienteListadoPage } from '../../features/clientes/pages/clientes-listado-page/clients-page';

export const router = createBrowserRouter([

    {
        path: '/login',
        element: <LoginPage />,
    },

    {
        element: <ProtectedRoute />,
        children: [
            {
                path: '/clientes',
                element: <ClienteListadoPage />,
            },
        ],
    },

    {
        path: '*',
        element: <Navigate to="/login" replace />,
    },
]);