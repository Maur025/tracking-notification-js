export class RedisApp {
	#ioredis;
	#environments;
	#containerAdapter;

	/** @type {import('ioredis').Redis} */
	#redisConnection;

	/**
	 * @param {object} request
	 * @param {typeof import("ioredis")} request.ioredis
	 * @param {import('../container-adapter.js').ContainerAdapter} request.containerAdapter
	 * @param {object} request.environments
	 */
	constructor({ ioredis, containerAdapter, environments }) {
		this.#ioredis = ioredis;
		this.#containerAdapter = containerAdapter;
		this.#environments = environments;
	}

	initialize() {
		this.#redisConnection = new this.#ioredis.Redis({
			host: this.#environments.REDIS_HOST,
			port: this.#environments.REDIS_PORT,
			maxRetriesPerRequest: null,
			keepAlive: 10000,
			retryStrategy: (times) => {
				return Math.min(times * 500, 2000);
			},
		});

		console.info(
			`[IOREDIS] create Redis connection to ${this.#environments.REDIS_HOST}:${this.#environments.REDIS_PORT}`,
		);

		this.#containerAdapter.registerValue("redisConnection", this.#redisConnection);
	}

	async close() {
		if (!this.#redisConnection) return;

		const status = this.#redisConnection.status;

		console.log(status);

		if (status === "end" || status === "close") {
			this.#redisConnection.disconnect();
			return;
		}

		try {
			await Promise.race([
				this.#redisConnection.quit(),
				new Promise((_, reject) =>
					setTimeout(() => reject(new Error("Redis quit timeout")), 2000),
				),
			]);
		} catch (err) {
			console.warn("[IOREDIS] Error closing Redis connection, forcing disconnection", err);
			this.#redisConnection.disconnect();
		}
	}

	getRedisConnection() {
		return this.#redisConnection;
	}
}
