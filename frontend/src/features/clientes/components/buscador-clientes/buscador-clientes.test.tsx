import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BuscadorClientes } from './buscador-clientes';

describe('BuscadorClientes Component', () => {
    it('debe permitir escribir y emitir el evento de búsqueda al enviar el formulario', async () => {
        const user = userEvent.setup();
        const mockOnBuscar = vi.fn();

        render(<BuscadorClientes search="" onBuscar={mockOnBuscar} active={false} onCambiarEstado={vi.fn()} />);

        const input = screen.getByRole('textbox');
        const botonBuscar = screen.getByRole('button');

        await user.type(input, 'Juan');
        expect(input).toHaveValue('Juan');

        await user.click(botonBuscar);

        expect(mockOnBuscar).toHaveBeenCalledTimes(1);
        expect(mockOnBuscar).toHaveBeenCalledWith('Juan');
    });
});