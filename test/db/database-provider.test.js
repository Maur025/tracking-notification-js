import { vi, describe, beforeEach, afterEach, test, expect } from "vitest";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { DatabaseProvider } from "../../src/db/database-provider.js";

vi.mock("drizzle-orm/libsql", () => ({
	drizzle: vi.fn(),
}));
vi.mock("drizzle-orm/libsql/migrator", () => ({
	migrate: vi.fn(),
}));

describe("DatabaseProvider", () => {
	let databaseProvider;

	let mockContainerAdapter;
	let mockContainerRegisterValue;

	const mockEnvironment = {
		DB_URL: "test.db",
	};

	beforeEach(() => {
		mockContainerRegisterValue = vi.fn();

		mockContainerAdapter = {
			registerValue: mockContainerRegisterValue,
		};

		databaseProvider = new DatabaseProvider({
			containerAdapter: mockContainerAdapter,
			environments: mockEnvironment,
		});
	});

	afterEach(() => {
		vi.resetAllMocks();
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
