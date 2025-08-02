import { describe, expect, it } from "vitest";
import { v } from "../../../src";

describe("String Validator", () => {
    it.each([
        [""],
        ["text"],
        ["   \t\n"],
    ])("should validate %j", (value) => {
        expect(v.string().validate(value)).toBeTruthy();
    });

    it.each([
        [15],
        [null],
        [true],
        [[]],
        [{}],
    ])("should not validate %j", (value) => {
        expect(v.string().validate(value)).toBeFalsy();
    });

    it.each([
        [3, 6, "test", true],
        [3, 6, "an", false],
        [3, 6, "out of range", false],
    ])("should check the length [%d, %d] %j %j", (min, max, value, result) => {
        expect(v.string({ min, max }).validate(value)).toBe(result);
    });

    it.each([
        ["[0-9]+", "1234567890", true],
        ["[0-9]+", "invalid", false],
        ["[0-9]+", "1234567890 ", false],
    ])("should check regex /%s/ %j %j", (regex, value, result) => {
        expect(v.string({ regex: new RegExp(regex) }).validate(value)).toBe(result);
        expect(v.string({ regex }).validate(value)).toBe(result);
    });

    it.each([
        [["test", "valid"], "test", true],
        [["test", "valid"], "valid", true],
        [["test", "valid"], "invalid", false],
    ])("should match enum %j %j => %j", (enumValue, value, result) => {
        expect(v.string({ enum: enumValue }).validate(value)).toBe(result);
    });
});
