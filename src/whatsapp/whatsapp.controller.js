import { serverResponse } from "../server/server-response.js";
import { workerJobNames } from "../worker-job-name.js";
import { StatusCodes } from "http-status-codes";

export class WhatsappController {
	#resource = "whatsapp";
	#whatsappQueue;
	#whatsappAuthentication;

	/**
	 * @param {object} request
	 * @param {import('./whatsapp-queue.js').WhatsappQueue} request.whatsappQueue
	 * @param {import('./whatsapp-authentication.js').WhatsappAuthentication} request.whatsappAuthentication
	 */
	constructor({ whatsappQueue, whatsappAuthentication }) {
		this.#whatsappQueue = whatsappQueue;
		this.#whatsappAuthentication = whatsappAuthentication;
	}

	registerRoutes(app) {
		app.post(`/${this.#resource}/queue`, (req, res) => this.#handlePostQueue(req, res));
		app.get(`/${this.#resource}/queue`, (req, res) => this.#handleGetQueue(req, res));
		app.post(`/${this.#resource}/auth`, (req, res) => this.#handlePostAuth(req, res));
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

	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async #handlePostAuth(req, res) {
		await this.#whatsappAuthentication.requestNewAuthentication();

		return res.status(StatusCodes.OK).json(
			serverResponse({
				code: StatusCodes.OK,
				message: "Whatsapp auth successful!",
			}),
		);
	}
}
