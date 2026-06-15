export class RedisApp {
	#ioredis;
	#environments;

	#redisConnection;

	constructor({ ioredis, environments }) {
		this.#ioredis = ioredis;
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
	}

	getRedisConnection() {
		return this.#redisConnection;
	}
}
