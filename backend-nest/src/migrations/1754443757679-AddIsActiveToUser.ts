import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsActiveToUser1754443757679 implements MigrationInterface {
  name = 'AddIsActiveToUser1754443757679';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isActive" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "roles" SET DEFAULT '["user"]'::jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "roles" SET DEFAULT '["user"]'`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isActive"`);
  }
}
