import Validator from "../validator";

const priceChecker = (value: number) => {
  return value > 0;
};

const idChecker = (value: number) => {
  return value > 10000;
};
// Define your test schema
interface TestSchema {
  name: string;
  age: number;
  email: string;
  other: undefined;
  sx: string[];
}
interface NestedTestSchema {
  user: TestSchema;
  product: {
    name: string;
    price: number;
    id: number;
  };
}

// Create an instance of Validator with your test schema
const validator = new Validator<TestSchema>({
  name: "string",
  age: "number",
  email: "string",
  other: "undefined",
  sx: {
    itemType: "string",
  },
});

const xValidator = new Validator<NestedTestSchema>({
  user: {
    name: "string",
    age: "number",
    email: "string",
  },
  product: {
    name: "string",
    price: ["number", priceChecker],
    id: ["number", idChecker],
  },
});

// Write your tests
describe("GenericValidationUtils", () => {
  it("should validate a valid input object", () => {
    const validInput: any = {
      name: "John Doe",
      age: 30,
      email: "john.doe@example.com",
      sx: ["a", "b"],
    };
    const validationResult = validator.validate(validInput);
    expect(validationResult).toEqual({
      name: true,
      age: true,
      email: true,
      other: true,
      sx: true,
    });
  });

  it("should validate an invalid input object", () => {
    const invalidInput: any = {
      name: "John Doe",
      age: "30", // Invalid type
      email: "john.doe@example.com",
    };
    const validationResult = validator.validate(invalidInput);
    expect(validationResult).toEqual({
      name: true,
      age: false,
      email: true,
      other: true,
      sx: false,
    });
  });

  it("should validate a nested input object", () => {
    const validInput: any = {
      user: {
        name: "John Doe",
        age: 30,
        email: "email@gg.com",
      },
      product: {
        name: "product",
        price: 12,
        id: 831,
      },
    };
    const validationResult = xValidator.validate(validInput);
    expect(validationResult).toEqual({
      user: {
        name: true,
        age: true,
        email: true,
      },
      product: {
        name: true,
        price: true,
        id: false,
      },
    });
  });
});
