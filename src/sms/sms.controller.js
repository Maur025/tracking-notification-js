import { workerJobNames } from "../worker-job-name.js";

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
		try {
			const newJobResponse = await this.#smsQueue.addToQueue(
				workerJobNames.SMS_SEND_NOTIFICATION,
				req.body,
			);

			return res.status(200).json({ code: 200, data: newJobResponse });
		} catch (error) {
			return res.status(500).json({
				code: 500,
				message: "Failed to add job to sms queue",
				error: error.message,
			});
		}
	}

	#handleGetQueue(req, res) {
		console.log({ req });
		return res.status(200).json({ code: 200, message: "GET /sms/queue endpoint is working!" });
	}
}
