import { ErrorType } from "../../errors/ErrorType";
import { ValidationError } from "../../errors/ValidationError";
import { Validator, type ValidatorConfig } from "../../Validator";

export interface StringValidationOptions {
    /** Minimum length of the string. */
    min?: number;
    /** Maximum length of the string. */
    max?: number;
    /** The regex the value has to match. */
    regex?: RegExp | string;
    /** Allowed values. (Will ignore all other options.) */
    enum?: string[];
}

export class stringValidator<T extends string = string> extends Validator<T> {
    public override type = "string";

    public constructor(private readonly options: StringValidationOptions = {}) {
        super();
    }

    /** @inheritdoc */
    public override validateReturn(input: unknown): ValidationError<T> | null {
        // Type check.
        if (typeof input !== "string") {
            return this.createError(ErrorType.INCORRECT_TYPE, "Has to be a string.");
        }

        // Enum Check.
        if (this.options.enum) {
            if (this.options.enum.includes(input)) {
                return null;
            }
            return this.createError(
                ErrorType.NO_MATCH,
                `Has to match one of the known values [${this.options.enum.join(", ")}].`,
            );
        }

        // Minimum length check.
        if (this.options.min !== undefined && input.length < this.options.min) {
            return this.createError(ErrorType.VALUE_SHORT, `Has to have a minimum length of ${this.options.min}.`);
        }

        // Maximum length check.
        if (this.options.max !== undefined && this.options.max < input.length) {
            return this.createError(ErrorType.VALUE_LONG, `Has to have a maximum length of ${this.options.max}.`);
        }

        // Regex format check.
        if (this.options.regex && input.match(this.options.regex)?.[0] !== input) {
            return this.createError(ErrorType.INCORRECT_FORMAT, `Has to match format '${
                typeof this.options.regex === "string"
                    ? this.options.regex
                    : this.options.regex.source
                }'.`);
        }
        return null;
    }

    /** @inheritdoc */
    protected override config(): Omit<ValidatorConfig, "type"> {
        return { ...this.options };
    }
}
