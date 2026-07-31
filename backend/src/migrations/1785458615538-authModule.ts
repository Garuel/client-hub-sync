import { MigrationInterface, QueryRunner } from "typeorm";

export class AuthModule1785458615538 implements MigrationInterface {
    name = 'AuthModule1785458615538'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS auth`);
        await queryRunner.query(`CREATE TABLE "auth"."tp_pre_registro" ("id" SERIAL NOT NULL, "email" character varying(150) NOT NULL, "token_invitacion" character varying NOT NULL, "fecha_expiracion" TIMESTAMP NOT NULL, "completado" boolean NOT NULL DEFAULT false, "ip_creacion" character varying(45), "user_agent" character varying, CONSTRAINT "UQ_b8f607623da8105f2fa3405e73b" UNIQUE ("email"), CONSTRAINT "UQ_aadd1e9689124eedb3d2a1d8de0" UNIQUE ("token_invitacion"), CONSTRAINT "PK_c1ffc3875ba160b4b95f2acb5f8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b8f607623da8105f2fa3405e73" ON "auth"."tp_pre_registro"  ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_aadd1e9689124eedb3d2a1d8de" ON "auth"."tp_pre_registro"  ("token_invitacion") `);
        await queryRunner.query(`CREATE TABLE "masters"."tm_estado_usuario" ("id" SERIAL NOT NULL, "descripcion" character varying(20) NOT NULL, CONSTRAINT "PK_3a964e6b9736cb8c4adf3a864e9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth"."tp_usuario_refresh_token" ("id" SERIAL NOT NULL, "id_usuario" integer NOT NULL, "refresh_token" character varying(255) NOT NULL, "fecha_expiracion" TIMESTAMP NOT NULL, "fecha_uso" TIMESTAMP, "revocado" boolean NOT NULL DEFAULT false, "ip_creacion" character varying(45), CONSTRAINT "PK_70eecaf88654d3052af5c7708eb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth"."tp_usuario" ("id" SERIAL NOT NULL, "username" character varying(75) NOT NULL, "password" character varying(255) NOT NULL, "fecha_inicio" TIMESTAMP NOT NULL DEFAULT now(), "fecha_fin" TIMESTAMP, "id_estado" integer NOT NULL, "id_usuario_datos_personales" integer NOT NULL, CONSTRAINT "UQ_581fb7cfcf00247b45c4621c230" UNIQUE ("username"), CONSTRAINT "PK_9fdb210df04367ee8f1afb7391e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth"."ts_usuario_datos_personales" ("id" SERIAL NOT NULL, "nombres" character varying NOT NULL, "apellido_paterno" character varying NOT NULL, "apellido_materno" character varying, "numero_documento" character varying NOT NULL, "email" character varying NOT NULL, "telefono" character varying, "direccion" character varying, "id_tipo_documento" integer NOT NULL, CONSTRAINT "PK_bae971b775790d2194798b0a9c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d4335a1b9a5697e8732e8a96be" ON "auth"."ts_usuario_datos_personales"  ("email") `);
        await queryRunner.query(`ALTER TABLE "auth"."tp_usuario_refresh_token" ADD CONSTRAINT "FK_5a02fd6d105a080e17014156fe9" FOREIGN KEY ("id_usuario") REFERENCES "auth"."tp_usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auth"."tp_usuario" ADD CONSTRAINT "FK_6b0b8507b376934ce22dff2c044" FOREIGN KEY ("id_estado") REFERENCES "masters"."tm_estado_usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auth"."tp_usuario" ADD CONSTRAINT "FK_1d7ad27a7416e975ce7860bb84a" FOREIGN KEY ("id_usuario_datos_personales") REFERENCES "auth"."ts_usuario_datos_personales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth"."tp_usuario" DROP CONSTRAINT "FK_1d7ad27a7416e975ce7860bb84a"`);
        await queryRunner.query(`ALTER TABLE "auth"."tp_usuario" DROP CONSTRAINT "FK_6b0b8507b376934ce22dff2c044"`);
        await queryRunner.query(`ALTER TABLE "auth"."tp_usuario_refresh_token" DROP CONSTRAINT "FK_5a02fd6d105a080e17014156fe9"`);
        await queryRunner.query(`DROP INDEX "auth"."IDX_d4335a1b9a5697e8732e8a96be"`);
        await queryRunner.query(`DROP TABLE "auth"."ts_usuario_datos_personales"`);
        await queryRunner.query(`DROP TABLE "auth"."tp_usuario"`);
        await queryRunner.query(`DROP TABLE "auth"."tp_usuario_refresh_token"`);
        await queryRunner.query(`DROP TABLE "masters"."tm_estado_usuario"`);
        await queryRunner.query(`DROP INDEX "auth"."IDX_aadd1e9689124eedb3d2a1d8de"`);
        await queryRunner.query(`DROP INDEX "auth"."IDX_b8f607623da8105f2fa3405e73"`);
        await queryRunner.query(`DROP TABLE "auth"."tp_pre_registro"`);
        await queryRunner.query(`DROP SCHEMA IF EXISTS auth`);
    }

}
