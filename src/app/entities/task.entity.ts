import { randomUUID } from "node:crypto";

export interface TaskProps {
  title: string;
  description?: string | null;
  isCompleted: boolean;
  userId: string; // Relação: O ID do dono da tarefa
}

export class Task {
  private _id: string;
  private props: TaskProps;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: TaskProps, id?: string, createdAt?: Date, updatedAt?: Date) {
    this._id = id ?? randomUUID();
    this.props = props;
    this._createdAt = createdAt ?? new Date();
    this._updatedAt = updatedAt ?? new Date();
  }

  public static create(props: { title: string; description?: string | null; userId: string }, id?: string): Task {
    if (props.title.length < 3) {
      throw new Error("Title must be at least 3 characters long.");
    }

    return new Task({
      title: props.title,
      description: props.description ?? null,
      isCompleted: false, // Padrão: não concluída
      userId: props.userId,
    }, id);
  }

  public static reconstitute(props: TaskProps, id: string, createdAt: Date, updatedAt: Date): Task {
    return new Task(props, id, createdAt, updatedAt);
  }

  // Métodos de Negócio
  public update(data: { title?: string | undefined; description?: string | null | undefined }): void {

    // Validação do título (se ele foi enviado)
    if (data.title && data.title.length < 3) {
      throw new Error("Title must be at least 3 characters long.");
    }

    // Verificamos se é undefined antes de atribuir
    if (data.title !== undefined) {
      this.props.title = data.title;
    }

    if (data.description !== undefined) {
      this.props.description = data.description;
    }

    this._updatedAt = new Date();
  }

  public toggleCompletion(): void {
    this.props.isCompleted = !this.props.isCompleted;
    this._updatedAt = new Date();
  }

  // Getters
  get id() { return this._id; }
  get title() { return this.props.title; }
  get description() { return this.props.description; }
  get isCompleted() { return this.props.isCompleted; }
  get userId() { return this.props.userId; }
  get createdAt() { return this._createdAt; }
  get updatedAt() { return this._updatedAt; }
}