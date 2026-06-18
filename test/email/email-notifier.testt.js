/* eslint-disable no-undef */
import { jest } from "@jest/globals";
import { EmailNotifier } from "../../src/email/email-notifier";

describe("EmailNotifier", () => {
	const username = "testuser@example.com";

	let emailNotifier;

	let consoleErrorSpy;

	let mockEmailProvider;
	let mockEmailProviderGetEmailChannel;

	let mockEmailChannelSendMail;
	let mockEmailChannelGetUsername;

	beforeEach(() => {
		jest.spyOn(console, "log").mockImplementation(() => {});
		consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

		mockEmailChannelSendMail = jest.fn();
		mockEmailChannelGetUsername = jest.fn().mockReturnValue(username);

		mockEmailProviderGetEmailChannel = jest.fn().mockImplementation(() => ({
			sendMail: mockEmailChannelSendMail,
			getUsername: mockEmailChannelGetUsername,
		}));

		mockEmailProvider = { getEmailChannel: mockEmailProviderGetEmailChannel };

		emailNotifier = new EmailNotifier({ emailProvider: mockEmailProvider });
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	test("should send an email notification", async () => {
		const notifierPayload = {
			toList: ["recipient@example.com"],
			subject: "Test Email Notification",
			html: "<p>This is a test email notification.</p>",
			text: "This is a test email notification.",
			notificationType: "SOME",
		};

		await emailNotifier.send(notifierPayload);

		expect(mockEmailProviderGetEmailChannel).toHaveBeenCalled();
		expect(mockEmailChannelSendMail).toHaveBeenCalledWith(
			expect.objectContaining({
				from: username,
				to: notifierPayload.toList,
				subject: notifierPayload.subject,
				html: notifierPayload.html,
				text: notifierPayload.text,
			}),
		);
		expect(consoleErrorSpy).not.toHaveBeenCalled();
	});

	test("should handle errors when sending email notification", async () => {
		const notifierPayload = {
			toList: ["recipient@example.com"],
			subject: "Test Email Notification",
			html: "<p>This is a test email notification.</p>",
			text: "This is a test email notification.",
			notificationType: "SOME",
		};

		mockEmailChannelSendMail.mockImplementation(() => {
			throw new Error("Failed to send email");
		});

		await expect(emailNotifier.send(notifierPayload)).rejects.toThrow();
		expect(consoleErrorSpy).toHaveBeenCalled();
	});
});
