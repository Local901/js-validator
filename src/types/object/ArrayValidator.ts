import { ErrorType } from "../../errors/ErrorType";
import type { ErrorFields, ValidationError } from "../../errors/ValidationError";
import { Validator } from "../../Validator";

export class ArrayValidator<T> extends Validator<T[]> {
    public override type = "array";

    public constructor(public readonly item: Validator<T>) {
        super();
    }

    /** @inheritdoc */
    public override validateReturn(input: unknown): ValidationError<T[]> | null {
        // Check type
        if (typeof input !== "object" || input === null || !Array.isArray(input)) {
            return this.createError(ErrorType.INCORRECT_TYPE, "Has to be an object.");
        }
        
        // Check item type
        let hasError = false;
        const fields = Object.fromEntries(input.entries().map(([key, item]) => {
            const result = this.item.validateReturn(item);
            if (result !== null) {
                hasError = true;
            }
            return [key, result ?? undefined];
        })) as ErrorFields<T[]>;
        if (hasError) {
            return this.createError(ErrorType.INCORRECT_TYPE, "One or More items are incorrect.", fields);
        }

        return null;
    }
}
