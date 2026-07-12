import { abstractAction } from "../../common/abstract-action.js";

export class WhatsappCredChannelCreateAction extends abstractAction {
	#channelAssignWpCredService;

	/**
	 * @param {object} request
	 * @param {import("../../channel/channel-assign-wp-cred.service.js").ChannelAssignWpCredService} request.channelAssignWpCredService
	 */
	constructor({ channelAssignWpCredService }) {
		super();
		this.#channelAssignWpCredService = channelAssignWpCredService;
	}

	async run({ whatsappCredChannelRequest }) {
		const channelAssignWpCred = await this.#channelAssignWpCredService.save({
			data: whatsappCredChannelRequest,
		});

		console.log(channelAssignWpCred);

		return channelAssignWpCred.id;
	}
}
