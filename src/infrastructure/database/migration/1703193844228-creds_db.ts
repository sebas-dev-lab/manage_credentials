import { MigrationInterface, QueryRunner } from "typeorm";

export class CredsDb1703193844228 implements MigrationInterface {
    name = 'CredsDb1703193844228'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "auth_sessions" ("data_created" TIMESTAMP DEFAULT now(), "data_modified" TIMESTAMP DEFAULT now(), "data_deleted" TIMESTAMP, "user_created" integer, "user_modified" integer, "user_deleted" integer, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "session_token" text NOT NULL, "refresh_session_token" text NOT NULL, "session_code" character varying(25) NOT NULL, "authorized" boolean NOT NULL DEFAULT false, "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP NOT NULL, "ip" character varying(100) NOT NULL, "user_agent" character varying(255) NOT NULL, "auth_user_id" integer, CONSTRAINT "PK_641507381f32580e8479efc36cd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "site_credentials" ("data_created" TIMESTAMP DEFAULT now(), "data_modified" TIMESTAMP DEFAULT now(), "data_deleted" TIMESTAMP, "user_created" integer, "user_modified" integer, "user_deleted" integer, "id" SERIAL NOT NULL, "secret" character varying(25) NOT NULL, "ivp" character varying(50) NOT NULL, "site" character varying(255) NOT NULL, "username" character varying(255), "note" text, CONSTRAINT "PK_9d8f7d5763895ec0ba39db936e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth_modules" ("data_created" TIMESTAMP DEFAULT now(), "data_modified" TIMESTAMP DEFAULT now(), "data_deleted" TIMESTAMP, "user_created" integer, "user_modified" integer, "user_deleted" integer, "id" SERIAL NOT NULL, "description" character varying(100) NOT NULL, "endpoint" character varying(100) NOT NULL, CONSTRAINT "PK_91b0aa5a35978a05ebe33243913" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth_permissions" ("data_created" TIMESTAMP DEFAULT now(), "data_modified" TIMESTAMP DEFAULT now(), "data_deleted" TIMESTAMP, "user_created" integer, "user_modified" integer, "user_deleted" integer, "id" SERIAL NOT NULL, "auth_role_id" integer, "auth_module_id" integer, CONSTRAINT "PK_9f1634df753682faaf3d2bca55b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth_roles" ("data_created" TIMESTAMP DEFAULT now(), "data_modified" TIMESTAMP DEFAULT now(), "data_deleted" TIMESTAMP, "user_created" integer, "user_modified" integer, "user_deleted" integer, "id" SERIAL NOT NULL, "description" character varying(50) NOT NULL, CONSTRAINT "PK_fa9e7a265809eafa9e1f47122e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth_users" ("data_created" TIMESTAMP DEFAULT now(), "data_modified" TIMESTAMP DEFAULT now(), "data_deleted" TIMESTAMP, "user_created" integer, "user_modified" integer, "user_deleted" integer, "id" SERIAL NOT NULL, "email" character varying(255) NOT NULL, "name" character varying(50) NOT NULL, "last_name" character varying(50) NOT NULL, "enable" boolean NOT NULL DEFAULT true, "auth_credential_id" integer, "auth_role_id" integer, CONSTRAINT "UQ_13d8b49e55a8b06bee6bbc828fb" UNIQUE ("email"), CONSTRAINT "REL_107c25b4b88ef92886b9276f3d" UNIQUE ("auth_credential_id"), CONSTRAINT "PK_c88cc8077366b470dafc2917366" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth_credentials" ("data_created" TIMESTAMP DEFAULT now(), "data_modified" TIMESTAMP DEFAULT now(), "data_deleted" TIMESTAMP, "user_created" integer, "user_modified" integer, "user_deleted" integer, "id" SERIAL NOT NULL, "password" character varying(150) NOT NULL, "auth_user_id" integer, CONSTRAINT "REL_172874b217f0de9f1e55e87b25" UNIQUE ("auth_user_id"), CONSTRAINT "PK_90fdced0865b5f15586e7cd3b25" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_site_credentials" ("authUsersId" integer NOT NULL, "siteCredentialsId" integer NOT NULL, CONSTRAINT "PK_70724037ccacbeec1458eb7e20c" PRIMARY KEY ("authUsersId", "siteCredentialsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bdda44c98e5c2c706d87b8b7cb" ON "users_site_credentials" ("authUsersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_59d432806cb4f11124da274221" ON "users_site_credentials" ("siteCredentialsId") `);
        await queryRunner.query(`ALTER TABLE "auth_sessions" ADD CONSTRAINT "FK_9bea31748811ff1b9770e7aca77" FOREIGN KEY ("auth_user_id") REFERENCES "auth_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auth_permissions" ADD CONSTRAINT "FK_2d10772a8723c63bacc18f22eea" FOREIGN KEY ("auth_role_id") REFERENCES "auth_roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auth_permissions" ADD CONSTRAINT "FK_62b666f8ceb72d226d24a769e27" FOREIGN KEY ("auth_module_id") REFERENCES "auth_modules"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auth_users" ADD CONSTRAINT "FK_107c25b4b88ef92886b9276f3dc" FOREIGN KEY ("auth_credential_id") REFERENCES "auth_credentials"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "auth_users" ADD CONSTRAINT "FK_cdb4ced56914cdc4df454b61af8" FOREIGN KEY ("auth_role_id") REFERENCES "auth_roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auth_credentials" ADD CONSTRAINT "FK_172874b217f0de9f1e55e87b25d" FOREIGN KEY ("auth_user_id") REFERENCES "auth_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_site_credentials" ADD CONSTRAINT "FK_bdda44c98e5c2c706d87b8b7cba" FOREIGN KEY ("authUsersId") REFERENCES "auth_users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_site_credentials" ADD CONSTRAINT "FK_59d432806cb4f11124da274221c" FOREIGN KEY ("siteCredentialsId") REFERENCES "site_credentials"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_site_credentials" DROP CONSTRAINT "FK_59d432806cb4f11124da274221c"`);
        await queryRunner.query(`ALTER TABLE "users_site_credentials" DROP CONSTRAINT "FK_bdda44c98e5c2c706d87b8b7cba"`);
        await queryRunner.query(`ALTER TABLE "auth_credentials" DROP CONSTRAINT "FK_172874b217f0de9f1e55e87b25d"`);
        await queryRunner.query(`ALTER TABLE "auth_users" DROP CONSTRAINT "FK_cdb4ced56914cdc4df454b61af8"`);
        await queryRunner.query(`ALTER TABLE "auth_users" DROP CONSTRAINT "FK_107c25b4b88ef92886b9276f3dc"`);
        await queryRunner.query(`ALTER TABLE "auth_permissions" DROP CONSTRAINT "FK_62b666f8ceb72d226d24a769e27"`);
        await queryRunner.query(`ALTER TABLE "auth_permissions" DROP CONSTRAINT "FK_2d10772a8723c63bacc18f22eea"`);
        await queryRunner.query(`ALTER TABLE "auth_sessions" DROP CONSTRAINT "FK_9bea31748811ff1b9770e7aca77"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_59d432806cb4f11124da274221"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bdda44c98e5c2c706d87b8b7cb"`);
        await queryRunner.query(`DROP TABLE "users_site_credentials"`);
        await queryRunner.query(`DROP TABLE "auth_credentials"`);
        await queryRunner.query(`DROP TABLE "auth_users"`);
        await queryRunner.query(`DROP TABLE "auth_roles"`);
        await queryRunner.query(`DROP TABLE "auth_permissions"`);
        await queryRunner.query(`DROP TABLE "auth_modules"`);
        await queryRunner.query(`DROP TABLE "site_credentials"`);
        await queryRunner.query(`DROP TABLE "auth_sessions"`);
    }

}
