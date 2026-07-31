import { DataSource, EntityManager, InsertResult, Repository } from "typeorm";
import { UsuarioEntity } from "../../../entities/auth/usuario.entity";
import { IUsuarioInsert } from "./insert/usuario.insert";


export class UsuarioRepository {
    constructor(private readonly dataSource: DataSource) { }
    private getRepo(manager?: EntityManager): Repository<UsuarioEntity> {
        return manager
            ? manager.getRepository(UsuarioEntity)
            : this.dataSource.getRepository(UsuarioEntity);
    }

    async insert(usuarioInsert: IUsuarioInsert[], manager?: EntityManager): Promise<InsertResult> {
        return this.getRepo(manager)
            .createQueryBuilder()
            .insert()
            .into(UsuarioEntity)
            .values(usuarioInsert)
            .execute();
    }

    async getPorUsername(username: string, manager?: EntityManager): Promise<UsuarioEntity | null> {
        return this.getRepo(manager)
            .createQueryBuilder('usuario')
            .select()
            .where('usuario.username = :username', { username })
            .getOne();
    }

    async getPorUsernameConDatosPersonales(username: string, manager?: EntityManager): Promise<UsuarioEntity | null> {
        return this.getRepo(manager)
            .createQueryBuilder('usuario')
            .leftJoinAndSelect('usuario.usuarioDatosPersonalesEntity', 'datosPersonales')
            .where('usuario.username = :username', { username })
            .getOne();
    }

    async getPorId(id: number, manager?: EntityManager): Promise<UsuarioEntity | null> {
        return this.getRepo(manager)
            .createQueryBuilder('usuario')
            .leftJoinAndSelect('usuario.usuarioDatosPersonalesEntity', 'datosPersonales')
            .where('usuario.id = :id', { id })
            .getOne();
    }

}

