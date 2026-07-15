import { v4 } from 'uuid';
import { ILegacyClienteMySQL } from '../interfaces/legacy-cliente-mysql.interface';
import { DatosTransformadosInterface, ITransformarDatoMigracionResponse } from '../interfaces/transformar-datos-migracion-response.interface';

export namespace TransformarDatosUtil {
  export function migracion(data: ILegacyClienteMySQL[]): ITransformarDatoMigracionResponse {
    let registrosMigradosContador = 0;
    const clientesTransformados: DatosTransformadosInterface[] = []
    for (const legacyUser of data) {
      const nombreCompleto = [
        legacyUser.txt_primer_nombre,
        legacyUser.txt_segundo_nombre,
        legacyUser.txt_apellido_paterno,
        legacyUser.txt_apellido_materno,
      ]
        .filter(Boolean)
        .join(' ');

      clientesTransformados.push({
        cliente: {
          publicKey: `CLI-${v4()}`,
          nombreCompleto,
          nombres: legacyUser.txt_primer_nombre + (legacyUser.txt_segundo_nombre ? ` ${legacyUser.txt_segundo_nombre}` : ''),
          apellidoPaterno: legacyUser.txt_apellido_paterno,
          apellidoMaterno: legacyUser.txt_apellido_materno || undefined,
          numeroDocumento: legacyUser.num_dni_ruc,
          idTipoDocumento: legacyUser.id_tipo_doc_legacy,
          activo: legacyUser.flg_activo === 1,
        },
        migracionMetadata: {
          legacyMysqlId: legacyUser.id,
          fechaMigracion: new Date(),
        }
      });



      registrosMigradosContador++;
    }
    return {
      clientesTransformados,
      registrosMigradosContador,
    };
  }
}
