import { ClienteMigracionEntity } from "src/core/database/entities/core/cliente-migracion.entity";
import { BaseRepository } from "../../base.repository";
import { DataSource, EntityManager } from "typeorm";
import { IClienteMigracionInsert } from "./insert/cliente-migracion.insert";

export class ClienteMigracionRepository extends BaseRepository<ClienteMigracionEntity> {
    constructor(connection: DataSource | EntityManager) {
        super(connection, ClienteMigracionEntity)
    }

    async insert(clienteMigracionInsert: IClienteMigracionInsert[]) {
        await this.repo.createQueryBuilder()
            .insert()
            .values(clienteMigracionInsert)
            .execute();
    }
}