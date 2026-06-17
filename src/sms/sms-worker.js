import { workerTopic } from "../worker-topic.js";

export class SmsWorker {
	#bullmq;
	#containerAdapter;
	#smsWorkerService;

	#smsWorker;

	constructor({ bullmq, smsWorkerService, containerAdapter }) {
		this.#bullmq = bullmq;
		this.#containerAdapter = containerAdapter;
		this.#smsWorkerService = smsWorkerService;
	}

	getWorkerTopic() {
		return workerTopic.SMS;
	}

	initialize(redisConnection) {
		this.#smsWorker = new this.#bullmq.Worker(
			this.getWorkerTopic(),
			async (job) => this.#handleJob(job),
			{
				connection: redisConnection,
				removeOnComplete: { count: 1000 },
				removeOnFail: { count: 2000 },
			},
		);

		this.onCompleted();
		this.onFailed();

		this.#containerAdapter.registerValue("smsBullmqWorker", this.#smsWorker);
	}

	async #handleJob(job) {
		const { data } = job;

		console.log("Processing sms job:", { data });

		await this.#smsWorkerService.sendNotification({ jobData: data });

		console.info(`Sms job completed successfully for job ID: ${job.id}`);
	}

	onCompleted() {
		this.#smsWorker.on("completed", (job) => {
			console.log(`Sms job with ID ${job.id} has been completed.`);
		});
	}

	onFailed() {
		this.#smsWorker.on("failed", (job, err) => {
			console.error(`Sms job with ID ${job.id} failed with error:`, err);
		});
	}
}
