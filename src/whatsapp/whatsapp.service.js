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

			const newJobResponse = await this.#whatsappQueue.addToQueue(
				workerJobNames.WHATSAPP_SEND_NOTIFICATION,
				{
					toList: chunk,
					channelId: requestData.channelIds[channelIndex],
					message: requestData.message,
					type: requestData.type,
					url: requestData.url,
					mimetype: requestData.mimetype,
					fileName: requestData.fileName,
				},
			);

			jobResponses.push(newJobResponse);

			indexChunk++;
		}

		return jobResponses;
	}
}

// "toList": [
//     "59170516916",
// 	"59170614959",
// 	"59172066106",
// 	"59170614903",
// 	"59177517276",
// 	"59161004440",
// 	"59161235591",
// 	"59172582553",
// 	"59179695000",
// 	"59179618726",
// 	"59172064646",
// 	"59165100029",
// 	"59161004100",
// 	"59172086807",
// 	"59167010892",
// 	"59170615285",
// 	"59171210768",
// 	"59172589988",
// 	"59170516472",
// 	"59170113347",
// 	"59170614930",
// 	"59179693000",
// 	"59170125699",
// 	"59165568447",
// 	"59165150387",
// 	"59175189220",
// 	"59178895388",
// 	"59177717703",
// 	"59165100016",
// 	"59170614965",
// 	"59165100028",
// 	"59170628031",
// 	"59178183086",
// 	"59171541563",
//     "59169775083"
//     ],
