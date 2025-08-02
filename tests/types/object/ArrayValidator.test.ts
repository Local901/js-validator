import { describe, expect, it } from "vitest";
import { v } from "../../../src";

describe("Array Validator string[]", () => {
    const validator = v.array(v.string());

    it.each([
        [[]],
        [["valid", "test"]]
    ])("should validate %j", (value) => {
        expect(validator.validate(value)).toBeTruthy();
    });

    it.each([
        [["test", 15]],
        [[15, 901]],
        [undefined],
        [901],
        ["test"],
        [false],
        [{}],
    ])("should not validate", (value) => {
        expect(validator.validate(value)).toBeFalsy();
    });

    it.each([
        [2, 4, [], false],
        [2, 4, ["1"], false],
        [2, 4, ["1", "2"], true],
        [2, 4, ["1", "2", "3"], true],
        [2, 4, ["1", "2", "3", "4"], true],
        [2, 4, ["1", "2", "3", "4", "5"], false],
    ])("should enforce array length bounds [%d, %d] %j %j", (min, max, value, result) => {
        expect(v.array(v.string(), { min, max }).validate(value)).toBe(result);
    });
});
