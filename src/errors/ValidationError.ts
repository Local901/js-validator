import type { ErrorValue } from "./ErrorType";

type TupleError<T extends ReadonlyArray<unknown>> = T extends [infer ITEM, ...infer ARR]
    ? [ValidationError<ITEM> | null, ...ARR extends never[] ? [] : TupleError<ARR>]
    : never;

type ArrayError<T extends ReadonlyArray<unknown>> = T extends [infer _ITEM, ...infer _ARR]
    ? TupleError<T>
    : T extends ReadonlyArray<infer ARR> ? Record<number, ValidationError<ARR> | null> : never;

export type ErrorFields<T> = (
    T extends object
        ? T extends readonly unknown[]
            ? ArrayError<T>
            : { [K in keyof T]: ValidationError<T[K]> | undefined }
        : never
) | Record<number, ValidationError<T>>;

type TupleErrorJson<T extends ReadonlyArray<unknown>> = T extends [infer ITEM, ...infer ARR]
    ? [ValidationJson<ITEM> | null, ...ARR extends never[] ? [] : TupleErrorJson<ARR>]
    : never;

type ArrayErrorJson<T extends ReadonlyArray<unknown>> = T extends [infer _ITEM, ...infer _ARR]
    ? TupleErrorJson<T>
    : T extends ReadonlyArray<infer ARR> ? Record<number, ValidationJson<ARR> | null> : never;

export type ErrorJsonFields<T> = (
    T extends object
        ? T extends readonly unknown[]
            ? ArrayErrorJson<T>
            : { [K in keyof T]: ValidationJson<T[K]> | undefined }
        : never
) | Record<number, ValidationJson<T>>;

export type ValidationJson<T> = {
    type: string,
    error: ErrorValue,
    message: string,
    fields?: ErrorJsonFields<T>,
}

export class ValidationError<
    T extends unknown = unknown
> extends Error {
    private readonly _message: string;
    public readonly type: string;
    public readonly error: ErrorValue;
    public readonly fields?: ErrorFields<T>

    public constructor(type: string, error: ErrorValue, message: string, fields?: ErrorFields<T>) {
        super(message);
        this.name = "ValidationError";
        this.type = type;
        this.error = error;
        this.fields = fields;
        this._message = this.message;
        this.message = JSON.stringify(this.toJson());
    }

    public toJson(): ValidationJson<T> {
        let fields: undefined | ErrorJsonFields<T>;

        if (this.fields) {
            if (Array.isArray(this.fields)) {
                fields = this.fields.map((error) => error?.toJson() ?? null);
            } else {
                fields = Object.fromEntries(Object.entries(this.fields).map(([key, error]) => [key, error.toJson()]));
            }
        }

        return {
            message: this._message,
            type: this.type,
            error: this.error,
            fields,
        }
    }
}
