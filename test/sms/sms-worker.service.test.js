import { vi, describe, beforeEach, afterEach, test, expect } from "vitest";
import { SmsWorkerService } from "../../src/sms/sms-worker.service.js";

describe("SmsWorkerService", () => {
	let smsWorkerService;
	let consoleLogSpy;

	beforeEach(() => {
		consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

		smsWorkerService = new SmsWorkerService();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	test("should send sms notification", async () => {
		const message = "Sending sms notification with data:";
		const jobData = { greeting: "Hello, World!" };

		smsWorkerService.sendNotification({ jobData });

		expect(consoleLogSpy).toHaveBeenCalledWith(message, jobData);
	});
});
