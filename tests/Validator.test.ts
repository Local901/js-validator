import { describe, it, expect } from "vitest";
import { v, ValidationError } from "../src";

describe("Validator", () => {
    it("Should not throw an error when valid", () => {
        expect(v.number().validateOrThrow(901)).toBeUndefined();
    });

    it("Should throw an error when invalid", () => {
        expect(() => v.number().validateOrThrow(false)).toThrowError(ValidationError);
    });

    it("should resolve to true when the validation result is valid", () => {
        const value: unknown = 901;
        const result = v.number().validateReturn(value);
        expect(v.number().validateResult(value, result)).toBeTruthy();
    });

    it("should resolve to false when the validation result is invalid", () => {
        const value: unknown = false;
        const result = v.number().validateReturn(value);
        expect(v.number().validateResult(value, result)).toBeFalsy();
    });
});
