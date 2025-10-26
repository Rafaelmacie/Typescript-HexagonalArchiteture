import type { Repository } from "typeorm";
import type { User } from "../../../../app/entities/user.entity.js";
import type { IUserRepository } from "../../../../app/repositories/user.repository.js";
import { UserModel } from "../models/user.model.js";
import { UserMapper } from "../mappers/user.mapper.js";
import { AppDataSource } from "../data-source.js";

export class TypeOrmUserRepository implements IUserRepository {
  private ormRepository: Repository<UserModel>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(UserModel);
  }

  // Implementação do 'save'
  async save(user: User): Promise<void> {
    // Converte a entidade de domínio para o modelo do banco
    const userModel = UserMapper.toPersistence(user);
    // Salva no banco
    await this.ormRepository.save(userModel);
  }

  // Implementação do 'find'
  async find(email: string): Promise<User | null> {
    // Busca no banco
    const userModel = await this.ormRepository.findOneBy({ email });

    if (!userModel) {
      return null;
    }

    // Converte o modelo do banco para a entidade de domínio
    return UserMapper.toDomain(userModel);
  }
}