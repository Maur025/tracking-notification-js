import { transformDevicesSubscriptionsInMap } from "../common/transform-devices-subscriptions-in-map.js";

export class SocketClientHandler {
	constructor() {}

	onDevicesSubscriptions = async (subscriptions) => {
		console.info("[WS-CLIENT] on DevicesSubscriptions");
		const dbResourcesMap = transformDevicesSubscriptionsInMap(subscriptions);

		const dbResources = [];

		for (const dbResourceValue of dbResourcesMap.values()) {
			for (const dbName of dbResourceValue.databases) {
				dbResources.push(
					`http://${dbResourceValue.address}:${dbResourceValue.apiPort}/${dbName}`,
				);
			}
		}

		console.log(dbResources);
	};
}
