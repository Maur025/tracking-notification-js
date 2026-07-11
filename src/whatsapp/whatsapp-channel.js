import makeWASocket from "@whiskeysockets/baileys";
import { useSqliteStoreCreds } from "./use-sqlite-store-creds.js";
import QRCode from "qrcode";
import { logger } from "../common/logger.js";

export class WhatsappChannel {
	#wpSock;
	#credId;
	#isConnected;

	constructor() {
		this.#isConnected = false;
	}

	async initialize({ credId }) {
		if (credId && !this.#credId) {
			this.#credId = credId;
		}

		if (!this.#credId) {
			throw new Error("credId is required to initialize WhatsappChannel");
		}

		const { state, saveCreds } = await useSqliteStoreCreds(this.#credId);

		this.#wpSock = makeWASocket({ auth: state });

		this.#wpSock.ev.on("creds.update", saveCreds);

		this.#wpSock.ev.on(
			"connection.update",
			async (update) => await this.#setOnConnectionUpdate(update),
		);
	}

	async #setOnConnectionUpdate(update) {
		const { connection, lastDisconnect, qr } = update;

		this.#connectionUpdateClose(connection, lastDisconnect);

		this.#connectionUpdateOpen(connection);

		await this.#handleQrCode(qr);
	}

	#connectionUpdateClose(connection, lastDisconnect) {
		if (connection !== "close") {
			return;
		}

		this.#isConnected = false;

		const error = lastDisconnect?.error;

		const statusCode = error?.output?.statusCode;

		logger.error(`Connection close with status code: ${statusCode}`);

		if (statusCode !== 401 && statusCode !== 403) {
			console.info("Restart stream of connection ...");
			setTimeout(async () => await this.initialize({ credId: this.#credId }), 1500);
			return;
		}

		logger.error(`Session close permanently o invalid, remove cache`);
	}

	#connectionUpdateOpen(connection) {
		if (connection !== "open") {
			return;
		}

		this.#isConnected = true;
		console.info("[WP-CHANNEL] Connection successful");
	}

	async #handleQrCode(qr) {
		if (!qr) {
			return;
		}

		try {
			const qrConsole = await QRCode.toString(qr, { type: "terminal", small: true });

			// console.clear();
			console.info("=== SCAN QR CODE ===");
			console.log("\n" + qrConsole);
		} catch (error) {
			logger.error("Error can't pair device", error);
		}
	}

	getUniqueIdentifier() {}

	getClient() {}

	send() {}

	close() {}

	getStatus() {
		return this.#isConnected;
	}
}
