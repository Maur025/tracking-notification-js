import { v4 as uuidv4 } from "uuid";
import { WhatsappChannel } from "./whatsapp-channel.js";

export class WhatsappAuthentication {
	/**
	 * @param {object} request
	 */
	constructor() {}

	async requestNewAuthentication() {
		const credId = uuidv4();

		console.log({ credId });

		const whatsappChannel = new WhatsappChannel();

		await whatsappChannel.initialize({ credId });
	}
}
