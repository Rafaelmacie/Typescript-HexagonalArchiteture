import { Task } from "../../entities/task.entity.js";
import type { TaskRepository } from "../../repositories/task.repository.js";

interface Input { title: string; description?: string; userId: string; }

export class CreateTaskUseCase {
  constructor(private taskRepo: TaskRepository) { }

  async execute(input: Input) {
    const task = Task.create(input);
    await this.taskRepo.create(task);
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      isCompleted: task.isCompleted,
      userId: task.userId,
      createdAt: task.createdAt
    };
  }
}