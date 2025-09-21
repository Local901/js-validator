import { ErrorType } from "../../errors/ErrorType";
import type { ErrorFields, ValidationError } from "../../errors/ValidationError";
import { Validator } from "../../Validator";

export type FieldValidators<T extends object> = {
    [K in keyof T]-?: Validator<T[K]>;
}

export type ObjectValidationOptions = {
    /**
     * Are additional properties allowed
     *
     * @default false
     */
    additionalProperties?: boolean;
}

export class ObjectValidator<T extends object> extends Validator<T> {
    public override type = "object";

    public constructor(public readonly fields: FieldValidators<T>, private readonly options: ObjectValidationOptions = {}) {
        super();
    }

    /** @inheritdoc */
    public override validateReturn(input: unknown): ValidationError<T> | null {
        // Check type
        if (typeof input !== "object" || input === null) {
            return this.createError(ErrorType.INCORRECT_TYPE, "Has to be an object.");
        }
    
        // Check field types
        let hasError = false;
        const fields = Object.fromEntries(Object.entries(this.fields).map(([key, validator]) => {
            const result = (validator as Validator).validateReturn((input as Record<string | number | symbol, unknown>)[key]);
            if (result !== null) {
                hasError = true;
            }
            return [key, result ?? undefined];
        }).filter(([, error]) => !!error)) as ErrorFields<T>;

        // Check for excess keys.
        if (!this.options.additionalProperties) {
            const fieldKeys = Object.keys(this.fields);
            const inputKeys = Object.keys(input);
            const extraKeys = inputKeys.filter((k) => !fieldKeys.includes(k));

            if (extraKeys.length) {
                return this.createError(
                    ErrorType.UNKNOWN_FIELD,
                    `No extra keys allowed. Found [${extraKeys.join(", ")}].`,
                    hasError
                        ? fields
                        : undefined,
                );
            }
        }

        if (hasError) {
            return this.createError(ErrorType.INCORRECT_TYPE, "One or more fields are incorrect.", fields);
        }
        return null;
    }

    /** @inheritdoc */
    protected override config(): Omit<Record<string, unknown>, "type"> {
        return {
            ...this.options,
            properties: Object.fromEntries(
                Object.entries<Validator>(this.fields)
                    .map(([key, validator]) => [key, validator?.getConfig()])
            ),
        };
    }
}
