import { describe, expect, it } from "vitest";
import { v } from "../../../src";

describe("Any Validator", () => {
    it.each([
        [15],
        ["test"],
        [true],
        [NaN],
        [null],
        [undefined],
        [[]],
        [{}],
    ])("should validate everything %j", (value) => {
        expect(v.any().validate(value)).toBeTruthy();
    });
});
