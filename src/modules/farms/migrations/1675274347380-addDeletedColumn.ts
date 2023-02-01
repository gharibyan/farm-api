import { MigrationInterface, QueryRunner } from "typeorm"

export class addDeletedColumn1675274347380 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
      `ALTER TABLE "farm" ADD COLUMN "deleted" boolean DEFAULT false`
      )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
        `ALTER TABLE "farm" DROP COLUMN IF EXISTS "deleted"`
      )
    }

}
