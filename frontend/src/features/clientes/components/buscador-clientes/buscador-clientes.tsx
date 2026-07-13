import { useState } from 'react';
import type { BuscadorClientesProps } from './buscador-clientes.types';


export const BuscadorClientes = ({ search, onBuscar }: BuscadorClientesProps) => {
    const [inputValue, setInputValue] = useState(search);

    const manejarBusqueda = (e: React.SyntheticEvent) => {
        e.preventDefault();
        onBuscar(inputValue);
    };

    return (
        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <form onSubmit={manejarBusqueda} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div>
                    <label htmlFor="search">Buscar Cliente: </label>
                    <input
                        id="search"
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ej. Juan Pérez..."
                    />
                </div>

                {/* <div>
                    <label htmlFor="estado">Estado: </label>
                    <select
                        id="estado"
                        value={active ? 'true' : 'false'}
                        onChange={(e) => onCambiarEstado(e.target.value === 'true')}
                    >
                        <option value="true">Activos</option>
                        <option value="false">Inactivos</option>
                    </select>
                </div> */}

                <button type="submit">Buscar</button>
            </form>
        </div>
    );
};