import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TipoDocumentoEntity } from '../masters/tipo-documento.entity';
import { ClienteMigracionEntity } from './cliente-migracion.entity';

@Entity({
  schema: 'core',
  name: 'tp_cliente',
})
export class ClienteEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    name: 'public_key',
    type: 'varchar',
    nullable: false,
  })
  publicKey: string;

  @Column({
    name: 'nombre_completo',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  nombreCompleto: string;

  @Column({
    name: 'nombres',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  nombres: string;

  @Column({
    name: 'apellido_paterno',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  apellidoPaterno: string;

  @Column({
    name: 'apellido_materno',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  apellidoMaterno?: string;

  @Column({
    name: 'numero_documento',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  numeroDocumento: string;

  @Column({
    name: 'id_tipo_documento',
    type: 'int',
    nullable: false,
  })
  idTipoDocumento: number;

  @Column({
    name: 'activo',
    type: 'boolean',
    nullable: false,
  })
  activo: boolean;


  @ManyToOne(() => TipoDocumentoEntity, (tipoDocumento) => tipoDocumento.id)
  @JoinColumn({ name: 'id_tipo_documento' })
  tipoDocumento: TipoDocumentoEntity;

  @OneToOne(() => ClienteMigracionEntity, (clienteMigracion) => clienteMigracion.cliente)
  clienteMigracion: ClienteMigracionEntity;
}
