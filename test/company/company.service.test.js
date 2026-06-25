import { vi, beforeEach, afterEach, describe, test, expect } from "vitest";
import { CompanyService } from "../../src/company/company.service.js";

describe("CompanyService", () => {
	let companyService;
	let mockDbClient;
	let mockDrizzleOrm;

	beforeEach(() => {
		mockDbClient = {};
		mockDrizzleOrm = {};

		companyService = new CompanyService({
			dbClient: mockDbClient,
			drizzleOrm: mockDrizzleOrm,
		});
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	test("should extend BaseDbService and inherit its methods", () => {
		expect(companyService).toHaveProperty("save");
		expect(companyService).toHaveProperty("findAll");
		expect(companyService).toHaveProperty("findById");
		expect(companyService).toHaveProperty("update");
		expect(companyService).toHaveProperty("deleteById");
		expect(companyService).toHaveProperty("processTransaction");
		expect(companyService).toHaveProperty("count");
	});
});
