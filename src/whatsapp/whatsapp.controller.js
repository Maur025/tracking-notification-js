import { workerJobNames } from "../worker-job-name.js";

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
		try {
			const newJobResponse = await this.#whatsappQueue.addToQueue(
				workerJobNames.WHATSAPP_SEND_NOTIFICATION,
				req.body,
			);

			return res.status(200).json({ code: 200, data: newJobResponse });
		} catch (error) {
			return res.status(500).json({
				code: 500,
				message: "Failed to add job to whatsapp queue",
				error: error.message,
			});
		}
	}

	#handleGetQueue(req, res) {
		console.log({ req });
		return res
			.status(200)
			.json({ code: 200, message: "GET /whatsapp/queue endpoint is working!" });
	}
}
