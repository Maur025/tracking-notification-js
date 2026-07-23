import makeWASocket, {
	Browsers,
	DisconnectReason,
	fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys";
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
	/** @type {boolean} */
	#isCleaning = false;

	#environment;
	#MAX_RETRIES = 3;

	constructor({ environment }) {
		this.#isConnected = false;
		this.#environment = environment;
	}

	#getWpBrowser(so, browser) {
		switch (so) {
			case "ubuntu": {
				return Browsers.ubuntu(this.#getBrowserLabel(browser));
			}
			case "mac": {
				return Browsers.macOS(this.#getBrowserLabel(browser));
			}
			case "windows": {
				return Browsers.windows(this.#getBrowserLabel(browser));
			}
			default: {
				return Browsers.ubuntu(this.#getBrowserLabel(browser));
			}
		}
	}

	#getBrowserLabel(browser) {
		if (!browser) {
			return "Chrome";
		}

		const normalizedBrowser = browser.toLowerCase();
		switch (normalizedBrowser) {
			case "chrome": {
				return "Chrome";
			}
			case "firefox": {
				return "Firefox";
			}
			case "safari": {
				return "Safari";
			}
			case "edge": {
				return "Edge";
			}
			default: {
				return "Chrome";
			}
		}
	}

	async initialize({ credId }) {
		if (credId && !this.#credId) {
			this.#credId = credId;
		}

		if (!this.#credId) {
			throw new Error("credId is required to initialize WhatsappChannel");
		}

		const { state, saveCreds } = await useSqliteStoreCreds(this.#credId);
		const { version } = await fetchLatestBaileysVersion();

		this.#wpSock = makeWASocket({
			auth: state,
			version,
			browser: this.#getWpBrowser(this.#environment.WP_SO, this.#environment.WP_BROWSER),
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
						await this.close();
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

		await this.#connectionUpdateClose({
			connection,
			lastDisconnect,
		});

		this.#connectionUpdateOpen({ connection });

		await this.#handleQrCode(qr);
	}

	async #connectionUpdateClose({ connection, lastDisconnect }) {
		if (connection !== "close") {
			return;
		}

		this.#isConnected = false;

		const error = lastDisconnect?.error;
		const statusCode = error?.output?.statusCode;
		const isConnectionReplaced =
			statusCode === DisconnectReason.connectionReplaced ||
			error?.message?.includes("conflict") ||
			error?.toString()?.includes("replaced");

		const shouldReconnect =
			statusCode !== DisconnectReason.loggedOut &&
			!isConnectionReplaced &&
			statusCode !== DisconnectReason.badSession;

		if (this.#isExpectedClose) {
			console.info(`[WP-CHANNEL] Connection closed as expected for wp: ${this.#credId}`);

			this.#isExpectedClose = false;

			return;
		}

		if (shouldReconnect) {
			console.info(`[WP-CHANNEL] Restart stream of connection for wp: ${this.#credId}`);

			await this.cleanupWpSocket();

			await setDelay(1500);

			await this.initialize({
				credId: this.#credId,
			});

			return;
		}

		logger.error(`[WP-CHANNEL] Connection close with status code: ${statusCode}`);
		logger.error(`[WP-CHANNEL] Session close permanently or invalid, remove cache`);
		await this.cleanupWpSocket();
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
			logger.error(`[WP-CHANNEL] Error can't pair device`, error);
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

	/**
	 * @param {object} request
	 * @param {string} request.jid - The JID of the recipient
	 * @param {import('@whiskeysockets/baileys').AnyMessageContent} request.content
	 */
	async send({ jid, content }) {
		try {
			const client = this.getClient();
			const formattedJid = jid.includes("@") ? jid : `${jid}@s.whatsapp.net`;

			await client.sendPresenceUpdate("composing", formattedJid);
			const delay = Math.floor(Math.random() * 500) + 1000;
			await setDelay(delay);

			await client.sendMessage(formattedJid, content);
		} catch (error) {
			logger.error("Error sending whatsapp message", error.message);
			throw error;
		}
	}

	async close() {
		try {
			this.#isExpectedClose = true;

			await this.cleanupWpSocket();

			console.info(`[WP-CHANNEL] Connection closed for wp: ${this.#credId}`);
		} catch (error) {
			logger.error("Error closing whatsapp connection", error.message);
		}
	}

	async cleanupWpSocket() {
		if (this.#isCleaning || !this.#wpSock) {
			return;
		}

		this.#isCleaning = true;

		try {
			this.#wpSock.ev.removeAllListeners("creds.update");
			this.#wpSock.ev.removeAllListeners("connection.update");
			this.#wpSock.ws?.close();
			await this.#wpSock.end(new Error("Credential update or channel closed by user"));
		} catch (error) {
			logger.error("Error cleaning up whatsapp socket", error.message);
		} finally {
			this.#isConnected = false;
			this.#wpSock = null;
			this.#isCleaning = false;
		}
	}

	getStatus() {
		return this.#isConnected;
	}
}
