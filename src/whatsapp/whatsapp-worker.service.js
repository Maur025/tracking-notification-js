export class WhatsappWorkerService {
	constructor() {}

	async sendNotification({ jobData }) {
		console.log("Sending whatsapp notification with data:", jobData);
	}
}
