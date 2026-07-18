import { useState } from 'react';
import type { BuscadorClientesProps } from './buscador-clientes.types';

export const BuscadorClientes = ({ search, onBuscar }: BuscadorClientesProps) => {
    const [inputValue, setInputValue] = useState(search);

    const manejarBusqueda = (e: React.SyntheticEvent) => {
        e.preventDefault();
        onBuscar(inputValue);
    };

    return (
        <div className="mb-5 p-4 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <form onSubmit={manejarBusqueda} className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
                <div className="w-full sm:w-auto flex-1">
                    <label
                        htmlFor="search"
                        className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                    >
                        Buscar Cliente
                    </label>
                    <input
                        id="search"
                        type="text"
                        aria-label="Buscar cliente por nombre o documento"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ej. Juan Pérez..."
                        className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                </div>

                {/* <div className="w-full sm:w-auto">
                    <label htmlFor="estado" className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Estado</label>
                    <select
                        id="estado"
                        value={active ? 'true' : 'false'}
                        onChange={(e) => onCambiarEstado(e.target.value === 'true')}
                        className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="true">Activos</option>
                        <option value="false">Inactivos</option>
                    </select>
                </div> */}

                <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer"
                >
                    Buscar
                </button>
            </form>
        </div>
    );
};