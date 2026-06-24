import { jest, describe, beforeEach, afterEach, test, expect } from "@jest/globals";
import { EmailNotifier } from "../../src/email/email-notifier.js";

describe("EmailNotifier", () => {
	const username = "testuser@example.com";

	let emailNotifier;

	let consoleErrorSpy;
	let consoleWarnSpy;

	let mockEmailProvider;
	let mockEmailProviderGetEmailChannel;

	let mockEmailChannelSendMail;
	let mockEmailChannelGetUsername;

	let mockChannelService;
	let mockChannelFindOneByFilters;

	beforeEach(() => {
		jest.spyOn(console, "log").mockImplementation(() => {});
		consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
		consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

		mockEmailChannelSendMail = jest.fn();
		mockEmailChannelGetUsername = jest.fn().mockReturnValue(username);

		mockEmailProviderGetEmailChannel = jest.fn().mockImplementation(() => ({
			sendMail: mockEmailChannelSendMail,
			getUsername: mockEmailChannelGetUsername,
		}));

		mockEmailProvider = { getEmailChannel: mockEmailProviderGetEmailChannel };

		mockChannelFindOneByFilters = jest.fn();

		mockChannelService = {
			findOneByFilters: mockChannelFindOneByFilters,
		};

		emailNotifier = new EmailNotifier({
			emailProvider: mockEmailProvider,
			channelService: mockChannelService,
		});
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	test("should send an email notification", async () => {
		const emailChannelData = {
			host: "smtp.example.com",
			port: 587,
			secure: false,
			username: "username",
			password: "testpassword",
		};

		mockChannelFindOneByFilters.mockResolvedValue(emailChannelData);

		const notifierPayload = {
			toList: ["recipient@example.com"],
			subject: "Test Email Notification",
			html: "<p>This is a test email notification.</p>",
			text: "This is a test email notification.",
			channelId: "test-channel-id",
			companyId: "test-company-id",
		};

		await emailNotifier.send(notifierPayload);

		expect(consoleWarnSpy).not.toHaveBeenCalled();
		expect(mockEmailProviderGetEmailChannel).toHaveBeenCalledWith(
			expect.objectContaining({
				connectionData: {
					host: emailChannelData.host,
					port: emailChannelData.port,
					secure: emailChannelData.secure,
				},
				credentials: {
					username: emailChannelData.username,
					password: emailChannelData.password,
				},
			}),
		);
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
			channelId: "test-channel-id",
			companyId: "test-company-id",
		};

		mockChannelFindOneByFilters.mockResolvedValue({});

		mockEmailChannelSendMail.mockImplementation(() => {
			throw new Error("Failed to send email");
		});

		await expect(emailNotifier.send(notifierPayload)).rejects.toThrow();
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			expect.stringContaining("[EMAIL-NOTIFICATION] Error sending email notification:"),
			expect.any(Error),
		);
	});

	test("should skip sending email notification if channel not found", async () => {
		const notifierPayload = {
			toList: ["recipient@example.com"],
			subject: "Test Email Notification",
			html: "<p>This is a test email notification.</p>",
			text: "This is a test email notification.",
			channelId: "test-channel-id",
			companyId: "test-company-id",
		};

		mockChannelFindOneByFilters.mockResolvedValue(null);

		await emailNotifier.send(notifierPayload);

		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining(
				"[EMAIL-NOTIFICATION] Email channel not found ... skipping notification",
			),
		);
		expect(mockEmailProviderGetEmailChannel).not.toHaveBeenCalled();
		expect(mockEmailChannelSendMail).not.toHaveBeenCalled();
		expect(consoleErrorSpy).not.toHaveBeenCalled();
	});
});
