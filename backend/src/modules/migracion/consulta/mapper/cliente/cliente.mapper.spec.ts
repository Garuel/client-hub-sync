import { ClienteEntity } from 'src/core/database/entities';
import { ClienteMapper } from './cliente.mapper';

describe('ClienteMapper', () => {
    it('debe mapear correctamente un ClienteEntity completo a ObtenerClientesResponse', () => {
        const mockEntity: Partial<ClienteEntity> = {
            publicKey: 'uuid-123',
            nombreCompleto: 'Juan Pérez',
            numeroDocumento: '12345678',
            activo: true,
            tipoDocumento: { id: 1, abreviatura: 'DNI' } as any,
            clienteMigracion: {
                legacyMysqlId: 99,
                fechaMigracion: new Date('2026-01-01'),
                usuarioMigrador: 'admin',
            } as any,
        };

        const result = ClienteMapper.toResponse([mockEntity as ClienteEntity]);


        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            publicKey: 'uuid-123',
            nombreCompleto: 'Juan Pérez',
            numeroDocumento: '12345678',
            activo: true,
            tipoDocumento: { id: 1, abreviatura: 'DNI' },
            clienteMigracion: {
                legacyMysqlId: 99,
                fechaMigracion: expect.any(Date),
                usuarioMigrador: 'admin',
            },
        });
    });

    it('debe retornar clienteMigracion como undefined si la entidad no lo tiene', () => {
        const mockEntity: Partial<ClienteEntity> = {
            publicKey: 'uuid-456',
            tipoDocumento: { id: 1, abreviatura: 'DNI' } as any,
            clienteMigracion: undefined,
        };

        const result = ClienteMapper.toResponse([mockEntity as ClienteEntity]);

        expect(result[0].clienteMigracion).toBeUndefined();
    });
});