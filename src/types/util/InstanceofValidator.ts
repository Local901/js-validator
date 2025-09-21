import { ErrorType } from "../../errors/ErrorType";
import { ValidationError } from "../../errors/ValidationError";
import { Validator } from "../../Validator";

export type ConstructorType<T> = {
    new (...args: unknown[]): T;
    name: string;
};

export interface InstanceofValidationOptions<T> {
    /**
     * 
     * @param value Value to be checked.
     * @returns 
     * - `true`: When the value is correct.
     * - `string`: Message when the value is incorrect.
     */
    check?: (value: T) => true | string;
}

export class InstanceofValidator<T> extends Validator<T> {
    public override type = "instanceof";

    public constructor(
        public readonly instance: ConstructorType<T>,
        private readonly options: InstanceofValidationOptions<T> = {},
    ) {
        super();
    }

    /** @inheritdoc */
    public override validateReturn(input: unknown): ValidationError<T> | null {
        // Type check.
        if (!(input instanceof this.instance)) {
            return this.createError(ErrorType.INCORRECT_TYPE, `Has to be instance of ${this.instance.name}.`);
        }

        // Check with custom test.
        if (this.options.check) {
            try {
                const result = this.options.check(input);
                if (result !== true) {
                    return this.createError(ErrorType.INCORRECT_FORMAT, result);
                }
            } catch (e) {
                if (e instanceof ValidationError) {
                    return e;
                } else if (e instanceof Error) {
                    return this.createError(ErrorType.INCORRECT_FORMAT, e.message);
                }
                return this,this.createError(ErrorType.INCORRECT_FORMAT, "Unknown.");
            }
        }

        return null;
    }

    /** @inheritdoc */
    protected override config(): Omit<Record<string, unknown>, "type"> {
        return {};
    }
}
