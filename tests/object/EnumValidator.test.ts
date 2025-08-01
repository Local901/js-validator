import { describe, expect, it } from "vitest";
import { v } from "../../src";

enum Values {
    Hello,
    Test,
}

describe("Enum Validator", () => {
    it.each([
        [Values.Hello],
        [0],
        ["Hello"],
        [Values.Test],
        [1],
        ["Test"],
    ])("should validate %j", (value) => {
        expect(v.enum(Values).validate(value)).toBeTruthy();
    });
    
    it.each([
        [3],
        ["Any"],
        [true],
        [undefined],
        [[]],
        [{}],
    ])("should not validate %j", (value) => {
        expect(v.enum(Values).validate(value)).toBeFalsy();
    });
});
