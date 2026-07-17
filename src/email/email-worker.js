import { logger } from "../common/logger.js";
import { workerTopic } from "../worker-topic.js";

export class EmailWorker {
	#environment;
	#bullmq;
	#containerAdapter;
	#emailWorkerService;

	/** @type {import('bullmq').Worker} */
	#emailWorker;

	/**
	 * @param {object} request
	 * @param {typeof import('bullmq')} request.bullmq
	 * @param {import("./email-worker.service.js").EmailWorkerService} request.emailWorkerService
	 * @param {import("../container/container-adapter.js").ContainerAdapter} request.containerAdapter
	 * @param {import("../environments.js").Environments} request.environments
	 */
	constructor({ bullmq, emailWorkerService, containerAdapter, environments }) {
		this.#bullmq = bullmq;
		this.#containerAdapter = containerAdapter;
		this.#emailWorkerService = emailWorkerService;
		this.#environment = environments;
	}

	getWorkerTopic() {
		return workerTopic.EMAIL;
	}

	initialize(redisConnection) {
		const {
			EMAIL_REMOVE_ON_COMPLETE,
			EMAIL_REMOVE_ON_FAIL,
			EMAIL_LIMITER_MAX,
			EMAIL_LIMITER_DURATION,
			EMAIL_LIMITER_GROUP_KEY,
			EMAIL_CONCURRENCY,
		} = this.#environment;

		this.#emailWorker = new this.#bullmq.Worker(
			this.getWorkerTopic(),
			async (job) => this.#handleJob(job),
			{
				connection: redisConnection,
				removeOnComplete: { count: EMAIL_REMOVE_ON_COMPLETE },
				removeOnFail: { count: EMAIL_REMOVE_ON_FAIL },
				limiter: {
					max: EMAIL_LIMITER_MAX,
					duration: EMAIL_LIMITER_DURATION,
					groupKey: EMAIL_LIMITER_GROUP_KEY,
				},
				concurrency: EMAIL_CONCURRENCY,
			},
		);

		this.onCompleted();
		this.onFailed();

		this.#containerAdapter.registerValue("emailBullmqWorker", this.#emailWorker);
	}

	async #handleJob(job) {
		const { data } = job;

		console.info(`[Email-Worker] Processing email job with ID ${job.id}:`, { data });

		await this.#emailWorkerService.sendNotification({ jobData: data });
	}

	onCompleted() {
		this.#emailWorker.on("completed", (job) => {
			console.info(`[Email-Worker] Email job with ID ${job.id} has been completed.`);
		});
	}

	onFailed() {
		this.#emailWorker.on("failed", (job, err) => {
			logger.error(`[Email-Worker] Email job with ID ${job.id} failed with error:`, err);
		});
	}

	async close() {
		if (!this.#emailWorker) {
			return;
		}

		try {
			await this.#emailWorker.close();
			console.info("[Email-Worker] Email worker closed");
		} catch (error) {
			logger.error(`[Email-Worker] Error closing email worker:`, error);
		}
	}
}
