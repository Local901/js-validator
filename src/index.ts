import { BooleanValidator } from "./types/bool/BooleanValidator";
import { IntValidator, type IntValidationOptions } from "./types/number/IntValidator";
import { NumberValidator, type NumberValidationOptions } from "./types/number/NumberValidator";
import { ObjectValidator, type FieldValidators } from "./types/object/ObjectValidator";
import { OptionalValidator } from "./types/util/OptionalValidator";
import { stringValidator, type StringValidationOptions } from "./types/string/StringValidator";
import { Validator } from "./Validator";
import { AnyValidator } from "./types/util/AnyValidator";
import { OrValidator, type OrValidators } from "./types/util/OrValidator";
import { ArrayValidator, type ArrayValidatorOptions } from "./types/object/ArrayValidator";
import { EnumValidator, type EnumLike } from "./types/object/EnumValidator";
import { TupleValidator, type TupleValidators } from "./types/object/TupleValidator";

export { Validator } from "./Validator";
export { ErrorType, type ErrorValue } from "./errors/ErrorType";
export { ValidationError, type ErrorFields } from "./errors/ValidationError";

export class v {
    public static boolean = () => new BooleanValidator();
    
    public static int = (options?: IntValidationOptions) => new IntValidator(options);
    public static number = (options?: NumberValidationOptions) => new NumberValidator(options);

    public static array = <T>(item: Validator<T>, options?: ArrayValidatorOptions) => new ArrayValidator(item, options);
    public static enum = <T extends EnumLike>(enumInstance: T) => new EnumValidator(enumInstance);
    public static object = <T extends object>(fields: FieldValidators<T>) => new ObjectValidator(fields);
    public static tuple = <T extends [...unknown[]]>(validators: TupleValidators<T>) => new TupleValidator(validators);

    public static string = <T extends string = string>(options?: StringValidationOptions) => new stringValidator<T>(options);

    public static any = <T>() => new AnyValidator<T>();
    public static optional = <T>(val: Validator<Exclude<T, undefined | null>>) => new OptionalValidator(val);
    public static or = <T>(validators: OrValidators<T>) => new OrValidator(validators);
}
