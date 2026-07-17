import { EmailChannel } from "./email-channel.js";

export class EmailProvider {
	#nodemailer;

	/** @type {Map<string, import('./email-channel.js').EmailChannel>} */
	#emailChannels;

	/**
	 * @param {object} request
	 * @param {typeof import('nodemailer')} request.nodemailer
	 */
	constructor({ nodemailer }) {
		this.#nodemailer = nodemailer;
		this.#emailChannels = new Map();
	}

	async getEmailChannel({ connectionData, credentials }) {
		const uniqueIdentifier = `${connectionData.host}|${connectionData.port}|${credentials.username}`;

		if (!this.#emailChannels.has(uniqueIdentifier)) {
			const emailChannel = new EmailChannel({
				nodemailer: this.#nodemailer,
				connectionData,
				credentials,
			});

			await emailChannel.initialize();

			this.#emailChannels.set(uniqueIdentifier, emailChannel);
		}

		return this.#emailChannels.get(uniqueIdentifier);
	}

	async disconnectAllChannels() {
		if (this.#emailChannels.size <= 0) {
			return;
		}

		for (const emailChannel of this.#emailChannels.values()) {
			await emailChannel.close();
		}

		console.info("[Email-Provider] All Email channels disconnected.");
	}
}
