import makeWASocket, { BufferJSON, initAuthCreds } from "@whiskeysockets/baileys";

const extractData = async () => {
	const creds = initAuthCreds();

	const credsTxt = JSON.stringify(creds, BufferJSON.replacer, 2);
	console.log(credsTxt);

	const saveCreds = async (creds) => {
		console.log(creds);
	};

	return {
		state: {
			creds,
			keys: {
				get: async (type, ids) => {
					console.log({ type, ids });
					return {};
				},
				set: async (data) => {
					console.log({ data });
				},
			},
		},
		saveCreds,
	};
};

const { state, saveCreds } = await extractData();

const sock = makeWASocket({
	auth: state,
});

sock.ev.on("creds.update", saveCreds);
