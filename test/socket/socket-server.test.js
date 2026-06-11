import { jest } from "@jest/globals";
import { SocketServer } from "../../src/socket/socket-server";

describe("SocketServer", () => {
	let containerAdapter;
	let containerRegisterValueMock;

	let socketServer;

	beforeEach(() => {
		containerRegisterValueMock = jest.fn();
		containerAdapter = {
			registerValue: containerRegisterValueMock,
		};

		jest.spyOn(console, "info").mockImplementation(() => {});

		socketServer = new SocketServer({ containerAdapter });
	});

	test("should initialize socket server", () => {
		socketServer.initialize();

		expect(containerRegisterValueMock).toHaveBeenCalledWith("wsServer", expect.any(Object));
	});

	test("should return the WebSocket server instance", () => {
		socketServer.initialize();

		const wsServer = socketServer.getWsServer();
		expect(wsServer).toBeDefined();
	});

	test("should return undefined with WebSocket server instance not initialized", () => {
		const wsServer = socketServer.getWsServer();
		expect(wsServer).toBeUndefined();
	});
});
