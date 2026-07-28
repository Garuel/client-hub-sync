import { render, screen } from '@testing-library/react';
import type { ClienteInterface } from '../../types/cliente.type';
import { TablaClientes } from './tabla-clientes';


const mockClientes: ClienteInterface[] = [
    {
        publicKey: 'CLI-001',
        nombreCompleto: 'Juan Pérez',
        numeroDocumento: '12345678',
        activo: true,
        tipoDocumento: { id: 1, abreviatura: 'DNI' },
        clienteMigracion: null,
    },
    {
        publicKey: 'CLI-002',
        nombreCompleto: 'Maria Gomez',
        numeroDocumento: '87654321',
        activo: false,
        tipoDocumento: { id: 1, abreviatura: 'DNI' },
        clienteMigracion: {
            legacyMysqlId: 101,
            fechaMigracion: '2026-01-01T10:00:00Z',
            usuarioMigrador: 'admin',
        },
    },
];

const defaultProps = {
    clientes: [],
    loading: false,
    page: 1,
    totalPages: 1,
    totalItems: 0,
    onCambiarPagina: vi.fn()
};

describe('TablaClientes Component', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('debe renderizar el SkeletonLoader cuando loading es true', () => {
        render(<TablaClientes {...defaultProps} loading={true} />);

        expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();

        expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    it('debe renderizar la lista de clientes correctamente cuando loading es false', () => {
        render(
            <TablaClientes
                {...defaultProps}
                clientes={mockClientes}
                totalItems={mockClientes.length}
            />
        );

        expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
        expect(screen.getByText('Maria Gomez')).toBeInTheDocument();
        const badgeActivo = screen.getByText('✅ Activo');
        expect(badgeActivo).toBeInTheDocument();
        expect(badgeActivo).toHaveClass('bg-green-100');
        const badgeInactivo = screen.getByText('❌ Inactivo');
        expect(badgeInactivo).toBeInTheDocument();
    });
    it('debe ocultar la columna PublicKey en móviles y mostrarla en escritorio', () => {
        render(
            <TablaClientes
                {...defaultProps}
                clientes={mockClientes}
                totalItems={mockClientes.length}
            />
        );

        const publicKeyHeader = screen.getByRole('columnheader', { name: 'PublicKey' });
        const publicKeyCells = screen.getAllByText(/^CLI-/);

        expect(publicKeyHeader).toHaveClass('hidden', 'sm:table-cell');

        publicKeyCells.forEach(cell => {
            expect(cell).toHaveClass('hidden', 'sm:table-cell');
        });
    });
});