import { toast } from 'react-hot-toast';
import { ClientesService } from '../../services/clientes.service';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { BotonMigracion } from './boton-migracion';

vi.mock('../../services/clientes.service.ts');
vi.mock('react-hot-toast');

describe('BotonMigracion Component', () => {

    const mockOnMigracionExitosa = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    })

    it('Debe ejecutar la migración cuando se hace click en el botón y notificar éxito', async () => {
        const user = userEvent.setup()

        let resolverPromesa: (value: any) => void;
        const promesaPendiente = new Promise((resolve) => {
            resolverPromesa = resolve;
        });

        vi.mocked(ClientesService.migrarClientes).mockReturnValueOnce(promesaPendiente as any);

        render(< BotonMigracion onMigracionExitosa={mockOnMigracionExitosa} />)

        const boton = screen.getByRole('button');
        expect(boton).toBeEnabled();
        await user.click(boton)
        expect(boton).toBeDisabled();
        expect(boton).toHaveAttribute('aria-busy', 'true');

        resolverPromesa!({ message: 'Migración exitosa' });

        await waitFor(() => {
            expect(ClientesService.migrarClientes).toHaveBeenCalledTimes(1);
            expect(toast.success).toHaveBeenCalledWith('Migración exitosa');
            expect(mockOnMigracionExitosa).toHaveBeenCalledTimes(1);
            expect(boton).toBeEnabled();
        });

    })


    it('debe manejar errores si la migración falla', async () => {
        const user = userEvent.setup();
        vi.mocked(ClientesService.migrarClientes).mockRejectedValueOnce(new Error('API Error'));

        render(<BotonMigracion onMigracionExitosa={mockOnMigracionExitosa} />);

        await user.click(screen.getByRole('button', { name: /iniciar migración/i }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Hubo un error al ejecutar la migración.');
            expect(mockOnMigracionExitosa).not.toHaveBeenCalled();
        });
    });
})
