export class RedisApp {
	#ioredis;
	#environments;
	#containerAdapter;

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
		});

		console.info(
			`[IOREDIS] create Redis connection to ${this.#environments.REDIS_HOST}:${this.#environments.REDIS_PORT}`,
		);

		this.#containerAdapter.registerValue("redisConnection", this.#redisConnection);
	}

	getRedisConnection() {
		return this.#redisConnection;
	}
}
