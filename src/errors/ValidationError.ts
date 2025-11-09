import type { ErrorValue } from "./ErrorType";

export type ErrorFields<T> = (
    T extends object
        ? T extends ReadonlyArray<infer I>
            ? Record<number, ValidationError<I>>
            : { [K in keyof T]: ValidationError<T[K]> | undefined }
        : never
) | Record<number, ValidationError<T>>;

export type ErrorJsonFields<T> = (
    T extends object
        ? T extends ReadonlyArray<infer I>
            ? Record<number, ValidationJson<I>>
            : { [K in keyof T]: ValidationJson<T[K]> | undefined }
        : never
) | Record<number, ValidationJson<T>>;

export type ValidationJson<T> = {
    type: string,
    error: ErrorValue,
    message: string,
    fields?: Record<string | number, ErrorJsonFields<T>>,
}

export class ValidationError<
    T extends unknown = unknown
> extends Error {
    private readonly _message: string;
    public readonly type: string;
    public readonly error: ErrorValue;
    public readonly fields?: ErrorFields<T>;

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
            fields = Object.fromEntries(Object.entries(this.fields).map(([key, error]) => [key, error.toJson()]));
        }

        return {
            message: this._message,
            type: this.type,
            error: this.error,
            fields,
        }
    }
}
