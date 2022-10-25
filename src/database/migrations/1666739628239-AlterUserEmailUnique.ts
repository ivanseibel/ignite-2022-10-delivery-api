import { MigrationInterface, QueryRunner, TableUnique } from 'typeorm';

export class AlterUserEmailUnique1666739628239 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createUniqueConstraint(
      'users',
      new TableUnique({
        columnNames: ['email'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint('users', 'email');
  }
}
