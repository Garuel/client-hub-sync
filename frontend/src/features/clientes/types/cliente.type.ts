import type { IListResponse, IPaginatedResponse } from "../../../share/type";

export interface ClienteInterface {
    publicKey: string;
    nombreCompleto: string;
    numeroDocumento: string;
    activo: boolean;
    tipoDocumento: TipoDocumento

    clienteMigracion?: ClienteMigracionInterface;
}

export interface TipoDocumento {
    id: number;
    abreviatura: string;
}

export interface ClienteMigracionInterface {
    legacyMysqlId: number;
    fechaMigracion: Date;
    usuarioMigrador: string;
}


export type ClientesPaginatedResponse = IPaginatedResponse<ClienteInterface>;
export type TipoDocumentoListResponse = IListResponse<TipoDocumento>;