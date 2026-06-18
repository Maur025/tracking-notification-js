import { Notifier } from "../common/notifier.js";
import { mockConnectionEmailData } from "./mock-connection-email-data.js";

export class EmailNotifier extends Notifier {
	#emailProvider;

	constructor({ emailProvider }) {
		super();
		this.#emailProvider = emailProvider;
	}

	async send({ toList, subject, html, text, notificationType = "ALL", emailChannelIds = [] }) {
		// buscar configuración en la db, todas las disponibles, según el id en caso de que type sea igual a ALL todos los de la empresa, si selecciona SOME, debe enviar el valor emailChannelIds

		console.log({
			notificationType,
			emailChannelIds,
		});

		const testDataMock = mockConnectionEmailData;
		// Entre varios resultado se debe notificar con cada objeto obtenido, en caso de que quieran que se balancee la carga entre clientes de email, la lógica cambiara
		const emailChannel = await this.#emailProvider.getEmailChannel({
			connectionData: {
				host: testDataMock.server,
				port: testDataMock.port,
				secure: testDataMock.ssl,
			},
			credentials: {
				username: testDataMock.username,
				password: testDataMock.password,
			},
		});

		try {
			emailChannel.sendMail({
				from: emailChannel.getUsername(),
				to: toList,
				subject: subject,
				html: html,
				text: text,
			});
		} catch (error) {
			console.error("[EMAIL-NOTIFICATION] Error sending email notification:", error);

			throw error;
		}
	}
}
