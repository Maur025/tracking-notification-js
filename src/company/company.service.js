import { BaseDbService } from "../db/base-db-service.js";
import { companiesTable } from "./company.schema.js";

export class CompanyService extends BaseDbService {
	#dbClient;
	#drizzleOrm;

	constructor({ dbClient, drizzleOrm }) {
		super({ dbClient, drizzleOrm, table: companiesTable });

		this.#dbClient = dbClient;
		this.#drizzleOrm = drizzleOrm;
	}

	async findByName({ name }) {
		const [row] = await this.#dbClient
			.select()
			.from(companiesTable)
			.where(this.#drizzleOrm.eq(companiesTable.name, name))
			.limit(1);

		return row || null;
	}
}
