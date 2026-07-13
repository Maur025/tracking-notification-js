import { initAuthCreds, proto } from "@whiskeysockets/baileys";
import { iocContainer } from "../ioc-container.js";

export const useSqliteStoreCreds = async (credId) => {
	/** @type {import('./whatsapp-auth-manager.js').WhatsappAuthManager} */
	const whatsappAuthManager = iocContainer.resolve("whatsappAuthManager");

	let creds = null;

	if (credId) {
		creds = await whatsappAuthManager.getCreds({ credId });
	}

	if (!creds) {
		creds = initAuthCreds();
		await whatsappAuthManager.saveCreds({ creds, credId });
	}

	const saveCreds = async () => {
		await whatsappAuthManager.saveCreds({ creds, credId });
	};

	const get = async (type, ids) => {
		const data = {};

		const keyRows = await whatsappAuthManager.getKeys({
			credId,
			keyType: type,
			keyIds: ids,
		});

		for (const keyRow of keyRows) {
			let value = whatsappAuthManager.getKeyValue({ key: keyRow });

			if (type === "app-state-sync-key" && value) {
				value = proto.Message.AppStateSyncKeyData.fromObject(value);
			}

			data[keyRow.keyId] = value;
		}

		return data;
	};

	const set = async (data) => {
		for (const type in data) {
			for (const id in data[type]) {
				const value = data[type][id];

				if (value) {
					await whatsappAuthManager.saveKey({
						credId,
						keyType: type,
						keyId: id,
						keyValue: value,
					});

					continue;
				}

				await whatsappAuthManager.deleteKey({
					credId,
					keyType: type,
					keyId: id,
				});
			}
		}
	};

	return {
		state: {
			creds,
			keys: {
				get,
				set,
			},
		},
		saveCreds,
	};
};
