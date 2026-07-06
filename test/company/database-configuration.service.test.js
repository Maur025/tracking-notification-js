import { vi, describe, beforeEach, afterEach, test, expect } from "vitest";
import { DatabaseConfigurationService } from "../../src/company/database-configuration.service.js";

describe("Database configuration service test", () => {
	let databaseConfigurationService;

	beforeEach(() => {
		databaseConfigurationService = new DatabaseConfigurationService({});
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	test("should extend BaseDbService and inherit its methods", () => {
		expect(databaseConfigurationService).toHaveProperty("save");
		expect(databaseConfigurationService).toHaveProperty("findAll");
		expect(databaseConfigurationService).toHaveProperty("findById");
		expect(databaseConfigurationService).toHaveProperty("findByIdThrow");
		expect(databaseConfigurationService).toHaveProperty("updateById");
		expect(databaseConfigurationService).toHaveProperty("deleteById");
		expect(databaseConfigurationService).toHaveProperty("count");
		expect(databaseConfigurationService).toHaveProperty("updateBulk");
		expect(databaseConfigurationService).toHaveProperty("processTransaction");
	});
});
