import { BufferJSON } from "@whiskeysockets/baileys";
import { logger } from "../common/logger.js";

export class WhatsappAuthManager {
	#whatsappCredService;
	#whatsappKeyService;

	/**
	 * @param {object} request
	 * @param {import("./services/whatsapp-cred.service.js").WhatsappCredService} request.whatsappCredService
	 * @param {import("./services/whatsapp-key.service.js").WhatsappKeyService} request.whatsappKeyService
	 */
	constructor({ whatsappCredService, whatsappKeyService }) {
		this.#whatsappCredService = whatsappCredService;
		this.#whatsappKeyService = whatsappKeyService;
	}

	async getCreds({ credId }) {
		const cred = await this.#whatsappCredService.findById({ id: credId });

		if (!cred) {
			return null;
		}

		return JSON.parse(cred.creds_json, BufferJSON.reviver);
	}

	async saveCreds({ creds }) {
		const credsStr = JSON.stringify(creds, BufferJSON.replacer);

		const savedCred = await this.#whatsappCredService.save({
			data: {
				credsJson: credsStr,
				numberIdentifier: null,
			},
		});

		return savedCred.id;
	}

	async getKey({ credId, keyType, keyId }) {
		const key = await this.#whatsappKeyService.findByCredIdAndKeyTypeAndKeyId({
			credId,
			keyType,
			keyId,
		});

		if (!key) {
			return null;
		}

		return JSON.parse(key.value_json, BufferJSON.reviver);
	}

	async saveKey({ credId, keyType, keyId, keyValue }) {
		const keyValueStr = JSON.stringify(keyValue, BufferJSON.replacer);

		await this.#whatsappKeyService.save({
			data: {
				credId,
				keyType,
				keyId,
				valueJson: keyValueStr,
			},
		});
	}

	async deleteKey({ credId, keyType, keyId }) {
		const key = await this.#whatsappKeyService.findByCredIdAndKeyTypeAndKeyId({
			credId,
			keyType,
			keyId,
		});

		if (!key) {
			logger.error("Key not found for deletion", { credId, keyType, keyId });
			return;
		}

		await this.#whatsappKeyService.deleteById({ id: key.id });
	}
}
