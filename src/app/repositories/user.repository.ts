import { User } from "../entities/user.entity.js";

export interface IUserRepository {
  // Encontra usuário por e-mail
  find(email: string): Promise<User | null>;
  // Salva um usuário
  save(user: User): Promise<void>;
}