import type { ClienteInterface } from "../../types/cliente.type";

export interface TablaClientesProps {
    clientes: ClienteInterface[];
    loading: boolean;
    page: number;
    totalPages: number;
    totalItems: number;
    onCambiarPagina: (nuevaPagina: number) => void;
}