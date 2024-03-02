/**
 * Represents a set of primitive type validators. This type is used to specify the expected
 * primitive type of a value during validation.
 */
type PrimitiveTypeValidator =
  | "string"
  | "number"
  | "boolean"
  | "object"
  | "symbol"
  | "bigint"
  | "undefined"
  | "null";

/**
 * A union type that can either be a custom validator function or a primitive type validator.
 * This allows for flexibility in defining validation rules for properties within the schema,
 * supporting both simple type checks and more complex custom validations.
 */
type ValidatorOrPrimitive = Validator<any> | PrimitiveTypeValidator;

/**
 * Describes a validator for array types, specifying the type of items within the array.
 * This interface is used to define validation rules for arrays, allowing for specification
 * of either primitive type checks, custom validators, or enum checks for array items.
 */
interface ArrayValidator {
  itemType: ValidatorOrPrimitive | EnumValidator;
}

/**
 * Defines a validator for enum types. This type allows for validation against a set of predefined
 * values represented by an object. It is used to ensure that a value matches one of the enum entries.
 */
type EnumValidator = {
  enum: object; // Use object to represent the enum type
};

/**
 * Represents a composite validator that can be one of the following:
 * - ValidatorOrPrimitiveExtended
 * - ArrayValidator
 * - EnumValidator
 * - Array of ValidatorOrPrimitiveExtended
 * - Array of ArrayValidator
 * - Array of EnumValidator
 */
type CompositeValidator =
  | ValidatorOrPrimitiveExtended
  | ArrayValidator
  | EnumValidator
  | ValidatorOrPrimitiveExtended[]
  | ArrayValidator[]
  | EnumValidator[];

/**
 * Describes the schema used for validation of an object of type T. This schema defines validation
 * rules for each property of T, supporting complex structures including nested objects and arrays.
 * Validation rules can be specified using primitive type checks, custom validators, or enum checks.
 *
 * @template T - The type of object the schema will validate.
 */
type ExtendedValidationSchema<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? ArrayValidator
    : T[P] extends object
    ? ExtendedValidationSchema<T[P]> | ValidatorOrPrimitive
    : ValidatorOrPrimitive | EnumValidator;
};

/**
 * Represents the result of validating an object of type T against a validation schema. This type
 * mirrors the structure of T, but each property is replaced with a boolean indicating whether the
 * value passed the validation. For properties that are objects, the result is nested accordingly.
 *
 * @template T - The type of object the validation result corresponds to.
 */
type ValidationResult<T> = {
  [P in keyof T]?: T[P] extends object ? ValidationResult<T[P]> : boolean;
};
