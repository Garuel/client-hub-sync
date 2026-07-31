import { PreRegistroEntity } from "src/core/database/entities/auth";
import { DataSource, EntityManager, InsertResult, Repository, UpdateResult } from "typeorm";
import { IPreRegistroInsert } from "./insert/pre-register.insert";
import { Injectable } from "@nestjs/common";
import { IPreRegistroUpdate } from "./update/pre-register.update";

@Injectable()
export class PreRegisterRepository {
    constructor(private readonly dataSource: DataSource) { }
    private getRepo(manager?: EntityManager): Repository<PreRegistroEntity> {
        return manager
            ? manager.getRepository(PreRegistroEntity)
            : this.dataSource.getRepository(PreRegistroEntity);
    }

    async insert(preRegistroInsert: IPreRegistroInsert[], manager?: EntityManager): Promise<InsertResult> {
        return this.getRepo(manager)
            .createQueryBuilder()
            .insert()
            .into(PreRegistroEntity)
            .values(preRegistroInsert)
            .execute();
    }

    async getPorEmail(email: string, manager?: EntityManager): Promise<PreRegistroEntity | null> {
        return this.getRepo(manager)
            .createQueryBuilder('preRegistro')
            .select()
            .where('preRegistro.email = :email', { email })
            .getOne();
    }

    async getPorToken(token: string, manager?: EntityManager): Promise<PreRegistroEntity | null> {
        return this.getRepo(manager)
            .createQueryBuilder('preRegistro')
            .select()
            .where('preRegistro.tokenInvitacion = :token', { token })
            .getOne();
    }

    async actualizar(id: number, data: IPreRegistroUpdate, manager?: EntityManager): Promise<UpdateResult> {
        return this.getRepo(manager)
            .createQueryBuilder()
            .update()
            .set(data)
            .where('id = :id', { id })
            .execute();
    }
}

