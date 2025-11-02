import { User } from "../../../../app/entities/user.entity.js";
import { UserModel } from "../models/user.model.js";
import { Email } from "../../../../app/entities/value-objects/email.vo.js";
import { Password } from "../../../../app/entities/value-objects/password.vo.js";
import { UniqueId } from "../../../../app/entities/value-objects/unique-id.vo.js";

export class UserMapper {

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

  static toDomain(userModel: UserModel): User {
    // Recria os VOs a partir dos dados do banco
    const emailVO = Email.create(userModel.email);
    const passwordVO = Password.reconstitute(userModel.password_hash);
    const idVO = UniqueId.create(userModel.id);

    // Monta as UserProps
    const userProps = {
      name: userModel.name,
      email: emailVO,
      password: passwordVO,
    };

    // Recria a entidade usando 'reconstitute'
    return User.reconstitute(
      userProps,
      idVO,
      userModel.created_at,
      userModel.updated_at,
      userModel.deleted_at
    );
  }
}