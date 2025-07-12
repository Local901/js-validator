import type { ValidationError } from "../../errors/ValidationError";
import { Validator } from "../../Validator";

export class OptionalValidator<T> extends Validator<T> {
    public override type = "optional";

    public constructor(public readonly child: Validator<Exclude<T, undefined | null>>) {
        super()
    }

    /** @inheritdoc */
    public override validateReturn(input: unknown): ValidationError<T> | null {
        if (input === undefined || input === null) {
            return null;
        }
        return this.child.validateReturn(input);
    }
    
}
