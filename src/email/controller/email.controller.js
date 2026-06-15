import { workerJobNames } from "../../worker-job-name.js";

export class EmailController {
	#resource = "emails";
	#emailQueue;

	constructor({ emailQueue }) {
		this.#emailQueue = emailQueue;
	}

	registerRoutes(app) {
		app.post(`/${this.#resource}/queue`, this.#handlePostQueue.bind(this));
		app.get(`/${this.#resource}/queue`, this.#handleGetQueue.bind(this));
	}

	async #handlePostQueue(req, res) {
		console.log(req.body);

		await this.#emailQueue.addToQueue(workerJobNames.EMAIL_SEND_NOTIFICATION, req.body);

		return res.json({ message: "POST /emails/queue endpoint is working!" });
	}

	#handleGetQueue(req, res) {
		console.log({ req });
		return res.json({ message: "GET /emails/queue endpoint is working!" });
	}
}
