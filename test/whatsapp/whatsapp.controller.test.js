import { vi, describe, beforeEach, test, expect } from "vitest";
import { WhatsappController } from "../../src/whatsapp/whatsapp.controller.js";

describe("WhatsappController", () => {
	let app;
	let appPostMock;
	let appGetMock;
	let whatsappController;

	const mockWhatsappQueue = {};

	beforeEach(() => {
		appPostMock = vi.fn();
		appGetMock = vi.fn();

		app = {
			post: appPostMock,
			get: appGetMock,
		};

		whatsappController = new WhatsappController({ whatsappQueue: mockWhatsappQueue });
	});

	test("should register routes correctly", () => {
		const expectedPostCalls = 3;
		const expectedGetCalls = 1;

		whatsappController.registerRoutes(app);

		expect(appPostMock).toHaveBeenCalledTimes(expectedPostCalls);
		expect(appGetMock).toHaveBeenCalledTimes(expectedGetCalls);

		expect(appPostMock).toHaveBeenCalledWith("/whatsapp/queue", expect.any(Function));
		expect(appGetMock).toHaveBeenCalledWith("/whatsapp/queue", expect.any(Function));
	});
});
