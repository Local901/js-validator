import { ErrorType } from "../../errors/ErrorType";
import type { ErrorFields, ValidationError } from "../../errors/ValidationError";
import { Validator } from "../../Validator";

export type FieldValidators<T extends object> = {
    [K in keyof T]-?: Validator<T[K]>;
}

export class ObjectValidator<T extends object> extends Validator<T> {
    public override type = "object";

    public constructor(public readonly fields: FieldValidators<T>) {
        super();
    }

    /** @inheritdoc */
    public override validateReturn(input: unknown): ValidationError<T> | null {
        // Check type
        if (typeof input !== "object" || input === null) {
            return this.createError(ErrorType.INCORRECT_TYPE, "Has to be an object.");
        }

        // Check for excess keys.
        const fieldKeys = Object.keys(this.fields);
        const inputKeys = Object.keys(input);
        const extraKeys = inputKeys.filter((k) => !fieldKeys.includes(k));
    
        // Check field types
        let hasError = false;
        const fields = Object.fromEntries(Object.entries(this.fields).map(([key, validator]) => {
            const result = (validator as Validator).validateReturn((input as Record<string | number | symbol, unknown>)[key]);
            if (result !== null) {
                hasError = true;
            }
            return [key, result ?? undefined];
        })) as ErrorFields<T>;

        if (hasError || extraKeys.length) {
            if (extraKeys.length) {
                return this.createError(
                    ErrorType.UNKNOWN_FIELD,
                    `No extra keys allowed. Found [${extraKeys.join(", ")}].`,
                    hasError
                        ? fields
                        : undefined,
                );
            }
            return this.createError(ErrorType.INCORRECT_TYPE, "One or more fields are incorrect.", fields);
        }
        return null;
    }
}
