import { ErrorType } from "../../errors/ErrorType";
import { ValidationError } from "../../errors/ValidationError";
import { Validator } from "../../Validator";

export interface IntValidationOptions {
    /** Minimum value of the int. */
    min?: number;
    /** Maximum value of the int. */
    max?: number;
}

export class IntValidator extends Validator<number> {
    public override type = "ïnt";

    public constructor(private readonly options: IntValidationOptions = {}) {
        super();
    }

    /** @inheritdoc */
    public override validateReturn(input: unknown): ValidationError<number> | null {
        // Type check.
        if (typeof input !== "number" || Number.isNaN(input) || Math.floor(input) !== input) {
            return this.createError(ErrorType.INCORRECT_TYPE, "Has to be a int.");
        }

        // Minimum value check
        if (this.options.min !== undefined && input < this.options.min) {
            return this.createError(ErrorType.VALUE_BELOW, `Has to be a minimum value of ${this.options.min}.`)
        }

        // Maximum value check
        if (this.options.max !== undefined && this.options.max < input) {
            return this.createError(ErrorType.VALUE_ABOVE, `Has to be a maximum value of ${this.options.max}.`)
        }
        return null;
    }
}
