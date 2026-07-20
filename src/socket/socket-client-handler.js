import { transformDevicesSubscriptionsInMap } from "../common/transform-devices-subscriptions-in-map.js";

export class SocketClientHandler {
	#databaseConfigurationService;
	#registerChannelOfDbConfigAction;

	/**
	 * @param {object} request
	 * @param {import('../company/database-configuration.service.js').DatabaseConfigurationService} request.databaseConfigurationService
	 * @param {import('../channel/action/register-channel-of-db-config.action.js').RegisterChannelOfDbConfigAction} request.registerChannelOfDbConfigAction
	 */
	constructor({ databaseConfigurationService, registerChannelOfDbConfigAction }) {
		this.#databaseConfigurationService = databaseConfigurationService;
		this.#registerChannelOfDbConfigAction = registerChannelOfDbConfigAction;
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

		await this.#databaseConfigurationService.saveBulk(dataFiltered);

		await this.#registerChannelOfDbConfigAction.execute({ configurations: dataFiltered });
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

	onManagerEnterprises = async (enterprises) => {
		console.info("[WS-CLIENT] on ManagerEnterprises");

		if (!enterprises || !Array.isArray(enterprises) || enterprises.length <= 0) {
			console.log(`[WS-CLIENT] on ManagerEnterprises: No enterprises found`);
			return;
		}

		const enterpriseConfigMap = this.#getEnterpriseConfigMap(enterprises);

		const databaseConfiguration =
			await this.#databaseConfigurationService.findAllByReferenceIdIn({
				referenceIds: Array.from(enterpriseConfigMap.keys()),
			});

		const dataFiltered = this.#getConfigFilter({
			enterpriseConfigMap,
			databaseConfiguration,
		});

		await this.#databaseConfigurationService.saveBulk(dataFiltered);

		await this.#registerChannelOfDbConfigAction.execute({ configurations: dataFiltered });
	};

	#getEnterpriseConfigMap(enterprises) {
		const enterpriseConfigs = [];

		for (const enterprise of enterprises) {
			const { server = undefined, codename, id } = enterprise.database ?? {};

			if (!server || !codename || !id) {
				continue;
			}

			const { address, apiPort } = server;
			const enterpriseConfig = {
				referenceId: id,
				host: `http://${address}`,
				port: apiPort ? String(apiPort) : null,
				database: codename,
			};

			enterpriseConfigs.push(enterpriseConfig);
		}

		return new Map(enterpriseConfigs.map((config) => [config.referenceId, config]));
	}

	#getConfigFilter({ enterpriseConfigMap, databaseConfiguration }) {
		const dbConfigurationMap = new Map(
			databaseConfiguration.map((config) => [
				`${config.referenceId}|${config.database}`,
				config,
			]),
		);

		const enterpriseConfigValues = Array.from(enterpriseConfigMap.values());

		return enterpriseConfigValues.filter(
			(config) => !dbConfigurationMap.has(`${config.referenceId}|${config.database}`),
		);
	}
}
