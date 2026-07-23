import { ClienteEntity } from 'src/core/database/entities';
import { ILegacyClienteMySQL } from '../../interfaces/legacy-cliente-mysql.interface';
import { TransformarDatosUtil } from './transformar-datos-migracion.util';

describe('TransformarDatosUtil', () => {
    it('debe transformar correctamente los datos', () => {

        const data: ILegacyClienteMySQL[] = [
            {
                id: 1,
                txt_primer_nombre: 'Juan',
                txt_segundo_nombre: 'Lucas',
                txt_apellido_paterno: 'Perez',
                txt_apellido_materno: 'Torres',
                num_dni_ruc: '12345678',
                id_tipo_doc_legacy: 1,
                flg_activo: 1,
            },
        ];
        const result = TransformarDatosUtil.migracion(data);


        expect(result).toEqual({
            clientesTransformados: [
                {
                    cliente: {
                        publicKey: expect.any(String),
                        nombreCompleto: "Juan Lucas Perez Torres",
                        nombres: "Juan Lucas",
                        apellidoPaterno: "Perez",
                        apellidoMaterno: "Torres",
                        numeroDocumento: "12345678",
                        idTipoDocumento: 1,
                        activo: true,
                    },
                    migracionMetadata: {
                        legacyMysqlId: 1,
                        fechaMigracion: expect.any(Date),
                    }
                }
            ],
            registrosMigradosContador: 1
        });
    });
    it('debe manejar correctamente campos opcionales ausentes y flg_activo = 0', () => {
        const data: ILegacyClienteMySQL[] = [
            {
                id: 2,
                txt_primer_nombre: 'Maria',
                txt_segundo_nombre: undefined,
                txt_apellido_paterno: 'Gomez',
                txt_apellido_materno: undefined,
                num_dni_ruc: '87654321',
                id_tipo_doc_legacy: 1,
                flg_activo: 0,
            },
        ];

        const result = TransformarDatosUtil.migracion(data);

        expect(result.clientesTransformados[0].cliente).toEqual({
            publicKey: expect.any(String),
            nombreCompleto: 'Maria Gomez',
            nombres: 'Maria',
            apellidoPaterno: 'Gomez',
            apellidoMaterno: undefined,
            numeroDocumento: '87654321',
            idTipoDocumento: 1,
            activo: false,
        });
    });
});