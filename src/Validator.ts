import type { ErrorValue } from "./errors/ErrorType";
import { ErrorFields, ValidationError } from "./errors/ValidationError";

export interface ValidatorConfig {
    type: string;
    optional?: boolean;

    items?: ValidatorConfig | ValidatorConfig[];

    properties?: Record<string, ValidatorConfig | undefined>;
    additionalProperties?: boolean;

    min?: number;
    max?: number;
    minExclusive?: boolean;
    maxExclusive?: boolean;

    regex?: RegExp | string;

    enum?: unknown[];
}

export abstract class Validator<T = unknown> {
    public abstract type: string;

    protected createError(error: ErrorValue, message: string, fields?: ErrorFields<T>): ValidationError<T> {
        return new ValidationError(this.type, error, message, fields);
    }

    /**
     * Validate input.
     *
     * @param input Input value to validate.
     * @returns An error if validation failed. Null when type is correct.
     */
    public abstract validateReturn(input: unknown): ValidationError<T> | null;

    /**
     * Validate input.
     *
     * @param input Input value to validate.
     * @returns True when input is valid, else False.
     */
    public validate(input: unknown): input is T {
        return !this.validateReturn(input);
    }
    /**
     * Validate input.
     *
     * @param input Input value to validate.
     * @throws ValidationError When input is invalid.
     */
    public validateOrThrow(input: unknown): asserts input is T {
        const response = this.validateReturn(input);
        if (response) {
            throw response;
        }
        return;
    }

    /**
     * Type narrow input using the validation result.
     *
     * @param _input Input that was validated.
     * @param result Result from the validation.
     * @returns True if the result says the input was valid.
     */
    public validateResult(_input: unknown, result: ValidationError<T> | null): _input is T {
        return !result;
    }

    /**
     * protected config.
     *
     * @returns Record of extra configuration.
     */
    protected abstract config(): Omit<ValidatorConfig, "type">;

    /**
     * Get the configuration of the validator.
     *
     * @returns Validator config.
     */
    public getConfig(): ValidatorConfig {
        return {
            type: this.type,
            ...this.config(),
        };
    }
}
