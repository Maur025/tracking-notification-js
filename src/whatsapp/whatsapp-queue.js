import { workerTopic } from "../worker-topic.js";

export class WhatsappQueue {
	#bullmq;
	#whatsappQueue;

	constructor({ bullmq }) {
		this.#bullmq = bullmq;
		this.#whatsappQueue = new this.#bullmq.Queue(workerTopic.WHATSAPP);
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
