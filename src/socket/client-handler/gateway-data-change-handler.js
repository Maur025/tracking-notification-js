import { logger } from "../../common/logger.js";

export class GatewayDataChangeHandler {
	#axios;
	#channelCreateOrUpdateAction;
	#channelDeleteAction;
	#databaseConfigurationService;

	/**
	 * @param {object} request
	 * @param {import('../../channel/action/channel-create-or-update.action.js').ChannelCreateOrUpdateAction} request.channelCreateOrUpdateAction
	 * @param {import("axios").AxiosInstance} request.axios
	 * @param {import('../../channel/action/channel-delete.action.js').ChannelDeleteAction} request.channelDeleteAction
	 * @param {import('../../company/database-configuration.service.js').DatabaseConfigurationService} request.databaseConfigurationService
	 */
	constructor({
		axios,
		channelCreateOrUpdateAction,
		channelDeleteAction,
		databaseConfigurationService,
	}) {
		this.#axios = axios;
		this.#channelCreateOrUpdateAction = channelCreateOrUpdateAction;
		this.#channelDeleteAction = channelDeleteAction;
		this.#databaseConfigurationService = databaseConfigurationService;
	}

	processEventData = async ({ data, type = "INSERT" }) => {
		console.info(`[WS-CLIENT] on${type}Data`, { data });

		if (!this.#validateProcess(data, type)) {
			return;
		}

		if (type === "DELETE") {
			await this.#handleByGroupName({
				groupName: data.groupName,
				referenceId: data.response?.id,
				type,
			});

			return;
		}

		const dbConfiguration = await this.#getDatabaseConfiguration(data);

		if (!dbConfiguration) {
			console.warn(
				`[WS-CLIENT] onProcessEventData: No database configuration found for ${data.dbName}`,
			);

			return;
		}

		const id = data.response?.id;

		const url = `${dbConfiguration?.host}${dbConfiguration?.port ? `:${dbConfiguration.port}` : ""}/${dbConfiguration.database}/${data.groupName}/${id}
      `;

		const [responseData] = await this.#fetchDataFromUrl(url);

		await this.#handleByGroupName({
			groupName: data.groupName,
			referenceId: data.response?.id,
			responseData,
			type,
		});
	};

	async #handleByGroupName({ groupName, referenceId, responseData, type }) {
		switch (groupName) {
			case "channels": {
				if (type === "DELETE") {
					await this.#channelDeleteAction.execute({ channelReferenceId: referenceId });
					break;
				}

				await this.#channelCreateOrUpdateAction.execute({ channel: responseData, type });
				break;
			}
			default: {
				console.warn(`[WS-CLIENT] onProcessEventData: Unhandled groupName ${groupName}`);
			}
		}
	}

	#validateProcess(data, type) {
		if (!data || (type !== "DELETE" && !data.dbName) || !data.groupName) {
			return false;
		}

		if (!data.response?.id) {
			console.warn(`[WS-CLIENT] onProcessEventData: Missing response id`);

			return false;
		}

		return data.groupName === "channels" || data.groupName === "users";
	}

	async #getDatabaseConfiguration(data) {
		try {
			return this.#databaseConfigurationService.findOneByDatabase({
				database: data.dbName,
			});
		} catch (error) {
			logger.error(
				`Error fetching database configuration for ${data.dbName}:`,
				error.message,
			);
			return null;
		}
	}

	async #fetchDataFromUrl(url) {
		try {
			const response = await this.#axios.get(url);
			return response.data?.content ?? [];
		} catch (error) {
			logger.error(`Error fetching data from ${url}:`, error.message);
		}
	}
}
