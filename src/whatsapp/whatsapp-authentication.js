export class WhatsappAuthentication {
	#whatsappAuthManager;

	/**
	 * @param {object} request
	 * @param {import('./whatsapp-auth-manager.js').WhatsappAuthManager} request.whatsappAuthManager
	 */
	constructor({ whatsappAuthManager }) {
		this.#whatsappAuthManager = whatsappAuthManager;
	}

	async requestNewAuthentication() {}

	useSqliteState = async () => {
		return {};
	};
}
