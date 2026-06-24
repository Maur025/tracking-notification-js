import compression from "compression";
import cors from "cors";
import { createServer } from "http";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export class ServerApp {
	#express;
	#expressApp;
	#httpServer;
	#env;
	#controllers;
	#errorHandler;

	constructor({ environments, controllers, express, errorHandler }) {
		this.#env = environments;
		this.#controllers = controllers;
		this.#express = express;
		this.#errorHandler = errorHandler;
		this.#expressApp = this.#express();
	}

	initialize() {
		this.#expressApp.use(compression());
		this.#expressApp.use(
			cors({
				origin: "*",
				methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
				allowedHeaders: ["Content-Type", "Authorization"],
			}),
		);
		this.#expressApp.use(this.#express.json({ limit: "25mb" }));
		this.#expressApp.use(this.#express.text({ limit: "25mb" }));
		this.#expressApp.use(
			this.#express.urlencoded({
				extended: true,
				parameterLimit: 100_000,
				limit: "50mb",
			}),
		);
		this.#expressApp.use("/", this.#express.static(this.#env.APP_STATIC_PUBLIC_PATH));

		this.#controllers.forEach((controller) => {
			if (typeof controller.registerRoutes === "function") {
				controller.registerRoutes(this.#expressApp);
			}
		});

		// eslint-disable-next-line no-unused-vars
		this.#expressApp.use((req, res, next) => {
			res.status(StatusCodes.NOT_FOUND).json({
				code: StatusCodes.NOT_FOUND,
				message: ReasonPhrases.NOT_FOUND,
			});
		});

		this.#expressApp.use((err, req, res, next) =>
			this.#errorHandler.handler(err, req, res, next),
		);

		this.#httpServer = createServer(this.#expressApp);
	}

	getApp() {
		return this.#expressApp;
	}

	getHttpServer() {
		return this.#httpServer;
	}

	async listen() {
		await this.#httpServer.listen(this.#env.APP_PORT, () => {
			console.info("[SERVER-APP] Server is running on port", this.#env.APP_PORT);
		});
	}
}
