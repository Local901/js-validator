import { ErrorType } from "../../errors/ErrorType";
import type { ValidationError } from "../../errors/ValidationError";
import { Validator } from "../../Validator";

export type EnumValue = string | number;
export type EnumLike = Readonly<Record<string, EnumValue>>

export class EnumValidator<T extends EnumLike | unknown[]> extends Validator<T[keyof T]> {
    public override type = "enum";
    private readonly enumValues: unknown[];

    public constructor(enumInstance: T) {
        super();
        this.enumValues = Object.values(enumInstance);
    }

    /** @inheritdoc */
    public override validateReturn(input: unknown): ValidationError<T[keyof T]> | null {
        // Check type
        if (!this.enumValues.includes(input)) {
            return this.createError(ErrorType.INCORRECT_TYPE, "Has to be an object.");
        }

        return null;
    }
}
