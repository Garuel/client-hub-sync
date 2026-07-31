import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UsuarioEntity } from "./usuario.entity";

@Entity({
    schema: 'auth',
    name: 'ts_usuario_datos_personales',
})
export class UsuarioDatosPersonalesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'nombres',
        type: 'varchar',
        nullable: false,
    })
    nombres: string;

    @Column({
        name: 'apellido_paterno',
        type: 'varchar',
        nullable: false,
    })
    apellidoPaterno: string;

    @Column({
        name: 'apellido_materno',
        type: 'varchar',
        nullable: true,
    })
    apellidoMaterno?: string;

    @Column({
        name: 'numero_documento',
        type: 'varchar',
        nullable: false,
    })
    numeroDocumento: string;

    @Index()
    @Column({
        name: 'email',
        type: 'varchar',
        nullable: false,
    })
    email: string;

    @Column({
        name: 'telefono',
        type: 'varchar',
        nullable: true,
    })
    telefono?: string;

    @Column({
        name: 'direccion',
        type: 'varchar',
        nullable: true,
    })
    direccion?: string;

    @Column({
        name: 'id_tipo_documento',
        type: 'integer',
        nullable: false,
    })
    idTipoDocumento: number;

    @OneToMany(() => UsuarioEntity, (usuario) => usuario.usuarioDatosPersonalesEntity)
    usuarios: UsuarioEntity[];
}