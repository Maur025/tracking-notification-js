import { Notifier } from "../common/notifier.js";

export class EmailNotifier extends Notifier {
	#emailProvider;
	#channelService;

	constructor({ emailProvider, channelService }) {
		super();
		this.#emailProvider = emailProvider;
		this.#channelService = channelService;
	}

	async send({ toList, subject, html, text, channelId, companyId }) {
		const emailChannelData = await this.#channelService.findOneByFilters({
			companyReferenceId: companyId,
			channelType: "email",
			channelReferenceId: channelId,
		});

		if (!emailChannelData) {
			console.warn("[EMAIL-NOTIFICATION] Email channel not found ... skipping notification");
			return;
		}

		const emailChannel = await this.#emailProvider.getEmailChannel({
			connectionData: {
				host: emailChannelData.host,
				port: emailChannelData.port,
				secure: emailChannelData.secure,
			},
			credentials: {
				username: emailChannelData.username,
				password: emailChannelData.password,
			},
		});

		try {
			emailChannel.send({
				from: emailChannel.getUsername(),
				to: toList,
				subject: subject,
				html: html,
				text: text,
			});
		} catch (error) {
			console.error("[EMAIL-NOTIFICATION] Error sending email notification:", error);

			throw error;
		}
	}
}
