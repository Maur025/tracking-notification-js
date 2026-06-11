import { Server } from "socket.io";

export class SocketServer {
	#containerAdapter;
	#wsServer;

	constructor({ containerAdapter }) {
		this.#containerAdapter = containerAdapter;
	}

	initialize(httpServer) {
		this.#wsServer = new Server(httpServer, { cors: "*" });

		this.#containerAdapter.registerValue("wsServer", this.#wsServer);

		console.info("[WS-SERVER-LISTEN] Configuring WebSocket listeners...");

		// eslint-disable-next-line no-unused-vars
		this.#wsServer.on("connection", (socket) => {});
	}

	getWsServer() {
		return this.#wsServer;
	}
}
