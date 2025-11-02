import { hash } from "bcrypt";

export class Password {
    private _value: string;

    private constructor(value: string) {
        this._value = value;
    }

    public get value(): string {
        return this._value;
    }

    // Método para criar um novo hash de senha (para novos usuários)
    public static async createAndHash(value: string): Promise<Password> {
        // Regra de negócio: senha deve ter no mínimo 8 caracteres
        if (value.length < 8) {
            throw new Error("Password must be at least 8 characters long.");
        }

        const hashedPassword = await hash(value, 10);
        return new Password(hashedPassword);
    }

    // Método para reconstituir uma senha (do banco de dados)
    public static reconstitute(hashedValue: string): Password {
        // Apenas "envelopa" o valor, sem validar ou fazer hash
        return new Password(hashedValue);
    }
}