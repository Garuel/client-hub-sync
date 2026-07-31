import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EstadoUsuarioEntity } from "../masters";
import { UsuarioDatosPersonalesEntity } from "./usuario-datos-personales.entity";
import { UsuarioRefreshTokenEntity } from "./usuario-refresh-token.entity";

@Entity({
    schema: 'auth',
    name: 'tp_usuario',
})
export class UsuarioEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({
        name: 'username',
        type: 'varchar',
        length: 75,
        nullable: false,
        unique: true,
    })
    username: string;

    @Column({
        name: 'password',
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    password: string;

    @Column({
        name: 'fecha_inicio',
        type: 'timestamp',
        nullable: false,
        default: () => 'CURRENT_TIMESTAMP',
    })
    fechaInicio: Date;

    @Column({
        name: 'fecha_fin',
        type: 'timestamp',
        nullable: true,
    })
    fechaFin: Date;


    @Column({
        name: 'id_estado',
        type: 'integer',
        nullable: false,
    })
    idEstado: number;

    @Column({
        name: 'id_usuario_datos_personales',
        type: 'integer',
        nullable: false,
    })
    idUsuarioDatosPersonales: number;


    @ManyToOne(() => EstadoUsuarioEntity, (estadoUsuarioEntity) => estadoUsuarioEntity.usuarios)
    @JoinColumn({ name: 'id_estado' })
    estadoUsuarioEntity: EstadoUsuarioEntity;

    @ManyToOne(() => UsuarioDatosPersonalesEntity, (usuarioDatosPersonalesEntity) => usuarioDatosPersonalesEntity.usuarios)
    @JoinColumn({ name: 'id_usuario_datos_personales' })
    usuarioDatosPersonalesEntity: UsuarioDatosPersonalesEntity;

    @OneToMany(() => UsuarioRefreshTokenEntity, (usuarioRefreshTokenEntity) => usuarioRefreshTokenEntity.usuario)
    usuarioRefreshTokens: UsuarioRefreshTokenEntity[];

}