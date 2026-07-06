import { vi, beforeEach, afterEach, describe, test, expect } from "vitest";
import { ChannelTypeService } from "../../src/channel/channel-type.service.js";

describe("ChannelTypeService", () => {
	let channelTypeService;
	let mockDbClient;
	let mockDrizzleOrm;

	beforeEach(() => {
		mockDbClient = {};
		mockDrizzleOrm = {};

		channelTypeService = new ChannelTypeService({
			dbClient: mockDbClient,
			drizzleOrm: mockDrizzleOrm,
		});
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	test("should extend BaseDbService and inherit its methods", () => {
		expect(channelTypeService).toHaveProperty("save");
		expect(channelTypeService).toHaveProperty("findAll");
		expect(channelTypeService).toHaveProperty("findById");
		expect(channelTypeService).toHaveProperty("findByIdThrow");
		expect(channelTypeService).toHaveProperty("updateById");
		expect(channelTypeService).toHaveProperty("deleteById");
		expect(channelTypeService).toHaveProperty("count");
		expect(channelTypeService).toHaveProperty("updateBulk");
		expect(channelTypeService).toHaveProperty("processTransaction");
	});
});
