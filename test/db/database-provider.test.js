import { jest, describe, beforeEach, afterEach, test, expect } from "@jest/globals";

jest.unstable_mockModule("drizzle-orm/libsql", () => ({
	__esModule: true,
	drizzle: jest.fn(),
}));
jest.unstable_mockModule("drizzle-orm/libsql/migrator", () => ({
	__esModule: true,
	migrate: jest.fn(),
}));

const { drizzle } = await import("drizzle-orm/libsql");
const { migrate } = await import("drizzle-orm/libsql/migrator");

const { DatabaseProvider } = await import("../../src/db/database-provider.js");

describe("DatabaseProvider", () => {
	let databaseProvider;

	let mockContainerAdapter;
	let mockContainerRegisterValue;

	const mockEnvironment = {
		DB_URL: "test.db",
	};

	beforeEach(() => {
		mockContainerRegisterValue = jest.fn();

		mockContainerAdapter = {
			registerValue: mockContainerRegisterValue,
		};

		databaseProvider = new DatabaseProvider({
			containerAdapter: mockContainerAdapter,
			environments: mockEnvironment,
		});
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	test("should initialize db instance", async () => {
		drizzle.mockReturnValue({});

		await databaseProvider.initialize();

		expect(drizzle).toHaveBeenCalledWith(
			expect.objectContaining({
				connection: {
					url: `file:${mockEnvironment.DB_URL}`,
				},
				schema: expect.any(Object),
			}),
		);

		expect(mockContainerRegisterValue).toHaveBeenCalledWith(
			expect.stringContaining("dbClient"),
			expect.any(Object),
		);

		expect(migrate).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ migrationsFolder: expect.any(String) }),
		);
	});
});
