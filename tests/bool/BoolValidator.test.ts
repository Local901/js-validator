import { describe, expect, it } from "vitest";
import { v } from "../../src";

describe("Bool Validator", () => {
    it.each([
        [true],
        [false],
    ])("should validate %j", (value) => {
        expect(v.boolean().validate(value)).toBeTruthy();
    });

    it.each([
        ["true"],
        [0],
        [undefined],
        [[]],
        [{}]
    ])("should not validate %j", (value) => {
        expect(v.boolean().validate(value)).toBeFalsy();
    });
});
