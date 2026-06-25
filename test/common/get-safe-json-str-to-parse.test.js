import { describe, test, expect } from "vitest";
import { getSafeJsonStrToParse } from "../../src/common/get-safe-json-str-to-parse.js";

describe("getSafeJsonStrToParse", () => {
	test("should remove trailing commas before closing brackets and braces", () => {
		const input = '{"name": "John", "age": 30,}';
		const expectedOutput = '{"name": "John", "age": 30}';

		const result = getSafeJsonStrToParse(input);

		expect(result).toEqual(expectedOutput);
	});

	test("should return the same string if no trailing commas are present", () => {
		const expectedOutput = '{"name": "John", "age": 30}';

		const result = getSafeJsonStrToParse(expectedOutput);

		expect(result).toEqual(expectedOutput);
	});
});
