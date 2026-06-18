import { jest } from "@jest/globals";
import { getObjectOfString } from "../../src/common/get-object-of-string";

describe("getObjectOfString", () => {
	let consoleErrorSpy;

	beforeEach(() => {
		consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
	});

	test("should return an object when given a valid JSON string", () => {
		const jsonString = '{"name": "John", "age": 30}';

		const result = getObjectOfString(jsonString);

		expect(result).toEqual({ name: "John", age: 30 });
	});

	test("should return undefined when given an invalid JSON string", () => {
		const invalidJsonString = '{"name": "John", "age": 30';

		const result = getObjectOfString(invalidJsonString);
		expect(result).toBeUndefined();
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			"Error parsing string to object:",
			expect.any(Error),
		);
	});
});
