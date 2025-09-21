import { ErrorType } from "../../errors/ErrorType";
import type { ValidationError } from "../../errors/ValidationError";
import { Validator } from "../../Validator";

export type OrValidators<T> = ReadonlyArray<Validator<T>>;

export class OrValidator<T> extends Validator<T> {
    public override type = "anyof";

    public constructor(public readonly validators: OrValidators<T>) {
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
    
    /** @inheritdoc */
    protected override config(): Omit<Record<string, unknown>, "type"> {
        return {
            items: this.validators.map((validator) => validator.getConfig()),
        };
    }
}
