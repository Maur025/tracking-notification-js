import { vi, describe, beforeEach, afterEach, test, expect } from "vitest";
import { ServerApp } from "../../src/server/server-app.js";

describe("ServerApp", () => {
	let environments;
	let controllers;
	let express;

	let mockAppUse;

	let serverApp;

	beforeEach(() => {
		environments = { APP_STATIC_PUBLIC_PATH: "/public", APP_PORT: 3000 };
		controllers = [
			{
				registerRoutes: vi.fn(),
			},
		];

		mockAppUse = vi.fn();

		express = vi.fn(() => ({
			use: mockAppUse,
		}));
		express.json = vi.fn();
		express.text = vi.fn();
		express.urlencoded = vi.fn();
		express.static = vi.fn();

		serverApp = new ServerApp({ environments, controllers, express });
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	test("should initialize server app", () => {
		serverApp.initialize();

		expect(mockAppUse).toHaveBeenCalled();
	});

	test("should get express app instance", () => {
		const app = serverApp.getApp();

		expect(app).toBeDefined();
		expect(app.use).toBe(mockAppUse);
	});

	test("should get http server instance", () => {
		serverApp.initialize();

		const httpServer = serverApp.getHttpServer();

		expect(httpServer).toBeDefined();
		expect(httpServer.listen).toBeDefined();
	});

	test("should listen on env port", async () => {
		serverApp.initialize();
		const httpServer = serverApp.getHttpServer();

		const httpServerListenSpy = vi.spyOn(httpServer, "listen").mockImplementation(() => {});

		await serverApp.listen();

		expect(httpServerListenSpy).toHaveBeenCalledWith(
			environments.APP_PORT,
			expect.any(Function),
		);
	});
});
