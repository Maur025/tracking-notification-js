import { vi, describe, beforeEach, afterEach, test, expect } from "vitest";
import { EmailProvider } from "../../src/email/email-provider.js";
import { EmailChannel } from "../../src/email/email-channel.js";

const mockEmailChannelInitialize = vi.fn();

vi.mock("../../src/email/email-channel.js", () => {
	class MockEmailChannel {
		// eslint-disable-next-line no-unused-vars
		constructor(dependencies) {}

		initialize = mockEmailChannelInitialize;
	}

	return { EmailChannel: MockEmailChannel };
});

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
		vi.clearAllMocks();
	});

	test("should create and get a new email channel if it does not exist", async () => {
		const emailChannel = await emailProvider.getEmailChannel({ connectionData, credentials });

		expect(emailChannel).toBeDefined();
		expect(emailChannel).toBeInstanceOf(EmailChannel);
		expect(mockEmailChannelInitialize).toHaveBeenCalled();
	});

	test("should only get an existing email channel if it exists", async () => {
		const firstChannel = await emailProvider.getEmailChannel({ connectionData, credentials });

		const secondChannel = await emailProvider.getEmailChannel({ connectionData, credentials });

		expect(secondChannel).toBeDefined();
		expect(secondChannel).toBeInstanceOf(EmailChannel);
		expect(secondChannel).toBe(firstChannel);
		expect(mockEmailChannelInitialize).toHaveBeenCalledTimes(1);
	});
});
