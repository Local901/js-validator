import type { ErrorValue } from "./ErrorType";

export type ErrorFields<T> = (T extends object
    ? { [K in keyof T]: ValidationError<T[K]> | undefined }
    : never) | Record<number, ValidationError<T>>;

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
