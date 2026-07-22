import { abstractAction } from "../../common/abstract-action.js";
import { getChannelData } from "../../common/get-channel-data.js";
import { extractChannelDataParams } from "../common/extract-channel-data-params.js";

export class ChannelCreateOrUpdateAction extends abstractAction {
	#channelService;
	#channelTypeService;

	/**
	 * @param {object} request
	 * @param {import("../../channel/channel.service.js").ChannelService} request.channelService
	 * @param {import("../../channel/channel-type.service.js").ChannelTypeService} request.channelTypeService
	 */
	constructor({ channelService, channelTypeService }) {
		super();
		this.#channelService = channelService;
		this.#channelTypeService = channelTypeService;
	}

	async run({ channel, type }) {
		const channelNormalized = { ...channel, data: getChannelData(channel.data) };

		const { server, port, username, password, ssl, fromphone } = extractChannelDataParams(
			channelNormalized.data.params,
		);

		const payload = {
			host: server,
			port: port ? Number(port) : null,
			username: username || fromphone,
			password,
			ssl: ssl ? ssl === "true" : null,
			name: channelNormalized.name,
		};

		const registeredChannel = await this.#channelService.findOneByFilters({
			channelReferenceId: String(channelNormalized.id),
		});

		if (registeredChannel && type === "UPDATE") {
			await this.#channelService.updateById({ data: payload, id: registeredChannel.id });
			return;
		}

		if (registeredChannel) {
			console.log("channel already exists");
			return;
		}

		const channelType = await this.#channelTypeService.findOneByCode({
			code: channelNormalized.cprotocol?.name,
		});

		await this.#channelService.save({
			data: {
				...payload,
				channelTypeId: channelType?.id,
				referenceId: String(channelNormalized.id),
			},
		});
	}
}
