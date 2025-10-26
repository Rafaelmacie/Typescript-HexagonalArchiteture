import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

@Entity("users")
export class UserModel {
  @PrimaryColumn("uuid")
  id!: string;

  @Column("varchar")
  name!: string;

  @Column("varchar", { length: 255 })
  email!: string;

  @Column("varchar", { name: "password_hash", length: 64 })
  password_hash!: string;

  @CreateDateColumn({ type: "timestamp with time zone" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updated_at!: Date;

  @DeleteDateColumn({ type: "timestamp with time zone", nullable: true })
  deleted_at!: Date | null;
}