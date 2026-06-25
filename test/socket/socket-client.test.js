import { vi, describe, beforeEach, afterEach, test, expect } from "vitest";
import { SocketClient } from "../../src/socket/socket-client.js";

const mockWsClientManagerOn = vi.fn();

vi.mock("tracking-common", () => {
	class NodeControllerClient {
		constructor() {}
		wsClientManager = {
			on: mockWsClientManagerOn,
		};
	}

	return { NodeControllerClient };
});

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

		mockContainerRegisterValue = vi.fn();

		mockContainerAdapter = {
			registerValue: mockContainerRegisterValue,
		};

		socketClient = new SocketClient({
			environments: mockEnvironments,
			containerAdapter: mockContainerAdapter,
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	test("should initialize with correct environments", () => {
		socketClient.initialize();

		expect(mockWsClientManagerOn).toHaveBeenCalled();
		expect(mockContainerRegisterValue).toHaveBeenCalledWith("wsClient", expect.any(Object));
	});
});
