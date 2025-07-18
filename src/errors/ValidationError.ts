import type { ErrorValue } from "./ErrorType";

type TupleError<T extends ReadonlyArray<unknown>> = T extends [infer ITEM, ...infer ARR]
    ? [ValidationError<ITEM> | null, ...ARR extends never[] ? [] : TupleError<ARR>]
    : never;

type ArrayError<T extends ReadonlyArray<unknown>> = T extends [infer ITEM, ...infer ARR]
    ? TupleError<T>
    : T extends ReadonlyArray<infer ARR> ? Record<number, ValidationError<ARR> | null> : never;

export type ErrorFields<T> = (
    T extends object
        ? T extends readonly unknown[]
            ? ArrayError<T>
            : { [K in keyof T]: ValidationError<T[K]> | undefined }
        : never
) | Record<number, ValidationError<T>>;

export class ValidationError<
    T extends unknown = unknown
> extends Error {
    public readonly type: string;
    public readonly error: ErrorValue;
    public readonly fields?: ErrorFields<T>

    public constructor(type: string, error: ErrorValue, message: string, fields?: ErrorFields<T>) {
        super(message);
        this.type = type;
        this.error = error;
        this.fields = fields;
    }
}
