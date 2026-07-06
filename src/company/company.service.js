import { BaseDbService } from "../db/base-db-service.js";
import { companiesTable } from "./company.schema.js";

export class CompanyService extends BaseDbService {
	/**
	 * @param {object} request
	 * @param {import("drizzle-orm/libsql").LibSQLDatabase} request.dbClient
	 * @param {typeof import("drizzle-orm")} request.drizzleOrm
	 */
	constructor({ dbClient, drizzleOrm }) {
		super({ dbClient, drizzleOrm, table: companiesTable, tableName: "companiesTable" });
	}

	async findByName({ name }) {
		const [row] = await this._dbClient
			.select()
			.from(companiesTable)
			.where(this._drizzleOrm.eq(companiesTable.name, name))
			.limit(1);

		return row || null;
	}
}
