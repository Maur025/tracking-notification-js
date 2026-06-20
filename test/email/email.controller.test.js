import { jest, describe, beforeEach, test, expect } from "@jest/globals";
import { EmailController } from "../../src/email/email.controller";

describe("EmailController", () => {
	let emailQueueMock;

	let app;
	let appPostMock;
	let appGetMock;
	let emailController;

	beforeEach(() => {
		emailQueueMock = {};

		appPostMock = jest.fn();
		appGetMock = jest.fn();

		app = {
			get: appGetMock,
			post: appPostMock,
		};

		emailController = new EmailController({ emailQueueMock });
	});

	test("should register routes correctly", () => {
		const expectedGetCalls = 1;
		const expectedPostCalls = 1;

		emailController.registerRoutes(app);

		expect(appGetMock).toHaveBeenCalledTimes(expectedGetCalls);
		expect(appPostMock).toHaveBeenCalledTimes(expectedPostCalls);

		expect(appPostMock).toHaveBeenCalledWith("/emails/queue", expect.any(Function));

		expect(appGetMock).toHaveBeenCalledWith("/emails/queue", expect.any(Function));
	});
});
