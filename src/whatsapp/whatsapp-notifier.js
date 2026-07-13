import { Notifier } from "../common/notifier.js";
import { setDelay } from "../common/set-delay.js";

export class WhatsappNotifier extends Notifier {
	#whatsappProvider;
	#channelService;

	/**
	 * @param {object} request
	 * @param {import('./whatsapp-provider.js').WhatsappProvider} request.whatsappProvider
	 * @param {import('../channel/channel.service.js').ChannelService} request.channelService
	 */
	constructor({ whatsappProvider, channelService }) {
		super();
		this.#whatsappProvider = whatsappProvider;
		this.#channelService = channelService;
	}

	async send({ toList, channelId, message }) {
		const whatsappChannelData = await this.#channelService.findOneByFilters({
			channelType: "whatsapp",
			channelReferenceId: channelId,
		});

		console.log(whatsappChannelData);

		if (
			!whatsappChannelData ||
			!whatsappChannelData.whatsappCreds ||
			whatsappChannelData.whatsappCreds.length === 0
		) {
			console.warn(
				"[WHATSAPP-NOTIFICATION] Whatsapp channel not found or cred invalid... skipping notification",
			);
			return;
		}

		const whatsappChannel = await this.#whatsappProvider.getWhatsappChannel({
			credId: whatsappChannelData.whatsappCreds[0].whatsappCredId,
		});

		let isConnected = whatsappChannel.getStatus();

		// while (!isConnected) {
		// 	console.info({ isConnected });

		// 	await setDelay(1000);

		// 	isConnected = whatsappChannel.getStatus();
		// }

		console.log({ isConnected });

		console.log(
			`[WHATSAPP-NOTIFICATION] Sending whatsapp notification to ${toList.length} recipients...`,
		);

		for (const to of toList) {
			const noise = Math.floor(Math.random() * 300 + 50);

			const jid = `${to}@s.whatsapp.net`;

			await whatsappChannel.send({ jid, message });

			await setDelay(2000 + noise);
		}
	}
}
