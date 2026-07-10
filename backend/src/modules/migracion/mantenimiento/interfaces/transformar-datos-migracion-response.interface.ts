
export interface ITransformarDatoMigracionResponse {
  clientesTransformados: DatosTransformadosInterface[];
  registrosMigradosContador: number;
}

export interface DatosTransformadosInterface {
  cliente: {
    publicKey: string;
    nombreCompleto: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno?: string;
    numeroDocumento: string;
    idTipoDocumento: number;
    activo: boolean;
  };
  migracionMetadata: {
    legacyMysqlId: number;
    fechaMigracion: Date;
  };
}
