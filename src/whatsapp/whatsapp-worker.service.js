export class WhatsappWorkerService {
	#whatsappNotifier;

	/**
	 * @param {object} request
	 * @param {import("./whatsapp-notifier.js").WhatsappNotifier} request.whatsappNotifier
	 */
	constructor({ whatsappNotifier }) {
		this.#whatsappNotifier = whatsappNotifier;
	}

	async sendNotification({ jobData }) {
		if (!jobData.toList || jobData.toList.length === 0 || !jobData.channelId) {
			console.error("Invalid whatsapp notification data");
			return;
		}

		await this.#whatsappNotifier.send({
			...jobData,
		});
	}
}
