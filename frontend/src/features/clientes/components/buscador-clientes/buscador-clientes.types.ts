export interface BuscadorClientesProps {
    search: string;
    active: boolean;
    onBuscar: (termino: string) => void;
    onCambiarEstado: (activo: boolean) => void;
}