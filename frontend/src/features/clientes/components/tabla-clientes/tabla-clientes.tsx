import type { TablaClientesProps } from "./tabla-clientes.types";


export const TablaClientes = ({ clientes, loading, page, totalPages, totalItems, onCambiarPagina }: TablaClientesProps) => {

    if (loading) {
        return <p>Cargando información desde la base de datos...</p>;
    }

    if (clientes.length === 0) {
        return <p>No se encontraron clientes con esos filtros.</p>;
    }

    return (
        <div>
            <p>Total de registros encontrados: <strong>{totalItems}</strong></p>

            <table className="mi-tabla-css" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f4f4f4' }}>
                        <th>Documento</th>
                        <th>Nombre Completo</th>
                        <th>PublicKey</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((cliente) => (
                        <tr key={cliente.publicKey} style={{ borderBottom: '1px solid #ddd' }}>
                            <td>{cliente.numeroDocumento}</td>
                            <td>{cliente.nombreCompleto}</td>
                            <td>{cliente.publicKey}</td>
                            <td>{cliente.activo ? '✅ Activo' : '❌ Inactivo'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ marginTop: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                    disabled={page === 1}
                    onClick={() => onCambiarPagina(page - 1)}
                >
                    Anterior
                </button>

                <span>Página {page} de {totalPages}</span>

                <button
                    disabled={page === totalPages || totalPages === 0}
                    onClick={() => onCambiarPagina(page + 1)}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};