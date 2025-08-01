import { ErrorType } from "../../errors/ErrorType";
import type { ErrorFields, ValidationError } from "../../errors/ValidationError";
import { Validator } from "../../Validator";

export type RecordType<T = unknown> = Record<string | number | symbol, T>;

export type RecordTypeValidator<T extends RecordType> = T extends RecordType<infer FIELD>
    ? Validator<FIELD>
    : never;

export class RecordValidator<T extends Record<string | number | symbol, unknown>> extends Validator<T> {
    public override type = "record";

    public constructor(public readonly field: RecordTypeValidator<T>) {
        super();
    }

    public override validateReturn(input: unknown): ValidationError<T> | null {
        // Check type
        if (typeof input !== "object" || input === null || Array.isArray(input)) {
            return this.createError(ErrorType.INCORRECT_TYPE, "Has to be an record.");
        }

        // Check field types
        let hasError = false;
        const fields = Object.fromEntries(Object.entries(input).map(([key, value]) => {
            const result = this.field.validateReturn(value);
            if (result !== null) {
                hasError = true;
            }
            return [key, result ?? undefined];
        })) as ErrorFields<T>;

        if (hasError) {
            return this.createError(ErrorType.INCORRECT_TYPE, "One or more fields are incorrect.", fields);
        }

        return null;
    }
}
