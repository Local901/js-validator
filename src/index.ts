import { BooleanValidator } from "./types/bool/BooleanValidator";
import { IntValidator, type IntValidationOptions } from "./types/number/IntValidator";
import { NumberValidator, type NumberValidationOptions } from "./types/number/NumberValidator";
import { ObjectValidator, type FieldValidators, type ObjectValidationOptions } from "./types/object/ObjectValidator";
import { OptionalValidator } from "./types/util/OptionalValidator";
import { stringValidator, type StringValidationOptions } from "./types/string/StringValidator";
import { Validator } from "./Validator";
import { AnyValidator } from "./types/util/AnyValidator";
import { OrValidator, type OrValidators } from "./types/util/OrValidator";
import { ArrayValidator, type ArrayValidatorOptions } from "./types/object/ArrayValidator";
import { EnumValidator, type EnumLike } from "./types/object/EnumValidator";
import { TupleValidator, type TupleValidators } from "./types/object/TupleValidator";
import { InstanceofValidator, type ConstructorType, type InstanceofValidationOptions } from "./types/util/InstanceofValidator";
import { RecordValidator, type RecordType, type RecordTypeValidator } from "./types/object/RecordValidator";

export { Validator } from "./Validator";
export { ErrorType, type ErrorValue } from "./errors/ErrorType";
export { ValidationError, type ErrorFields } from "./errors/ValidationError";

export class v {
    // Boolean
    public static boolean(): Validator<boolean> {
        return new BooleanValidator();
    }
    
    // Numbers
    public static int(options?: IntValidationOptions): Validator<number> {
        return new IntValidator(options);
    }
    public static number(options?: NumberValidationOptions): Validator<number> {
        return new NumberValidator(options);
    }

    // Objects
    public static array<T>(item: Validator<T>, options?: ArrayValidatorOptions): Validator<T[]> {
        return new ArrayValidator<T>(item, options);
    }
    public static enum<T extends EnumLike>(enumInstance: T): Validator<T[keyof T]> {
        return new EnumValidator(enumInstance);
    }
    public static object<T extends object>(fields: FieldValidators<T>, options?: ObjectValidationOptions): Validator<T> {
        return new ObjectValidator(fields, options);
    }
    public static record<T extends RecordType>(field: RecordTypeValidator<T>): Validator<T> {
        return new RecordValidator(field);
    }
    public static tuple<T extends [...unknown[]]>(validators: TupleValidators<T>): Validator<T> {
        return new TupleValidator(validators);
    }

    // Strings
    public static string<T extends string = string>(options?: StringValidationOptions): Validator<T> {
        return new stringValidator<T>(options);
    }

    // Utility
    public static any<T>(): Validator<T> {
        return new AnyValidator<T>();
    }
    public static instanceof<T>(instance: ConstructorType<T>, options?: InstanceofValidationOptions<T>): Validator<T> {
        return new InstanceofValidator(instance, options);
    }
    public static optional<T>(val: Validator<Exclude<T, undefined | null>>, type?: undefined): Validator<T | undefined | null>;
    public static optional<T>(val: Validator<Exclude<T, undefined | null>>, type: "undefined"): Validator<T | undefined>;
    public static optional<T>(val: Validator<Exclude<T, undefined | null>>, type: "null"): Validator<T | null>;
    public static optional<T>(val: Validator<Exclude<T, undefined | null>>, type?: "undefined" | "null"): Validator<T | undefined | null> {
        return new OptionalValidator(val, { only: type });
    }
    public static or<T>(validators: OrValidators<T>): Validator<T> {
        return new OrValidator(validators);
    }
}
