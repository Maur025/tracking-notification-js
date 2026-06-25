import { vi, describe, beforeEach, afterEach, test, expect } from "vitest";
import { RedisApp } from "../../src/redis/redis-app.js";

describe("Redis App", () => {
	let mockIoRedis;
	let mockEnvironments;
	let redisApp;
	let consoleInfoSpy;

	beforeEach(() => {
		consoleInfoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
		class MockRedis {
			// eslint-disable-next-line no-unused-vars
			constructor(options) {}
			on = vi.fn();
		}

		mockIoRedis = {
			Redis: MockRedis,
		};
		mockEnvironments = {
			REDIS_HOST: "localhost",
			REDIS_PORT: 6379,
		};

		redisApp = new RedisApp({ ioredis: mockIoRedis, environments: mockEnvironments });
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	test("should initialize Redis connection", () => {
		redisApp.initialize();

		const redisConnection = redisApp.getRedisConnection();
		expect(redisConnection).toBeDefined();
		expect(consoleInfoSpy).toHaveBeenCalledWith(
			expect.stringContaining(
				`[IOREDIS] create Redis connection to ${mockEnvironments.REDIS_HOST}:${mockEnvironments.REDIS_PORT}`,
			),
		);
	});

	test("should return instance of ioredis connection", () => {
		redisApp.initialize();

		const redisConnection = redisApp.getRedisConnection();

		expect(redisConnection).toBeDefined();
	});
});
