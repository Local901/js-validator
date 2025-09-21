import type { ValidationError } from "../../errors/ValidationError";
import { Validator } from "../../Validator";

export class AnyValidator<T> extends Validator<T> {
    public override type = "any";

    /** @inheritdoc */
    public override validateReturn(_input: unknown): ValidationError<T> | null {
        return null;
    }

    /** @inheritdoc */
    protected override config(): Omit<Record<string, unknown>, "type"> {
        return {};
    }
}
