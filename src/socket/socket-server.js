import { Server } from "socket.io";
import { SocketServerTopics } from "./socket-server-topics.js";

export class SocketServer {
	#containerAdapter;
	#wsServer;
	#socketServerHandler;

	constructor({ containerAdapter, socketServerHandler }) {
		this.#containerAdapter = containerAdapter;
		this.#socketServerHandler = socketServerHandler;
	}

	initialize(httpServer) {
		this.#wsServer = new Server(httpServer, { cors: "*" });

		this.#containerAdapter.registerValue("wsServer", this.#wsServer);

		console.info("[WS-SERVER-LISTEN] Configuring WebSocket listeners...");

		this.#wsServer.on("connection", (socket) => {
			socket.on(SocketServerTopics.EMAIL_ADD_TO_QUEUE, (data) => {
				this.#socketServerHandler.emailAddToQueueHandler(data);
			});
			socket.on(SocketServerTopics.SMS_ADD_TO_QUEUE, (data) => {
				this.#socketServerHandler.smsAddToQueueHandler(data);
			});
			socket.on(SocketServerTopics.WHATSAPP_ADD_TO_QUEUE, (data) => {
				this.#socketServerHandler.whatsappAddToQueueHandler(data);
			});
		});
	}

	getWsServer() {
		return this.#wsServer;
	}
}
