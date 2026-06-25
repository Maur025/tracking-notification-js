import { vi, describe, beforeEach, afterEach, test, expect } from "vitest";
import { EmailChannel } from "../../src/email/email-channel.js";

describe("EmailChannel", () => {
	let emailChannel;

	let consoleInfoSpy;
	let consoleErrorSpy;

	let mockNodemailer;
	let mockNodemailerCreateTransport;
	let mockTransportVerify;
	let mockTransportSendMail;
	let mockTransportClose;

	const connectionData = {
		host: "smtp.example.com",
		port: 465,
		secure: true,
	};

	const credentials = {
		username: "username",
		password: "password",
	};

	beforeEach(() => {
		consoleInfoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
		consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		mockTransportVerify = vi.fn();
		mockTransportSendMail = vi.fn();
		mockTransportClose = vi.fn();

		mockNodemailerCreateTransport = vi.fn().mockReturnValue({
			verify: mockTransportVerify,
			sendMail: mockTransportSendMail,
			close: mockTransportClose,
		});

		mockNodemailer = { createTransport: mockNodemailerCreateTransport };

		emailChannel = new EmailChannel({
			nodemailer: mockNodemailer,
			connectionData,
			credentials,
		});
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	test("should initialize email client successfully", async () => {
		mockTransportVerify.mockResolvedValue(true);

		await emailChannel.initialize();

		expect(mockTransportVerify).toHaveBeenCalled();
		expect(consoleInfoSpy).toHaveBeenCalledWith(
			"[EMAIL-CHANNEL] Email client is ready to send messages",
		);
		expect(consoleErrorSpy).not.toHaveBeenCalled();
	});

	test("should fail to initialize email client", async () => {
		mockTransportVerify.mockRejectedValue(new Error("Connection failed"));

		await emailChannel.initialize();

		expect(mockTransportVerify).toHaveBeenCalled();
		expect(consoleInfoSpy).not.toHaveBeenCalled();
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			"[EMAIL-CHANNEL] Error creating email client:",
			expect.any(Error),
		);
	});

	test("should return unique identifier", () => {
		const identifier = emailChannel.getUniqueIdentifier();

		expect(identifier).toBe(
			`${connectionData.host}|${connectionData.port}|${credentials.username}`,
		);
	});

	test("should return email client instance", () => {
		const client = emailChannel.getClient();

		expect(client).toBeDefined();
	});

	test("should return username", () => {
		const username = emailChannel.getUsername();

		expect(username).toBe(credentials.username);
	});

	test("should send mail", () => {
		const mailOptions = {
			from: credentials.username,
			to: ["recipient@example.com"],
			subject: "Test Email",
			html: "<p>This is a test email.</p>",
			text: "This is a test email.",
		};

		emailChannel.send(mailOptions);

		expect(mockTransportSendMail).toHaveBeenCalledWith(mailOptions);
	});

	test("should close email client", () => {
		emailChannel.close();

		expect(mockTransportClose).toHaveBeenCalled();
	});
});
