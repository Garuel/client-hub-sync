export interface IUsuarioDatosPersonalesInsert {
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno?: string;
    numeroDocumento: string;
    email: string;
    telefono?: string;
    direccion?: string;
    idTipoDocumento: number;
}
