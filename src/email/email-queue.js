import { workerTopic } from "../worker-topic.js";

export class EmailQueue {
	#bullmq;
	#emailQueue;

	constructor({ bullmq }) {
		this.#bullmq = bullmq;
		this.#emailQueue = new this.#bullmq.Queue(workerTopic.EMAIL);
	}

	getQueue() {
		return this.#emailQueue;
	}

	async addToQueue(jobName, payload) {
		const job = await this.#emailQueue.add(jobName, payload, {
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
