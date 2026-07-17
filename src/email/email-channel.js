export class EmailChannel {
	#host;
	#port;
	#secure;
	#username;
	#password;

	/** @type {import('nodemailer').Transporter} */
	#emailClient;

	/**
	 *
	 * @param {object} request
	 * @param {typeof import('nodemailer')} request.nodemailer
	 * @param {object} request.connectionData
	 * @param {object} request.credentials
	 */
	constructor({ nodemailer, connectionData, credentials }) {
		this.#host = connectionData.host;
		this.#port = connectionData.port;
		this.#secure = connectionData.secure;
		this.#username = credentials.username;
		this.#password = credentials.password;

		this.#emailClient = nodemailer.createTransport({
			host: this.#host,
			port: this.#port,
			secure: this.#secure,
			auth: { user: this.#username, pass: this.#password },
			tls: { rejectUnauthorized: false }, // remove in production
			pool: true,
			maxConnections: 5,
			maxMessages: 100,
		});
	}

	async initialize() {
		try {
			await this.#emailClient.verify();
			console.info("[EMAIL-CHANNEL] Email client is ready to send messages");
		} catch (error) {
			console.error("[EMAIL-CHANNEL] Error creating email client:", error.message);
			throw error;
		}
	}

	getUniqueIdentifier() {
		return `${this.#host}|${this.#port}|${this.#username}`;
	}

	getClient() {
		return this.#emailClient;
	}

	getUsername() {
		return this.#username;
	}

	async send(mailOptions) {
		try {
			await this.#emailClient.sendMail(mailOptions);
		} catch (error) {
			console.error("[EMAIL-CHANNEL] Error sending email:", error.message);
			throw error;
		}
	}

	async close() {
		if (!this.#emailClient) {
			return;
		}

		await this.#emailClient.close();
	}
}
