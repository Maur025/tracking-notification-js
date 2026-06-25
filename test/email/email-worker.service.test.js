import { vi, describe, beforeEach, afterEach, test, expect } from "vitest";
import { EmailWorkerService } from "../../src/email/email-worker.service.js";

describe("EmailWorkerService", () => {
	let emailWorkerService;
	let consoleErrorSpy;

	let mockEmailNotifier;
	let mockEmailNotifierSend;

	beforeEach(() => {
		consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		mockEmailNotifierSend = vi.fn();
		mockEmailNotifier = {
			send: mockEmailNotifierSend,
		};

		emailWorkerService = new EmailWorkerService({ emailNotifier: mockEmailNotifier });
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	test("should send email notification", async () => {
		const jobData = {
			message: "Test message",
			subject: "Test subject",
			toList: ["test@example.com"],
		};

		await emailWorkerService.sendNotification({ jobData });

		expect(consoleErrorSpy).not.toHaveBeenCalled();
		expect(mockEmailNotifierSend).toHaveBeenCalledWith(
			expect.objectContaining({ ...jobData, html: jobData.message, text: jobData.message }),
		);
	});

	test("should log error for invalid email notification data", async () => {
		const invalidJobData = {
			message: "Test message",
			subject: "Test subject",
		};

		await emailWorkerService.sendNotification({ jobData: invalidJobData });

		expect(consoleErrorSpy).toHaveBeenCalledWith("Invalid email notification data");
		expect(mockEmailNotifierSend).not.toHaveBeenCalled();
	});
});
