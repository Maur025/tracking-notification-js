import { WhatsappChannel } from "./whatsapp-channel.js";

export class WhatsappProvider {
	/** @type {Map<string, import('./whatsapp-channel.js').WhatsappChannel>} */
	#whatsappChannels;

	constructor() {
		this.#whatsappChannels = new Map();
	}

	async getWhatsappChannel({ credId }) {
		if (!this.#whatsappChannels.has(credId)) {
			const whatsappChannel = new WhatsappChannel();

			await whatsappChannel.initialize({ credId });

			this.#whatsappChannels.set(credId, whatsappChannel);
		}

		return this.#whatsappChannels.get(credId);
	}
}
