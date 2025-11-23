import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { UserModel } from "./user.model.js";

@Entity("tasks")
export class TaskModel {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  title!: string;

  @Column({ type: "varchar", nullable: true })
  description!: string;

  @Column({ type: "boolean", name: "is_completed", default: false })
  is_completed!: boolean;

  @Column({ type: "uuid", name: "user_id" })
  user_id!: string;

  @ManyToOne(() => UserModel)
  @JoinColumn({ name: "user_id" })
  user!: UserModel;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updated_at!: Date;
}