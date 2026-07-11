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

		return JSON.parse(cred.credsJson, BufferJSON.reviver);
	}

	async saveCreds({ creds, credId = null }) {
		const credsStr = JSON.stringify(creds, BufferJSON.replacer);

		const savedCred = await this.#whatsappCredService.saveOrUpdate({
			data: {
				id: credId,
				credsJson: credsStr,
				numberIdentifier: null,
			},
		});

		return savedCred.id;
	}

	getKeyValue({ key }) {
		return JSON.parse(key.valueJson, BufferJSON.reviver);
	}

	async getKeys({ credId, keyType, keyIds }) {
		return this.#whatsappKeyService.findByCredIdAndKeyTypeAndKeyIdIn({
			credId,
			keyType,
			keyIds,
		});
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
		try {
			await this.#whatsappKeyService.deleteByCredIdAndKeyTypeAndKeyId({
				credId,
				keyType,
				keyId,
			});
		} catch (error) {
			logger.error(
				`Error deleting key with credId: ${credId}, keyType: ${keyType}, keyId: ${keyId}`,
				error,
			);
		}
	}
}
