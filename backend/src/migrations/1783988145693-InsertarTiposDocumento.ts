import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertarTiposDocumento1783988145693 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO masters.tp_tipo_documento (nombre, descripcion, abreviatura) VALUES
            ('Documento Nacional de Identidad', 'Documento Nacional de Identidad peruano', 'DNI'),
            ('Registro Único de Contribuyentes', 'Documento de persona tributaria en Perú', 'RUC'),
            ('Carnet de Extranjería', 'Documento de persona extranjera en Perú', 'CE');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM masters.tp_tipo_documento WHERE abreviatura IN ('DNI', 'RUC', 'CE');
        `);
    }
}