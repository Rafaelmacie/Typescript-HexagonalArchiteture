import type { TaskRepository } from "../../repositories/task.repository.js";

interface Input { taskId: string; userId: string; title?: string; description?: string; isCompleted?: boolean; }

export class UpdateTaskUseCase {
  constructor(private taskRepo: TaskRepository) { }

  async execute(input: Input) {
    const task = await this.taskRepo.findById(input.taskId);

    if (!task) throw new Error("Task not found.");
    if (task.userId !== input.userId) throw new Error("Not allowed.");

    if (input.title || input.description) {
      task.update({ title: input.title, description: input.description });
    }

    if (input.isCompleted !== undefined) {
      // Se o estado enviado for diferente do atual, alterna
      if (task.isCompleted !== input.isCompleted) {
        task.toggleCompletion();
      }
    }

    await this.taskRepo.save(task);
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      isCompleted: task.isCompleted,
      userId: task.userId,
      updatedAt: task.updatedAt
    };
  }
}