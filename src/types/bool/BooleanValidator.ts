import { ErrorType } from "../../errors/ErrorType";
import { ValidationError } from "../../errors/ValidationError";
import { Validator } from "../../Validator";

export type BooleanValidationError = ErrorType;

export class BooleanValidator extends Validator<boolean> {
    public override type = "boolean";

    /** @inheritdoc */
    public override validateReturn(input: unknown): ValidationError<boolean> | null {
        if (typeof input !== "boolean") {
            return this.createError(ErrorType.INCORRECT_TYPE, "Has to be a boolean.");
        }
        return null;
    }
}
