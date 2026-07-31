export interface IPreRegistroInsert {
    email: string;
    tokenInvitacion: string;
    fechaExpiracion: Date;
    completado: boolean;
    ipCreacion?: string;
    userAgent?: string;
}
