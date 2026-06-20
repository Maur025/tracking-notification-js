import { jest, describe, beforeEach, afterEach, test, expect } from "@jest/globals";
import { ServerApp } from "../../src/server/server-app";

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
				registerRoutes: jest.fn(),
			},
		];

		mockAppUse = jest.fn();

		express = jest.fn(() => ({
			use: mockAppUse,
		}));
		express.json = jest.fn();
		express.text = jest.fn();
		express.urlencoded = jest.fn();
		express.static = jest.fn();

		serverApp = new ServerApp({ environments, controllers, express });
	});

	afterEach(() => {
		jest.resetAllMocks();
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

		const httpServerListenSpy = jest.spyOn(httpServer, "listen").mockImplementation(() => {});

		await serverApp.listen();

		expect(httpServerListenSpy).toHaveBeenCalledWith(
			environments.APP_PORT,
			expect.any(Function),
		);
	});
});
