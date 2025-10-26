import { randomUUID } from "node:crypto";
import { hash } from "bcrypt";

// Propriedades do usuário
export interface UserProps {
    name: string;
    email: string;
    password: string;
}

export class User {
    private _id: string;
    private props: UserProps;
    private _created_at: Date;
    private _updated_at: Date;
    private _deleted_at: Date | null;

    // Construtor privado para controlar a criação
    private constructor(props: UserProps, id?: string, created_at?: Date, updated_at?: Date, deleted_at?: Date | null) {
        this._id = id ?? randomUUID();
        this.props = {
            ...props,
        };
        this._created_at = created_at ?? new Date();
        this._updated_at = updated_at ?? this._created_at;
        this._deleted_at = deleted_at ?? null;
    }

    // Método estático para criar um novo usuário
    public static async create(props: UserProps, id?: string): Promise<User> {
        // Validações
        if (props.name.length < 3) {
            throw new Error("Name is too short");
        }

        // Criptografia da senha
        const hashedPassword = await hash(props.password, 10);

        const userProps: UserProps = {
            ...props,
            password: hashedPassword,
        };

        return new User(userProps, id);
    }

    // Método estático para reconstituir um usuário
    public static reconstitute(
        props: UserProps,
        id: string,
        created_at: Date,
        updated_at: Date,
        deleted_at?: Date | null
    ): User {
        return new User(props, id, created_at, updated_at, deleted_at);
    }

    public get id(): string {
        return this._id;
    }
    public get name(): string {
        return this.props.name;
    }
    public get email(): string {
        return this.props.email;
    }
    public get password(): string {
        return this.props.password;
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