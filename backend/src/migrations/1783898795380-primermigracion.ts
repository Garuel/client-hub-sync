import { MigrationInterface, QueryRunner } from "typeorm";

export class Primermigracion1783898795380 implements MigrationInterface {
    name = 'Primermigracion1783898795380'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS masters`);
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS core`);
        await queryRunner.query(`CREATE TABLE "masters"."tp_tipo_documento" ("id" SERIAL NOT NULL, "nombre" character varying(100) NOT NULL, "descripcion" character varying(255), "abreviatura" character varying(30) NOT NULL, CONSTRAINT "PK_116f470d4112f0e312d82d15c76" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "core"."tp_cliente" ("id" SERIAL NOT NULL, "public_key" character varying NOT NULL, "nombre_completo" character varying(100) NOT NULL, "nombres" character varying(100) NOT NULL, "apellido_paterno" character varying(100) NOT NULL, "apellido_materno" character varying(100), "numero_documento" character varying(100) NOT NULL, "id_tipo_documento" integer NOT NULL, "activo" boolean NOT NULL, CONSTRAINT "PK_a8770492ab11d61f93a806ef912" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "core"."tp_cliente_migracion" ("id" SERIAL NOT NULL, "id_cliente" integer NOT NULL, "legacy_mysql_id" integer NOT NULL, "fecha_migracion" TIMESTAMP NOT NULL DEFAULT now(), "usuario_migrador" character varying(50), CONSTRAINT "UQ_9b539cf338dcf8fdfd4a54392e0" UNIQUE ("legacy_mysql_id"), CONSTRAINT "REL_75ca3d58ded6782f2b134e5ebd" UNIQUE ("id_cliente"), CONSTRAINT "PK_8ae39f0ffbe764b39f9dc1da382" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "core"."tp_cliente" ADD CONSTRAINT "FK_59927f9235e54300b2aab660b1f" FOREIGN KEY ("id_tipo_documento") REFERENCES "masters"."tp_tipo_documento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "core"."tp_cliente_migracion" ADD CONSTRAINT "FK_75ca3d58ded6782f2b134e5ebdf" FOREIGN KEY ("id_cliente") REFERENCES "core"."tp_cliente"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."tp_cliente_migracion" DROP CONSTRAINT "FK_75ca3d58ded6782f2b134e5ebdf"`);
        await queryRunner.query(`ALTER TABLE "core"."tp_cliente" DROP CONSTRAINT "FK_59927f9235e54300b2aab660b1f"`);
        await queryRunner.query(`DROP TABLE "core"."tp_cliente_migracion"`);
        await queryRunner.query(`DROP TABLE "core"."tp_cliente"`);
        await queryRunner.query(`DROP TABLE "masters"."tp_tipo_documento"`);
        await queryRunner.query(`DROP SCHEMA IF EXISTS masters`);
        await queryRunner.query(`DROP SCHEMA IF EXISTS core`);
    }

}
