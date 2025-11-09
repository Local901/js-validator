import { ErrorType } from "../../errors/ErrorType";
import type { ValidationError } from "../../errors/ValidationError";
import { Validator, type ValidatorConfig } from "../../Validator";

export type TupleValidators<T extends [...unknown[]]> =  T extends [infer ITEM, ...infer ARR]
    ? [Validator<ITEM>, ...ARR extends never[] ? [] : TupleValidators<ARR>]
    : T extends ReadonlyArray<infer ARR> ? ReadonlyArray<Validator<ARR>> : never;

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
                `Has to have length of ${this.validators.length}.`,
            );
        }

        // Check items
        let hasError = false;
        const fields = Object.fromEntries(this.validators.map((validator, index) => {
            const result = validator.validateReturn(input[index]);
            if (result) {
                hasError = true;
            }
            return [index, result];
        }).filter(([, v]) => !!v));
        if (hasError) {
            return this.createError(ErrorType.INCORRECT_TYPE, "One or more items are incorrect.", fields);
        }

        return null;
    }

    /** @inheritdoc */
    protected override config(): Omit<ValidatorConfig, "type"> {
        return {
            items: this.validators.map((validator) => validator.getConfig()),
        };
    }
}
