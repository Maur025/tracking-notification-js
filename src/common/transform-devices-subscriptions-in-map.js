/**
 * @typedef {object} Info
 * @property {string} uuid
 * @property {string} address
 * @property {string} portParent
 * @property {string} type
 * @property {number} subscriptionsCount
 * @property {string} portUdp
 * @property {string} portTcp
 * @property {string} portWs
 * @property {string} portHttp
 * @property {string} apiPort
 */

/**
 * @typedef {object} Route
 * @property {string} method
 * @property {string} path
 */

/**
 * @typedef {object} Database
 * @property {string} name
 * @property {Route[]} routes
 */

/**
 * @typedef {object} Backend
 * @property {string} uuid
 * @property {number} resonse
 * @property {number} connectTime
 * @property {string} connectTimeF
 * @property {Info} info
 * @property {number} devicesCount
 * @property {object[]} devices
 * @property {object[]} subscriptions
 * @property {Database[]} databases
 */

/**
 * @typedef {object} Subscription
 * @property {string} id
 * @property {string} deviceId
 * @property {object} parser
 * @property {string} backendUuid
 * @property {Backend} backend
 * @property {string} processorUuid
 * @property {object} processor
 */

/**
 * @param {Subscription[]|undefined} subscriptions
 * @returns {Map<string, { uuid: string, address: string, apiPort: string, databases: string[] }>}
 */
export const transformDevicesSubscriptionsInMap = (subscriptions) => {
	if (!subscriptions) {
		return new Map();
	}

	const dbResources = new Map();

	for (const subscription of subscriptions) {
		const { uuid, info, databases } = subscription.backend;
		const { address, apiPort } = info;

		if (dbResources.has(uuid)) {
			const newData = addMissingDbs({
				uuid,
				dbResources,
				databasesToCompare: databases,
			});

			if (!newData) {
				continue;
			}

			dbResources.set(uuid, newData);

			continue;
		}

		dbResources.set(uuid, {
			uuid,
			address,
			apiPort,
			databases: databases.map((db) => db.name),
		});
	}

	return dbResources;
};

/**
 * @param {object} request
 * @param {Database[]} request.databasesToCompare
 * @param {string} request.uuid
 * @param {Map} request.dbResources
 */
const addMissingDbs = ({ uuid, dbResources, databasesToCompare }) => {
	if (!uuid || !dbResources || !databasesToCompare || databasesToCompare.length <= 0) {
		return;
	}

	const existingResource = dbResources.get(uuid);

	if (!existingResource) {
		return;
	}

	const dbToCompare = databasesToCompare.map((db) => db.name);
	const currentDbSet = new Set(existingResource.databases);

	const missingDbs = dbToCompare.filter((db) => !currentDbSet.has(db));

	if (missingDbs.length <= 0) {
		return;
	}

	return {
		...existingResource,
		databases: [...existingResource.databases, ...missingDbs],
	};
};
