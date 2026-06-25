import { vi, describe, beforeEach, test, expect } from "vitest";
import { SocketServer } from "../../src/socket/socket-server.js";

describe("SocketServer", () => {
	let containerAdapter;
	let containerRegisterValueMock;

	let socketServer;

	beforeEach(() => {
		containerRegisterValueMock = vi.fn();
		containerAdapter = {
			registerValue: containerRegisterValueMock,
		};

		vi.spyOn(console, "info").mockImplementation(() => {});

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
