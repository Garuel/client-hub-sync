import { useClientes } from "../../hooks/use-clientes.hook";
import { BotonMigracion } from "../boton-migracion/boton-migracion";
import { BuscadorClientes } from "../buscador-clientes/buscador-clientes";
import { TablaClientes } from "../tabla-clientes/tabla-clientes";

export const ClientesPage = () => {
    const {
        clientes, loading, page, totalPages, totalItems,
        search, active, cambiarPagina, aplicarBusqueda, setEstadoActivo
    } = useClientes(5);

    const manejarFinMigracion = () => {
        aplicarBusqueda(search);
    };

    return (
        <div className="p-4 md:p-6 min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 font-sans">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Módulo de Migración de Clientes
                </h1>

                <BotonMigracion onMigracionExitosa={manejarFinMigracion} />
            </div>

            <BuscadorClientes
                search={search}
                active={active}
                onBuscar={aplicarBusqueda}
                onCambiarEstado={setEstadoActivo}
            />

            <TablaClientes
                clientes={clientes}
                loading={loading}
                page={page}
                totalPages={totalPages}
                totalItems={totalItems}
                onCambiarPagina={cambiarPagina}
            />
        </div>
    );
};