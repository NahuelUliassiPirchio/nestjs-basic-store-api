import { MigrationInterface, QueryRunner } from "typeorm";

export class UserPassword1670878013239 implements MigrationInterface {
    name = 'UserPassword1670878013239'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
    }

}
