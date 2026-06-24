import { serverResponse } from "../server/server-response.js";
import { EmailAddQueueRequest } from "./request/email-add-queue-request.js";
import { StatusCodes } from "http-status-codes";

export class EmailController {
	#resource = "emails";
	#emailService;

	constructor({ emailService }) {
		this.#emailService = emailService;
	}

	registerRoutes(app) {
		app.post(`/${this.#resource}/queue`, this.#handlePostQueue.bind(this));
		app.get(`/${this.#resource}/queue`, this.#handleGetQueue.bind(this));
	}

	async #handlePostQueue(req, res) {
		const data = EmailAddQueueRequest.parse(req.body);

		const jobResponses = await this.#emailService.assignAndDistributeJobs({
			requestData: data,
		});

		return res.status(StatusCodes.OK).json(
			serverResponse({
				code: StatusCodes.OK,
				data: jobResponses,
				message: "Emails have been queued successfully.",
			}),
		);
	}

	#handleGetQueue(req, res) {
		console.log({ req });
		return res.status(StatusCodes.OK).json(
			serverResponse({
				code: StatusCodes.OK,
				message: "GET /emails/queue endpoint is working!",
			}),
		);
	}
}
