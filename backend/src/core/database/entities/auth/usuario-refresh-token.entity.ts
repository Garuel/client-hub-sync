import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UsuarioEntity } from "./usuario.entity";

@Entity({
  schema: "auth",
  name: "tp_usuario_refresh_token",
})
export class UsuarioRefreshTokenEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({ name: "id_usuario", type: "int" })
  idUsuario!: number;

  @Column({ name: "refresh_token", type: "varchar", length: 255 })
  refreshToken!: string;

  @Column({ name: "fecha_expiracion", type: "timestamp" })
  fechaExpiracion!: Date;

  @Column({ name: "fecha_uso", type: "timestamp", nullable: true })
  fechaUso!: Date | null;

  @Column({ name: "revocado", type: "boolean", default: false })
  revocado!: boolean;

  @Column({ name: "ip_creacion", type: "varchar", length: 45, nullable: true })
  ipCreacion?: string;

  @ManyToOne(() => UsuarioEntity, (usuario) => usuario.usuarioRefreshTokens)
  @JoinColumn({ name: "id_usuario" })
  usuario!: UsuarioEntity;
}
