import { abstractAction } from "../../common/abstract-action.js";
import { getChannelData } from "../../common/get-channel-data.js";
import { logger } from "../../common/logger.js";

export class RegisterChannelOfDbConfigAction extends abstractAction {
	#databaseConfigurationService;
	#axios;
	#channelTypeService;
	#channelService;

	/**
	 *
	 * @param {object} request
	 * @param {import("../../company/database-configuration.service.js").DatabaseConfigurationService} request.databaseConfigurationService
	 * @param {import("axios").AxiosInstance} request.axios
	 * @param {import("../../channel/channel-type.service.js").ChannelTypeService} request.channelTypeService
	 * @param {import("../../channel/channel.service.js").ChannelService} request.channelService
	 */
	constructor({ databaseConfigurationService, axios, channelTypeService, channelService }) {
		super();
		this.#databaseConfigurationService = databaseConfigurationService;
		this.#axios = axios;
		this.#channelTypeService = channelTypeService;
		this.#channelService = channelService;
	}

	async run({ configurations }) {
		if (configurations && configurations.length > 0) {
			await this.#processInputConfigurations(configurations);
			return;
		}

		await this.#processDbConfigurations();
	}

	async #processDbConfigurations() {
		const size = 10;
		let page = 0;

		let dbConfigurationPage;

		const channelTypeMap = await this.#getChannelTypeMap();
		const registeredChannelMap = await this.#getRegisteredChannels();

		do {
			dbConfigurationPage = await this.#databaseConfigurationService.findAllWithPagination({
				page,
				size,
				orderBy: [
					["id", false],
					["referenceId", true],
				],
			});

			await this.#requestAndSave({
				dbConfigs: this.#getDbUris(dbConfigurationPage.data),
				channelTypeMap,
				registeredChannelMap,
			});

			page++;
		} while (dbConfigurationPage.totalPages > page);
	}

	async #processInputConfigurations(configurations) {
		const batchSize = 20;

		const channelTypeMap = await this.#getChannelTypeMap();
		const registeredChannelMap = await this.#getRegisteredChannels();

		for (let index = 0; index < configurations.length; index += batchSize) {
			const batch = configurations.slice(index, index + batchSize);

			await this.#requestAndSave({
				dbConfigs: this.#getDbUris(batch),
				channelTypeMap,
				registeredChannelMap,
			});
		}
	}

	async #requestAndSave({ dbConfigs, channelTypeMap, registeredChannelMap }) {
		const promises = await Promise.all(
			dbConfigs.map(async (dbConfig) => {
				try {
					const response = await this.#axios.get(`${dbConfig}/channels`, {
						timeout: 5000,
					});

					if (response.status !== 200) {
						return [];
					}

					return response.data?.content ?? [];
				} catch (error) {
					logger.error(`Error fetching channels from ${dbConfig}:`, error.message);

					return [];
				}
			}),
		);

		const channels = promises
			.flat()
			.map((channel) => ({ ...channel, data: getChannelData(channel.data) }));

		await this.#saveChannels({ channels, channelTypeMap, registeredChannelMap });
	}

	#getDbUris(configurations) {
		return configurations.map(
			({ host, port, database }) => `${host}${port ? `:${port}` : ""}/${database}`,
		);
	}

	async #getChannelTypeMap() {
		const channelTypes = await this.#channelTypeService.findAll();

		return new Map(channelTypes.map((channelType) => [channelType.code, channelType.id]));
	}

	async #saveChannels({ channels, channelTypeMap, registeredChannelMap }) {
		const channelsToCreate = [];
		const channelsToUpdate = [];

		for (const channel of channels) {
			const { server, port, username, password, ssl, fromphone } =
				this.#extractChannelDataParams(channel.data.params);

			const payload = {
				host: server,
				port: port ? Number(port) : undefined,
				username: username || fromphone,
				password,
				secure: ssl ? ssl === "true" : undefined,
				name: channel.name,
			};

			const channelReferenceId = String(channel.id);

			if (registeredChannelMap.has(channelReferenceId)) {
				channelsToUpdate.push({
					id: registeredChannelMap.get(channelReferenceId),
					data: payload,
				});

				continue;
			}

			channelsToCreate.push({
				...payload,
				referenceId: channelReferenceId,
				channelTypeId: channelTypeMap.get(channel.cprotocol?.name),
			});
		}

		if (channelsToCreate.length > 0) {
			await this.#channelService.saveBulk(channelsToCreate);
		}

		if (channelsToUpdate.length > 0) {
			await this.#channelService.updateBulk(channelsToUpdate);
		}
	}

	#extractChannelDataParams(channelDataParams = []) {
		const dataFields = {};

		for (const row of channelDataParams) {
			dataFields[row.field] = row.value;
		}

		return dataFields;
	}

	async #getRegisteredChannels() {
		const size = 50;
		let page = 0;

		const channelMap = new Map();
		let channelPage;

		do {
			channelPage = await this.#channelService.findAllWithPagination({
				page,
				size,
				orderBy: "id",
				descending: false,
			});

			channelPage.data.forEach((channel) => channelMap.set(channel.referenceId, channel.id));

			page++;
		} while (channelPage.totalPages > page);

		return channelMap;
	}
}
