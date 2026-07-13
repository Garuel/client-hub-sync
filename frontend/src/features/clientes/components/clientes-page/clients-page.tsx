import { useClientes } from "../../hooks/use-clientes.hook";
import { BotonMigracion } from "../boton-migracion/boton-migracion";
import { BuscadorClientes } from "../buscador-clientes/buscador-clientes";

import { TablaClientes } from "../tabla-clientes/tabla-clientes";


export const ClientesPage = () => {
    const {
        clientes, loading, page, totalPages, totalItems,
        search, active, cambiarPagina, aplicarBusqueda, setActive
    } = useClientes(5);

    const manejarFinMigracion = () => {
        aplicarBusqueda(search);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Módulo de Migración de Clientes</h1>

                <BotonMigracion onMigracionExitosa={manejarFinMigracion} />
            </div>

            <BuscadorClientes
                search={search}
                active={active}
                onBuscar={aplicarBusqueda}
                onCambiarEstado={setActive}
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