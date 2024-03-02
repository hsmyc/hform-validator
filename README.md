# hform-Validator

The `hform-Validator` is a versatile validation utility designed to be seamlessly integrated into both JavaScript and TypeScript projects. It provides developers with the tools to validate input objects against predefined schemas, supporting primitive type checks, custom validation functions, enum checks, and validations for array items. This document outlines how to get started with `hform-Validator`, its features, and how to use it in your projects.

## Features

- **TypeScript and JavaScript Compatibility:** Use `hform-Validator` in projects written in either TypeScript or JavaScript.
- **Custom Validation Functions:** Allows for complex validation logic beyond primitive type checks.
- **Nested Schema Validation:** Supports validating nested objects with specified schemas.
- **Lightweight & Fast:** Optimized for performance, ensuring minimal overhead.
- **Easy to Integrate:** Simple setup process for quick integration into your project.

## Installation

Install `hform-validator` using npm:

```bash
npm install hform-validator
```

Or using yarn:

```bash
yarn add hform-validator
```

## Getting Started

### Importing the Package

Import `hform-Validator` in your TypeScript file:

```typescript
import Validator from "hform-validator";
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

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Author

- hsmyc

## Documentation

For more information, please visit the [documentation](https://hsmyc.github.io/hform-validator/)
