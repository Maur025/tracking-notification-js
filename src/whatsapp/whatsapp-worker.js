import { logger } from "../common/logger.js";
import { workerTopic } from "../worker-topic.js";

export class WhatsappWorker {
	#environment;
	#bullmq;
	#containerAdapter;
	#whatsappWorkerService;

	/** @type {import('bullmq').Worker} */
	#whatsappWorker;

	/**
	 * @param {object} request
	 * @param {typeof import("bullmq")} request.bullmq
	 * @param {import('./whatsapp-worker.service.js').WhatsappWorkerService} request.whatsappWorkerService
	 * @param {import('../container-adapter.js').ContainerAdapter} request.containerAdapter
	 * @param {import('../environments.js').Environments} request.environments
	 */
	constructor({ bullmq, whatsappWorkerService, containerAdapter, environments }) {
		this.#bullmq = bullmq;
		this.#containerAdapter = containerAdapter;
		this.#whatsappWorkerService = whatsappWorkerService;
		this.#environment = environments;
	}

	getWorkerTopic() {
		return workerTopic.WHATSAPP;
	}

	initialize(redisConnection) {
		const {
			WP_REMOVE_ON_COMPLETE,
			WP_REMOVE_ON_FAIL,
			WP_LIMITER_MAX,
			WP_LIMITER_DURATION,
			WP_LIMITER_GROUP_KEY,
			WP_CONCURRENCY,
		} = this.#environment;

		this.#whatsappWorker = new this.#bullmq.Worker(
			this.getWorkerTopic(),
			async (job) => this.#handleJob(job),
			{
				connection: redisConnection,
				removeOnComplete: { count: WP_REMOVE_ON_COMPLETE },
				removeOnFail: { count: WP_REMOVE_ON_FAIL },
				limiter: {
					max: WP_LIMITER_MAX,
					duration: WP_LIMITER_DURATION,
					groupKey: WP_LIMITER_GROUP_KEY,
				},
				concurrency: WP_CONCURRENCY,
			},
		);

		this.onCompleted();
		this.onFailed();

		this.#containerAdapter.registerValue("whatsappBullmqWorker", this.#whatsappWorker);
	}

	async #handleJob(job) {
		const { data } = job;

		console.info(`[WP-Worker] Processing whatsapp job with ID ${job.id}:`, { data });

		await this.#whatsappWorkerService.sendNotification({ jobData: data });
	}

	onCompleted() {
		this.#whatsappWorker.on("completed", (job) => {
			console.info(`[WP-Worker] Whatsapp job with ID ${job.id} has been completed.`);
		});
	}

	onFailed() {
		this.#whatsappWorker.on("failed", (job, err) => {
			logger.error(`[WP-Worker] Whatsapp job with ID ${job.id} failed with error:`, err);
		});
	}

	async close() {
		if (!this.#whatsappWorker) {
			return;
		}

		try {
			await this.#whatsappWorker.close();
			console.info("[WP-Worker] Whatsapp worker closed");
		} catch (error) {
			logger.error(`[WP-Worker] Error closing whatsapp worker:`, error);
		}
	}
}
