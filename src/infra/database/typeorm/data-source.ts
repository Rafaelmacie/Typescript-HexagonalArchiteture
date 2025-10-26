import { DataSource } from "typeorm";
import { env, isDev } from "../../../config/env.js";
import { UserModel } from "./models/user.model.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  synchronize: isDev,
  logging: isDev,
  entities: [UserModel],
  migrations: [],
});