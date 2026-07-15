import { ClienteMigracionEntity } from "src/core/database/entities/core/cliente-migracion.entity";
import { DataSource, Repository } from "typeorm";
import { IClienteMigracionInsert } from "./insert/cliente-migracion.insert";

export class ClienteMigracionRepository extends Repository<ClienteMigracionEntity> {
    constructor(connection: DataSource) {
        super(ClienteMigracionEntity, connection.createEntityManager());
    }

    async insert(clienteMigracionInsert: IClienteMigracionInsert[]) {
        return this.createQueryBuilder()
            .insert()
            .values(clienteMigracionInsert)
            .execute();
    }
}