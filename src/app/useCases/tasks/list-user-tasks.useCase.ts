import type { TaskRepository } from "../../repositories/task.repository.js";

export class ListUserTasksUseCase {
  constructor(private taskRepo: TaskRepository) { }

  async execute(userId: string) {
    const tasks = await this.taskRepo.findManyByUserId(userId);

    // Mapeia cada entidade para um DTO
    return tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      isCompleted: task.isCompleted,
      createdAt: task.createdAt
    }));
  }
}