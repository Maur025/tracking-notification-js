import { EmailChannel } from "./email-channel.js";

export class EmailProvider {
	#nodemailer;
	#emailChannels;

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
}
