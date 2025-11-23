import { Task } from "../entities/task.entity.js";

export interface TaskRepository {
  create(task: Task): Promise<void>;
  findById(id: string): Promise<Task | null>;
  findManyByUserId(userId: string): Promise<Task[]>;
  save(task: Task): Promise<void>; // Para update
  delete(id: string): Promise<void>;
}