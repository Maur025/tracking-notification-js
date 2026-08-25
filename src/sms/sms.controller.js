export class SmsController {
	// #resource = "sms";
	// #smsQueue;

	constructor() {
		// { smsQueue }
		// this.#smsQueue = smsQueue;
	}

	// eslint-disable-next-line no-unused-vars
	registerRoutes(app) {
		// app.post(`/${this.#resource}/queue`, (req, res) => this.#handlePostQueue(req, res));
		// app.get(`/${this.#resource}/queue`, (req, res) => this.#handleGetQueue(req, res));
	}

	// async #handlePostQueue(req, res) {
	// 	const newJobResponse = await this.#smsQueue.addToQueue(
	// 		workerJobNames.SMS_SEND_NOTIFICATION,
	// 		req.body,
	// 	);

	// 	return res.status(StatusCodes.OK).json(
	// 		serverResponse({
	// 			code: StatusCodes.OK,
	// 			data: newJobResponse,
	// 			message: "SMS job has been queued successfully.",
	// 		}),
	// 	);
	// }

	// #handleGetQueue(req, res) {
	// 	console.log({ req });
	// 	return res.status(StatusCodes.OK).json(
	// 		serverResponse({
	// 			code: StatusCodes.OK,
	// 			message: "GET /sms/queue endpoint is working!",
	// 		}),
	// 	);
	// }
}
