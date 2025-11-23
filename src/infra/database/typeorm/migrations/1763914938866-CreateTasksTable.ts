import { Table, TableForeignKey, type MigrationInterface, type QueryRunner } from "typeorm";

export class CreateTasksTable1763914938866 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "tasks",
            columns: [
                { name: "id", type: "uuid", isPrimary: true },
                { name: "title", type: "varchar" },
                { name: "description", type: "varchar", isNullable: true },
                { name: "is_completed", type: "boolean", default: false },
                { name: "user_id", type: "uuid" },
                { name: "created_at", type: "timestamp", default: "now()" },
                { name: "updated_at", type: "timestamp", default: "now()" },
            ]
        }));

        await queryRunner.createForeignKey("tasks", new TableForeignKey({
            columnNames: ["user_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE" // Se apagar o user, apaga as tasks
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("tasks");
    }
}