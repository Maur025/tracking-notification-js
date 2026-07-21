import makeWASocket, { jidDecode } from "@whiskeysockets/baileys";
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

	async initialize({ credId, onSuccess = null, onlyRegister = false }) {
		if (credId && !this.#credId) {
			this.#credId = credId;
		}

		if (!this.#credId) {
			throw new Error("credId is required to initialize WhatsappChannel");
		}

		const { state, saveCreds } = await useSqliteStoreCreds(this.#credId);

		this.#wpSock = makeWASocket({
			auth: state,
			fireInitQueries: false,
			defaultQueryTimeoutMs: 60000,
			connectTimeoutMs: 60000,
			keepAliveIntervalMs: 30000,
			syncFullHistory: false,
		});

		this.#wpSock.ev.on("creds.update", saveCreds);

		this.#wpSock.ev.on(
			"connection.update",
			async (update) =>
				await this.#setOnConnectionUpdate({ update, onSuccess, onlyRegister }),
		);
	}

	async #setOnConnectionUpdate({ update, onSuccess = null, onlyRegister = false }) {
		const { connection, lastDisconnect, qr } = update;

		this.#connectionUpdateClose({
			connection,
			lastDisconnect,
			onSuccess,
			onlyRegister,
		});

		this.#connectionUpdateOpen({ connection, onSuccess, onlyRegister });

		await this.#handleQrCode(qr);
	}

	#connectionUpdateClose({ connection, lastDisconnect, onSuccess = null, onlyRegister = false }) {
		if (connection !== "close") {
			return;
		}

		this.#isConnected = false;

		if (this.#isExpectedClose) {
			console.info(`[WP-CHANNEL] Connection closed as expected for wp: ${this.#credId}`);

			this.#isExpectedClose = false;

			return;
		}

		const error = lastDisconnect?.error;

		const statusCode = error?.output?.statusCode;

		logger.error(`Connection close with status code: ${statusCode}`);

		if (statusCode !== 401 && statusCode !== 403) {
			console.info(`[WP-CHANNEL] Restart stream of connection for wp: ${this.#credId}`);
			setTimeout(
				async () =>
					await this.initialize({
						credId: this.#credId,
						onlyRegister,
						onSuccess,
					}),
				1500,
			);
			return;
		}

		logger.error(`Session close permanently o invalid, remove cache`);
	}

	#connectionUpdateOpen({ connection, onSuccess = null, onlyRegister = false }) {
		if (connection !== "open") {
			return;
		}

		this.#isConnected = true;
		console.info(`[WP-CHANNEL] Connection successful for wp: ${this.#credId}`);

		if (onlyRegister) {
			console.info(
				`[WP-CHANNEL] Only register mode, closing connection for wp: ${this.#credId}`,
			);

			setTimeout(async () => {
				await this.close();
			}, 3000);
		}

		const jidCompleto = this.#wpSock.user?.id;

		if (!jidCompleto) {
			return;
		}

		const fullJid = jidDecode(jidCompleto);

		if (onSuccess && typeof onSuccess === "function") {
			onSuccess({ phoneNumber: fullJid.user });
		}
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
