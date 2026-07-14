import { workerTopic } from "../worker-topic.js";

export class WhatsappQueue {
	#bullmq;
	#whatsappQueue;

	/**
	 * @param {object} request
	 * @param {typeof import("bullmq")} request.bullmq
	 * @param {typeof import("ioredis").Redis} request.redisConnection
	 */
	constructor({ bullmq, redisConnection }) {
		this.#bullmq = bullmq;
		this.#whatsappQueue = new this.#bullmq.Queue(workerTopic.WHATSAPP, {
			connection: redisConnection,
		});
	}

	getQueue() {
		return this.#whatsappQueue;
	}

	async addToQueue(jobName, payload) {
		const job = await this.#whatsappQueue.add(jobName, payload, {
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
