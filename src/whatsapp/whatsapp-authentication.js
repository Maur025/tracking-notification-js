import { v4 as uuidv4 } from "uuid";
import { WhatsappChannel } from "./whatsapp-channel.js";
import { logger } from "../common/logger.js";

export class WhatsappAuthentication {
	#whatsappCredService;
	#channelAssignWpCredService;

	/**
	 * @param {object} request
	 * @param {import("./services/whatsapp-cred.service.js").WhatsappCredService} request.whatsappCredService
	 * @param {import("../channel/channel-assign-wp-cred.service.js").ChannelAssignWpCredService} request.channelAssignWpCredService
	 */
	constructor({ whatsappCredService, channelAssignWpCredService }) {
		this.#whatsappCredService = whatsappCredService;
		this.#channelAssignWpCredService = channelAssignWpCredService;
	}

	async requestNewAuthentication({ channelId }) {
		if (!channelId) {
			throw new Error("Channel ID is required for WhatsApp authentication");
		}

		const credId = uuidv4();

		const whatsappChannel = new WhatsappChannel();

		await whatsappChannel.initialize({
			credId,
			onlyRegister: true,
			onSuccess: async ({ phoneNumber }) => {
				try {
					await this.#channelAssignWpCredService.save({
						data: {
							whatsappCredId: credId,
							channelId,
						},
					});

					await this.#whatsappCredService.updateById({
						id: credId,
						data: {
							phoneNumberIdentifier: phoneNumber,
						},
					});
				} catch (error) {
					logger.error(
						`Error saving WhatsApp credentials for channel ${channelId}:`,
						error.message,
					);
				}
			},
		});
	}
}
