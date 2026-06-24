import { serverResponse } from "../server/server-response.js";
import { workerJobNames } from "../worker-job-name.js";
import { StatusCodes } from "http-status-codes";

export class WhatsappController {
	#resource = "whatsapp";
	#whatsappQueue;

	constructor({ whatsappQueue }) {
		this.#whatsappQueue = whatsappQueue;
	}

	registerRoutes(app) {
		app.post(`/${this.#resource}/queue`, this.#handlePostQueue.bind(this));
		app.get(`/${this.#resource}/queue`, this.#handleGetQueue.bind(this));
	}

	async #handlePostQueue(req, res) {
		const newJobResponse = await this.#whatsappQueue.addToQueue(
			workerJobNames.WHATSAPP_SEND_NOTIFICATION,
			req.body,
		);

		return res.status(StatusCodes.OK).json(
			serverResponse({
				code: StatusCodes.OK,
				data: newJobResponse,
				message: "Whatsapp job has been queued successfully.",
			}),
		);
	}

	#handleGetQueue(req, res) {
		console.log({ req });
		return res.status(StatusCodes.OK).json(
			serverResponse({
				code: StatusCodes.OK,
				message: "GET /whatsapp/queue endpoint is working!",
			}),
		);
	}
}
