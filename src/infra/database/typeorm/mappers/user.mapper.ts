import { User } from "../../../../app/entities/user.entity.js";
import { UserModel } from "../models/user.model.js";

export class UserMapper {
  // Converte do domínio para o modelo do banco (para salvar)
  static toPersistence(user: User): UserModel {
    const userModel = new UserModel();
    userModel.id = user.id;
    userModel.name = user.name;
    userModel.email = user.email;
    userModel.password_hash = user.password;
    userModel.created_at = user.created_at;
    userModel.updated_at = user.updated_at;
    userModel.deleted_at = user.deleted_at;
    
    return userModel;
  }

  // Converte do modelo do banco para o domínio (para ler)
  static toDomain(userModel: UserModel): User {
    // Usa o 'reconstitute' para recriar a entidade sem rodar a lógica de 'create'
    return User.reconstitute(
      {
        name: userModel.name,
        email: userModel.email,
        password: userModel.password_hash,
      },
      userModel.id,
      userModel.created_at,
      userModel.updated_at,
      userModel.deleted_at
    );
  }
}