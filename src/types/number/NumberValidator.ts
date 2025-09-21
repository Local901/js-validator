import { ErrorType } from "../../errors/ErrorType";
import { ValidationError } from "../../errors/ValidationError";
import { Validator } from "../../Validator";

export interface NumberValidationOptions {
    /** Minimum value of the number. */
    min?: number;
    /** Is the minimum value exclusive. */
    minExclusive?: boolean;
    /** Maximum value of the number. */
    max?: number;
    /** Is the maximin value exclusive. */
    maxExclusive?: boolean;
}

export class NumberValidator extends Validator<number> {
    public override type = "number";

    public constructor(private readonly options: NumberValidationOptions = {}) {
        super();
    }

    /** @inheritdoc */
    public override validateReturn(input: unknown): ValidationError<number> | null {
        // Type check.
        if (typeof input !== "number" || Number.isNaN(input)) {
            return this.createError(ErrorType.INCORRECT_TYPE, "Has to be a number.");
        }

        // Minimum value check.
        if (this.options.min !== undefined && (this.options.minExclusive ? input <= this.options.min : input < this.options.min)) {
            return this.createError(
                this.options.minExclusive ? ErrorType.VALUE_BELOW_EXCLUSIVE : ErrorType.VALUE_BELOW,
                `Has to be a minimum value of ${this.options.min}${this.options.minExclusive ? " (exclusive)" : ""}.`,
            );
        }

        // Maximum value check.
        if (this.options.max !== undefined && (this.options.maxExclusive ? this.options.max <= input : this.options.max < input)) {
            return this.createError(
                this.options.maxExclusive ? ErrorType.VALUE_ABOVE_EXCLUSIVE : ErrorType.VALUE_ABOVE,
                `Has to be a maximum value of ${this.options.max}${this.options.minExclusive ? " (exclusive)" : ""}.`,
            );
        }
        return null;
    }

    /** @inheritdoc */
    protected override config(): Omit<Record<string, unknown>, "type"> {
        return { ...this.options };
    }
}
