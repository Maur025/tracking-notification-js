import { serverResponse } from "../server/server-response.js";
import { workerJobNames } from "../worker-job-name.js";
import { StatusCodes } from "http-status-codes";

export class SmsController {
	#resource = "sms";
	#smsQueue;

	constructor({ smsQueue }) {
		this.#smsQueue = smsQueue;
	}

	registerRoutes(app) {
		app.post(`/${this.#resource}/queue`, this.#handlePostQueue.bind(this));
		app.get(`/${this.#resource}/queue`, this.#handleGetQueue.bind(this));
	}

	async #handlePostQueue(req, res) {
		const newJobResponse = await this.#smsQueue.addToQueue(
			workerJobNames.SMS_SEND_NOTIFICATION,
			req.body,
		);

		return res.status(StatusCodes.OK).json(
			serverResponse({
				code: StatusCodes.OK,
				data: newJobResponse,
				message: "SMS job has been queued successfully.",
			}),
		);
	}

	#handleGetQueue(req, res) {
		console.log({ req });
		return res.status(StatusCodes.OK).json(
			serverResponse({
				code: StatusCodes.OK,
				message: "GET /sms/queue endpoint is working!",
			}),
		);
	}
}
