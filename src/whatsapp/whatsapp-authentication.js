import { v4 as uuidv4 } from "uuid";
import { WhatsappChannel } from "./whatsapp-channel.js";

export class WhatsappAuthentication {
	#channelAssignWpCredService;
	#environment;

	/**
	 * @param {object} request
	 * @param {import("../channel/channel-assign-wp-cred.service.js").ChannelAssignWpCredService} request.channelAssignWpCredService
	 */
	constructor({ channelAssignWpCredService, environments }) {
		this.#channelAssignWpCredService = channelAssignWpCredService;
		this.#environment = environments;
	}

	async requestNewAuthentication({ channelId }) {
		if (!channelId) {
			throw new Error("Channel ID is required for WhatsApp authentication");
		}

		await this.#channelAssignWpCredService.deleteByChannelId({ channelId });

		const credId = uuidv4();

		const whatsappChannel = new WhatsappChannel({ environment: this.#environment });

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
