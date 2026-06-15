import { workerTopic } from "../worker-topic.js";

export class WhatsappWorker {
	#bullmq;
	#containerAdapter;
	#whatsappWorkerService;

	#whatsappWorker;

	constructor({ bullmq, whatsappWorkerService, containerAdapter }) {
		this.#bullmq = bullmq;
		this.#containerAdapter = containerAdapter;
		this.#whatsappWorkerService = whatsappWorkerService;
	}

	getWorkerTopic() {
		return workerTopic.WHATSAPP;
	}

	initialize(redisConnection) {
		this.#whatsappWorker = new this.#bullmq.Worker(
			this.getWorkerTopic(),
			async (job) => this.#handleJob(job),
			{
				connection: redisConnection,
			},
		);

		this.onCompleted();
		this.onFailed();

		this.#containerAdapter.registerValue("whatsappBullmqWorker", this.#whatsappWorker);
	}

	async #handleJob(job) {
		const { data } = job;

		console.log("Processing whatsapp job:", { data });

		await this.#whatsappWorkerService.sendNotification({ jobData: data });

		console.info(`Whatsapp job completed successfully for job ID: ${job.id}`);
	}

	onCompleted() {
		this.#whatsappWorker.on("completed", (job) => {
			console.log(`Whatsapp job with ID ${job.id} has been completed.`);
		});
	}

	onFailed() {
		this.#whatsappWorker.on("failed", (job, err) => {
			console.error(`Whatsapp job with ID ${job.id} failed with error:`, err);
		});
	}
}
