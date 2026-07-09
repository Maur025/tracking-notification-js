import { vi, describe, beforeEach, afterEach, test, expect } from "vitest";
import { SocketClientHandler } from "../../src/socket/socket-client-handler.js";
import { transformDevicesSubscriptionsInMap } from "../../src/common/transform-devices-subscriptions-in-map.js";

vi.mock("../../src/common/transform-devices-subscriptions-in-map.js", () => ({
	transformDevicesSubscriptionsInMap: vi.fn(),
}));
describe("Socket client handler test", () => {
	/** @type {SocketClientHandler} */
	let socketClientHandler;

	/** @type {import('vitest').Mock} */
	let consoleInfoSpy;

	/** @type {import('vitest').Mock} */
	let mockFindAllByReferenceIdIn;

	/** @type {import('vitest').Mock} */
	let mockSaveBulk;

	/** @type {import('vitest').Mock} */
	let mockExecute;

	beforeEach(() => {
		consoleInfoSpy = vi.spyOn(console, "info").mockImplementation(() => {});

		mockFindAllByReferenceIdIn = vi.fn();
		mockSaveBulk = vi.fn();
		mockExecute = vi.fn();

		const mockDatabaseConfigurationService = {
			findAllByReferenceIdIn: mockFindAllByReferenceIdIn,
			saveBulk: mockSaveBulk,
		};
		const mockRegisterChannelOfDbConfigAction = {
			execute: mockExecute,
		};

		socketClientHandler = new SocketClientHandler({
			databaseConfigurationService: mockDatabaseConfigurationService,
			registerChannelOfDbConfigAction: mockRegisterChannelOfDbConfigAction,
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	test("should execute on devices subscriptions flow", async () => {
		// GIVEN
		const subscription = {
			uuid: "backend-uuid",
			address: "192.168.0.1",
			apiPort: "8080",
			databases: ["db1", "db2"],
		};
		const subscriptions = [subscription];
		transformDevicesSubscriptionsInMap.mockReturnValue(
			new Map(subscriptions.map((sub) => [sub.uuid, sub])),
		);
		mockFindAllByReferenceIdIn.mockResolvedValue([]);

		const expectedDataFiltered = [
			expect.objectContaining({
				referenceId: subscription.uuid,
				host: `http://${subscription.address}`,
				port: subscription.apiPort,
				database: subscription.databases[0],
			}),
			expect.objectContaining({
				referenceId: subscription.uuid,
				host: `http://${subscription.address}`,
				port: subscription.apiPort,
				database: subscription.databases[1],
			}),
		];

		// WHEN
		await socketClientHandler.onDevicesSubscriptions(subscriptions);

		// THEN
		expect(consoleInfoSpy).toHaveBeenCalledWith(
			expect.stringContaining("[WS-CLIENT] on DevicesSubscriptions"),
		);
		expect(mockFindAllByReferenceIdIn).toHaveBeenCalledWith(
			expect.objectContaining({
				referenceIds: expect.arrayContaining([subscription.uuid]),
			}),
		);
		expect(mockSaveBulk).toHaveBeenCalledWith(expect.arrayContaining(expectedDataFiltered));
		expect(mockExecute).toHaveBeenCalledWith(
			expect.objectContaining({
				configurations: expect.arrayContaining(expectedDataFiltered),
			}),
		);
	});
});
