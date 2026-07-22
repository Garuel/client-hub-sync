import { TableSkeleton } from "../../../../share/ui/table-skeleton";
import type { TablaClientesProps } from "./tabla-clientes.types";

export const TablaClientes = ({
    clientes,
    loading,
    page,
    totalPages,
    totalItems,
    onCambiarPagina
}: TablaClientesProps) => {

    if (loading) return <TableSkeleton rows={5} cols={4} />;

    if (clientes.length === 0) {
        return (
            <div aria-live="polite" className="p-8 text-center bg-gray-50 border border-gray-200 rounded-xl dark:bg-gray-800/50 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">No se encontraron clientes con esos filtros.</p>
            </div>
        );
    }

    const paginas = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
                Total de registros encontrados: <strong className="font-semibold text-gray-900 dark:text-white">{totalItems}</strong>
            </p>

            <div className="w-full overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border-collapse">
                    <thead className="text-xs font-semibold uppercase text-gray-700 bg-gray-50 border-b border-gray-200 dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">Documento</th>
                            <th scope="col" className="px-6 py-3">Nombre Completo</th>
                            <th scope="col" className="px-6 py-3 hidden sm:table-cell">PublicKey</th>
                            <th scope="col" className="px-6 py-3">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {clientes.map((cliente) => (
                            <tr
                                key={cliente.publicKey}
                                className="bg-white hover:bg-gray-50/80 transition-colors duration-150 dark:bg-gray-800 dark:hover:bg-gray-700/50"
                            >
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                    {cliente.numeroDocumento}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {cliente.nombreCompleto}
                                </td>
                                {/* Misma regla de ocultamiento para la celda */}
                                <td className="px-6 py-4 font-mono text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap hidden sm:table-cell">
                                    {cliente.publicKey}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cliente.activo
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                        }`}>
                                        {cliente.activo ? '✅ Activo' : '❌ Inactivo'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    Página <span className="font-semibold text-gray-900 dark:text-white">{page}</span> de <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
                </span>

                <div className="flex gap-1.5 flex-wrap justify-center">
                    <button
                        disabled={page === 1}
                        onClick={() => onCambiarPagina(1)}
                        className="px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 active:scale-95 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                        title="Primera página"
                    >
                        &lt;&lt;
                    </button>

                    <button
                        disabled={page === 1}
                        onClick={() => onCambiarPagina(page - 1)}
                        className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 active:scale-95 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                        Anterior
                    </button>

                    {paginas.map((numPagina) => (
                        <button
                            key={numPagina}
                            onClick={() => onCambiarPagina(numPagina)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 active:scale-95 cursor-pointer ${page === numPagina
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            {numPagina}
                        </button>
                    ))}

                    <button
                        disabled={page === totalPages || totalPages === 0}
                        onClick={() => onCambiarPagina(page + 1)}
                        className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 active:scale-95 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                        Siguiente
                    </button>

                    <button
                        disabled={page === totalPages || totalPages === 0}
                        onClick={() => onCambiarPagina(totalPages)}
                        className="px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 active:scale-95 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                        title="Última página"
                    >
                        &gt;&gt;
                    </button>
                </div>
            </div>
        </div>
    );
};