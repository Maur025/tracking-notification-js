import { jest, describe, beforeEach, afterEach, test, expect } from "@jest/globals";
import { RedisApp } from "../../src/redis/redis-app";

describe("Redis App", () => {
	let mockIoRedis;
	let mockEnvironments;
	let redisApp;

	let mockRedis;

	beforeEach(() => {
		mockRedis = jest.fn().mockImplementation(() => ({
			on: jest.fn(),
		}));

		mockIoRedis = {
			Redis: mockRedis,
		};
		mockEnvironments = {
			REDIS_HOST: "localhost",
			REDIS_PORT: 6379,
		};

		jest.spyOn(console, "info").mockImplementation(() => {});

		redisApp = new RedisApp({ ioredis: mockIoRedis, environments: mockEnvironments });
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	test("should initialize Redis connection", () => {
		redisApp.initialize();

		expect(mockRedis).toHaveBeenCalledWith({
			host: "localhost",
			port: 6379,
			maxRetriesPerRequest: null,
		});

		const redisConnection = redisApp.getRedisConnection();
		expect(redisConnection).toBeDefined();
	});

	test("should return instance of ioredis connection", () => {
		redisApp.initialize();

		const redisConnection = redisApp.getRedisConnection();

		expect(redisConnection).toBeDefined();
	});
});
