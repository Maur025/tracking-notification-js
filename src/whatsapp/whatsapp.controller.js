import { serverResponse } from "../server/server-response.js";
import { StatusCodes } from "http-status-codes";
import { WhatsappCredChannelRequest } from "./request/whatsapp-cred-channel-request.js";
import { whatsappAddQueueRequest } from "./action/whatsapp-add-queue-request.js";

export class WhatsappController {
	#resource = "whatsapp";
	#whatsappAuthentication;
	#whatsappCredChannelCreateAction;
	#whatsappService;

	/**
	 * @param {object} request
	 * @param {import('./whatsapp-authentication.js').WhatsappAuthentication} request.whatsappAuthentication
	 * @param {import('./action/whatsapp-cred-channel-create.action.js').WhatsappCredChannelCreateAction} request.whatsappCredChannelCreateAction
	 * @param {import('./whatsapp.service.js').WhatsappService} request.whatsappService
	 */
	constructor({ whatsappAuthentication, whatsappCredChannelCreateAction, whatsappService }) {
		this.#whatsappAuthentication = whatsappAuthentication;
		this.#whatsappCredChannelCreateAction = whatsappCredChannelCreateAction;
		this.#whatsappService = whatsappService;
	}

	registerRoutes(app) {
		app.post(`/${this.#resource}/queue`, (req, res) => this.#handlePostQueue(req, res));
		app.get(`/${this.#resource}/queue`, (req, res) => this.#handleGetQueue(req, res));
		app.post(`/${this.#resource}/auth`, (req, res) => this.#handlePostAuth(req, res));
		app.post(`/${this.#resource}/credentials`, (req, res) =>
			this.#handlePostCredentials(req, res),
		);
	}

	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async #handlePostQueue(req, res) {
		const data = whatsappAddQueueRequest.parse(req.body);

		const jobResponses = await this.#whatsappService.assignAndDistributeJobs({
			requestData: data,
		});

		return res.status(StatusCodes.OK).json(
			serverResponse({
				code: StatusCodes.OK,
				data: jobResponses,
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

	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async #handlePostCredentials(req, res) {
		const request = WhatsappCredChannelRequest.parse(req.body);

		const channelAssignWhatsappCredId = await this.#whatsappCredChannelCreateAction.execute({
			whatsappCredChannelRequest: request,
		});

		console.log(channelAssignWhatsappCredId);

		return res.status(StatusCodes.OK).json(
			serverResponse({
				code: StatusCodes.OK,
				data: { id: channelAssignWhatsappCredId },
			}),
		);
	}
}
