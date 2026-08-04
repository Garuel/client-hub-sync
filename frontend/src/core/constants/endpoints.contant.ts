
export const ENDPOINTS = {
    MIGRATION: {
        CLIENTS: '/migration/clients',
        RUN: '/migration/run',
    },
    MASTERS: {
        DOCUMENT_TYPES: '/masters/tipo-documento',
    },
    AUTH: {
        login: 'auth/login',
        preRegister: 'auth/pre-register',
        register: 'auth/pre-register',
        refreshToken: 'auth/refresh-token'
    }
} as const;

