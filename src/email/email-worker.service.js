export class EmailWorkerService {
	constructor() {}

	async sendNotification({ jobData }) {
		console.log("Sending email notification with data:", jobData);
	}
}
