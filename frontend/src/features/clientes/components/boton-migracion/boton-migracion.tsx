
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ClientesService } from '../../services/clientes.service';
import type { BotonMigracionProps } from './boton-migracion.types';


export const BotonMigracion = ({ onMigracionExitosa }: BotonMigracionProps) => {
    const [procesando, setProcesando] = useState(false);

    const ejecutarMigracion = async () => {
        setProcesando(true);
        try {
            const response = await ClientesService.ejecutarEtl();

            toast.success(response.message || '¡Migración ejecutada con éxito!');

            onMigracionExitosa();
        } catch (error) {
            console.error('Error en el proceso ETL:', error);
        } finally {
            setProcesando(false);
        }
    };

    return (
        <div style={{ margin: '20px 0' }}>
            <button
                onClick={ejecutarMigracion}
                disabled={procesando}
                style={{
                    padding: '10px 20px',
                    backgroundColor: procesando ? '#ccc' : '#0070f3',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: procesando ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                }}
            >
                {procesando ? 'Procesando ETL...' : 'Iniciar Migración de Clientes'}
            </button>
        </div>
    );
};