# h-Validator

The `h-Validator` is a versatile validation utility designed to be seamlessly integrated into both JavaScript and TypeScript projects. It provides developers with the tools to validate input objects against predefined schemas, supporting primitive type checks, custom validation functions, enum checks, and validations for array items. This document outlines how to get started with `h-Validator`, its features, and how to use it in your projects.

## Features

- **TypeScript and JavaScript Compatibility:** Use `h-Validator` in projects written in either TypeScript or JavaScript.
- **Custom Validation Functions:** Allows for complex validation logic beyond primitive type checks.
- **Nested Schema Validation:** Supports validating nested objects with specified schemas.
- **Lightweight & Fast:** Optimized for performance, ensuring minimal overhead.
- **Easy to Integrate:** Simple setup process for quick integration into your project.

## Installation

Install `h-Validator` using npm:

```bash
npm install h-validator
```

Or using yarn:

```bash
yarn add h-validator
```

## Getting Started

### For TypeScript Projects

Import `h-Validator` in your TypeScript file:

```typescript
import Validator from "h-validator";
```

### For JavaScript Projects

Require `h-Validator` in your JavaScript file:

```javascript
const Validator = require("h-validator");
```

## Usage

### Defining a Schema

Start by defining a schema to specify the validation rules for your input object's properties.

#### TypeScript

```typescript
interface TestSchema {
  name: string;
  age: number;
  email: string;
  other: undefined;
  sx: string[];
}
```

#### JavaScript

```javascript
const testSchema = {
  name: "string",
  age: "number",
  email: "string",
  other: "undefined",
  sx: { itemType: "string" },
};
```

### Creating an Instance of Validator

Instantiate `Validator` with your schema to start validating input objects.

#### TypeScript

```typescript
const validator = new Validator<TestSchema>(...);
```

#### JavaScript

```javascript
const validator = new Validator(testSchema);
```

### Validating Input

Use the `validate` method to check if an input object conforms to your schema.

```typescript
const validationResult = validator.validate(inputObject);
```

### Custom Validation Functions

Implement custom functions for more complex validation scenarios.

```typescript
const isEmailValid = (email) => ...;
```

## Building and Testing

Build the package using the provided script:

```bash
npm run build
```

Run tests to ensure everything is working as expected:

```bash
npm test
```

## Contributing

Contributions are welcome! Please read our contributing guidelines to get started.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Author

- hsmyc

---

For more information on `h-Validator`, please refer to the [documentation](docs).