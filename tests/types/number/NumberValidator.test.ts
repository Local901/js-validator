import { describe, it, expect } from "vitest";
import { v } from "../../../src";

describe("Number Validator", () => {
    it.each([
        [0],
        [10023545],
        [-4562121357],
        [1.54865]
    ])("should validate %j", (value) => {
        expect(v.number().validate(value)).toBeTruthy();
    });
    
    it.each([
        [NaN],
        ["10023545"],
        [true],
        [[]],
        [{}],
    ])("should not validate %j", (value) => {
        expect(v.number().validate(value)).toBeFalsy();
    });

    it.each([
        [-5, 5, 0, true],
        [-5, 5, -5, true],
        [-5, 5, 5, true],
        [-5, 5, 5.0000000001, false],
        [-5, 5, -6.9999999999, false],
    ])("should enforce bounds [%d, %d] => %d %j", (min, max, value, result) => {
        expect(v.number({ min, max }).validate(value)).toBe(result);
    });

    it.each([
        [-5, 5, 0, true],
        [-5, 5, -5, false],
        [-5, 5, 5, false],
    ])("should enforce bounds ]%d, %d[ => %d %j", (min, max, value, result) => {
        expect(v.number({ min, max, minExclusive: true, maxExclusive: true }).validate(value)).toBe(result);
    });
});
