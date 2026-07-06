import { NodeControllerClient } from "tracking-common";

export class SocketClient {
	#environment;
	#containerAdapter;
	#socketClientHandler;

	#wsClient;

	/**
	 * @param {object} request
	 * @param { object} request.environments
	 * @param {import("../container-adapter.js").ContainerAdapter} request.containerAdapter
	 * @param {import("./socket-client-handler.js").SocketClientHandler} request.socketClientHandler
	 */
	constructor({ environments, containerAdapter, socketClientHandler }) {
		this.#environment = environments;
		this.#containerAdapter = containerAdapter;
		this.#socketClientHandler = socketClientHandler;
	}

	initialize() {
		this.#wsClient = new NodeControllerClient({
			host: this.#environment.WS_GATEWAY_HOST_PROCESSOR,
			port: this.#environment.WS_GATEWAY_PORT_PROCESSOR,
			type: "tracking-notification",
			extra: {
				portWs: String(this.#environment.APP_PORT),
				portHttp: String(this.#environment.APP_PORT),
			},
		});

		this.#socketEventListener();

		this.#containerAdapter.registerValue("wsClient", this.#wsClient);
	}

	#socketEventListener() {
		this.#wsClient.on("devices.subscribe", (subscriptions) =>
			this.#socketClientHandler.onDevicesSubscriptions(subscriptions),
		);
	}

	clientStart() {
		this.#wsClient.start();
	}

	getWsClient() {
		return this.#wsClient;
	}

	getSubscriptions() {
		return this.#wsClient.subscriptions;
	}
}
