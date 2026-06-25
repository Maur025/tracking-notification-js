import { vi, describe, beforeEach, afterEach, test, expect } from "vitest";
import { WhatsappWorkerService } from "../../src/whatsapp/whatsapp-worker.service.js";

describe("WhatsappWorkerService", () => {
	let whatsappWorkerService;
	let consoleLogSpy;

	beforeEach(() => {
		consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

		whatsappWorkerService = new WhatsappWorkerService();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	test("should send whatsapp notification", async () => {
		const message = "Sending whatsapp notification with data:";
		const jobData = { greeting: "Hello, World!" };

		whatsappWorkerService.sendNotification({ jobData });

		expect(consoleLogSpy).toHaveBeenCalledWith(message, jobData);
	});
});
