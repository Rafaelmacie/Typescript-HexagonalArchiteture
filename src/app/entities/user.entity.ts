import { Email } from "./value-objects/email.vo.js";
import { Password } from "./value-objects/password.vo.js";
import { UniqueId } from "./value-objects/unique-id.vo.js";

// UserProps recebe os VOs
export interface UserProps {
    name: string;
    email: Email;
    password: Password;
}

export class User {
    private _id: UniqueId;
    private props: UserProps;
    private _created_at: Date;
    private _updated_at: Date;
    private _deleted_at: Date | null;

    private constructor(
        props: UserProps,
        id: UniqueId,
        created_at?: Date,
        updated_at?: Date,
        deleted_at?: Date | null
    ) {
        this._id = id;
        this.props = props;
        this._created_at = created_at ?? new Date();
        this._updated_at = updated_at ?? this._created_at;
        this._deleted_at = deleted_at ?? null;
    }

    public static async create(
        props: { name: string; email: string; password: string },
        id?: string
    ): Promise<User> {

        // 1. Valida e cria os VOs
        const idVO = UniqueId.create(id);
        const emailVO = Email.create(props.email);
        const passwordVO = await Password.createAndHash(props.password);

        // Validação do nome
        if (props.name.length < 3) {
            throw new Error("Name is too short");
        }

        // 2. Monta as 'UserProps' com os VOs
        const userProps: UserProps = {
            name: props.name,
            email: emailVO,
            password: passwordVO,
        };

        return new User(userProps, idVO);
    }

    // 'reconstitute' recebe strings e VOs
    public static reconstitute(
        props: UserProps,
        id: UniqueId, // <- Alterado
        created_at: Date,
        updated_at: Date,
        deleted_at?: Date | null
    ): User {
        return new User(props, id, created_at, updated_at, deleted_at);
    }

    // Getters que retornam o .value (string) dos VOs
    public get id(): string {
        return this._id.value;
    }
    public get name(): string {
        return this.props.name;
    }
    public get email(): string {
        return this.props.email.value;
    }
    public get password(): string {
        return this.props.password.value;
    }
    public get created_at(): Date {
        return this._created_at;
    }
    public get updated_at(): Date {
        return this._updated_at;
    }
    public get deleted_at(): Date | null {
        return this._deleted_at;
    }
}