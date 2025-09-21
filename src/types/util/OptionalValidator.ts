import { ErrorType } from "../../errors/ErrorType";
import type { ValidationError } from "../../errors/ValidationError";
import { Validator } from "../../Validator";

export interface OptionalValidatorOptions {
    only?: "undefined" | "null";
}

export class OptionalValidator<T> extends Validator<T> {
    public override type = "optional";

    public constructor(
        public readonly child: Validator<Exclude<T, undefined | null>>,
        private readonly options: OptionalValidatorOptions = {},
    ) {
        super()
    }

    /** @inheritdoc */
    public override validateReturn(input: unknown): ValidationError<T> | null {
        if (input === undefined || input === null) {
            if (!this.options.only || input === (this.options.only === "null" ? null : undefined)) {
                return null;
            }
            return this.createError(ErrorType.INCORRECT_FORMAT, `Optional value has to be ${this.options.only}`);
        }
        return this.child.validateReturn(input);
    }

    /** @inheritdoc */
    protected override config(): Omit<Record<string, unknown>, "type"> {
        return {
            ...this.child.getConfig(),
            optional: true,
        };
    }
}
