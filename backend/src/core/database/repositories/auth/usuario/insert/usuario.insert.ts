export interface IUsuarioInsert {
    username: string
    password: string
    fechaInicio: Date
    fechaFin?: Date
    idEstado: number
    idUsuarioDatosPersonales: number
}
