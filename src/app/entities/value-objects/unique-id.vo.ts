import { randomUUID } from "node:crypto";

export class UniqueId {
    private _value: string;

    private constructor(value: string) {
        this._value = value;
    }

    public get value(): string {
        return this._value;
    }

    // Método estático para criar ou validar um ID
    public static create(value?: string): UniqueId {
        // Regex para validar um UUID
        const uuidRegex =
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

        let id: string;

        if (value) {
            // Se um valor foi passado, valide-o
            if (!uuidRegex.test(value)) {
                throw new Error("Invalid ID format. Must be a UUID.");
            }
            id = value;
        } else {
            // Se nenhum valor foi passado, gere um novo
            id = randomUUID();
        }

        return new UniqueId(id);
    }
}