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

		for (const to of toList) {
			if (!to || to.trim() === "") {
				continue;
			}

			const noise = Math.floor(Math.random() * 300 + 50);

			const jid = `${to}@s.whatsapp.net`;

			await whatsappChannel.send({ jid, content: { text: message } });

			await setDelay(1000 + noise);
		}
	}
}
