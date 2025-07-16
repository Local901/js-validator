# js-validator

Validator for javascript and typescript. Do you have an object with uncertain contents. Use a validator to make sure what you have.

Quick start:
```shell
npm install @local901/validator
```

Example:

```typescript
import { v } from "@local901/validator";

type Example = {
    message: string;
    isPublic?: boolean;
}

const validator = v.object<Example>({
    message: v.string({ min: 6 }),
    isPublic: v.optional(v.boolean()),
});

validator.validate({ message: "example" }) // returns true
validator.validate({ message: "short" }) // returns false

validator.validateOrThrow(15) // throws error.
```
