import { ClienteMigracionEntity } from "src/core/database/entities/core/cliente-migracion.entity";
import { DataSource, EntityManager, Repository } from "typeorm";
import { IClienteMigracionInsert } from "./insert/cliente-migracion.insert";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ClienteMigracionRepository {
    constructor(private readonly dataSource: DataSource) { }
    private getRepo(manager?: EntityManager): Repository<ClienteMigracionEntity> {
        return manager
            ? manager.getRepository(ClienteMigracionEntity)
            : this.dataSource.getRepository(ClienteMigracionEntity);
    }


    async insert(clienteMigracionInsert: IClienteMigracionInsert[], manager?: EntityManager) {
        return this.getRepo(manager)
            .createQueryBuilder()
            .insert()
            .values(clienteMigracionInsert)
            .execute();
    }
}