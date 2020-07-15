import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTransaction1594516985676 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "transactions",
        columns: [{
          name: "id",
          type: 'uuid',
          generationStrategy: "uuid",
          default: "uuid_generate_v4()",
          isPrimary: true,
        },
        {
          name: "title",
          type: "varchar",
          isNullable: false
        },
        {
          name: "value",
          type: "float8",
          isNullable: false
        },
        {
          name: "type",
          type: "varchar",
          isNullable: false
        },
        {
          name:"created_at",
          type:'timestamp',
          default:"now()"
        },
        {
          name:"updated_at",
          type:"timestamp",
          default:"now()"
        }
        ]
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("transactions");
  }

}
