import { workerTopic } from "../worker-topic.js";

export class EmailWorker {
	#bullmq;
	#containerAdapter;
	#emailWorkerService;

	#emailWorker;

	constructor({ bullmq, emailWorkerService, containerAdapter }) {
		this.#bullmq = bullmq;
		this.#containerAdapter = containerAdapter;
		this.#emailWorkerService = emailWorkerService;
	}

	getWorkerTopic() {
		return workerTopic.EMAIL;
	}

	initialize(redisConnection) {
		this.#emailWorker = new this.#bullmq.Worker(
			this.getWorkerTopic(),
			async (job) => this.#handleJob(job),
			{
				connection: redisConnection,
				concurrency: 15,
				removeOnComplete: { count: 1000 },
				removeOnFail: { count: 2000 },
			},
		);

		this.onCompleted();
		this.onFailed();

		this.#containerAdapter.registerValue("emailBullmqWorker", this.#emailWorker);
	}

	async #handleJob(job) {
		const { data } = job;

		console.log("Processing email job:", { data });

		await this.#emailWorkerService.sendNotification({ jobData: data });

		console.info(`Email job completed successfully for job ID: ${job.id}`);
	}

	onCompleted() {
		this.#emailWorker.on("completed", (job) => {
			console.log(`Email job with ID ${job.id} has been completed.`);
		});
	}

	onFailed() {
		this.#emailWorker.on("failed", (job, err) => {
			console.error(`Email job with ID ${job.id} failed with error:`, err);
		});
	}
}
