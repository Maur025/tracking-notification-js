import { jest, describe, beforeEach, afterEach, test, expect } from "@jest/globals";

const mockEmailChannelInitialize = jest.fn();

jest.unstable_mockModule("../../src/email/email-channel", () => ({
	__esModule: true,
	EmailChannel: jest.fn().mockImplementation(() => ({
		initialize: mockEmailChannelInitialize,
	})),
}));

const { EmailChannel } = await import("../../src/email/email-channel");
const { EmailProvider } = await import("../../src/email/email-provider");

describe("EmailProvider", () => {
	let emailProvider;

	let mockNodemailer;

	const connectionData = {
		host: "smtp.example.com",
		port: 587,
	};

	const credentials = {
		username: "user@example.com",
	};

	beforeEach(() => {
		mockNodemailer = {};

		emailProvider = new EmailProvider({ nodemailer: mockNodemailer });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test("should create and get a new email channel if it does not exist", async () => {
		const emailChannel = await emailProvider.getEmailChannel({ connectionData, credentials });

		expect(emailChannel).toBeDefined();
		expect(EmailChannel).toHaveBeenCalledWith(
			expect.objectContaining({
				nodemailer: mockNodemailer,
				connectionData,
				credentials,
			}),
		);
		expect(mockEmailChannelInitialize).toHaveBeenCalled();
	});

	test("should only get an existing email channel if it exists", async () => {
		await emailProvider.getEmailChannel({ connectionData, credentials });

		const emailChannel = await emailProvider.getEmailChannel({ connectionData, credentials });

		expect(emailChannel).toBeDefined();
		expect(EmailChannel).toHaveBeenCalledTimes(1);
		expect(mockEmailChannelInitialize).toHaveBeenCalledTimes(1);
	});
});
