import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { UsuarioEntity } from '../auth/usuario.entity';


@Entity({
  schema: 'masters',
  name: 'tm_estado_usuario',
})
export class EstadoUsuarioEntity {
  @PrimaryColumn()
  id: number;

  @Column({
    name: 'descripcion',
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  descripcion: string;

  @OneToMany(() => UsuarioEntity, (usuarios) => usuarios.estadoUsuarioEntity)
  usuarios: UsuarioEntity[];

}
