import { jest, describe, beforeEach, afterEach, test, expect } from "@jest/globals";
import { SmsWorkerService } from "../../src/sms/sms-worker.service";

describe("SmsWorkerService", () => {
	let smsWorkerService;
	let consoleLogSpy;

	beforeEach(() => {
		consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

		smsWorkerService = new SmsWorkerService();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	test("should send sms notification", async () => {
		const message = "Sending sms notification with data:";
		const jobData = { greeting: "Hello, World!" };

		smsWorkerService.sendNotification({ jobData });

		expect(consoleLogSpy).toHaveBeenCalledWith(message, jobData);
	});
});
