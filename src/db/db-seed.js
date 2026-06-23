export class DbSeed {
	#companyService;
	#channelTypeService;
	#channelService;

	constructor({ companyService, channelTypeService, channelService }) {
		this.#companyService = companyService;
		this.#channelTypeService = channelTypeService;
		this.#channelService = channelService;
	}

	async runSeeders() {
		await this.addChannelTypes();
		await this.addTestCompanyData();

		await this.addTestChannelData();
	}

	async addChannelTypes() {
		const channelTypeCount = await this.#channelTypeService.count();

		if (channelTypeCount > 0) {
			return;
		}

		await this.#channelTypeService.save({
			data: [
				{ name: "email", code: "mail_smtp" },
				{ name: "SMS", code: "sms_service" },
				{ name: "Whatsapp", code: "whatsapp_service" },
			],
		});

		console.log("channel types added successfully");
	}

	async addTestCompanyData() {
		const companyTestName = "Test company";
		const companyRefId = "123456789";
		const testCompany = await this.#companyService.findByName({ name: companyTestName });
		if (testCompany) {
			return;
		}

		await this.#companyService.save({
			data: { name: companyTestName, referenceId: companyRefId },
		});

		console.log(`Test company data added: ${companyTestName}`);
	}

	async addTestChannelData() {
		const testCompany = await this.#companyService.findByName({ name: "Test company" });

		if (!testCompany) {
			console.error("Test company not found");
			return;
		}

		const channelDataCount = await this.#channelService.count();

		if (channelDataCount > 0) {
			return;
		}

		const channelTypes = await this.#channelTypeService.findAll();
		const emailChannelType = channelTypes.find(
			(channelType) => channelType.code === "mail_smtp",
		);

		const testChannelData = [
			{
				name: "Test Email Channel",
				channelTypeId: emailChannelType.id,
				companyId: testCompany.id,
				referenceId: "9999",
				host: "correo.kernotec.com",
				port: 465,
				username: "mauro.moya@kernotec.com",
				password: "testPassword",
				secure: true,
			},
		];

		await this.#channelService.save({ data: testChannelData });

		console.log("channel added successfully");
	}
}
