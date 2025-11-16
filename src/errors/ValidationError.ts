import type { ErrorValue } from "./ErrorType";

export type ErrorFields<T> = (
    T extends object
        ? T extends ReadonlyArray<infer I>
            ? Partial<Record<number, ValidationError<I>>>
            : Partial<{ [K in keyof T]: ValidationError<T[K]> }>
        : never
) | Partial<Record<number, ValidationError<T>>>;

export type ErrorJsonFields<T> = (
    T extends object
        ? T extends ReadonlyArray<infer I>
            ? Partial<Record<number, ValidationJson<I>>>
            : Partial<{ [K in keyof T]: ValidationJson<T[K]> }>
        : never
) | Partial<Record<number, ValidationJson<T>>>;

export type ValidationJson<T> = {
    type: string,
    error: ErrorValue,
    message: string,
    fields?: Partial<Record<string | number, ErrorJsonFields<T>>>,
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
            fields = Object.fromEntries(Object.entries(this.fields).map(([key, error]) => [key, error?.toJson()]));
        }

        return {
            message: this._message,
            type: this.type,
            error: this.error,
            fields,
        }
    }
}
