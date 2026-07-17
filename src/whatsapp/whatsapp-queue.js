import { workerTopic } from "../worker-topic.js";

export class WhatsappQueue {
	#environment;
	#bullmq;
	#whatsappQueue;

	/**
	 * @param {object} request
	 * @param {typeof import("bullmq")} request.bullmq
	 * @param {typeof import("ioredis").Redis} request.redisConnection
	 * @param {import("../environments.js").Environments} request.environments
	 */
	constructor({ bullmq, redisConnection, environments }) {
		this.#environment = environments;
		this.#bullmq = bullmq;
		this.#whatsappQueue = new this.#bullmq.Queue(workerTopic.WHATSAPP, {
			connection: redisConnection,
		});
	}

	getQueue() {
		return this.#whatsappQueue;
	}

	async addToQueue(jobName, payload) {
		const { WP_QUEUE_ATTEMPTS, WP_QUEUE_BACKOFF_DELAY } = this.#environment;

		const job = await this.#whatsappQueue.add(jobName, payload, {
			attempts: WP_QUEUE_ATTEMPTS,
			backoff: { type: "exponential", delay: WP_QUEUE_BACKOFF_DELAY },
		});

		return {
			id: job.id ?? "N/A",
			queueName: job.queueQualifiedName,
			timestamp: job.timestamp,
		};
	}
}
