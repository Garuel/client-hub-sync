export interface IClienteMigracionInsert {
    idCliente: number;
    legacyMysqlId: number;
    fechaMigracion: Date;
    usuarioMigrador?: string;
}