import { MigrationInterface, QueryRunner } from 'typeorm';

export class basicRelations1670529431472 implements MigrationInterface {
  name = 'basicRelations1670529431472';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bid" ("id" SERIAL NOT NULL, "initial_date" TIME WITH TIME ZONE NOT NULL, "end_date" TIME WITH TIME ZONE NOT NULL, CONSTRAINT "PK_ed405dda320051aca2dcb1a50bb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "products_categories" ("product_id" integer NOT NULL, "category_id" integer NOT NULL, CONSTRAINT "PK_634f5e1b5983772473fe0ec0008" PRIMARY KEY ("product_id", "category_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f2c76a4306a82c696d620f81f0" ON "products_categories" ("product_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_19fe0fe8c2fcf1cbe1a80f639f" ON "products_categories" ("category_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "order_products_product" ("orderId" integer NOT NULL, "productId" integer NOT NULL, CONSTRAINT "PK_59f5d41216418eba313ed3c7d7c" PRIMARY KEY ("orderId", "productId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1f9ea0b0e59e0d98ade4f2d5e9" ON "order_products_product" ("orderId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d6c66c08b9c7e84a1b657797df" ON "order_products_product" ("productId") `,
    );
    await queryRunner.query(`ALTER TABLE "brand" ADD "productsId" integer`);
    await queryRunner.query(`ALTER TABLE "product" ADD "brandId" integer`);
    await queryRunner.query(`ALTER TABLE "order" ADD "userId" integer`);
    await queryRunner.query(
      `ALTER TABLE "brand" ADD CONSTRAINT "FK_fffa90bca42031ca4f22f010466" FOREIGN KEY ("productsId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_bb7d3d9dc1fae40293795ae39d6" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products_categories" ADD CONSTRAINT "FK_f2c76a4306a82c696d620f81f08" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "products_categories" ADD CONSTRAINT "FK_19fe0fe8c2fcf1cbe1a80f639f1" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_products_product" ADD CONSTRAINT "FK_1f9ea0b0e59e0d98ade4f2d5e99" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_products_product" ADD CONSTRAINT "FK_d6c66c08b9c7e84a1b657797dff" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_products_product" DROP CONSTRAINT "FK_d6c66c08b9c7e84a1b657797dff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_products_product" DROP CONSTRAINT "FK_1f9ea0b0e59e0d98ade4f2d5e99"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products_categories" DROP CONSTRAINT "FK_19fe0fe8c2fcf1cbe1a80f639f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products_categories" DROP CONSTRAINT "FK_f2c76a4306a82c696d620f81f08"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_bb7d3d9dc1fae40293795ae39d6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "brand" DROP CONSTRAINT "FK_fffa90bca42031ca4f22f010466"`,
    );
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "brandId"`);
    await queryRunner.query(`ALTER TABLE "brand" DROP COLUMN "productsId"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d6c66c08b9c7e84a1b657797df"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1f9ea0b0e59e0d98ade4f2d5e9"`,
    );
    await queryRunner.query(`DROP TABLE "order_products_product"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_19fe0fe8c2fcf1cbe1a80f639f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f2c76a4306a82c696d620f81f0"`,
    );
    await queryRunner.query(`DROP TABLE "products_categories"`);
    await queryRunner.query(`DROP TABLE "bid"`);
  }
}
