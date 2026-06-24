import { workerJobNames } from "../worker-job-name.js";

export class EmailService {
	#CHUNK_SIZE;
	#emailQueue;

	constructor({ emailQueue }) {
		this.#CHUNK_SIZE = 25;
		this.#emailQueue = emailQueue;
	}

	async assignAndDistributeJobs({ requestData }) {
		let indexChunk = 0;

		const jobResponses = [];

		for (let index = 0; index < requestData.toList.length; index += this.#CHUNK_SIZE) {
			const chunk = requestData.toList.slice(index, index + this.#CHUNK_SIZE);

			const channelIndex = indexChunk % requestData.channelIds.length;

			const newJobResponse = await this.#emailQueue.addToQueue(
				workerJobNames.EMAIL_SEND_NOTIFICATION,
				{
					toList: chunk,
					channelId: requestData.channelIds[channelIndex],
					companyId: requestData.companyId,
					subject: requestData.subject,
					message: requestData.message,
				},
			);

			jobResponses.push(newJobResponse);

			indexChunk++;
		}

		return jobResponses;
	}
}
