import { transformDevicesSubscriptionsInMap } from "../common/transform-devices-subscriptions-in-map.js";

export class SocketClientHandler {
	#databaseConfigurationService;

	/**
	 * @param {object} request
	 * @param {import('../company/database-configuration.service.js').DatabaseConfigurationService} request.databaseConfigurationService
	 */
	constructor({ databaseConfigurationService }) {
		this.#databaseConfigurationService = databaseConfigurationService;
	}

	onDevicesSubscriptions = async (subscriptions) => {
		console.info("[WS-CLIENT] on DevicesSubscriptions");

		const dbResourcesMap = transformDevicesSubscriptionsInMap(subscriptions);

		const dbResources = this.#buildDbResources(dbResourcesMap);

		const referenceIdSet = new Set(dbResources.map(({ referenceId }) => referenceId));

		const databaseConfiguration =
			await this.#databaseConfigurationService.findAllByReferenceIdIn({
				referenceIds: Array.from(referenceIdSet.values()),
			});

		const dbConfigurationMap = new Map(
			databaseConfiguration.map((config) => [
				`${config.referenceId}|${config.database}`,
				config,
			]),
		);

		const dataFiltered = dbResources.filter(
			(resource) => !dbConfigurationMap.has(`${resource.referenceId}|${resource.database}`),
		);

		const result = await this.#databaseConfigurationService.saveBulk(dataFiltered);
		console.log({ result });
	};

	/**
	 * @param {Map<string, object>} dbResourcesMap
	 * @returns {Array<{ referenceId: string, host: string, port: string, database: string }>}
	 */
	#buildDbResources(dbResourcesMap) {
		const dbResources = [];

		for (const dbResourceValue of dbResourcesMap.values()) {
			for (const dbName of dbResourceValue.databases) {
				dbResources.push({
					referenceId: dbResourceValue.uuid,
					host: `http://${dbResourceValue.address}`,
					port: dbResourceValue.apiPort,
					database: dbName,
				});
			}
		}

		return dbResources;
	}
}
