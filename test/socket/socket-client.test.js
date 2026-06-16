import { jest } from "@jest/globals";

const mockWsClientManagerOn = jest.fn();
const mockWsClientManager = { on: mockWsClientManagerOn };

jest.unstable_mockModule("tracking-common", () => ({
	__esModule: true,
	NodeControllerClient: jest.fn().mockImplementation(() => ({
		wsClientManager: mockWsClientManager,
	})),
}));
const { NodeControllerClient } = await import("tracking-common");
const { SocketClient } = await import("../../src/socket/socket-client");

describe("SocketClient", () => {
	let socketClient;

	let mockEnvironments;

	let mockContainerAdapter;
	let mockContainerRegisterValue;

	beforeEach(() => {
		mockEnvironments = {
			WS_GATEWAY_HOST_PROCESSOR: "localhost",
			WS_GATEWAY_PORT_PROCESSOR: 7180,
			APP_PORT: 3000,
		};

		mockContainerRegisterValue = jest.fn();

		mockContainerAdapter = {
			registerValue: mockContainerRegisterValue,
		};

		socketClient = new SocketClient({
			environments: mockEnvironments,
			containerAdapter: mockContainerAdapter,
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test("should initialize with correct environments", () => {
		socketClient.initialize();

		expect(NodeControllerClient).toHaveBeenCalled();
		expect(mockWsClientManagerOn).toHaveBeenCalled();
		expect(mockContainerRegisterValue).toHaveBeenCalledWith("wsClient", expect.any(Object));
	});
});
