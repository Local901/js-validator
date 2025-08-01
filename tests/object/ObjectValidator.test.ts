import { describe, expect, it } from "vitest";
import { v } from "../../src";

describe("Object Validator", () => {
    it.each([
        [{ id: 901, message: "test" }],
        [{ id: 15, message: "this is valid" }],
    ])("should validate %j", (value) => {
        expect(v.object({
            id: v.number(),
            message: v.string(),
        }).validate(value)).toBeTruthy();
    });
    
    it.each([
        [{ id: 901, message: "hello", title: "extra property" }],
        [{ message: null, title: "extra property" }],
        [{ id: 901 }],
        [{ message: "this is missing the prop property" }],
        [{ invalid: false }],
        [undefined],
        [null],
        [false],
        [901],
        [[]],
    ])("should not validate %j", (value) => {
        expect(v.object({
            id: v.number(),
            message: v.string(),
        }).validate(value)).toBeFalsy();
    });
});
