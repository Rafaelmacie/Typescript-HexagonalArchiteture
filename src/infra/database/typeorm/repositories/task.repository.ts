import { Repository } from "typeorm";
import type { TaskRepository } from "../../../../app/repositories/task.repository.js";
import { Task } from "../../../../app/entities/task.entity.js";
import { AppDataSource } from "../data-source.js";
import { TaskModel } from "../models/task.model.js";
import { TaskMapper } from "../mappers/task.mapper.js";

export class TypeOrmTaskRepository implements TaskRepository {
    private repo: Repository<TaskModel>;

    constructor() {
        this.repo = AppDataSource.getRepository(TaskModel);
    }

    async create(task: Task): Promise<void> {
        const model = TaskMapper.toPersistence(task);
        await this.repo.save(model);
    }

    async save(task: Task): Promise<void> {
        await this.create(task); // TypeORM 'save' serve para create e update
    }

    async findById(id: string): Promise<Task | null> {
        const model = await this.repo.findOneBy({ id });
        return model ? TaskMapper.toDomain(model) : null;
    }

    async findManyByUserId(userId: string): Promise<Task[]> {
        const models = await this.repo.findBy({ user_id: userId });
        return models.map(TaskMapper.toDomain);
    }

    async delete(id: string): Promise<void> {
        await this.repo.delete(id);
    }
}