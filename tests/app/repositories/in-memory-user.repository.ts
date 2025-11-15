import { User } from "../../../src/app/entities/user.entity.js";
import type { IUserRepository } from "../../../src/app/repositories/user.repository.js";

// Repositório que implementa a interface, mas usa um array
export class InMemoryUserRepository implements IUserRepository {
  public users: User[] = []; // O "banco de dados" em memória

  async find(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);
    return user || null;
  }

  async save(user: User): Promise<void> {
    // Lógica de 'save' (cria ou atualiza)
    const userIndex = this.users.findIndex((item) => item.id === user.id);

    if (userIndex >= 0) {
      this.users[userIndex] = user; // Atualiza
    } else {
      this.users.push(user); // Cria
    }
  }
}