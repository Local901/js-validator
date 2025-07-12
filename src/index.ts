import { BooleanValidator } from "./types/bool/BooleanValidator";
import { IntValidator, type IntValidationOptions } from "./types/number/IntValidator";
import { NumberValidator, type NumberValidationOptions } from "./types/number/NumberValidator";
import { ObjectValidator, type FieldValidators } from "./types/object/ObjectValidator";
import { OptionalValidator } from "./types/util/OptionalValidator";
import { stringValidator, type StringValidationOptions } from "./types/string/StringValidator";
import { Validator } from "./Validator";
import { AnyValidator } from "./types/util/AnyValidator";
import { AnyOfValidator, type AnyOfValidators } from "./types/util/AnyOfValidator";

export namespace v {
    export const boolean = () => new BooleanValidator();
    
    export const int = (options?: IntValidationOptions) => new IntValidator(options);
    export const number = (options?: NumberValidationOptions) => new NumberValidator(options);

    export const object = <T extends object>(fields: FieldValidators<T>) => new ObjectValidator(fields);

    export const string = (options?: StringValidationOptions) => new stringValidator(options);

    export const anyOf = <T>(validators: AnyOfValidators<T>) => new AnyOfValidator(validators);
    export const any = <T>() => new AnyValidator<T>();
    export const optional = <T>(val: Validator<Exclude<T, undefined | null>>) => new OptionalValidator(val);
}
