import { ErrorType } from "../../errors/ErrorType";
import type { ErrorFields, ValidationError } from "../../errors/ValidationError";
import { Validator } from "../../Validator";

export interface ArrayValidatorOptions {
    /** Minimum length of the array. */
    min?: number;
    /** Maximum length of the array. */
    max?: number;
}

export class ArrayValidator<T> extends Validator<T[]> {
    public override type = "array";

    public constructor(
        public readonly item: Validator<T>,
         private readonly options: ArrayValidatorOptions = {},
    ) {
        super();
    }

    /** @inheritdoc */
    public override validateReturn(input: unknown): ValidationError<T[]> | null {
        // Check type
        if (typeof input !== "object" || input === null || !Array.isArray(input)) {
            return this.createError(ErrorType.INCORRECT_TYPE, "Has to be an array.");
        }

        // Check minimum length
        if (this.options.min !== undefined && input.length < this.options.min) {
            return this.createError(ErrorType.VALUE_SHORT, `Has to have a minimum length of ${this.options.min}.`)
        }

        // Check maximum length
        if (this.options.max !== undefined && input.length > this.options.max) {
            return this.createError(ErrorType.VALUE_SHORT, `Has to have a maximum length of ${this.options.max}.`)
        }
        
        // Check item type
        let hasError = false;
        const fields: ErrorFields<T[]> = Object.fromEntries(input.map((item, index) => {
            const result = this.item.validateReturn(item);
            if (result !== null) {
                hasError = true;
            }
            return [index, result];
        }).filter((entry) => !!entry[1]));
        if (hasError) {
            return this.createError(ErrorType.INCORRECT_TYPE, "One or more items are incorrect.", fields);
        }

        return null;
    }

    /** @inheritdoc */
    protected override config(): Omit<Record<string, unknown>, "type"> {
        return {
            ...this.options,
            items: this.item.getConfig(),
        };
    }
}
