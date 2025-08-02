import { describe, expect, it } from "vitest";
import { v } from "../../../src";

describe("Tuple Validator [string, number]", () => {
    const validator = v.tuple([v.string(), v.number()]);

    it.each([
        [["seconds", 60]],
        [["This is a message", 17]],
    ])("should validate %j", (value) => {
        expect(validator.validate(value)).toBeTruthy();
    });

    it.each([
        [["title", "Movie X"]],
        [[901, 15]],
        [[]],
        [{}],
        [901],
        [true],
        [undefined],
        [null],
        ["invalid"],
    ])("should not validate %j", (value) => {
        expect(validator.validate(value)).toBeFalsy();
    });
});
