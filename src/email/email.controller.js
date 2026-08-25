export class EmailController {
	// #resource = "emails";
	// #emailService;

	/**
	 *
	 * @param {object} request
	 * @param {import('./email.service.js').EmailService} request.emailService
	 */
	constructor() {
		// { emailService }
		// this.#emailService = emailService;
	}

	// eslint-disable-next-line no-unused-vars
	registerRoutes(app) {
		// app.post(`/${this.#resource}/queue`, (req, res) => this.#handlePostQueue(req, res));
		// app.get(`/${this.#resource}/queue`, (req, res) => this.#handleGetQueue(req, res));
	}

	// async #handlePostQueue(req, res) {
	// 	const data = EmailAddQueueRequest.parse(req.body);

	// 	const jobResponses = await this.#emailService.assignAndDistributeJobs({
	// 		requestData: data,
	// 	});

	// 	return res.status(StatusCodes.OK).json(
	// 		serverResponse({
	// 			code: StatusCodes.OK,
	// 			data: jobResponses,
	// 			message: "Emails have been queued successfully.",
	// 		}),
	// 	);
	// }

	// #handleGetQueue(req, res) {
	// 	console.log({ req });
	// 	return res.status(StatusCodes.OK).json(
	// 		serverResponse({
	// 			code: StatusCodes.OK,
	// 			message: "GET /emails/queue endpoint is working!",
	// 		}),
	// 	);
	// }
}
