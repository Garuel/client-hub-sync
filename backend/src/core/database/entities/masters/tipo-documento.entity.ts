import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ClienteEntity } from '../core/cliente.entity';

@Entity({
  schema: 'masters',
  name: 'tp_tipo_documento',
})
export class TipoDocumentoEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    name: 'nombre',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  nombre: string;

  @Column({
    name: 'descripcion',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  descripcion?: string;

  @Column({
    name: 'abreviatura',
    type: 'varchar',
    length: 30,
    nullable: false,
  })
  abreviatura: string;

  @OneToMany(() => ClienteEntity, (cliente) => cliente.tipoDocumento)
  clientes: ClienteEntity[];
}
