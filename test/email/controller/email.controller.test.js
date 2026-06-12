import { jest } from "@jest/globals";
import { EmailController } from "../../../src/email/controller/email.controller";

describe("EmailController", () => {
	let app;
	let appPostMock;
	let appGetMock;
	let emailController;

	beforeEach(() => {
		appPostMock = jest.fn();
		appGetMock = jest.fn();

		app = {
			get: appGetMock,
			post: appPostMock,
		};

		emailController = new EmailController();
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
