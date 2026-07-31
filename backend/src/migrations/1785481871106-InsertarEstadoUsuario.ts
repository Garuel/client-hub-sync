import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertarEstadoUsuario1785481871106 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO masters.tm_estado_usuario (id, descripcion) VALUES
            (1, 'ACTIVO'),
            (2, 'INACTIVO'),
            (3, 'ELIMINADO'),
            (4, 'SUSPENDIDO');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM masters.tm_estado_usuario WHERE id IN (1, 2, 3, 4);
        `);
    }

}
