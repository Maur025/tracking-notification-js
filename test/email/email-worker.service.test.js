import { jest } from "@jest/globals";
import { EmailWorkerService } from "../../src/email/email-worker.service";

describe("EmailWorkerService", () => {
	let emailWorkerService;
	let consoleLogSpy;

	beforeEach(() => {
		consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

		emailWorkerService = new EmailWorkerService();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	test("should send email notification", async () => {
		const message = "Sending email notification with data:";
		const jobData = { greeting: "Hello, World!" };

		emailWorkerService.sendNotification({ jobData });

		expect(consoleLogSpy).toHaveBeenCalledWith(message, jobData);
	});
});
