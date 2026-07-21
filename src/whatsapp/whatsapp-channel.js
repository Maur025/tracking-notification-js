import makeWASocket, { DisconnectReason } from "@whiskeysockets/baileys";
import { useSqliteStoreCreds } from "./use-sqlite-store-creds.js";
import QRCode from "qrcode";
import { logger } from "../common/logger.js";

export class WhatsappChannel {
	/** @type {ReturnType<typeof makeWASocket>} */
	#wpSock;
	/** @type {string} */
	#credId;
	/** @type {boolean} */
	#isConnected;
	/** @type {boolean} */
	#isExpectedClose = false;

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
			async (update) => await this.#setOnConnectionUpdate({ update }),
		);
	}

	async #setOnConnectionUpdate({ update }) {
		const { connection, lastDisconnect, qr } = update;

		this.#connectionUpdateClose({
			connection,
			lastDisconnect,
		});

		this.#connectionUpdateOpen({ connection });

		await this.#handleQrCode(qr);
	}

	#connectionUpdateClose({ connection, lastDisconnect }) {
		if (connection !== "close") {
			return;
		}

		this.#isConnected = false;

		const error = lastDisconnect?.error;
		const statusCode = error?.output?.statusCode;
		const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

		if (this.#isExpectedClose) {
			console.info(`[WP-CHANNEL] Connection closed as expected for wp: ${this.#credId}`);

			this.#isExpectedClose = false;

			return;
		}

		logger.error(`Connection close with status code: ${statusCode}`);

		if (shouldReconnect) {
			console.info(`[WP-CHANNEL] Restart stream of connection for wp: ${this.#credId}`);

			setTimeout(
				async () =>
					await this.initialize({
						credId: this.#credId,
					}),
				1500,
			);
			return;
		}

		logger.error(`Session close permanently o invalid, remove cache`);
	}

	#connectionUpdateOpen({ connection }) {
		if (connection !== "open") {
			return;
		}

		this.#isConnected = true;
		console.info(`[WP-CHANNEL] Connection successful for wp: ${this.#credId}`);
	}

	async #handleQrCode(qr) {
		if (!qr) {
			return;
		}

		try {
			const qrConsole = await QRCode.toString(qr, { type: "terminal", small: true });

			// console.clear();
			console.info(`[WP-CHANNEL] SCAN QR CODE for wp: ${this.#credId}`);
			console.log("\n" + qrConsole);
		} catch (error) {
			logger.error("Error can't pair device", error);
		}
	}

	getUniqueIdentifier() {
		return this.#credId;
	}

	getClient() {
		if (!this.#isConnected) {
			throw new Error(
				"Whatsapp client is not connected. Please initialize and connect first.",
			);
		}

		return this.#wpSock;
	}

	async send({ jid, message }) {
		try {
			await this.getClient().sendMessage(jid, { text: message });
		} catch (error) {
			logger.error("Error sending whatsapp message", error.message);
			throw error;
		}
	}

	async close() {
		if (!this.#wpSock) {
			return;
		}

		this.#isExpectedClose = true;

		await this.#wpSock.end();
		console.info(`[WP-CHANNEL] Connection closed for wp: ${this.#credId}`);
	}

	getStatus() {
		return this.#isConnected;
	}
}
