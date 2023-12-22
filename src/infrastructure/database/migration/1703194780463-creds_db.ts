import { MigrationInterface, QueryRunner } from "typeorm";

export class CredsDb1703194780463 implements MigrationInterface {
    name = 'CredsDb1703194780463'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth_users" ADD "aaa" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth_users" DROP COLUMN "aaa"`);
    }

}
