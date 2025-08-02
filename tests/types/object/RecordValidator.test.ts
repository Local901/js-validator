import { describe, expect, it } from "vitest";
import { v } from "../../../src";

describe("Record Validator", () => {
    it.each([
        [{}],
        [{ title: "title", message: "hello" }],
        [{ time: "13:55", date: "9-8-69" }],
    ])("should validate %j", (value) => {
        expect(v.record(v.string()).validate(value)).toBeTruthy();
    });

    it.each([
        [{ seconds: 901 }],
        [{ title: "movie x", length: 7200 }],
        [[]],
        [901],
        ["test"],
        [true],
        [undefined],
        [null]
    ])("should not validate %j", (value) => {
        expect(v.record(v.string()).validate(value)).toBeFalsy();
    });
});
