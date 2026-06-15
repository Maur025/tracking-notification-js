export class SmsWorkerService {
	constructor() {}

	async sendNotification({ jobData }) {
		console.log("Sending sms notification with data:", jobData);
	}
}
