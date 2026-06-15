import { jest } from "@jest/globals";
import { SmsController } from "../../src/sms/sms.controller";

describe("SmsController", () => {
	let smsQueueMock;

	let app;
	let appPostMock;
	let appGetMock;
	let smsController;

	beforeEach(() => {
		smsQueueMock = {};

		appPostMock = jest.fn();
		appGetMock = jest.fn();

		app = {
			get: appGetMock,
			post: appPostMock,
		};

		smsController = new SmsController({ smsQueueMock });
	});

	test("should register routes correctly", () => {
		const expectedGetCalls = 1;
		const expectedPostCalls = 1;

		smsController.registerRoutes(app);

		expect(appGetMock).toHaveBeenCalledTimes(expectedGetCalls);
		expect(appPostMock).toHaveBeenCalledTimes(expectedPostCalls);

		expect(appPostMock).toHaveBeenCalledWith("/sms/queue", expect.any(Function));

		expect(appGetMock).toHaveBeenCalledWith("/sms/queue", expect.any(Function));
	});
});
