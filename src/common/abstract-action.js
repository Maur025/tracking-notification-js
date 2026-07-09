export class abstractAction {
	async execute(request) {
		await this.validate(request);

		return await this.run(request);
	}

	// eslint-disable-next-line no-unused-vars
	async validate(request) {}

	// eslint-disable-next-line no-unused-vars
	async run(request) {}
}
