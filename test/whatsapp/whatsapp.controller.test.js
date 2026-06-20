import { jest, describe, beforeEach, test, expect } from "@jest/globals";
import { WhatsappController } from "../../src/whatsapp/whatsapp.controller";

describe("WhatsappController", () => {
	let app;
	let appPostMock;
	let appGetMock;
	let whatsappController;

	const mockWhatsappQueue = {};

	beforeEach(() => {
		appPostMock = jest.fn();
		appGetMock = jest.fn();

		app = {
			post: appPostMock,
			get: appGetMock,
		};

		whatsappController = new WhatsappController({ whatsappQueue: mockWhatsappQueue });
	});

	test("should register routes correctly", () => {
		const expectedPostCalls = 1;
		const expectedGetCalls = 1;

		whatsappController.registerRoutes(app);

		expect(appPostMock).toHaveBeenCalledTimes(expectedPostCalls);
		expect(appGetMock).toHaveBeenCalledTimes(expectedGetCalls);

		expect(appPostMock).toHaveBeenCalledWith("/whatsapp/queue", expect.any(Function));
		expect(appGetMock).toHaveBeenCalledWith("/whatsapp/queue", expect.any(Function));
	});
});
