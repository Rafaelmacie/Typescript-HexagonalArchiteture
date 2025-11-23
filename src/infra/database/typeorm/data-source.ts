import { DataSource } from "typeorm";
import { env, isDev, isTest } from "../../../config/env.js";
import { UserModel } from "./models/user.model.js";
import { TaskModel } from "./models/task.model.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  synchronize: isDev || isTest,
  logging: isDev && !isTest,
  entities: [UserModel, TaskModel],
  migrations: isTest ? [] : ['src/infra/database/typeorm/migrations/*.{ts,js}'],
});