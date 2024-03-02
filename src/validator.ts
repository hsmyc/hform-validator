/**
 * A generic validation utility class designed to validate input objects against a specified schema.
 * The schema defines validation rules for the properties of the input object, which can include
 * primitive type checks, custom validation functions, enum checks, and array item validations.
 *
 * @template T - The type of object this class will validate.
 */
export default class Validator<T> {
  /**
   * The schema against which input objects will be validated. This schema is defined by the user
   * and specifies the validation rules for the properties of the input object.
   *
   * @private
   * @type {ExtendedValidationSchema<T>}
   */
  private schema: ExtendedValidationSchema<T>;

  /**
   * Constructs an instance of the Validator class with a given validation schema.
   *
   * @param {ExtendedValidationSchema<T>} schema - The validation schema to be used for validating input objects.
   */
  constructor(schema: ExtendedValidationSchema<T>) {
    this.schema = schema;
  }

  /**
   * Validates an input object against the provided schema. This is a recursive helper function
   * that facilitates complex nested validations.
   *
   * @private
   * @template U - The type of the input object to validate.
   * @param {U} input - The input object to validate.
   * @param {ExtendedValidationSchema<U>} schema - The schema against which the input is validated.
   * @returns {ValidationResult<U>} - An object representing the validation result, where each property
   *                                   corresponds to the validation result (true or false) of the respective
   *                                   property in the input object.
   */
  private validateHelper<U>(
    input: U,
    schema: ExtendedValidationSchema<U>
  ): ValidationResult<U> {
    const result: any = {};
    for (const key in schema) {
      const validatorOrType = schema[key];
      const value = input[key];
      let isValid = false;

      if (validatorOrType === "undefined") {
        isValid =
          !Object.prototype.hasOwnProperty.call(input, key) ||
          value === undefined;
        result[key] = isValid;
        continue;
      } else if (validatorOrType === "null") {
        isValid = value === null;
        result[key] = isValid;
        continue;
      }

      if (!Object.prototype.hasOwnProperty.call(input, key)) {
        result[key] = false;
        continue;
      }
      if (typeof validatorOrType === "function") {
        isValid = validatorOrType(value);
      } else if (typeof validatorOrType === "string") {
        isValid = this.applyDefaultValidator(
          validatorOrType as PrimitiveTypeValidator,
          value
        );
      } else if (
        validatorOrType instanceof Object &&
        "enum" in validatorOrType
      ) {
        isValid = this.validateEnum(value, validatorOrType.enum);
      } else if (
        validatorOrType instanceof Object &&
        "itemType" in validatorOrType
      ) {
        isValid = this.validateArray(value, validatorOrType.itemType);
      } else if (
        typeof value === "object" &&
        validatorOrType !== undefined &&
        value !== null &&
        typeof validatorOrType === "object"
      ) {
        result[key] = this.validateHelper(value, validatorOrType);
        continue;
      } else if (Array.isArray(validatorOrType)) {
        isValid = this.validateCompositeValidator(value, validatorOrType);
      } else {
        console.warn(`Unhandled validation case for key: ${key}`);
        isValid = false;
      }
      result[key] = isValid;
    }
    console.log(result);
    return result;
  }

  /**
   * Applies a default validator based on the primitive type specified. This method supports
   * basic type checks such as string, number, boolean, etc.
   *
   * @private
   * @param {PrimitiveTypeValidator} type - The type of validation to apply (e.g., "string", "number").
   * @param {any} value - The value to validate.
   * @returns {boolean} - True if the value matches the specified type, false otherwise.
   */
  private applyDefaultValidator(
    type: PrimitiveTypeValidator,
    value: any
  ): boolean {
    switch (type) {
      case "string":
        return typeof value === "string";
      case "number":
        return typeof value === "number";
      case "boolean":
        return typeof value === "boolean";
      case "object":
        return typeof value === "object" && value !== null;
      case "symbol":
        return typeof value === "symbol";
      case "bigint":
        return typeof value === "bigint";
      case "undefined":
        return typeof value === "undefined";
      case "null":
        return value === null;
      default:
        return false;
    }
  }
  /**
   * Validates if a value matches any value in a given enumeration.
   *
   * @private
   * @param {any} value - The value to check against the enumeration.
   * @param {object} enumType - An object representing the enumeration.
   * @returns {boolean} - True if the value is part of the enumeration, false otherwise.
   */
  private validateEnum(value: any, enumType: object): boolean {
    return Object.values(enumType).includes(value);
  }

  /**
   * Validates if all items in an array meet a specified validation criterion. This criterion
   * can be a primitive type check, an enum check, or a custom validator function.
   *
   * @private
   * @param {any} value - The array to validate.
   * @param {ValidatorOrPrimitive | EnumValidator} itemType - The validation criterion for array items.
   * @returns {boolean} - True if all items in the array pass the validation, false otherwise.
   */
  private validateArray(
    value: any,
    itemType: ValidatorOrPrimitive | EnumValidator
  ): boolean {
    if (!Array.isArray(value)) return false;
    if (typeof itemType === "string") {
      return value.every((item) =>
        this.applyDefaultValidator(itemType as PrimitiveTypeValidator, item)
      );
    } else if ("enum" in itemType) {
      return value.every((item) => this.validateEnum(item, itemType.enum));
    } else {
      return value.every((item) => itemType(item));
    }
  }

  /**
   * Validates a value against a composite validator, where the value is considered valid if it
   * passes any one of the specified validation rules. This method supports validating against
   * multiple types, including handling custom validation functions, enum checks, and primitive
   * type validations.
   *
   * @private
   * @param {any} value - The value to be validated.
   * @param {CompositeValidator} validators - A single validator or an array of validators.
   * @returns {boolean} - True if the value is valid according to at least one of the validators, false otherwise.
   */
  private validateCompositeValidator(
    value: any,
    validators: CompositeValidator
  ): boolean {
    const validatorArray = Array.isArray(validators)
      ? validators
      : [validators];
    return validatorArray.every((validator) => {
      if (typeof validator === "string") {
        return this.applyDefaultValidator(
          validator as PrimitiveTypeValidator,
          value
        );
      } else if (typeof validator === "function") {
        return validator(value);
      } else if (validator && typeof validator === "object") {
        if ("enum" in validator) {
          return this.validateEnum(value, validator.enum);
        } else if ("itemType" in validator) {
          return this.validateArray(value, validator.itemType);
        }
      }
      return false;
    });
  }
  private validateNestedObject(obj: any): boolean {
    return Object.values(obj).every(
      (v) =>
        v === true || (typeof v === "object" && this.validateNestedObject(v))
    );
  }
  /**
   * Validates an input object against the instance's schema. This method serves as the public
   * interface to trigger validation.
   *
   * @param {T} input - The input object to validate.
   * @returns {ValidationResult<T>} - An object representing the validation results for the input object,
   *                                  where each property corresponds to the validation result of the
   *                                  respective property in the input object.
   */
  validate(input: T): ValidationResult<T> {
    return this.validateHelper(input, this.schema);
  }
}
