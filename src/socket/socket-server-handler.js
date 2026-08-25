import { whatsappAddQueueRequest } from "../whatsapp/action/whatsapp-add-queue-request.js";

export class SocketServerHandler {
	// #emailService;
	#whatsappService;

	/**
	 * @param {object} request
	 * @param {import("../email/email.service.js").EmailService} request.emailService
	 * @param {import("../whatsapp/whatsapp.service.js").WhatsappService} request.whatsappService
	 */
	constructor({
		// emailService,
		whatsappService,
	}) {
		// this.#emailService = emailService;
		this.#whatsappService = whatsappService;
	}

	// async emailAddToQueueHandler(data) {
	// 	const resultValidation = EmailAddQueueRequest.safeParse(data);

	// 	if (!resultValidation.success) {
	// 		console.error(
	// 			"[WS-SERVER-HANDLER] Invalid data received for email add to queue:",
	// 			resultValidation.error,
	// 		);

	// 		return;
	// 	}

	// 	await this.#emailService.assignAndDistributeJobs({ requestData: resultValidation.data });
	// }

	// smsAddToQueueHandler(data) {
	// 	console.log(data);
	// }

	async whatsappAddToQueueHandler(data) {
		const resultValidation = whatsappAddQueueRequest.safeParse(data);

		if (!resultValidation.success) {
			console.error(
				"[WS-SERVER-HANDLER] Invalid data received for whatsapp add to queue:",
				resultValidation.error,
			);

			return;
		}

		await this.#whatsappService.assignAndDistributeJobs({ requestData: resultValidation.data });
	}
}
