import { ErrorType } from "../../errors/ErrorType";
import type { ValidationError } from "../../errors/ValidationError";
import { Validator } from "../../Validator";

export type AnyOfValidators<T> = ReadonlyArray<T extends unknown ? Validator<T> : never>;

export class AnyOfValidator<T> extends Validator<T> {
    public override type = "anyof";

    public constructor(public readonly validators: AnyOfValidators<T>) {
        super();
    }

    public override validateReturn(input: unknown): ValidationError<T> | null {
        const errors: Record<number, ValidationError<T>> = {};
        let i = 0;
        for (const validator of this.validators) {
            const result = validator.validateReturn(input);
            if (result === null) {
                return null;
            }
            errors[i++] = result;
        }
        return this.createError(ErrorType.INCORRECT_TYPE, "Has to match at least one of the types.", errors);
    }
    
}
