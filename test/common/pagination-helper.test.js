import { describe, test, expect } from "vitest";
import {
	calculateTotalPages,
	getOrderByValues,
	mapOrderBy,
	validateAndParse,
} from "../../src/common/pagination-helper.js";

describe("Pagination helper test", () => {
	test.each([
		{
			case: "supply all parameters",
			input: { page: 0, size: 10, orderBy: "id", descending: false },
			expected: { page: 0, size: 10, offset: 0, orderBy: "id", descending: false },
		},
		{
			case: "supply only page and size",
			input: { page: 1, size: 20 },
			expected: { page: 1, size: 20, offset: 20, orderBy: undefined, descending: undefined },
		},
		{
			case: "supply page, size and orderBy",
			input: { page: 2, size: 5, orderBy: "name" },
			expected: { page: 2, size: 5, offset: 10, orderBy: "name", descending: undefined },
		},
		{
			case: "supply page, size and orderBy",
			input: { page: 2, size: 5, orderBy: "name" },
			expected: { page: 2, size: 5, offset: 10, orderBy: "name", descending: undefined },
		},
		{
			case: "supply page, size and descending",
			input: { page: 3, size: 15, descending: true },
			expected: { page: 3, size: 15, offset: 45, orderBy: undefined, descending: true },
		},
		{
			case: "page is a valid string number",
			input: { page: "2", size: 5 },
			expected: { page: 2, size: 5, offset: 10, orderBy: undefined, descending: undefined },
		},
		{
			case: "size is a valid string number",
			input: { page: 2, size: "5" },
			expected: { page: 2, size: 5, offset: 10, orderBy: undefined, descending: undefined },
		},
	])(
		"should return a valid object when call validate and parser method, $case",
		({ input, expected }) => {
			// WHEN
			const validationParseResult = validateAndParse(input);

			// THEN
			expect(validationParseResult).toEqual(expected);
		},
	);

	test.each([
		{
			case: "invalid page",
			input: { page: "invalid", size: 10, orderBy: "id", descending: false },
			expectedError: "Value invalid is not a valid number",
		},
		{
			case: "invalid size",
			input: { page: 0, size: "invalid", orderBy: "id", descending: false },
			expectedError: "Value invalid is not a valid number",
		},
		{
			case: "invalid descending",
			input: { page: 0, size: 10, orderBy: "id", descending: "notABoolean" },
			expectedError: "Descending parameter must be a boolean",
		},
		{
			case: "page is negative",
			input: { page: -1, size: 10, orderBy: "id", descending: false },
			expectedError: "Page number must be greater than or equal to 0",
		},
		{
			case: "size is less than 1",
			input: { page: 0, size: 0, orderBy: "id", descending: false },
			expectedError: "Size must be greater than or equal to 1",
		},
		{
			case: "descending is not a boolean",
			input: { page: 0, size: 10, orderBy: "id", descending: "notABoolean" },
			expectedError: "Descending parameter must be a boolean",
		},
		{
			case: "page is null",
			input: { page: null, size: 25, orderBy: "id", descending: false },
			expectedError: "Page and size parameters are required for pagination",
		},
		{
			case: "size is null",
			input: { page: 0, size: null, orderBy: "id", descending: false },
			expectedError: "Page and size parameters are required for pagination",
		},
		{
			case: "size is undefined",
			input: { page: 0, size: undefined, orderBy: "id", descending: false },
			expectedError: "Page and size parameters are required for pagination",
		},
		{
			case: "page is undefined",
			input: { page: undefined, size: 10, orderBy: "id", descending: false },
			expectedError: "Page and size parameters are required for pagination",
		},
	])("should throw error when validate and parse fails, $case", ({ input, expectedError }) => {
		// WHEN
		const validateAndParseCall = () => validateAndParse(input);

		// THEN
		expect(validateAndParseCall).throws(expectedError);
	});

	test.each([
		{
			case: "total is 20 and size is 1",
			input: { total: 20, size: 1 },
			expected: 20,
		},
		{
			case: "total is 20 and size is 5",
			input: { total: 20, size: 5 },
			expected: 4,
		},
		{
			case: "total is 20 and size is 10",
			input: { total: 20, size: 10 },
			expected: 2,
		},
		{
			case: "total is 20 and size is 20",
			input: { total: 20, size: 20 },
			expected: 1,
		},
		{
			case: "total is 20 and size is 25",
			input: { total: 20, size: 25 },
			expected: 1,
		},
	])("should return a total pages of 2 numbers, $case", ({ input, expected }) => {
		// WHEN
		const totalPages = calculateTotalPages(input.total, input.size);

		// THEN
		expect(totalPages).toBe(expected);
	});

	test.each([
		{
			case: "total is negative",
			input: { total: -1, size: 10 },
			expectedError:
				"Total must be greater than or equal to 0 and size must be greater than 0",
		},
		{
			case: "size is 0",
			input: { total: 10, size: 0 },
			expectedError:
				"Total must be greater than or equal to 0 and size must be greater than 0",
		},
		{
			case: "size is negative",
			input: { total: 10, size: -5 },
			expectedError:
				"Total must be greater than or equal to 0 and size must be greater than 0",
		},
	])("should throw error when use invalid numbers, $case", ({ input, expectedError }) => {
		// WHEN
		const calculateTotalPagesCall = () => calculateTotalPages(input.total, input.size);
		// THEN
		expect(calculateTotalPagesCall).throws(expectedError);
	});

	test.each([
		{
			case: "values is a string",
			input: { values: "name", descending: true },
			expected: [["name", true]],
		},
		{
			case: "values is a tuple of string, boolean",
			input: {
				values: [
					["name", true],
					["age", true],
				],
			},
			expected: [
				["name", true],
				["age", true],
			],
		},
		{
			case: "values is null",
			input: { values: null, descending: false },
			expected: [],
		},
		{
			case: "values is undefined",
			input: { values: undefined, descending: false },
			expected: [],
		},
		{
			case: "values is an array of strings",
			input: { values: ["name", "age"], descending: false },
			expected: [["name"], ["age"]],
		},
	])("should return order by values in an array, $case", ({ input, expected }) => {
		// WHEN
		const orderByValues = getOrderByValues(input.values, input.descending);

		// THEN

		expect(orderByValues).toEqual(expected);
	});

	test.each([
		{
			case: "values is a tuple of string, boolean",
			input: { values: [["name", false]] },
			expected: {
				orderBy: {
					name: "asc",
				},
			},
		},
		{
			case: "values is a array with strings values",
			input: { values: [["name"], ["age"]] },
			expected: {
				orderBy: {
					name: "asc",
					age: "asc",
				},
			},
		},
		{
			case: "values is a array with strings values and descending",
			input: {
				values: [
					["name", true],
					["age", false],
				],
			},
			expected: {
				orderBy: {
					name: "desc",
					age: "asc",
				},
			},
		},
		{
			case: "values is a array with null values",
			input: {
				values: [
					[null, true],
					["age", false],
				],
			},
			expected: {
				orderBy: {
					age: "asc",
				},
			},
		},
		{
			case: "values is a array with undefined values",
			input: {
				values: [
					[undefined, true],
					["age", false],
				],
			},
			expected: {
				orderBy: {
					age: "asc",
				},
			},
		},
		{
			case: "values is a array with empty string values",
			input: {
				values: [
					["", true],
					["age", false],
				],
			},
			expected: {
				orderBy: {
					age: "asc",
				},
			},
		},
		{
			case: "values is a array empty",
			input: {
				values: [],
			},
			expected: {},
		},
		{
			case: "values is a array with null and undefined values",
			input: {
				values: [[undefined], [null, true], [null], [undefined, true]],
			},
			expected: {},
		},
	])("should return object with order by configuration, $case", ({ input, expected }) => {
		// WHEN
		const orderByConfig = mapOrderBy(input.values);

		// THEN

		expect(orderByConfig).toEqual(expected);
	});
});
