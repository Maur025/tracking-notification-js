export class EmailChannel {
	#host;
	#port;
	#secure;
	#username;
	#password;

	#emailClient;

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

	send(mailOptions) {
		try {
			this.#emailClient.sendMail(mailOptions);
		} catch (error) {
			console.error("[EMAIL-CHANNEL] Error sending email:", error.message);
			throw error;
		}
	}

	close() {
		if (!this.#emailClient) {
			return;
		}

		this.#emailClient.close();
	}
}
