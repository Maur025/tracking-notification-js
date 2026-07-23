import { abstractAction } from "../../common/abstract-action.js";
import { logger } from "../../common/logger.js";

export class ChannelDeleteAction extends abstractAction {
	#channelService;

	/**
	 * @param {object} request
	 * @param {import("../../channel/channel.service.js").ChannelService} request.channelService
	 */
	constructor({ channelService }) {
		super();
		this.#channelService = channelService;
	}

	async run({ channelReferenceId }) {
		if (!channelReferenceId) {
			logger.error("Channel reference ID is required for deletion.");
			return;
		}

		try {
			await this.#channelService.deleteByReferenceId({
				referenceId: String(channelReferenceId),
			});
		} catch (error) {
			logger.error("Error occurred while deleting channel:", error);
		}
	}
}
