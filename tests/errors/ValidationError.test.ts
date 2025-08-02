import { describe, expect, it } from "vitest";
import { ErrorType, v, ValidationError } from "../../src";

describe("Validation Error", () => {
    it("should have a message that is an json", () => {
        expect(() => { throw new ValidationError("test", ErrorType.INCORRECT_TYPE, "Has to be a test"); })
            .toThrowError(JSON.stringify({
                message: "Has to be a test",
                type: "test",
                error: ErrorType.INCORRECT_TYPE,
            }));
    });

    it("should add fields to the message when those are found", () => {
        expect(() => { throw v.object({ title: v.string(), duration: v.number() }).validateReturn({}); })
            .toThrowError(JSON.stringify({
                message: "One or more fields are incorrect.",
                type: "object",
                error: ErrorType.INCORRECT_TYPE,
                fields: {
                    title: {
                        message: "Has to be a string.",
                        type: "string",
                        error: ErrorType.INCORRECT_TYPE,
                    },
                    duration: {
                        message: "Has to be a number.",
                        type: "number",
                        error: ErrorType.INCORRECT_TYPE,
                    }
                },
            }));
    });
});
