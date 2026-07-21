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
			reconnect: true,
		});

		this.#socketEventListener();

		this.#containerAdapter.registerValue("wsClient", this.#wsClient);
	}

	#socketEventListener() {
		this.#wsClient.on("devices.subscribe", (subscriptions) =>
			this.#socketClientHandler.onDevicesSubscriptions(subscriptions),
		);

		this.#wsClient.on("", (data) => {
			console.log({ data });
		});

		this.#wsClient.wsClientManager.on("insert", (socket, uuid, data) =>
			this.#socketClientHandler.processEventData({ data, type: "INSERT" }),
		);
		this.#wsClient.wsClientManager.on("update", (socket, uuid, data) =>
			this.#socketClientHandler.processEventData({ data, type: "UPDATE" }),
		);
		this.#wsClient.wsClientManager.on("delete", (socket, uuid, data) =>
			this.#socketClientHandler.processEventData({ data, type: "DELETE" }),
		);

		this.#wsClient.wsClientManager.on("enterprises", (socket, uuid, _enterprises) =>
			this.#socketClientHandler.onManagerEnterprises(_enterprises),
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
