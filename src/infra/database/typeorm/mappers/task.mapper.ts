import { Task } from "../../../../app/entities/task.entity.js";
import { TaskModel } from "../models/task.model.js";

export class TaskMapper {
    static toPersistence(task: Task): TaskModel {
        const model = new TaskModel();
        model.id = task.id;
        model.title = task.title;
        model.description = task.description || "";
        model.is_completed = task.isCompleted;
        model.user_id = task.userId;
        model.created_at = task.createdAt;
        model.updated_at = task.updatedAt;
        return model;
    }

    static toDomain(model: TaskModel): Task {
        return Task.reconstitute(
            {
                title: model.title,
                description: model.description,
                isCompleted: model.is_completed,
                userId: model.user_id,
            },
            model.id,
            model.created_at,
            model.updated_at
        );
    }
}