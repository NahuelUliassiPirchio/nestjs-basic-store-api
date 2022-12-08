import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1670466581391 implements MigrationInterface {
  name = 'init1670466581391';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bid" ("id" SERIAL NOT NULL, "initial_date" TIME WITH TIME ZONE NOT NULL, "end_date" TIME WITH TIME ZONE NOT NULL, CONSTRAINT "PK_ed405dda320051aca2dcb1a50bb" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "bid"`);
  }
}
