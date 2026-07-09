import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
import QRCode from "qrcode";

const initService = async () => {
	const { state, saveCreds } = await useMultiFileAuthState("whatsapp_session");

	const sock = makeWASocket({
		auth: state,
	});

	sock.ev.on("creds.update", saveCreds);

	sock.ev.on("connection.update", async (update) => {
		const { connection, lastDisconnect, qr } = update;

		if (connection === "close") {
			const error = lastDisconnect?.error;

			const statusCode = error?.output?.statusCode;

			console.log(`Connection close with status code: ${statusCode}`);

			if (statusCode !== 401 && statusCode !== 403) {
				console.log("Restart stream of connection ...");
				setTimeout(() => initService(), 1500);
				return;
			}

			console.log(`Session close permanently o invalid, remove cache`);
		}

		if (connection === "open") {
			console.log("Connection successful");
		}

		if (qr) {
			try {
				const qrConsole = await QRCode.toString(qr, { type: "terminal", small: true });

				console.clear();
				console.log("=== ESCANEA EL CÓDIGO QR ===");
				console.log(qrConsole);
			} catch (error) {
				console.log("Error can't pair device", error);
			}
		}
	});

	setTimeout(async () => {
		await sendMessage(
			sock,
			"Probando por primera vez la libreria de whatsapp con nodejs y baileys",
			["69775083"],
			"591",
		);
	}, 15000);
};

const sendMessage = async (sock, message, toList, countryCode) => {
	for (const to of toList) {
		const jid = `${countryCode}${to}@s.whatsapp.net`;

		try {
			console.log(`Send whatsapp notification to ${jid}  ====`);

			await sock.sendMessage(jid, { text: message });

			console.log("message sent successfully");

			await delay(2000);
		} catch (error) {
			console.error(`Error sending message to ${jid}:`, error.message);
		}
	}
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

initService();

// if (
// 	(connection === "connecting" || qr) &&
// 	!sock.authState.creds.registered &&
// 	!isWaitingForCode
// ) {
// 	isWaitingForCode = true;

// 	setTimeout(async () => {
// 		try {
// 			const code = await sock.requestPairingCode("59169775083");
// 			console.log(`\nREQUESTED CODE: ${code}\n`);
// 		} catch (error) {
// 			console.log("Failed to pairing", error);
// 		}
// 	}, 1500);
// }
