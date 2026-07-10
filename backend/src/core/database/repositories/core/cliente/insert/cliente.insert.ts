export interface IClienteInsert {
  publicKey: string;
  nombreCompleto: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  numeroDocumento: string;
  idTipoDocumento: number;
  activo: boolean;
}
