import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterIsAdminColumnName1667662626166 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('users', 'isAdmin', 'is_admin');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('users', 'is_admin', 'isAdmin');
  }
}
