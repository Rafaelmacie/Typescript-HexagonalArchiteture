import { User } from "../entities/user.entity.js";
import type { IUserRepository } from "../repositories/user.repository.js";

// DTO - Data Transfer Objects
export interface CreateUserInputDTO {
  name: string;
  email: string;
  password: string;
}

export interface CreateUserOutputDTO {
  id: string;
  name: string;
  email: string;
  created_at: Date;
}

export class CreateUserUseCase {
  // Injeção de dependência do repositório
  constructor(private readonly userRepository: IUserRepository) { }

  async execute(input: CreateUserInputDTO): Promise<CreateUserOutputDTO> {
    // Verifica se o usuário já existe
    const existingUser = await this.userRepository.find(input.email);

    if (existingUser) {
      throw new Error("User with this email is already registered");
    }

    // Cria a entidade de usuário (com hash de senha)
    const user = await User.create(input);

    // Salva o usuário no banco
    await this.userRepository.save(user);

    // Retorna o DTO de saída
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    };
  }
}