import { EmailAddQueueRequest } from "../email/request/email-add-queue-request.js";

export class SocketServerHandler {
	#emailService;

	constructor({ emailService }) {
		this.#emailService = emailService;
	}

	async emailAddToQueueHandler(data) {
		const resultValidation = EmailAddQueueRequest.safeParse(data);

		if (!resultValidation.success) {
			console.error(
				"[WS-SERVER-HANDLER] Invalid data received for email add to queue:",
				resultValidation.error,
			);

			return;
		}

		await this.#emailService.assignAndDistributeJobs({ requestData: resultValidation.data });
	}

	smsAddToQueueHandler(data) {
		console.log(data);
	}

	whatsappAddToQueueHandler(data) {
		console.log(data);
	}
}
