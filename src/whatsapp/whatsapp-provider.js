import { WhatsappChannel } from "./whatsapp-channel.js";

export class WhatsappProvider {
	/** @type {Map<string, import('./whatsapp-channel.js').WhatsappChannel>} */
	#whatsappChannels;

	#environment;

	constructor({ environments }) {
		this.#environment = environments;
		this.#whatsappChannels = new Map();
	}

	async getWhatsappChannel({ credId }) {
		if (!this.#whatsappChannels.has(credId)) {
			const whatsappChannel = new WhatsappChannel({ environment: this.#environment });

			await whatsappChannel.initialize({ credId });

			this.#whatsappChannels.set(credId, whatsappChannel);
		}

		return this.#whatsappChannels.get(credId);
	}

	async disconnectAllChannels() {
		if (this.#whatsappChannels.size <= 0) {
			return;
		}

		for (const whatsappChannel of this.#whatsappChannels.values()) {
			await whatsappChannel.close();
		}

		console.info("[WP-Provider] All WhatsApp channels disconnected.");
	}
}
