import { UsuarioRefreshTokenEntity } from "src/core/database/entities/auth";
import { DataSource, EntityManager, InsertResult, Repository, UpdateResult } from "typeorm";
import { IUsuarioRefreshTokenInsert } from "./insert/usuario-refresh-token.insert";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UsuarioRefreshTokenRepository {
    // constructor(connection: DataSource | EntityManager) {
    //     super(
    //         UsuarioRefreshTokenEntity,
    //         typeof (connection as any).createEntityManager === 'function'
    //             ? (connection as DataSource).createEntityManager()
    //             : (connection as EntityManager)
    //     );
    // }


    constructor(private readonly dataSource: DataSource) { }
    private getRepo(manager?: EntityManager): Repository<UsuarioRefreshTokenEntity> {
        return manager
            ? manager.getRepository(UsuarioRefreshTokenEntity)
            : this.dataSource.getRepository(UsuarioRefreshTokenEntity);
    }

    async insert(usuarioRefreshTokenInsert: IUsuarioRefreshTokenInsert[], manager?: EntityManager): Promise<InsertResult> {
        return this.getRepo(manager)
            .createQueryBuilder()
            .insert()
            .into(UsuarioRefreshTokenEntity)
            .values(usuarioRefreshTokenInsert)
            .execute();
    }

    async getPorTokenHash(tokenHash: string, manager?: EntityManager): Promise<UsuarioRefreshTokenEntity | null> {
        return this.getRepo(manager)
            .createQueryBuilder('refresh_token')
            .select()
            .where('refresh_token.tokenHash = :tokenHash', { tokenHash })
            .getOne();
    }

    async update(id: number, data: Partial<UsuarioRefreshTokenEntity>, manager?: EntityManager): Promise<UpdateResult> {
        return this.getRepo(manager)
            .createQueryBuilder()
            .update()
            .set(data)
            .where('id = :id', { id })
            .execute();
    }
}