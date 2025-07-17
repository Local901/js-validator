import { ErrorType } from "../../errors/ErrorType";
import type { ErrorFields, ValidationError } from "../../errors/ValidationError";
import { Validator } from "../../Validator";

export type TupleValidators<T extends [...unknown[]]> =  T extends [infer ITEM, ...infer ARR]
    ? [Validator<ITEM>, ...ARR extends never[] ? [] : TupleValidators<ARR>]
    : T extends ReadonlyArray<infer ARR> ? Array<Validator<ARR>> : never;

export class TupleValidator<T extends [...unknown[]]> extends Validator<T> {
    public override type = "tuple";

    public constructor(public readonly validators: TupleValidators<T>) {
        super();
    }

    public override validateReturn(input: unknown): ValidationError<T> | null {
        // Check type
        if (typeof input !== "object" || !input || !Array.isArray(input)) {
            return this.createError(ErrorType.INCORRECT_TYPE, "Has te be a tuple.");
        }

        // Check length
        if (input.length !== this.validators.length) {
            return this.createError(
                input.length < this.validators.length
                    ? ErrorType.VALUE_SHORT
                    : ErrorType.VALUE_LONG,
                `Has to have length of ${this.validators.length}`,
            );
        }

        // Check items
        let hasError = false;
        const fields = this.validators.map((validator, index) => {
            const result = validator.validateReturn(input[index]);
            if (result) {
                hasError = true;
            }
            return result;
        }) as ErrorFields<T>;
        if (hasError) {
            return this.createError(ErrorType.INCORRECT_TYPE, "One or more items are incorrect.", fields);
        }

        return null;
    }
}
