import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { ClienteEntity } from './cliente.entity';

@Entity({
    schema: 'core',
    name: 'tp_cliente_migracion',
})
export class ClienteMigracionEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({
        name: 'id_cliente',
        type: 'int',
        nullable: false,
    })
    idCliente: number;

    @Column({
        name: 'legacy_mysql_id',
        type: 'int',
        nullable: false,
        unique: true,
    })
    legacyMysqlId: number;

    @Column({
        name: 'fecha_migracion',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    fechaMigracion: Date;

    @Column({
        name: 'usuario_migrador',
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    usuarioMigrador?: string;

    @OneToOne(() => ClienteEntity, (cliente) => cliente.clienteMigracion, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_cliente' })
    cliente: ClienteEntity;
}