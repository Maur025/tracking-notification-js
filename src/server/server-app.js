import compression from "compression";
import cors from "cors";
import express from "express";
import { createServer } from "http";

export class ServerApp {
	#expressApp;
	#httpServer;
	#env;
	#controllers;

	constructor({ environments, controllers }) {
		this.#env = environments;
		this.#controllers = controllers;
		this.#expressApp = express();
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
		this.#expressApp.use(express.json({ limit: "25mb" }));
		this.#expressApp.use(express.text({ limit: "25mb" }));
		this.#expressApp.use(
			express.urlencoded({
				extended: true,
				parameterLimit: 100_000,
				limit: "50mb",
			}),
		);
		this.#expressApp.use("/", express.static(this.#env.APP_STATIC_PUBLIC_PATH));

		this.#controllers.forEach((controller) => {
			if (typeof controller.registerRoutes === "function") {
				controller.registerRoutes(this.#expressApp);
			}
		});

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
