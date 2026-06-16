import { NodeControllerClient } from "tracking-common";

export class SocketClient {
	#environment;
	#containerAdapter;

	#wsClient;

	constructor({ environments, containerAdapter }) {
		this.#environment = environments;
		this.#containerAdapter = containerAdapter;
	}

	initialize() {
		this.#wsClient = new NodeControllerClient({
			host: this.#environment.WS_GATEWAY_HOST_PROCESSOR,
			port: this.#environment.WS_GATEWAY_PORT_PROCESSOR,
			type: "tracking-notification",
			extra: {
				portWs: this.#environment.APP_PORT,
				portHttp: this.#environment.APP_PORT,
			},
		});

		this.#socketEventListener();

		this.#containerAdapter.registerValue("wsClient", this.#wsClient);
	}

	#socketEventListener() {
		this.#wsClient.wsClientManager.on("enterprises", (socket, uuid, _enterprises) => {
			console.log({
				uuid,
				_enterprises,
			});
		});
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
