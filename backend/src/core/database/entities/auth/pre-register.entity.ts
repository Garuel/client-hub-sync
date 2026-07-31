import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  schema: "auth",
  name: "tp_pre_registro",
})
export class PreRegistroEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Index()
  @Column({ type: "varchar", length: 150, nullable: false, unique: true })
  email: string;

  @Index()
  @Column({ name: "token_invitacion", type: "varchar", nullable: false, unique: true })
  tokenInvitacion: string;

  @Column({ name: "fecha_expiracion", type: "timestamp", nullable: false })
  fechaExpiracion: Date;

  @Column({ name: "completado", type: "boolean", default: false })
  completado: boolean;

  @Column({ name: "ip_creacion", type: "varchar", length: 45, nullable: true })
  ipCreacion?: string;

  @Column({ name: "user_agent", type: "varchar", nullable: true })
  userAgent?: string;
}
