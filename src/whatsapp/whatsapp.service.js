import { workerJobNames } from "../worker-job-name.js";

export class WhatsappService {
	#CHUNK_SIZE;
	#whatsappQueue;

	/**
	 * @param {object} request
	 * @param {import('./whatsapp-queue.js').WhatsappQueue} request.whatsappQueue
	 */
	constructor({ whatsappQueue }) {
		this.#CHUNK_SIZE = 10;
		this.#whatsappQueue = whatsappQueue;
	}

	async assignAndDistributeJobs({ requestData }) {
		let indexChunk = 0;

		const jobResponses = [];

		for (let index = 0; index < requestData.toList.length; index += this.#CHUNK_SIZE) {
			const chunk = requestData.toList.slice(index, index + this.#CHUNK_SIZE);

			const channelIndex = indexChunk % requestData.channelIds.length;

			for (const to of chunk) {
				if (!to?.trim()) {
					continue;
				}

				const newJobResponse = await this.#whatsappQueue.addToQueue(
					workerJobNames.WHATSAPP_SEND_NOTIFICATION,
					{
						to,
						channelId: requestData.channelIds[channelIndex],
						message: requestData.message,
						type: requestData.type,
						url: requestData.url,
						mimetype: requestData.mimetype,
						fileName: requestData.fileName,
					},
				);

				jobResponses.push(newJobResponse);
			}

			indexChunk++;
		}

		return jobResponses;
	}
}
