import { describe, expect, it } from "vitest";
import { v } from "../../../src";

describe("Int Validator", () => {
    it.each([
        [0],
        [565],
        [-5654324],
    ])("should validate %j", (value) => {
        expect(v.int().validate(value)).toBeTruthy();
    });

    it.each([
        [NaN],
        [1.5],
        ["565"],
        [true],
        [undefined],
        [[]],
        [{}],
    ])("should not validate %j", (value) => {
        expect(v.int().validate(value)).toBeFalsy();
    });

    it.each([
        [-5, 5, 0, true],
        [-5, 5, -5, true],
        [-5, 5, 5, true],
        [-5, 5, 6, false],
        [-5, 5, -6, false],
    ])("should enforce bounds [%d, %d] => %d %j", (min, max, value, result) => {
        expect(v.int({ min, max }).validate(value)).toBe(result);
    });
});
