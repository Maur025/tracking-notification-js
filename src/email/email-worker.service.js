export class EmailWorkerService {
	#emailNotifier;

	constructor({ emailNotifier }) {
		this.#emailNotifier = emailNotifier;
	}

	async sendNotification({ jobData }) {
		if (!jobData.message || !jobData.subject || !jobData.toList) {
			console.error("Invalid email notification data");
			return;
		}

		await this.#emailNotifier.send({
			...jobData,
			html: jobData.message,
			text: jobData.message,
		});
	}
}
