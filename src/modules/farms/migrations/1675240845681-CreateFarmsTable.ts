import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateFarmsTable1675240845681 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS "farm" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY, 
            "userId" uuid NOT NULL REFERENCES "user" ("id"),
            "name" character varying NOT NULL, 
            "address" text NOT NULL, 
            "coordinates" point NOT NULL, 
            "size" double precision,
            "yield" double precision, 
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
            "updatedAt" TIMESTAMP DEFAULT now()
          )`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "farm"`);
    }

}
