import { vi, describe, beforeEach, afterEach, test, expect } from "vitest";
import { SocketServerHandler } from "../../src/socket/socket-server-handler.js";

describe("SocketServerHandler", () => {
	let socketServerHandler;

	let consoleErrorSpy;

	let mockEmailService;
	let mockEmailAssignAndDistributeJobs;

	beforeEach(() => {
		consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		mockEmailAssignAndDistributeJobs = vi.fn();
		mockEmailService = { assignAndDistributeJobs: mockEmailAssignAndDistributeJobs };

		socketServerHandler = new SocketServerHandler({ emailService: mockEmailService });
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	test("should add to email queue by socket", async () => {
		const requestData = {
			toList: Array.from({ length: 15 }, (_, i) => `user${i}@example.com`),
			channelIds: ["channel1"],
			companyId: "company1",
			subject: "Test Subject",
			message: "Hello World!",
		};

		await socketServerHandler.emailAddToQueueHandler(requestData);

		expect(consoleErrorSpy).not.toHaveBeenCalled();
		expect(mockEmailAssignAndDistributeJobs).toHaveBeenCalledWith({ requestData });
	});

	test("should fail when adding to email queue by socket", async () => {
		const requestData = {
			toList: Array.from({ length: 15 }, (_, i) => `user${i}@example.com`),
			channelIds: ["channel1"],
			companyId: "company1",
		};

		await socketServerHandler.emailAddToQueueHandler(requestData);

		expect(consoleErrorSpy).toHaveBeenCalledWith(
			expect.stringContaining(
				"[WS-SERVER-HANDLER] Invalid data received for email add to queue:",
			),
			expect.any(Object),
		);
		expect(mockEmailAssignAndDistributeJobs).not.toHaveBeenCalled();
	});
});
