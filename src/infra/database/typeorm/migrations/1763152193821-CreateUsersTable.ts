import { type MigrationInterface, type QueryRunner, Table } from "typeorm";

export class CreateUsersTable1763152193821 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "name",
                        type: "varchar",
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "password_hash",
                        type: "varchar",
                        length: "64",
                    },
                    {
                        name: "created_at",
                        type: "timestamp with time zone",
                        default: "now()",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp with time zone",
                        default: "now()",
                    },
                    {
                        name: "deleted_at",
                        type: "timestamp with time zone",
                        isNullable: true, // [00:18:30]
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users");
    }
}