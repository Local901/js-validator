import { describe, expect, it } from "vitest";
import { v } from "../../../src";

describe("Or Validator [number, string]", () => {
    // TODO: find a way to have typescript auto find the type.
    const validator = v.or<number | string>([
        v.number(),
        v.string(),
    ]);

    it.each([
        [15],
        ["test"],
    ])("should validate %j", (value) => {
        expect(validator.validate(value)).toBeTruthy();
    });

    it.each([
        [true],
        [undefined],
        [[]],
        [{}],
    ])("Should not validate %j", (value) => {
        expect(validator.validate(value)).toBeFalsy();
    });
});
