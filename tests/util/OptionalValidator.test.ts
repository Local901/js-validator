import { describe, expect, it } from "vitest";
import { v } from "../../src";

describe("Optional Validator", () => {
    it.each([
        [null],
        [undefined],
        ["test"],
    ])("should validate %j", (value) => {
        expect(v.optional(v.string()).validate(value)).toBeTruthy();
    });

    it("should exclude null when limited to undefined", () => {
        expect(v.optional(v.string(), "undefined").validate(undefined)).toBeTruthy();
        expect(v.optional(v.string(), "undefined").validate(null)).toBeFalsy();
        expect(v.optional(v.string(), "undefined").validate("test")).toBeTruthy();
    });

    it("should exclude undefined when limited to null", () => {
        expect(v.optional(v.string(), "null").validate(undefined)).toBeFalsy();
        expect(v.optional(v.string(), "null").validate(null)).toBeTruthy();
        expect(v.optional(v.string(), "null").validate("test")).toBeTruthy();
    });
});
