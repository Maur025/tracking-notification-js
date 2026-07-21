import { v4 as uuidv4 } from "uuid";
import { WhatsappChannel } from "./whatsapp-channel.js";

export class WhatsappAuthentication {
	#channelAssignWpCredService;

	/**
	 * @param {object} request
	 * @param {import("../channel/channel-assign-wp-cred.service.js").ChannelAssignWpCredService} request.channelAssignWpCredService
	 */
	constructor({ channelAssignWpCredService }) {
		this.#channelAssignWpCredService = channelAssignWpCredService;
	}

	async requestNewAuthentication({ channelId }) {
		if (!channelId) {
			throw new Error("Channel ID is required for WhatsApp authentication");
		}

		await this.#channelAssignWpCredService.deleteByChannelId({ channelId });

		const credId = uuidv4();

		const whatsappChannel = new WhatsappChannel();

		await whatsappChannel.initialize({
			credId,
		});

		await this.#channelAssignWpCredService.save({
			data: {
				whatsappCredId: credId,
				channelId,
			},
		});
	}
}

// onlyRegister: true,
// onSuccess: async ({ phoneNumber }) => {
// 	try {
// 		await this.#whatsappCredService.updateById({
// 			id: credId,
// 			data: {
// 				phoneNumberIdentifier: phoneNumber,
// 			},
// 		});
// 	} catch (error) {
// 		logger.error(
// 			`Error saving WhatsApp credentials for channel ${channelId}:`,
// 			error.message,
// 		);
// 	}
// },
