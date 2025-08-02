import { describe, expect, it } from "vitest";
import { v } from "../../../src";

describe("Instanceof Validator", () => {
    it("Should validate Date", () => {
        const validator = v.instanceof(Date);

        expect(validator.validate(new Date())).toBeTruthy();
        expect(validator.validate("text")).toBeFalsy();
        expect(validator.validate(new URL("http://localhost:8080"))).toBeFalsy();
        expect(validator.validate({})).toBeFalsy();
    });

    it("Should validate String", () => {
        const validator = v.instanceof(String);

        expect(validator.validate(new String("test"))).toBeTruthy();
        expect(validator.validate("test")).toBeFalsy();
    });
});
