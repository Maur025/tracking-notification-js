import { workerTopic } from "../worker-topic.js";

export class SmsQueue {
	#bullmq;
	#smsQueue;

	/**
	 * @param {object} request
	 * @param {typeof import("bullmq")} request.bullmq
	 * @param {typeof import("ioredis").Redis} request.redisConnection
	 */
	constructor({ bullmq, redisConnection }) {
		this.#bullmq = bullmq;
		this.#smsQueue = new this.#bullmq.Queue(workerTopic.SMS, {
			connection: redisConnection,
		});
	}

	getQueue() {
		return this.#smsQueue;
	}

	async addToQueue(jobName, payload) {
		const job = await this.#smsQueue.add(jobName, payload, {
			attempts: 5,
			backoff: { type: "exponential", delay: 8000 },
		});

		return {
			id: job.id ?? "N/A",
			queueName: job.queueQualifiedName,
			timestamp: job.timestamp,
		};
	}
}
