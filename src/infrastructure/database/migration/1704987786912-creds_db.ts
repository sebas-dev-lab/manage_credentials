import { MigrationInterface, QueryRunner } from "typeorm";

export class CredsDb1704987786912 implements MigrationInterface {
    name = 'CredsDb1704987786912'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth_sessions" ADD "two_factor_authorized" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "auth_sessions" ADD "two_factor_code" character varying(200)`);
        await queryRunner.query(`ALTER TABLE "auth_users" ADD "two_factor_enabled" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth_users" DROP COLUMN "two_factor_enabled"`);
        await queryRunner.query(`ALTER TABLE "auth_sessions" DROP COLUMN "two_factor_code"`);
        await queryRunner.query(`ALTER TABLE "auth_sessions" DROP COLUMN "two_factor_authorized"`);
    }

}
