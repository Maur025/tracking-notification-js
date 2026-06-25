import { vi, describe, beforeEach, afterEach, test, expect } from "vitest";
import { ChannelService } from "../../src/channel/channel.service.js";

describe("ChannelService", () => {
	let channelService;

	let mockDbClient;
	let mockDrizzleOrm;

	beforeEach(() => {
		mockDbClient = {};
		mockDrizzleOrm = {};

		channelService = new ChannelService({ dbClient: mockDbClient, drizzleOrm: mockDrizzleOrm });
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	test("should extends baseDbService methods", () => {
		expect(channelService).toHaveProperty("save");
		expect(channelService).toHaveProperty("findAll");
		expect(channelService).toHaveProperty("findById");
		expect(channelService).toHaveProperty("update");
		expect(channelService).toHaveProperty("deleteById");
		expect(channelService).toHaveProperty("processTransaction");
		expect(channelService).toHaveProperty("count");
	});

	test("should return channel type code when calling getChannelTypeCode", () => {
		const channelTypeInputs = ["EMAIL", "SMS", "WHATSAPP"];
		const expectedChannelTypeCodes = ["mail_smtp", "sms_service", "whatsapp_service"];

		for (let index = 0; index < channelTypeInputs.length; index++) {
			const channelTypeCode = channelService.getChannelTypeCode(channelTypeInputs[index]);

			expect(channelTypeCode).toBe(expectedChannelTypeCodes[index]);
		}
	});

	test("should return a code regardless of whether it is uppercase or lowercase", () => {
		const channelTypeLowerCaseInput = "email";
		const channelTypeCamelCaseInput = "Email";
		const channelTypeUpperCaseInput = "EMAIL";

		const expectedChannelTypeCode = "mail_smtp";

		const lowerCaseCode = channelService.getChannelTypeCode(channelTypeLowerCaseInput);
		const camelCaseCode = channelService.getChannelTypeCode(channelTypeCamelCaseInput);
		const upperCaseCode = channelService.getChannelTypeCode(channelTypeUpperCaseInput);

		expect(lowerCaseCode).toBe(expectedChannelTypeCode);
		expect(camelCaseCode).toBe(expectedChannelTypeCode);
		expect(upperCaseCode).toBe(expectedChannelTypeCode);
	});

	test("should return a code null when called with invalid value", () => {
		const invalidInput = "push-notification";

		const code = channelService.getChannelTypeCode(invalidInput);

		expect(code).toBeNull();
	});
});
