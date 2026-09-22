import { Notifier } from "../common/notifier.js";

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

	async send({ to, channelId, message, type, url, mimetype, fileName }) {
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

		const jid = `${to}@s.whatsapp.net`;

		const content = this.getContent({ message, type, url, mimetype, fileName });

		await whatsappChannel.send({ jid, content });
	}

	/** @returns {import("@whiskeysockets/baileys").AnyMessageContent} */
	getContent({ message, type, url, mimetype, fileName }) {
		const captionObject = message ? { caption: message } : {};

		switch (type) {
			case "TEXT":
				return { text: message, linkPreview: null };
			case "DOCUMENT":
				return { document: { url }, mimetype, fileName, ...captionObject };
			case "VIDEO":
				return { video: { url }, gifPlayback: false, ...captionObject };
			case "IMAGE":
				return { image: { url }, ...captionObject };
		}
	}
}
