import type { ClienteInterface } from "../../schemas/cliente.schema";


export interface TablaClientesProps {
    clientes: ClienteInterface[];
    loading: boolean;
    page: number;
    totalPages: number;
    totalItems: number;
    onCambiarPagina: (nuevaPagina: number) => void;
}