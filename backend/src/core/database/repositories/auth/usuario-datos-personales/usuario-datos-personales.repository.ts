import { UsuarioDatosPersonalesEntity } from "src/core/database/entities/auth/usuario-datos-personales.entity";
import { DataSource, EntityManager, InsertResult, Repository } from "typeorm";
import { IUsuarioDatosPersonalesInsert } from "./insert/usuario-datos-personales.insert";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UsuarioDatosRepository {
    constructor(private readonly dataSource: DataSource) { }
    private getRepo(manager?: EntityManager): Repository<UsuarioDatosPersonalesEntity> {
        return manager
            ? manager.getRepository(UsuarioDatosPersonalesEntity)
            : this.dataSource.getRepository(UsuarioDatosPersonalesEntity);
    }


    async insert(usuarioDatosInsert: IUsuarioDatosPersonalesInsert[], manager?: EntityManager): Promise<InsertResult> {
        return this.getRepo(manager)
            .createQueryBuilder()
            .insert()
            .into(UsuarioDatosPersonalesEntity)
            .values(usuarioDatosInsert)
            .execute();
    }


    async getPorEmail(email: string, manager?: EntityManager): Promise<UsuarioDatosPersonalesEntity | null> {
        return this.getRepo(manager)
            .createQueryBuilder('datosPersonales')
            .select()
            .where('datosPersonales.email = :email', { email })
            .getOne();
    }
}