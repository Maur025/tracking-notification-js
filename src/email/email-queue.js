import { workerTopic } from "../worker-topic.js";

export class EmailQueue {
	#bullmq;
	#emailQueue;

	/**
	 * @param {object} request
	 * @param {typeof import("bullmq")} request.bullmq
	 * @param {typeof import("ioredis").Redis} request.redisConnection
	 */
	constructor({ bullmq, redisConnection }) {
		this.#bullmq = bullmq;
		this.#emailQueue = new this.#bullmq.Queue(workerTopic.EMAIL, {
			connection: redisConnection,
		});
	}

	getQueue() {
		return this.#emailQueue;
	}

	async addToQueue(jobName, payload) {
		const job = await this.#emailQueue.add(jobName, payload, {
			attempts: 6,
			backoff: { type: "exponential", delay: 10000 },
		});

		return {
			id: job.id ?? "N/A",
			queueName: job.queueQualifiedName,
			timestamp: job.timestamp,
		};
	}
}
