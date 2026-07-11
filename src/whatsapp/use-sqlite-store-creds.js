import { initAuthCreds } from "@whiskeysockets/baileys";
import { iocContainer } from "../ioc-container.js";

export const useSqliteStoreCreds = async (credId = null) => {
	/** @type {import('./whatsapp-auth-manager.js').WhatsappAuthManager} */
	const whatsappAuthManager = iocContainer.resolve("whatsappAuthManager");

	let creds = null;
	let localCredId = credId;

	if (credId) {
		creds = await whatsappAuthManager.getCreds({ credId });
	}

	if (!creds) {
		creds = initAuthCreds();
		localCredId = await whatsappAuthManager.saveCreds({ creds });
	}

	const saveCreds = async () => {
		await whatsappAuthManager.saveCreds({ creds });
	};

	const get = async (type, ids) => {
		const data = {};

		const keys = await Promise.all(
			ids.map(async (id) =>
				whatsappAuthManager.getKey({ credId: localCredId, keyType: type, keyId: id }),
			),
		);

		for (const id of ids) {
		}
	};

	return {
		state: {
			creds,
			keys: {
				get,
			},
		},
		saveCreds,
	};
};
