import { describe, test, expect } from "@jest/globals";
import { serverResponse } from "../../src/server/server-response.js";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

describe("server-response", () => {
	test("should return a response with default values", () => {
		const responseData = { code: StatusCodes.OK };

		const response = serverResponse(responseData);

		expect(response).toEqual(
			expect.objectContaining({
				code: StatusCodes.OK,
				message: "SUCCESS",
			}),
		);
	});

	test("should return a response with data", () => {
		const responseData = { code: StatusCodes.CREATED, data: { id: 1, name: "John Doe" } };

		const response = serverResponse(responseData);

		expect(response).toEqual(
			expect.objectContaining({
				code: StatusCodes.CREATED,
				message: ReasonPhrases.CREATED.toUpperCase(),
				data: responseData.data,
			}),
		);
	});

	test("should return a response with data and detail", () => {
		const responseData = {
			code: StatusCodes.CREATED,
			data: { id: 1, name: "John Doe" },
			message: "Resource created successfully",
		};

		const response = serverResponse(responseData);

		expect(response).toEqual(
			expect.objectContaining({
				code: StatusCodes.CREATED,
				message: ReasonPhrases.CREATED.toUpperCase(),
				data: responseData.data,
				detail: responseData.message,
			}),
		);
	});
});
