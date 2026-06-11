export class WhatsappController {
	#resource = "whatsapp";

	registerRoutes(app) {
		app.post(`/${this.#resource}/queue`, this.#handlePostQueue.bind(this));
		app.get(`/${this.#resource}/queue`, this.#handleGetQueue.bind(this));
	}

	#handlePostQueue(req, res) {
		console.log({ req, res });
	}

	#handleGetQueue(req, res) {
		console.log({ req });
		return res.json({ message: "GET /whatsapp/queue endpoint is working!" });
	}
}
