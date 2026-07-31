export interface IUsuarioRefreshTokenInsert {
    idUsuario: number;
    refreshToken: string;
    fechaExpiracion: Date;
    fechaUso?: Date | null;
    revocado?: boolean;
    ipCreacion?: string;
}
