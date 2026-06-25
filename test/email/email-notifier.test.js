import { vi, describe, beforeEach, afterEach, test, expect } from "vitest";
import { EmailNotifier } from "../../src/email/email-notifier.js";

describe("EmailNotifier", () => {
	const username = "testuser@example.com";

	let emailNotifier;

	let consoleErrorSpy;
	let consoleWarnSpy;

	let mockEmailProvider;
	let mockEmailProviderGetEmailChannel;

	let mockEmailChannelSend;
	let mockEmailChannelGetUsername;

	let mockChannelService;
	let mockChannelFindOneByFilters;

	beforeEach(() => {
		vi.spyOn(console, "log").mockImplementation(() => {});
		consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

		mockEmailChannelSend = vi.fn();
		mockEmailChannelGetUsername = vi.fn().mockReturnValue(username);

		mockEmailProviderGetEmailChannel = vi.fn().mockImplementation(() => ({
			send: mockEmailChannelSend,
			getUsername: mockEmailChannelGetUsername,
		}));

		mockEmailProvider = { getEmailChannel: mockEmailProviderGetEmailChannel };

		mockChannelFindOneByFilters = vi.fn();

		mockChannelService = {
			findOneByFilters: mockChannelFindOneByFilters,
		};

		emailNotifier = new EmailNotifier({
			emailProvider: mockEmailProvider,
			channelService: mockChannelService,
		});
	});

	afterEach(() => {
		vi.resetAllMocks();
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
		expect(mockEmailChannelSend).toHaveBeenCalledWith(
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

		mockEmailChannelSend.mockImplementation(() => {
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
		expect(mockEmailChannelSend).not.toHaveBeenCalled();
		expect(consoleErrorSpy).not.toHaveBeenCalled();
	});
});
