import makeWASocket, { DisconnectReason } from "@whiskeysockets/baileys";
import { useSqliteStoreCreds } from "./use-sqlite-store-creds.js";
import QRCode from "qrcode";
import { logger } from "../common/logger.js";
import { setDelay } from "../common/set-delay.js";

export class WhatsappChannel {
	/** @type {ReturnType<typeof makeWASocket>} */
	#wpSock;
	/** @type {string} */
	#credId;
	/** @type {boolean} */
	#isConnected;
	/** @type {boolean} */
	#isExpectedClose = false;

	#environment;
	#MAX_RETRIES = 3;

	constructor({ environment }) {
		this.#isConnected = false;
		this.#environment = environment;
	}

	async initialize({ credId }) {
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
			defaultQueryTimeoutMs: this.#environment.WP_CH_DEFAULT_QUERY_TIMEOUT_MS,
			connectTimeoutMs: this.#environment.WP_CH_CONNECT_TIMEOUT_MS,
			keepAliveIntervalMs: this.#environment.WP_CH_KEEP_ALIVE_INTERVAL_MS,
			syncFullHistory: false,
		});

		this.#wpSock.ev.on("creds.update", async (creds) => {
			let attempt = 0;

			while (attempt < this.#MAX_RETRIES) {
				try {
					await saveCreds(creds);
					return;
				} catch (error) {
					attempt++;
					console.warn(
						`[WP-CHANNEL] Attempt ${attempt} to save credentials failed for wp: ${this.#credId}. Retrying...`,
					);

					if (attempt >= this.#MAX_RETRIES) {
						logger.error("Error saving credentials", error);
						this.close();
						return;
					}

					await setDelay(500 * attempt);
				}
			}
		});

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

		try {
			this.#isExpectedClose = true;

			this.#wpSock.ev.removeAllListeners("creds.update");
			this.#wpSock.ev.removeAllListeners("connection.update");

			await this.#wpSock.end(new Error("Credential update or channel closed by user"));
			console.info(`[WP-CHANNEL] Connection closed for wp: ${this.#credId}`);
		} catch (error) {
			logger.error("Error closing whatsapp connection", error.message);
		} finally {
			this.#wpSock = null;
		}
	}

	getStatus() {
		return this.#isConnected;
	}
}
