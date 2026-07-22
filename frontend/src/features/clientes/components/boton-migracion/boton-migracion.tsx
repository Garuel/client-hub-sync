import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ClientesService } from '../../services/clientes.service';
import type { BotonMigracionProps } from './boton-migracion.types';

export const BotonMigracion = ({ onMigracionExitosa }: BotonMigracionProps) => {
    const [procesando, setProcesando] = useState(false);

    const ejecutarMigracion = async () => {
        setProcesando(true);
        try {
            const response = await ClientesService.migrarClientes();
            toast.success(response.message || '¡Migración ejecutada con éxito!');
            onMigracionExitosa();
        } catch (error) {
            console.error('Error en el proceso ETL:', error);
            toast.error('Hubo un error al ejecutar la migración.');
        } finally {
            setProcesando(false);
        }
    };

    return (
        <div className="my-5">
            <button
                onClick={ejecutarMigracion}
                disabled={procesando}
                className={`
                    inline-flex items-center justify-center px-5 py-2.5 
                    text-sm font-semibold text-white rounded-lg shadow-sm
                    transition-all duration-200
                    ${procesando
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 cursor-pointer'
                    }
                `}
            >
                {procesando ? (
                    <>
                        <svg className="w-4 h-4 mr-2 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Procesando ETL...
                    </>
                ) : (
                    'Iniciar Migración de Clientes'
                )}
            </button>
        </div>
    );
};