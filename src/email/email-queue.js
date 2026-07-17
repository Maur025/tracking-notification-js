import { workerTopic } from "../worker-topic.js";

export class EmailQueue {
	#environment;
	#bullmq;
	#emailQueue;

	/**
	 * @param {object} request
	 * @param {typeof import("bullmq")} request.bullmq
	 * @param {typeof import("ioredis").Redis} request.redisConnection
	 * @param {import("../environments.js").Environments} request.environments
	 */
	constructor({ bullmq, redisConnection, environments }) {
		this.#environment = environments;
		this.#bullmq = bullmq;
		this.#emailQueue = new this.#bullmq.Queue(workerTopic.EMAIL, {
			connection: redisConnection,
		});
	}

	getQueue() {
		return this.#emailQueue;
	}

	async addToQueue(jobName, payload) {
		const { EMAIL_QUEUE_ATTEMPTS, EMAIL_QUEUE_BACKOFF_DELAY } = this.#environment;

		const job = await this.#emailQueue.add(jobName, payload, {
			attempts: EMAIL_QUEUE_ATTEMPTS,
			backoff: { type: "exponential", delay: EMAIL_QUEUE_BACKOFF_DELAY },
		});

		return {
			id: job.id ?? "N/A",
			queueName: job.queueQualifiedName,
			timestamp: job.timestamp,
		};
	}
}
