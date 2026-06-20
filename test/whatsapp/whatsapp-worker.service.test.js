import { jest, describe, beforeEach, afterEach, test, expect } from "@jest/globals";
import { WhatsappWorkerService } from "../../src/whatsapp/whatsapp-worker.service";

describe("WhatsappWorkerService", () => {
	let whatsappWorkerService;
	let consoleLogSpy;

	beforeEach(() => {
		consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

		whatsappWorkerService = new WhatsappWorkerService();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	test("should send whatsapp notification", async () => {
		const message = "Sending whatsapp notification with data:";
		const jobData = { greeting: "Hello, World!" };

		whatsappWorkerService.sendNotification({ jobData });

		expect(consoleLogSpy).toHaveBeenCalledWith(message, jobData);
	});
});
