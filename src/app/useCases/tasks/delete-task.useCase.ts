import type { TaskRepository } from "../../repositories/task.repository.js";

export class DeleteTaskUseCase {
  constructor(private taskRepo: TaskRepository) { }

  async execute(taskId: string, userId: string) {
    const task = await this.taskRepo.findById(taskId);

    if (!task) throw new Error("Task not found.");
    if (task.userId !== userId) throw new Error("Not allowed.");

    await this.taskRepo.delete(taskId);
  }
}