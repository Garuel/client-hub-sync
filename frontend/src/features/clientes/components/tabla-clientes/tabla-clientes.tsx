import type { TablaClientesProps } from "./tabla-clientes.types";

export const TablaClientes = ({
    clientes,
    loading,
    page,
    totalPages,
    totalItems,
    onCambiarPagina
}: TablaClientesProps) => {

    // 1. Estado de Carga (Antes era un texto plano feo, ahora tiene un indicador visual)
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-3 bg-white border border-gray-200 rounded-xl dark:bg-gray-800 dark:border-gray-700">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Cargando información desde la base de datos...
                </p>
            </div>
        );
    }

    if (clientes.length === 0) {
        return (
            <div className="p-8 text-center bg-gray-50 border border-gray-200 rounded-xl dark:bg-gray-800/50 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">No se encontraron clientes con esos filtros.</p>
            </div>
        );
    }

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
                            <th scope="col" className="px-6 py-3">PublicKey</th>
                            <th scope="col" className="px-6 py-3">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {clientes.map((cliente) => (
                            <tr
                                key={cliente.publicKey}
                                className="bg-white hover:bg-gray-50 transition-colors dark:bg-gray-800 dark:hover:bg-gray-700/50"
                            >
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                    {cliente.numeroDocumento}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {cliente.nombreCompleto}
                                </td>
                                <td className="px-6 py-4 font-mono text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
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

            <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    Página <span className="font-semibold text-gray-900 dark:text-white">{page}</span> de <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
                </span>

                <div className="flex gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => onCambiarPagina(page - 1)}
                        className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                        Anterior
                    </button>

                    <button
                        disabled={page === totalPages || totalPages === 0}
                        onClick={() => onCambiarPagina(page + 1)}
                        className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
};